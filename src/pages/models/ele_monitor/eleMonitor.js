import { getEleMonitorInfo, getEleLines, getEleLinesDetail } from '../../services/eleMonitorService';
const initialState = {
    optionType:'1',
    isLoading:true,
    chartInfo:{},
    eleScenes:[],
    currentScene:{},
    eleLoading:true,
    eleDetail:{},
    detailLoading:true,
}

export default {
    namespace:'eleMonitor',
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
            yield put({ type:'cancelChartInfo'});
            yield put({ type:'reset'});
        },
        *fetchChartInfo(action, { call, put, select }){
            yield put({ type:'cancelChartInfo'});
            yield put.resolve({ type:'cancelable', task:fetchChartInfoCancelable, action:'cancelChartInfo' });
            function* fetchChartInfoCancelable(params){
                try {
                    yield put({ type:'toggleLoading'});
                    let { global:{ companyId, startDate, endDate, timeType, currentAttr }, eleMonitor:{ optionType }} = yield select();
                    // 如果维度树已经加载好
                    if ( Object.keys(currentAttr).length ){
                        let { data } = yield call(getEleMonitorInfo, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, energy_type:optionType });
                        if ( data && data.code === '0'){
                            yield put({ type:'getChartInfo', payload:{ data:data.data }});
                        }                      
                    } else {
                        yield put.resolve({ type:'global/fieldInit'});
                        let { global:{ currentAttr }} = yield select();
                        let { data } = yield call(getEleMonitorInfo, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, energy_type:optionType  });
                        if ( data && data.code === '0'){
                            yield put({ type:'getChartInfo', payload:{ data:data.data }});
                        } 
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchEleLines(action, { call, put, select }){
            yield put.resolve({ type:'cancelable', task:fetchEleLinesCancelable, action:'cancelEleLines'});
            function* fetchEleLinesCancelable(params){
                try {
                    yield put({ type:'toggleEleLoading' });
                    let { global:{ companyId }} = yield select();
                    let { data } = yield call(getEleLines, { company_id:companyId });
                    if ( data && data.code === '0'){
                        yield put({ type:'getEleScenes', payload:{ data:data.data }})
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *resetDetail(action, { put }){
            yield put({ type:'cancelEleLinesDetail'});
            yield put({ type:'resetDetailInfo'});
        },
        *fetchEleLinesDetail(action, { call, put, select }){
            yield put.resolve({ type:'cancelable', task:fetchEleLinesDetailCancelable, action:'cancelEleLinesDetail'});
            function* fetchEleLinesDetailCancelable(params){
                try {
                    yield put({ type:'toggleDetailLoading'});
                    let { global:{ companyId, startDate, endDate, timeType }} = yield select();
                    let { mach_id, optionType } = action.payload || {};
                    let { data } = yield call(getEleLinesDetail, { company_id:companyId, mach_id, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, energy_type:optionType });
                    if ( data && data.code === '0'){
                        yield put({ type:'getEleLinesDetail', payload:{ data:data.data }});
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
        toggleDetailLoading(state){
            return { ...state, detailLoading:true };
        },
        toggleEleLoading(state){
            return { ...state, eleLoading:true };
        },
        getChartInfo(state, { payload:{ data }}){
            return { ...state, chartInfo:data, isLoading:false };
        },
        toggleOptionType(state, { payload }){
            return { ...state, optionType:payload };
        },
        getEleScenes(state, { payload:{ data }}){
            let temp = data.length ? data[0] : {};
            return { ...state, eleScenes:data, currentScene:temp, eleLoading:false };
        },
        getEleLinesDetail(state, { payload:{ data }}){
            return { ...state, eleDetail:data, detailLoading:false };
        },
        toggleCurrentScene(state, { payload }){
            return { ...state, currentScene:payload };
        },
        resetDetailInfo(state){
            return { ...state, eleDetail:{}, detailLoading:true };
        },
        reset(state){
            return initialState;
        }
    }
}