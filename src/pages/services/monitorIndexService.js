import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

export function getMonitorInfo(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/Eleroommonitor/home', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}