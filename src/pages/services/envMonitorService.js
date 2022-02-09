import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';
// 获取摄像头设备列表
export function getCameraList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/camera/getcameralist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        })
}
// 获取摄像头通道列表
export function getChannels(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/camera/getchannels', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        })
}
// 摄像头取流认证接口
export function getCameraToken(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/camera/getAccessFlowToken', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        })
}
