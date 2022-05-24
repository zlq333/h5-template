import projectConfig from '@/config/config';
export function getAccessToken() {
  let wxurl = 'https://open.weixin.qq.com/connect/oauth2/authorize?';
  wxurl += 'appid=' + projectConfig.wxConfig.appId;
  wxurl += '&redirect_uri=' + encodeURIComponent(projectConfig.wxConfig.redirectUrl);
  wxurl += '&response_type=code';
  // snsapi_base静默授权 （不弹出授权页面，直接跳转，只能获取用户openid）,目前公众号只需要openid
  wxurl += '&scope=snsapi_base';
  wxurl += '&state=';
  wxurl += '#wechat_redirect';
  window.location.href = wxurl;
}
