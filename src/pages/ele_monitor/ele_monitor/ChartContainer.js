import React from 'react';
import { Radio, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from '../../index.less';
import LineChart from './LineChart';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';

const buttons = [
    { title:'有功功率', code:'1', unit:'kw' },
    { title:'电流', code:'2', unit:'A' },
    { title:'相电压', code:'3', unit:'V' },
    { title:'线电压', code:'4', unit:'V' },
    { title:'功率因素', code:'5', unit:'cosΦ' },
    { title:'无功功率', code:'6', unit:'kvar' },
    { title:'视在功率', code:'7', unit:'kw' },
    // { title:'三相不平衡', code:'8', unit:'' },
];

function ChartContainer({ dispatch, data, isLoading, timeType, startDate, optionType }){
    let info = buttons.filter(i=>i.code === optionType)[0] ;
    return (
        <div style={{ height:'100%', position:'relative' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div className={style['button-group-container']}>
                {
                    buttons.map((item,index)=>(
                        <div key={index} className={ item.code === optionType ? style['button-group-item'] + ' ' + style['selected'] : style['button-group-item']} onClick={()=>{
                            dispatch({ type:'eleMonitor/toggleOptionType', payload:item.code });
                            dispatch({ type:'eleMonitor/fetchChartInfo'});
                        }}>{ item.title }</div>
                    ))
                }
            </div>
            <CustomDatePicker optionStyle={{ margin:'16px 0'}} onDispatch={()=>{
                dispatch({ type:'eleMonitor/fetchChartInfo'});
            }} />
            <div style={{ height:'calc( 100% - 90px)'}}>
                <LineChart xData={data.date} energy={data.energy} energyA={ data.energyA} energyB={data.energyB} energyC={data.energyC} info={info} startDate={startDate} timeType={timeType} optionType={optionType} />
            </div>
        </div>
    )
}

export default ChartContainer;