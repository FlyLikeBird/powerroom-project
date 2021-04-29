import React from 'react';
import { connect } from 'dva';
import style from './monitorIndex.css';
import bg from '../../../public/monitor_bg.png';

function MonitorIndex({ global, children }){
    console.log(global);
    return (
        <div className={style['container']} style={{ backgroundImage:`url(${bg})`}}>
            <div className={style['left']}>
                <div className={style['card-container']}></div>
            </div>
            <div className={style['right']}>

            </div>
        </div>
    )
}

export default connect(({ global })=>({ global }))(MonitorIndex);