import { getBaseCost, getAdjustCost, getMeasureCost, getCostTrend, getEnergyFlow } from '../../services/costMonitorService';
import { message } from 'antd';

const initialState = {
    baseCostInfo:{},
    adjustCostInfo:{},
    measureCostInfo:{},
    costTrendInfo:{},
    selectedKeys:[],
    trendLoading:true,
    flowChartInfo:{},
    chartLoading:true
}

export default {
    namespace:'baseCost',
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
            yield put.resolve({ type:'global/fetchIncoming'});
            yield put({ type:'fetchBaseCost'});
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'cancelBaseCost'});
            yield put({ type:'cancelAdjustCost'});
            yield put({ type:'cancelMeasureCost'});
            yield put({ type:'cancelCostTrend'});
            yield put({ type:'cancelEnergyFlow'});
            yield put({ type:'reset'});
        },
        *fetchBaseCost(action, { call, put, select }){
            yield put({ type:'cancelBaseCost'});
            yield put.resolve({ type:'cancelable', task:fetchBaseCostCancelable, action:'cancelBaseCost' });
            function* fetchBaseCostCancelable(params){
                try {
                    let { global:{ companyId, startDate, endDate, currentIncoming }} = yield select();
                    let { data } = yield call(getBaseCost, { company_id:companyId, in_id:currentIncoming.in_id, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD') });
                    if ( data && data.code === '0'){
                        yield put({ type:'getBaseCost', payload:{ data:data.data }});
                    } else {
                        
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchAdjustCost(action, { call, put, select }){
            yield put({ type:'cancelAdjustCost'});
            yield put.resolve({ type:'cancelable', task:fetchAdjustCostCancelable, action:'cancelAdjustCost' });
            function* fetchAdjustCostCancelable(params){
                try {
                    let { global:{ companyId, startDate, endDate, currentAttr }} = yield select();
                    // 如果维度树已经加载好
                    if ( Object.keys(currentAttr).length ){
                        let { data } = yield call(getAdjustCost, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD') });
                        if ( data && data.code === '0'){
                            yield put({ type:'getAdjustCost', payload:{ data:data.data }});
                        }                      
                    } else {
                        yield put.resolve({ type:'global/fieldInit'});
                        let { global:{ currentAttr }} = yield select();
                        let { data } = yield call(getAdjustCost, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD') });
                        if ( data && data.code === '0'){
                            yield put({ type:'getAdjustCost', payload:{ data:data.data }});
                        } 
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchMeasureCost(action, { call, put, select }){
            yield put({ type:'cancelMeasureCost'});
            yield put.resolve({ type:'cancelable', task:fetchMeasureCostCancelable, action:'cancelMeasureCost' });
            function* fetchMeasureCostCancelable(params){
                try {
                    let { global:{ companyId, startDate, endDate, currentAttr, timeType }} = yield select();
                    // 如果维度树已经加载好
                    if ( Object.keys(currentAttr).length ){
                        let { data } = yield call(getMeasureCost, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType });
                        if ( data && data.code === '0'){
                            yield put({ type:'getMeasureCost', payload:{ data:data.data }});
                        }                      
                    } else {
                        yield put.resolve({ type:'global/fieldInit'});
                        let { global:{ currentAttr }} = yield select();
                        let { data } = yield call(getMeasureCost, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType });
                        if ( data && data.code === '0'){
                            yield put({ type:'getMeasureCost', payload:{ data:data.data }});
                        } 
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchCostTrend(action, { call, put, select }){
            yield put({ type:'cancelCostTrend'});
            yield put.resolve({ type:'cancelable', task:fetchCostTrendCancelable, action:'cancelCostTrend' });
            function* fetchCostTrendCancelable(params){
                try {
                    let { global:{ companyId, startDate, endDate, currentAttr, timeType}, baseCost:{ selectedKeys }} = yield select();
                    timeType = timeType === '1' ? '3' : timeType === '3' ? '1' : '2';
                    // yield put({ type:'toggleTrendLoading'});
                    // 如果维度树已经加载好
                    if ( Object.keys(currentAttr).length ){
                        
                        let { data } = yield call(getCostTrend, { type_id:1, company_id:companyId, attr_ids:selectedKeys, begin_time:startDate.format('YYYY-MM-DD'), end_time:endDate.format('YYYY-MM-DD'), time_type:timeType });
                        if ( data && data.code === '0'){
                            yield put({ type:'getCostTrend', payload:{ data:data.data }});
                        }                      
                    } else {
                        yield put.resolve({ type:'global/fieldInit'});
                        let { global:{ currentAttr }} = yield select();
                        let temp = [];
                        if ( currentAttr.children && currentAttr.children.length ) {
                            temp.push(currentAttr.key);
                            currentAttr.children.map(i=>temp.push(i.key));
                        } else {
                            temp.push(currentAttr.key);
                        }
                        yield put({ type:'select', payload:temp });
                        let { baseCost:{ selectedKeys }} = yield select();
                        let { data } = yield call(getCostTrend, { type_id:1, company_id:companyId, attr_ids:selectedKeys, begin_time:startDate.format('YYYY-MM-DD'), end_time:endDate.format('YYYY-MM-DD'), time_type:timeType });
                        if ( data && data.code === '0'){
                            yield put({ type:'getCostTrend', payload:{ data:data.data }});
                        } 
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchEnergyFlow(action, { call, put, select }){
            yield put({ type:'cancelEnergyFlow'});
            yield put.resolve({ type:'cancelable', task:fetchEnergyFlowCancelable, action:'cancelEnergyFlow' });
            function* fetchEnergyFlowCancelable(params){
                try {
                    let { global:{ companyId, startDate, endDate, currentAttr }, baseCost:{ flowChartInfo }} = yield select();
                    // 如果维度树已经加载好
                    let { clickNode } = action.payload || {};
                    let finalAttr;
                    if ( Object.keys(currentAttr).length ){
                        finalAttr = clickNode || currentAttr;
                        let { data } = yield call(getEnergyFlow, { company_id:companyId, attr_id:finalAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD') });
                        if ( data && data.code === '0'){
                            if ( data.data.children && data.data.children.length ) {
                                yield put({ type:'getEnergyFlow', payload:{ data:data.data, parentChart:flowChartInfo, clickNode }});
                            } else {
                                if ( clickNode ){
                                    message.info('没有下一级节点');
                                } else {
                                    yield put({ type:'getEnergyFlow', payload:{ data:{ empty:true } }});
                                }
                            }

                        }                      
                    } else {
                        yield put.resolve({ type:'global/fieldInit'});
                        let { global:{ currentAttr }} = yield select();
                        finalAttr = clickNode || currentAttr;
                        let { data } = yield call(getEnergyFlow, { company_id:companyId, attr_id:finalAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD')  });
                        if ( data && data.code === '0'){
                            if ( data.data.children && data.data.children.length ) {
                                yield put({ type:'getEnergyFlow', payload:{ data:data.data, parentChart:flowChartInfo, clickNode }});
                            } else {
                                if ( clickNode ){
                                    message.info('没有下一级节点');
                                } else {
                                    yield put({ type:'getChart', payload:{ data:{ empty:true } }});
                                }
                            }
                        } 
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
    },
    reducers:{
        toggleChartLoading(state){
            return { ...state, chartLoading:true  }
        },
        toggleTrendLoading(state){
            return { ...state, trendLoading:true };
        },
        getBaseCost(state, { payload:{ data }}){
            return { ...state, baseCostInfo:data };
        },
        getAdjustCost(state, { payload:{ data }}){
            return { ...state, adjustCostInfo:data };
        },
        getMeasureCost(state, { payload:{ data }}){
            let totalCost = data.base.totalCost || 0;
            // 将尖时段信息设为数组第一项
            let temp = data.base.detail.pop();
            data.base.detail.unshift(temp);
            let measureInfoList = data.base.detail.map(item=>{
                return {
                    title:item.time_type === 1 ? '峰时段' : item.time_type === 2 ? '平时段' : item.time_type === 3 ? '谷时段' : '尖时段',
                    cost:item.totalCost,
                    child:[
                        { title:'电费', value: Math.round(item.totalCost), unit:'元' },
                        { title:'电费占比', value: totalCost ? (item.totalCost / totalCost * 100).toFixed(1) : 0, unit:'%' },
                        { title:'用电量', value:Math.round(item.totalEnergy), unit:'kwh'}
                    ]
                }
            }).filter(i=>+i.cost);
            measureInfoList.push({ title:'分析结果', child:[{ title:'总电费', value:Math.round(totalCost), unit:'元'}, { title:'可节省空间', value:data.saveCost, unit:'元' }]})
            // console.log(measureInfoList);
            data.measureInfoList = measureInfoList;
            return { ...state, measureCostInfo:data };
        },
        select(state, { payload }){
            
            return { ...state, selectedKeys:payload };
        },
        getCostTrend(state, { payload:{ data }}){
            let infoList = [];
            infoList.push({ title:'本期成本', unit:'元', value:data.analyze.current });
            infoList.push({ title:'上期成本', unit:'元', value:data.analyze.link });
            infoList.push({ title:'同比增长率', unit:'%', value:data.analyze.same_period });
            infoList.push({ title:'环比增长率', unit:'%', value:data.analyze.link_period });
            data.infoList = infoList;
            return { ...state, costTrendInfo:data, trendLoading:false };
        },
        toggleClickNode(state, { payload }){
            return { ...state, clickNode:payload };
        },
        getEnergyFlow(state, { payload:{ data, parentChart, clickNode }}){
            // 重新构建节点树的层级关系
            let temp = data;
            if ( clickNode ){
                addNewNode(parentChart, clickNode, data);
                temp = { ...parentChart };
            }
            // console.log(data);
            // console.log(temp);
            return { ...state, flowChartInfo:temp, chartLoading:false };
        },

        reset(state){
            return initialState;
        }
    }
}

function addNewNode(node, checkNode, newNode, deep = 0){
    let isExist = { value:false };
    checkIsExist(node, checkNode, isExist);
    // console.log(node.attr_name + ':' + isExist.value);
    if ( deep !== 0 && isExist.value ) {
        // 点击节点的所有祖先节点都保留children
        if ( deep === checkNode.depth ){
            console.log('a');
            node.children = newNode.children;
            return ;
        } 
    } else {
        // 点击节点祖先节点以外的其他节点都清空children
        if ( deep !== 0 ){
            node.children = null;
        }
    } 
    if ( node.children && node.children.length ){
        node.children.forEach((item)=>{
            let temp = deep;
            ++temp;
            addNewNode(item, checkNode, newNode, temp);
        })
        
    }
}

function checkIsExist(tree, checkNode, isExist){
    if ( tree.attr_name === checkNode.title ) {
        isExist.value = true;
        return ;
    }
    if ( tree.children && tree.children.length ){
        tree.children.map(item=>{
            checkIsExist(item, checkNode, isExist);
        })
    }
}
