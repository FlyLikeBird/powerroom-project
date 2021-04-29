import React, { useState, useEffect } from 'react';
import { getToday } from '../../utils/parseDate';
let timer;
let week = new Date().getDay();
const weekObj = {
    0:'周日',
    1:'周一',
    2:'周二',
    3:'周三',
    4:'周四',
    5:'周五',
    6:'周六',
}

function WeatherCom({ weatherInfo }){
    const [curTime, updateTime] = useState(getToday(2));
    useEffect(()=>{
        timer = setInterval(()=>{
            updateTime(getToday(2));
        },1000);
        return ()=>{
            clearInterval(timer);
            timer = null;
            week = null;
        }
    },[])
    return (
        <div>
            <span>{ curTime + '  '+ `(${weekObj[week]})` }</span>
            {/* <span style={{ margin:'0 10px'}}>{ weatherInfo.city }</span>
            <span>{ weatherInfo.weather }</span> */}
            <span style={{ margin:'0 10px'}}>|</span>
        </div>
    )
}

export default WeatherCom;