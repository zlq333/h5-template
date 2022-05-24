import JSEncrypt from 'jsencrypt';
import projectConfig from '@/config/config';

let encrypt = new JSEncrypt();
encrypt.setPublicKey(projectConfig.publicKey as string);
export default encrypt;
