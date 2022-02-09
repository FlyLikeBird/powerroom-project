import { getRestEle } from '../services/safeMonitorService';
const initialState = {
    // 1：母排温度；2：剩余电流；3：三相不平衡度；4：谐波监控
    energyType:'2',
    isLoading:true,
    chartInfo:{}
}

export default {
    namespace:'safeMonitor',
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
            yield put.resolve({ type:'global/fieldInit'});
            yield put.resolve({ type:'fetchChartInfo'});
            // yield put.resolve({ type:'fetchIncomingChart'});
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'cancelRestEle'});
            yield put({ type:'reset'});
        },
        *fetchRestEle(action, { call, put, select }){
            yield put({ type:'cancelRestEle'});
            yield put.resolve({ type:'cancelable', task:fetchRestEleCancelable, action:'cancelRestEle' });
            function* fetchRestEleCancelable(params){
                try {
                    let { global:{ companyId, startDate, endDate, currentAttr, timeType }, safeMonitor:{ energyType }} = yield select();
                    yield put({ type:'toggleLoading'});
                    // 如果维度树已经加载好
                    if ( Object.keys(currentAttr).length ){
                        let { data } = yield call(getRestEle, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, energy_type:energyType });
                        if ( data && data.code === '0'){
                            yield put({ type:'getRestEle', payload:{ data:data.data }});
                        }                      
                    } else {
                        yield put.resolve({ type:'global/fieldInit'});
                        let { global:{ currentAttr }} = yield select();
                        let { data } = yield call(getRestEle, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, energy_type:energyType  });
                        if ( data && data.code === '0'){
                            yield put({ type:'getRestEle', payload:{ data:data.data }});
                        } 
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getRestEle(state, { payload :{ data }}){
            return { ...state, chartInfo:data, isLoading:false };
        },
        toggleOptionType(state, { payload }){
            return { ...state, optionType:payload };
        },
        reset(state){
            return initialState;
        }
    }
}