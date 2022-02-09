import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';
// 用户登录接口
export function getUserLogin(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/login/login', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

// 获取用户信息接口
export function getUserInfo(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/login/getuser', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

// 判断第三方代理商接口
export function getThirdAgent(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/login/checkthirdagent', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

// 公司维度属性相关接口
export function getFieldList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/energyquota/getfieldlist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getFieldAttrs(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/energyquota/getfieldtree', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 获取进线接口
export function getIncoming(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/line/getincoming', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

