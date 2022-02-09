import { getWarningList, getConfirmWarning, uploadImg } from '../services/costReportService';
const initialState = {
    sourceData:[],
    isLoading:true,
    currentPage:1,
    total:0,
    // 0：全部；1：电气安全；2：指标越限；3：通讯异常；
    cateCode:'0',
    // 0：全部；1：未处理；2：处理中；3：已处理；4：挂起
    warningStatus:'0'
}

export default {
    namespace:'alarm',
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
            yield put({ type:'cancelWarningList'});  
            yield put({ type:'cancelConfirmWarning'});      
            yield put({ type:'reset'});
        },
        // 请求告警列表
        *fetchWarningList(action, { call, put, select }){
            yield put({ type:'cancelWarningList'});
            yield put.resolve({ type:'cancelable', task:fetchWarningListCancelable, action:'cancelWarningList' });
            function* fetchWarningListCancelable(params){
                try {
                    yield put({ type:'toggleLoading'});
                    let { global:{ companyId, currentAttr, startDate, endDate }, alarm:{ cateCode, warningStatus } } = yield select();
                    let { page } = action.payload || {};
                    page = page || '1';
                    if ( Object.keys(currentAttr).length ){
                        let { data } = yield call(getWarningList, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), cate_code:cateCode, status:warningStatus, page, page_size:20 });
                        if ( data && data.code === '0'){
                            yield put({ type:'getWarningList', payload:{ data:data.data, total:data.count, page }});
                        }                      
                    } else {
                        yield put.resolve({ type:'global/fieldInit'});
                        let { global:{ currentAttr }} = yield select();
                        let { data } = yield call(getWarningList, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), cate_code:cateCode, status:warningStatus, page, page_size:20  });
                        if ( data && data.code === '0'){
                            yield put({ type:'getWarningList', payload:{ data:data.data, total:data.count, page }});
                        } 
                    }
                } catch(err){
                    console.log(err);
                    
                }
            }
        },
        // 告警事件流处理
        *fetchConfirmWarning(action, { select, call, put, all }){
            yield put.resolve({ type:'cancelable', task:fetchConfirmWarningCancelable, action:'cancelConfirmWarning' });
            function* fetchConfirmWarningCancelable(params){
                try {
                    console.log('b');
                    let { global:{ companyId }} = yield select();
                    let { record_id, oper_code, execute_type, execute_info, photos, resolve, reject } = action.payload || {};
                    // photos字段是上传到upload接口返回的路径
                    let uploadPaths;
                    if ( photos && photos.length ) {
                        let imagePaths = yield all([
                            ...photos.map(file=>call(uploadImg, { file }))
                        ]);
                        uploadPaths = imagePaths.map(i=>i.data.data.filePath);
                    } 
                    let { data } = yield call(getConfirmWarning, { company_id:companyId, record_id, photos:uploadPaths, log_desc:execute_info, oper_code, type_id:execute_type });                 
                    if ( data && data.code === '0'){
                        if ( resolve && typeof resolve === 'function' ) resolve();
                        yield put({type:'fetchWarningList'});
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
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getWarningList(state, { payload:{ data, total, page }}){
            console.log(data);
            return { ...state, sourceData:data, total, currentPage:page, isLoading:false };
        },
        setPage(state, { payload }){
            return { ...state, currentPage:payload };
        },
        toggleCateCode(state, { payload }){
            return { ...state, cateCode:payload };
        },
        toggleWarningStatus(state, { payload }){
            return { ...state, warningStatus:payload };
        },
        reset(state){
            return initialState;
        }
    }
}