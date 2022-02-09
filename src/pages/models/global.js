import { getFieldList, getFieldAttrs, getIncoming, getUserLogin, getThirdAgent, getUserInfo } from '../services/globalService';
import moment from 'moment';
import { history } from 'umi';
import { md5 } from '../utils/encryption';
import config from '../../../config';
const env = config.apiHost === 'api.h1dt.com' ? 'prod' : 'dev';
const agentReg = /pr-(.*)/;

// 初始化socket对象，并且添加监听事件
function createWebSocket(url, data, companyId, dispatch){
    let ws = new WebSocket(url);
    // console.log(data);
    ws.onopen = function(){
        if ( data.agent_id){
            ws.send(`agent:${data.agent_id}`);
        }
        ws.send(`com:${companyId}`);
    };
    // ws.onclose = function(){
    //     console.log('socket close...');
    //     reconnect(url, data, companyId, dispatch);
    // };
    ws.onerror = function(){
        console.log('socket error...');
        reconnect(url, data, companyId, dispatch);
    };
    ws.onmessage = (e)=>{
        if ( dispatch ) {   
            let data = JSON.parse(e.data); 
            // console.log(data);
            if ( data.type === 'company'){
                dispatch({ type:'setMsg', payload:{ data }});
            } else if ( data.type === 'agent'){
                dispatch({ type:'setAgentMsg', payload:{ data }})
            }                       
        }
    }
}

function reconnect(url, data, companyId, dispatch){
    if(reconnect.lock) return;
    reconnect.lock = true;
    setTimeout(()=>{
        createWebSocket(url, data, companyId, dispatch);
        reconnect.lock = false;
    },2000)
}
let date = new Date();
let socket = null;
const initialState= {
    currentMenu:'',
    userId:40,
    userInfo:{},
    currentCompany:{},
    companyId:1,
    // 全局socket消息
    msg:{},
    // 全局日期筛选状态
    // 1-日 2-月 3-年
    timeType:'1',
    startDate:moment(date),
    endDate:moment(date),
    // 维度属性
    fieldList:[],
    currentField:{},
    fieldAttrs:[],
    currentAttr:{},
    treeLoading:true,
    // 进线属性
    incomingList:[],
    currentIncoming:{},
    containerWidth:0,
    pagesize:12,
    userAuthed:false,
    thirdAgent:{}
};
let apiHost = '120.25.168.203';     

