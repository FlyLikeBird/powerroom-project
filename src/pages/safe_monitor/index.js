import React from 'react';
import { connect } from 'dva';
import style from '../index.less';

function SafeMonitor({ global, children }){
    console.log(global);
    return (
        <div>
            SafeMonitor
        </div>
    )
}

export default connect(({ global })=>({ global }))(SafeMonitor);