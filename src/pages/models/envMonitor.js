import { getCameraToken, getCameraList, getChannels } from '../services/envMonitorService';
const initialState = {
    // 1：母排温度；2：剩余电流；3：三相不平衡度；4：谐波监控
    energyType:'2',
    isLoading:true,
    chartInfo:{},
    accessToken:'',
    cameraList:[],
    currentCamera:{},
    channelList:[],
    currentChannel:{}
}

export default {
    namespace:'envMonitor',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        // 统一管理所有action
        *init(action, { put }){
            yield put.resolve({ type:'fetchCameraToken'});
            yield put.resolve({ type:'fetchCameraList'});
            yield put.resolve({ type:'fetchCameraChannels'});
            // yield put.resolve({ type:'fetchIncomingChart'});
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'reset'});
        },
        *fetchCameraToken(action, { call, put, select }){
            try {
                let { data } = yield call(getCameraToken);
                let { resolve, reject } = action.payload || {};
                if ( data && data.code === '0'){
                    yield put({ type:'getToken', payload:{ data:data.data }});
                    if ( resolve && typeof resolve === 'function') resolve(data.data.accessToken);
                } else {
                    if ( reject && typeof reject === 'function' ) resolve(data.msg);
                }
            } catch(err){
                console.log(err);
            }      
        },
        *fetchCameraList(action, { call, put, select }){
            yield put({ type:'cancelCameraList'});
            yield put.resolve({ type:'cancelable', task:fetchCameraListCancelable, action:'cancelCameraList' });
            function* fetchCameraListCancelable(params){
                try {
                    let { global:{ companyId }} = yield select();               
                    let { data } = yield call(getCameraList, { company_id:companyId });
                    if ( data && data.code === '0'){
                        yield put({ type:'getCameraList', payload:{ data:data.data }});
                    } 
                    
                } catch(err){
                    console.log(err);
                    
                }
            }
        },
        *fetchCameraChannels(action, { call, put, select }){
            yield put({ type:'cancelChannels'});
            yield put.resolve({ type:'cancelable', task:fetchCameraChannelsCancelable, action:'cancelChannels' });
            function* fetchCameraChannelsCancelable(params){
                try {
                    let { global:{ companyId }, envMonitor:{ currentCamera }} = yield select();               
                    let { data } = yield call(getChannels, { company_id:companyId, deviceSerial:currentCamera.deviceSerial });
                    if ( data && data.code === '0'){
                        yield put({ type:'getChannels', payload:{ data:data.data }});
                    } 
                    
                } catch(err){
                    console.log(err);
                    
                }
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getToken(state, { payload:{ data }}){
            return { ...state, accessToken:data.accessToken };
        },
        getCameraList(state, { payload:{ data }}){
            return { ...state, cameraList:data, currentCamera:data[0] || {} };
        },
        getChannels(state, { payload:{ data }}){
            return { ...state, channelList:data.rows || [], currentChannel:data.rows && data.rows.length ? data.rows[0] : {}};
        },
        toggleChannel(state, { payload }){
            return { ...state, currentChannel:payload };
        },
        reset(state){
            return initialState;
        }
    }
}