export default {
    namespace:'global',
    state:initialState,
    subscriptions:{
        setup({ dispatch, history }){
            history.listen(( location )=>{
                // console.log(window.location);
                // 登录页判断是自身代理商还是第三方代理商
                if ( location.pathname === '/login' ) {
                    let str = window.location.host.split('.');
                    let matchResult = agentReg.exec(str[0]);
                    let temp = matchResult ? matchResult[1] : '';
                    // console.log(str);
                    // console.log(matchResult);
                    dispatch({ type:'fetchThirdAgent', payload:temp });
                    return ;
                }
                let pathname = location.pathname === '/' ? '/' : location.pathname.slice(1);   
                dispatch({ type:'toggleCurrentMenu', payload:pathname });
                dispatch({ type:'userAuth', payload:{ dispatch, query:location.query.userid }});
            })
        }
    },
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        *cancelAll(action, { put }){
            yield put({ type:'cancelField'});
            yield put({ type:'cancelFieldAttrs'});
            // 初始化日期控件
            yield put({ type:'toggleTimeType', payload:'2' });
        },
        *userAuth(action, { put, select, call }){
            let { global:{ userAuthed, companyId, thirdAgent }} = yield select();
            let { dispatch, query } = action.payload;
            if ( !userAuthed ){
                // 获取路由传递的参数userid，如果获取到则自动验证
                if ( query ){
                    localStorage.setItem('user_id', query);
                }
                let { data } = yield call(getUserInfo);
                if ( data && data.code === '0'){
                    // 先判断是否是第三方代理商账户
                    if ( !Object.keys(thirdAgent).length ) {
                        let str = window.location.host.split('.');
                        let matchResult = agentReg.exec(str[0]);
                        let temp = matchResult ? matchResult[1] : '';
                        yield put({ type:'fetchThirdAgent', payload:temp });
                    }
                    let { companys } = data.data;
                    let currentCompany = companys && companys.length ? companys[0] : {};
                    if ( WebSocket ) {
                        socket = createWebSocket(`ws://${apiHost}:${config.socketPort}`, data.data, currentCompany.company_id, dispatch);
                    }
                    yield put({ type:'getUserInfo', payload:{ data:data.data, currentCompany }});
                } else {
                    yield put({ type:'loginOut'});
                }
                
            }
        },
        *login(action, { put, select, call }) {
            try {
                let { payload, resolve, reject } = action;
                let password = md5(payload.password, payload.user_name);
                var { data }  = yield call(getUserLogin, {user_name:payload.user_name, password});
                if ( data && data.code === '0'){   
                    let { user_id, user_name, agent_id, companys } = data.data;
                    let companysMap = companys.map((item)=>{
                        return { [encodeURI(item.company_name)]:item.company_id };
                    })
                    let timestamp = parseInt(new Date().getTime()/1000);
                    //  保存登录的时间戳,用户id,公司id 
                    localStorage.setItem('timestamp', timestamp);
                    localStorage.setItem('user_id', user_id);
                    localStorage.setItem('user_name', user_name);
                    localStorage.setItem('companysMap', JSON.stringify(companysMap));
                    localStorage.setItem('agent_id', agent_id);
                    //  登录后跳转到默认页面
                    if ( agent_id ) {
                        // history.push('/agentMonitor');
                    } else {
                        history.push('/');
                    }
                } else {
                    if (reject) reject( data && data.msg );
                }
            } catch(err){
                console.log(err);
            }
        },
        *loginOut(action, { call, put, select }){
            yield put({type:'clearUserInfo'});
            if ( socket && socket.close ){
                socket.close();
                socket = null;
            }
            history.push('/login');
        },
        *fetchThirdAgent(action, { put, select, call}){
            let { data } = yield call(getThirdAgent, { agent_code:action.payload });
            if ( data && data.code === '0'){
                yield put({ type:'getThirdAgent', payload:{ data:data.data }});
            } else {

            }
        },
        *fieldInit(action, { put }){
            yield put.resolve({ type:'fetchField' });
            yield put.resolve({ type:'fetchFieldAttrs'});        
        },
        *fetchField(action, { call, put, select}){
            yield put.resolve({ type:'cancelable', task:fetchFieldCancelable, action:'cancelField' });
            function* fetchFieldCancelable(params){
                try {
                    let { global:{ companyId }} = yield select();
                    let { data } = yield call(getFieldList, { company_id:companyId });
                    if ( data && data.code == 0 ){
                        yield put({type:'getFields', payload:{ data:data.data }}); 
                    }  
                } catch(err){
                    console.log(err);
                } 
            }
        },
        *fetchFieldAttrs(action, { call, put, select}){
            // 取消上一次的异步action
            yield put({ type:'cancelFieldAttrs'});
            yield put.resolve({ type:'cancelable', task:fetchFieldAttrsCancelable, action:'cancelFieldAttrs' });
            function* fetchFieldAttrsCancelable(params){
                try {
                    let { resolve, reject } = action.payload || {};
                    // resolve 用于定额管理 确保先获取fieldAttrs的异步控制
                    let { global: { currentField } } = yield select();
                    yield put({type:'toggleTreeLoading'});
                    let { data } = yield call(getFieldAttrs, { field_id : currentField.field_id });           
                    if ( data && data.code == 0 ){
                        yield put({type:'getFieldAttrs', payload:{ data:data.data }});
                        if ( resolve && typeof resolve === 'function') resolve(data.data.list);
                    } else {
                        if ( reject && typeof reject === 'function' ) reject(data.msg);
                    }
                } catch(err){
                    console.log(err);
                } 
            }           
        },
        *fetchIncoming(action, { call, put, select }){
            yield put.resolve({ type:'cancelable', task:fetchIncomingCancelable, action:'cancelIncoming'});
            function* fetchIncomingCancelable(params){
                try{
                    let { global:{ companyId }} = yield select();
                    let { resolve, reject } = action.payload || {};
                    let { data } = yield call(getIncoming, { company_id:companyId });
                    if ( data && data.code === '0'){
                        yield put({ type:'getIncoming', payload:{ data:data.data }});
                        if ( resolve && typeof resolve === 'function') resolve();
                    } else {
                        if ( reject && typeof reject === 'function' ) reject(data.msg);
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
    },
    reducers:{
        toggleTreeLoading(state){
            return { ...state, treeLoading:true }
        },
        toggleCurrentMenu(state, { payload }){
            return { ...state, currentMenu:payload };
        },
        toggleTimeType(state, { payload }){
            let startDate, endDate;
            let date = new Date();
            if ( payload === '1'){
                startDate = endDate = moment(date);
            }
            if ( payload === '2'){
                startDate = moment(date).startOf('month');
                endDate = moment(date).endOf('month');
            } else if ( payload === '3'){
                startDate = moment(date).startOf('year');
                endDate = moment(date).endOf('year');
            }
            return { ...state, timeType:payload, startDate, endDate };
        },
        setDate(state, { payload:{ startDate, endDate }}){
            return { ...state, startDate, endDate };
        },
        getFields(state, { payload:{ data }}){
            return { ...state, fieldList:data, currentField : data && data.length ? data[0] : {}};
        },
        getFieldAttrs(state, { payload:{ data }}){
            return { ...state, fieldAttrs:data.list || [], currentAttr:data.list && data.list.length ? data.list[0] : {}, treeLoading:false };
        },
       
        toggleField(state, { payload }){
            return { ...state, currentField:payload };
        },
        toggleAttr(state, { payload }){
            return { ...state, currentAttr:payload };
        },
        getIncoming(state, { payload:{ data }}){    
            return { ...state, incomingList:data, currentIncoming : data && data.length ? data[0] : {}};
        },
        toggleIncoming(state, { payload }){
            return { ...state, currentIncoming:payload };
        },
        setContainerWidth(state, { payload:{ containerWidth } }){
            return { ...state, containerWidth };
        },
        getUserInfo(state, { payload:{ data, currentCompany }}){
            return { ...state, userInfo:data, currentCompany, companyId:currentCompany.company_id, userAuthed:true };
        },
        getThirdAgent(state, { payload:{ data }}) {
            // console.log(data);
            return { ...state, thirdAgent:data };
        },
        clearUserInfo(state){
            localStorage.clear();
            return initialState;
        },
        setMsg(state, { payload : { data } }){
            // 根据count 字段判断是否需要更新告警信息
            if ( state.msg.count !== data.count ){
                return { ...state, msg:data };
            } else {
                return state;
            }
        },
    }
}

function delay(ms){
    return new Promise((resolve ,reject)=>{
        setTimeout(()=>{
            resolve();
        },ms)
    })
}