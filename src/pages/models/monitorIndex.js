import { getMonitorInfo, getScenes, getMachData } from '../services/monitorIndexService';

const initialState = {
    sceneList:[],
    currentScene:{},
    sceneLoading:true,
    monitorInfo:{},
    sceneIndex:1
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
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put.resolve({ type:'reset'});
        },
        *init(action, { put }){
            yield put.resolve({ type:'fetchScenes'});
            yield put.resolve({ type:'fetchMonitorInfo'});
        },
        *fetchScenes(action, { call, select, put }){
            let { global:{ companyId }} = yield select();
            let { data } = yield call(getScenes, { company_id:companyId, scene_type:'1' });
            if ( data && data.code === '0'){
                yield put({ type:'getScenes', payload:{ data:data.data }});
            }
        },
        *fetchMonitorInfo(action, { call, put, select }){         
            try {
                let { global:{ companyId }, monitorIndex:{ currentScene }} = yield select();
                let { noLoading } = action.payload || {};
                if ( !noLoading ){
                    yield put({ type:'toggleSceneLoading', payload:true });
                }
                let { data } = yield call(getMonitorInfo, { company_id:companyId, scene_id:currentScene.scene_id });
                if ( data && data.code === '0'){
                    yield put({ type:'getResult', payload:{ data:data.data }});
                } 
            } catch(err){
                console.log(err);
            }
        },   
        *fetchMachsData(action, { call, put, select, all }){
            try {
                let { global:{ companyId }} = yield select();
                let { ids, resolve, reject  } = action.payload || {};
                let dataArr = yield all(
                    ids.map(id=>call(getMachData, { company_id:companyId, register_code:id, mach_type:'ele' }))
                )
                if ( dataArr && dataArr.length ) {
                    if ( resolve ) {
                        resolve(dataArr.map(i=>i.data.data))
                    }
                } else {
                    if ( reject ) reject('请求数据出错，请稍后再试');
                }
            } catch(err){
                console.log(err);
            }
        }
    },
    reducers:{
        toggleSceneLoading(state, { payload }){
            return { ...state, sceneLoading:payload };
        },
        getResult(state, { payload:{ data }}){
            let { realtime } = data;
            let totalInfoList = [], energyInfoList=[], envInfoList = [];
            totalInfoList.push({ title:'电压', value:Math.round(realtime.volt), unit:'v' });
            totalInfoList.push({ title:'变压器台数', value:realtime.transmerCnt, unit:'台' })
            totalInfoList.push({ title:'装机容量', value:realtime.kva, unit:'kva' })
            totalInfoList.push({ title:'负荷率', value:realtime.powerRatio, unit:'%' })
            totalInfoList.push({ title:'最大需量', value:realtime.maxDemand, unit:'kw' })
            totalInfoList.push({ title:'测控装置', value:realtime.collectCnt, unit:'个' })
            data['totalInfoList'] = totalInfoList;
            energyInfoList.push({ title:'有功功率', value:Math.round(realtime.power), unit:'kw' });
            energyInfoList.push({ title:'今日能耗', value:data.dayEnergy, unit:'kwh' })
            energyInfoList.push({ title:'功率因素', value:(+realtime.factor).toFixed(2), unit:'cosΦ' })
            energyInfoList.push({ title:'本月能耗', value:data.monthEnergy, unit:'kwh' })
            energyInfoList.push({ title:'无功功率', value:Math.round(realtime.uselessPower), unit:'kvar' })
            energyInfoList.push({ title:'本年能耗', value:data.yearEnergy, unit:'kwh' });
            data['energyInfoList'] = energyInfoList;
            // envInfoList.push({ title:'室内温度', value:30, unit:'℃' });
            // envInfoList.push({ title:'湿度', value:68.1, unit:'%' })
            // envInfoList.push({ title:'水浸', value:0.98, unit:'mm' })
            // envInfoList.push({ title:'烟雾感应', value:'正常', unit:'' })
            // envInfoList.push({ title:'门禁', value:'开', unit:'' })
            // envInfoList.push({ title:'空调', value:'开', unit:'' });
            // envInfoList.push({ title:'变压器温度', value:'60.2', unit:'℃' });
            // envInfoList.push({ title:'母排温度', value:'56.2', unit:'℃' });
            // data['envInfoList'] = envInfoList;
            return { ...state, monitorInfo:data, sceneLoading:false };
        },
        toggleCurrentScene(state, { payload:{ currentScene, sceneIndex } }){
            return { ...state, currentScene, sceneIndex };
        },
        getScenes(state, { payload:{ data }}){
            let currentScene = data && data.length ? data[0] : {};
            return { ...state, sceneList:data, currentScene };
        },
        reset(state){
            return initialState;
        }
    }
}
