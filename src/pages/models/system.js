import { getRoleList, getLoginLog, getOperationLog } from '../services/systemSettingService';
const initialState = {
    roleList:[],
    logList:[],
    currentPage:1,
    total:0
}

export default {
    namespace:'system',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'cancelBaseCost'});
            yield put({ type:'cancelAdjustCost'});
            yield put({ type:'cancelMeasureCost'});
            yield put({ type:'reset'});
        },
        *fetchRoleList(action, { call, put, select }){
            yield put.resolve({ type:'cancelable', task:fetchRoleListCancelable, action:'cancelRoleList' });
            function* fetchRoleListCancelable(params){
                try {
                    let { data } = yield call(getRoleList);
                    if ( data && data.code === '0'){
                        yield put({ type:'getRoleList', payload:{ data:data.data }});
                    } else {
                        
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchLogList(action, { call, put, select }){
            yield put.resolve({ type:'cancelable', task:fetchLogListCancelable, action:'cancelLogList' });
            function* fetchLogListCancelable(params){
                try {
                    let { logType, page } = action.payload || {};
                    if ( page ){
                        yield put({ type:'setPage', payload:page });
                    } else {
                        // 初始化
                        yield put({ type:'setPage', payload:1 });
                    }
                    let { global:{ companyId }, system:{ currentPage }} = yield select();
                    let { data } = yield call( logType === 'login' ? getLoginLog : getOperationLog , { company_id:companyId, page:currentPage });
                    if ( data && data.code === '0'){
                        yield put({ type:'getLogList', payload:{ data:data.data, total:data.count }});
                    } else {
                        
                    }
                } catch(err){
                    console.log(err);
                }
            }
        }
        
    },
    reducers:{
        getRoleList(state, { payload:{ data }}){
            let { roles } = data;
            return { ...state, roleList: roles };
        },
        getLogList(state, { payload:{ data, total }}){
            return { ...state, logList:data.logs, total }
        },
        setPage(state, { payload }){
            return { ...state, currentPage:payload };
        },
        reset(state){
            return initialState;
        }
    }
}