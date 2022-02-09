import React from 'react';
import { Radio, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from '../../index.less';
import LineChart from '../components/LineChart';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';

const buttons = [
    { title:'需量', code:'1', unit:'kw' },
    { title:'电压', code:'2', unit:'V' },
    { title:'视在', code:'3', unit:'kw' },
    { title:'有功', code:'4', unit:'kw' },
    { title:'无功', code:'5', unit:'kvar' },
    { title:'电流', code:'6', unit:'A' },
];

function ChartContainer({ data, dispatch, startDate, timeType, optionType, isLoading }){
    return (
        <div style={{ height:'100%', position:'relative' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ display:'flex', alignItems:'center', height:'50px', padding:'6px 0' }}>
                <div className={style['button-group-container']} style={{ marginRight:'20px' }} >
                    {
                        buttons.map((item,index)=>(
                            <div key={index} className={ item.code === optionType ? style['button-group-item'] + ' ' + style['selected'] : style['button-group-item']} onClick={()=>{
                                dispatch({ type:'incoming/toggleOptionType', payload:item.code });
                                dispatch({ type:'incoming/fetchIncomingChart'});
                            }}>{ item.title }</div>
                        ))
                    }
                </div>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'incoming/fetchIncomingChart'});
                }} />
            </div>
            <div style={{ height:'calc( 100% - 50px)'}}>
                <LineChart timeType={timeType} startDate={startDate} xData={data.date} yData={data.energy} y2Data={data.energySame} unit={buttons.filter(i=>i.code === optionType)[0].unit } />
            </div>
        </div>
    )
}

export default ChartContainer;