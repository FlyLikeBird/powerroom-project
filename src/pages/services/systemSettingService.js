import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';
// 角色权限接口
export function getRoleList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/getrolelist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 系统日志接口
export function getLoginLog(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/log/getloginloglist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getOperationLog(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/log/getloglist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
