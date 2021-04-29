import moment from 'moment';
let date = new Date();
const initialState= {
    currentMenu:'',
    userInfo:{},
    currentCompany:{},
    // 全局socket消息
    msg:{},
    // 全局日期筛选状态
    // 1-日 2-月 3-年
    dateTimeType:'2',
    startDate:moment(date).startOf('month'),
    endDate:moment(date).endOf('month'),
};

export default {
    namespace:'global',
    state:initialState,
    effects:{
        
    },
    reducers:{
        toggleCurrentMenu(state, { payload }){
            return { ...state, currentMenu:payload };
        },
        toggleDateTimeType(state, { payload }){
            let startDate, endDate;
            let date = new Date();
            if ( payload === '1'){

            } else if ( payload === '2'){
                startDate = moment(date).startOf('month');
                endDate = moment(date).endOf('month');
            } else if ( payload === '3'){
                startDate = moment(date).startOf('year');
                endDate = moment(date).endOf('year');
            }
            return { ...state, dateTimeType:payload, startDate, endDate };
        },
        setDate(state, { payload:{ startDate, endDate }}){
            return { ...state, startDate, endDate };
        }
    }
}