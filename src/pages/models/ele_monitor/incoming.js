import { getIncoming, getIncomingInfo, getIncomingChart } from '../../services/eleMonitorService';
const initialState = {
    incomingInfo:{},
    isLoading:true,
    optionType:'1',
    chartInfo:{}
}

export default {
    namespace:'incoming',
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
            yield put({ type:'fetchIncomingInfo'});
            yield put({ type:'fetchIncomingChart'});
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'cancelIncomingInfo'});
            yield put({ type:'cancelIncomingChart'});
            yield put({ type:'reset'});
        },
        
        *fetchIncomingInfo(action, { call, put, select }){
            yield put.resolve({ type:'cancelable', task:fetchIncomingInfoCancelable, action:'cancelIncomingInfo' });
            function* fetchIncomingInfoCancelable(params){
                try {
                    let { global:{ companyId, currentIncoming }} = yield select();
                    let { data } = yield call(getIncomingInfo, { company_id:companyId, in_id:currentIncoming.in_id });
                    if ( data && data.code === '0'){
                        yield put({ type:'getIncomingInfo', payload:{ data:data.data }});
                    } else {
                        
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchIncomingChart(action, { call, put, select }){
            yield put.resolve({ type:'cancelable', task:fetchIncomingChartCancelable, action:'cancelIncomingChart'});
            function* fetchIncomingChartCancelable(params){
                try {
                    yield put({ type:'toggleLoading' });
                    let { global:{ companyId, timeType, startDate, endDate, currentIncoming }, incoming:{ optionType } } = yield select();
                    let { data } = yield call(getIncomingChart, { company_id:companyId, in_id:currentIncoming.in_id, time_type:timeType, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), energy_type:optionType });
                    if ( data && data.code === '0'){
                        yield put({ type:'getIncomingChart', payload:{ data:data.data }});
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
        getIncomingInfo(state, { payload:{ data }}){
            let infoList = [];
            infoList.push({ title:'进线电流', child:[{ title:'A相电流', value:data.I1 , unit:'A', type:'A' }, { title:'B相电流', value:data.I2 , unit:'A', type:'B' }, { title:'C相电流', value:data.I3 , unit:'A', type:'C' }]});
            infoList.push({ title:'进线电压', child:[{ title:'AB线电压', value:data.U12 , unit:'v', type:'A' }, { title:'BC线电压', value:data.U23 , unit:'v', type:'B' }, { title:'CA线电压', value:data.U31 , unit:'v', type:'C' } ]});
            infoList.push({ title:'最大需量', child:[{ title:'今日最大需量', value:data.dayDemand , unit:'kw'}, { title:'本月最大需量', value:data.monthDemand , unit:'kw'}, { title:'预测下月需量', value:data.predDemand , unit:'kw'}]})
            infoList.push({ title:'当前负荷', child:[{ title:'有功功率', value:data.usePower, unit:'kw'}, { title:'无功功率', value:data.uselessPower, unit:'kvar'}]});
            infoList.push({ title:'功率因素', child:[{ title:'PF', value:data.factor, unit:'cosΦ'}]})
            data.infoList = infoList;
            // console.log(infoList);
            return { ...state, incomingInfo:data };
        },
        getIncomingChart(state, { payload:{ data }}){
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