import fetch from 'dva/fetch';

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, otherProxy) {
    let config = window.g;
    let proxy = otherProxy || config.proxy;
    let finalURL = `http://${config.apiHost}${proxy}${url}`;
    return fetch(finalURL, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => ({ data }))
        .catch(err => ({ err }));
}

export function requestImg(url, options) {
    let config = window.g;
    let finalURL = `http://${config.apiHost}${config.proxy}${url}`;
    return fetch(finalURL, options)
        .then(checkStatus)
        .then(response=>{
            return response.blob();
        })
        .then(blob=>{
            return new Promise((resolve)=>{
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = function(){
                    resolve(reader.result);
                }
            })
            
        })
        .catch(err => ({ err }));
}
