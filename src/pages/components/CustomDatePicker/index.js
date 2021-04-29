import React from 'react';
import { connect } from 'dva';
import { DatePicker, Radio } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from './CustomDatePicker.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

const { RangePicker } = DatePicker;

function nextAction(dispatch, action){
    switch(action){
        case 'transformer':
            console.log('transformer');
            break;  
        case 'highVoltage':
            console.log('highVoltage');
            break;   
    }
}

function CustomDatePicker({ dispatch, global, action, size }){
    const { dateTimeType, startDate, endDate } = global;
    return (
        <div className={style['container']}>
            <Radio.Group size={size || 'small'} buttonStyle='solid' className={style['radio-container']} value={dateTimeType} onChange={e=>{
                dispatch({ type:'global/toggleDateTimeType', payload:e.target.value });
                nextAction(dispatch, action);
            }}>
                <Radio.Button value='2'>月</Radio.Button>
                <Radio.Button value='3'>年</Radio.Button>
            </Radio.Group>
            <div style={{ display:'inline-flex'}}>
                <div className={style['date-picker-button-left']}><LeftOutlined /></div>
                <RangePicker size={size || 'small'} locale={zhCN} allowClear={false} className={style['date-picker-container']} value={[startDate, endDate]} onChange={arr=>{

                }}/>
                <div className={style['date-picker-button-right']}><RightOutlined /></div>
            </div>
           
        </div>
    )
}

export default connect(({ global })=>({ global }))(CustomDatePicker);