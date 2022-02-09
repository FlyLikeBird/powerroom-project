import { getMachTypes, getSeriesMach, getMachDetail } from '../../services/eleMonitorService';
import moment from 'moment';
var date = new Date();
const initialState = {
    // 所有设备类型
    typeList:[],
    currentType:{},
    // 某种具体设备
    machList:[],
    // 用于加载设备列表
    isLoading:true,
    currentMach:{},
    // 用于加载设备详情
    machLoading:true,
    machDetailInfo:{},
    currentPage:1,
    total:0,
    
}

export default {
    namespace:'terminalMach',
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
            yield put.resolve({ type:'fetchMachTypes'});
            yield put.resolve({ type:'fetchSeriesMach'});
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'cancelMachTypes'});
            yield put({ type:'cancelSeriesMach'});
            yield put({ type:'reset'});
        },
        *fetchMachTypes(action, { call, put, select }){
            yield put({ type:'cancelMachTypes'});
            yield put.resolve({ type:'cancelable', task:fetchMachTypesCancelable, action:'cancelMachTypes' });
            function* fetchMachTypesCancelable(params){
                try {
                    let { global:{ companyId }} = yield select();
                    let { data } = yield call(getMachTypes, { company_id:companyId });
                    if ( data && data.code === '0'){
                        yield put({ type:'getMachTypes', payload:{ data:data.data }});
                    } else {
                        
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchSeriesMach(action, { call, put, select }){
            yield put({ type:'cancelSeriesMach'});
            yield put.resolve({ type:'cancelable', task:fetchSeriesMachCancelable, action:'cancelSeriesMach' });
            function* fetchSeriesMachCancelable(params){
                try {
                    yield put({ type:'toggleLoading'});
                    let { global:{ companyId }, terminalMach:{ currentType } } = yield select();
                    let { page } = action.payload || {};
                    page = page || 1;
                    console.log(currentType);
                    let { data } = yield call(getSeriesMach, { company_id:companyId, type:currentType.key, page, pagesize:12 });
                    if ( data && data.code === '0'){
                        yield put({ type:'getSeriesMach', payload:{ data:data.data, currentPage:page, total:data.count }});
                    } else {
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *resetMachDetail(action, { put }){
            yield put({ type:'cancelMachDetail'});
            yield put({ type:'resetMach'});
        },
        *fetchMachDetail(action, { call, put, select }){
            yield put.resolve({ type:'cancelable', task:fetchMachDetailCancelable, action:'cancelMachDetail' });
            function* fetchMachDetailCancelable(params){
                try {
                    yield put({ type:'toggleMachLoading'});
                    let { global:{ companyId }, terminalMach:{ currentMach } } = yield select();
                    let { referDate } = action.payload || {};
                    referDate = referDate || moment(new Date());
                    let { data } = yield call(getMachDetail, { company_id:companyId, mach_id:currentMach.mach_id, date_time:referDate.format('YYYY-MM-DD')  });
                    if ( data && data.code === '0'){
                        yield put({ type:'getMachDetail', payload:{ data:data.data }});
                    } else {
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
        toggleMachLoading(state){
            return { ...state, machLoading:true };
        },
        getMachTypes(state, { payload:{ data }}){
            let currentType = data && data.length ? data[0] : {};
            return { ...state, typeList:data, currentType };
        },
        getSeriesMach(state, { payload:{ data, currentPage, total }}){
            return { ...state, machList:data.meterList || [], total, currentPage, isLoading:false };
        },
        getMachDetail(state, { payload:{ data }}){
            return { ...state, machDetailInfo:data, machLoading:false };
        },
        toggleMachType(state, { payload }){
            return { ...state, currentType:payload };
        },
        setCurrentMach(state, { payload }){
            return { ...state, currentMach:payload };
        },
        resetMach(state){
            return { ...state, machLoading:true, currentMach:{}, machDetailInfo:{} };
        },
        reset(state){
            return initialState;
        }
    }
}