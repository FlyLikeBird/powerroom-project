import { getMonitorInfo } from '../services/monitorIndexService';
const initialState = {
    monitorInfo:{}
}

export default {
    namespace:'monitorIndex',
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
            yield put({ type:'fetchMonitorInfo'});
        },
        // 统一取消所有action
        *cancelAll(action, { put }){

        },
        *fetchMonitorInfo(action, { call, put }){
            yield put.resolve({ type:'cancelable', task:fetchMonitorInfoCancelable, action:'cancelMonitorInfo' });
            function* fetchMonitorInfoCancelable(params){
                try {
                    let { data } = yield call(getMonitorInfo, { company_id:1 });
                    if ( data && data.code === '0'){
                        yield put({ type:'getMonitorInfo', payload:{ data:data.data }});
                    } else {

                    }
                } catch(err){
                    console.log(err);
                }
            }
        }
    },
    reducers:{
        getMonitorInfo(state, { payload:{ data }}){
            let totalInfo = [];
            totalInfo.push({ title:'电压等级', value:0.4, unit:'kv' });
            totalInfo.push({ title:'变压器台数', value:2, unit:'台' })
            totalInfo.push({ title:'装机容量', value:315, unit:'kva' })
            totalInfo.push({ title:'负荷率', value:20.14, unit:'kw' })
            totalInfo.push({ title:'申报需量', value:0.4, unit:'kv' })
            totalInfo.push({ title:'测控装置', value:46, unit:'个' })
            data['totalInfo'] = totalInfo;
            return { ...state, monitorInfo:data };
        }
    }
}