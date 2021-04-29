import React from 'react';
import { Radio, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from '../../index.less';
import LineChart from '../components/LineChart';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
const buttons = [
    { title:'视在', code:'1' },
    { title:'有功', code:'2' },
    { title:'无功', code:'3' },
    { title:'绕组温度', code:'4' },
    { title:'负荷率', code:'5' },

]
function ChartContainer({ global }){
    return (
        <div style={{ height:'100%'}}>
            <div style={{ height:'30px' }} className={style['button-group-container']}>
                {
                    buttons.map((item,index)=>(
                        <div className={style['button-group-item']}>{ item.title }</div>
                    ))
                }
            </div>
            <CustomDatePicker action='ele_monitor'/>
            <div style={{ height:'calc( 100% - 60px)'}}>
                <LineChart />
            </div>
        </div>
    )
}

export default ChartContainer;