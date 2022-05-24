import axios from '@/utils/axios';
import api from '@/api/api';
import { Toast } from 'vant';

const wxsdk = {
  // 获取签名包，调用微信SDK页面需调用
  async getSignPackage(jsApiList: any) {
    return new Promise(async (resolve, reject) => {
      // const _url = encodeURIComponent(location.href.split('#')[0]);
      const _url = location.href.split('#')[0];
      let res = await axios.post(api.wechatResourceSign, { url: _url });
      let result: any = res.data;
      wx.config({
        debug: false,
        appId: result.appid,
        timestamp: result.timestamp,
        nonceStr: result.nonce,
        signature: result.signature,
        jsApiList: jsApiList
      });
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: jsApiList,
          success: function (res: any) {
            resolve(res);
          }
        });
      });
      wx.error(function (res: any) {
        // Toast('签名无效');
        reject('签名无效');
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      });
    });
  },
  // 选择图片
  async chooseImg() {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res: any) {
          let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          wx.uploadImage({
            localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (rtn: any) {
              resolve(rtn.serverId); // 返回图片的服务器端ID
            },
            fail(err: any) {
              alert(JSON.stringify(err));
            }
          });
        },
        cancel: function () {
          reject('取消');
        }
      });
    });
  },
  // 上传图片
  async uploadImg() {
    return new Promise(async (resolve, reject) => {
      // 获取微信SDK图片上传id
      let serverId = await wxsdk.chooseImg();
      // 调用图片下载接口
      let res: any = await axios.post(api.wechatResourceMedia, {
        mediaId: serverId
      });
      resolve(res.data.mediaUrl);
    });
  },
  async getLocation() {
    return new Promise(async (resolve, reject) => {
      // resolve({ longitude: 114.42252159, latitude: 30.45525885 }); // 武汉
      // resolve({ longitude: 121.472644, latitude: 31.231706 }); // 上海
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res: any) {
          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          var speed = res.speed; // 速度，以米/每秒计
          var accuracy = res.accuracy; // 位置精度
          resolve(res);
        },
        fail(err: any) {
          // alert(JSON.stringify(err));
          if (err.errMsg == 'getLocation:fail' || err.errMsg == 'getLocation:location permission') {
            Toast('请到手机的【设置】功能中，打开微信的定位服务');
          } else {
            Toast('请关闭当前页面，重新打开后，再尝试完成操作。');
          }
          reject(err);
        }
      });
    });
  },
  // 获取地理位置
  async getTransLocation() {
    return new Promise(async (resolve, reject) => {
      let res: any = await wxsdk.getLocation();
      let rtn: any = await axios.post(api.lbsLocationParse, {
        longitude: res.longitude,
        latitude: res.latitude,
        geoType: 1
      });
      let locaationInfo = {
        longitude: rtn.data.longitude,
        latitude: rtn.data.latitude,
        address: rtn.data.address
      };
      resolve(locaationInfo);
    });
  },
  // 扫一扫
  scanQRCode() {
    return new Promise(async (resolve, reject) => {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res: any) {
          let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          resolve(result);
        }
      });
    });
  },
  // 微信支付
  async chooseWXPay(wxpayData: any) {
    return new Promise(async (resolve, reject) => {
      const sendPayData = {
        // appId: wxpayData.appId, //公众号名称，由商户传入
        timestamp: wxpayData.timeStamp, //时间戳，自1970年以来的秒数
        nonceStr: wxpayData.nonceStr, //随机串
        package: wxpayData.package,
        signType: wxpayData.signType, //微信签名方式：
        paySign: wxpayData.paySign // 支付签名
      };
      wx.chooseWXPay({
        ...sendPayData,
        success: function (res: any) {
          // 支付成功后的回调函数
          if (res.errMsg == 'chooseWXPay:ok') {
            // 支付成功
            resolve({ status: 0, message: '支付成功' });
          } else {
            resolve({ status: 1, message: res.errMsg || '支付失败' });
          }
        },
        fail(err: any) {
          alert(JSON.stringify(err));
          reject(err);
        },
        cancel: function (res: any) {
          // 支付取消
          resolve({ status: 3, message: '用户取消支付' });
        }
      });
    });
  }
};
export default wxsdk;
