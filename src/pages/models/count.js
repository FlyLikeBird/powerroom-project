function delay(ms){
    console.log(ms);
    return new Promise((resolve, reject)=>{
        setTimeout(()=>resolve(), ms);
    })
}

const initialState = {
    count:0
}
export default {
    namespace:'count',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        *init(action, { put }){
            yield put({ type:'addAsync'});
            yield put({ type:'getProduct'});
        },
        *cancelAll(action, { put}){
            yield put({ type:'cancelAdd'});
            yield put({ type:'cancelProduct'});
            yield put({ type:'reset'});
        },
        *clear(action, { put }){
            yield put.resolve({ type:'cancelAdd' });
        },
        *addAsync(action, { call, put}){
            console.log('a');
            yield put.resolve({ type:'cancelable', task:addAsyncCancelable, action:'cancelAdd' })
            function* addAsyncCancelable(params){
                console.log(params);
            
                try {
                    
                    let result = yield call(delay, 2000);
                    console.log('add action');
                    yield put({type:'getResult'});
                    
                } catch(err){
                    console.log(err);
                }
            }
        },
        *getProduct(action, { call,put }){
            yield put.resolve({ type:'cancelable', task:getProductCancelable, action:'cancelProduct'});
            function* getProductCancelable(params){
                let result = yield call(delay, 3000);
                console.log('getProduct action');
            }
        }
    },
    reducers:{
        getResult(state){
            return { ...state, count:state.count + 1 };
        },
        reset(state){
            console.log('reset');
            return initialState;
        }
    }
}