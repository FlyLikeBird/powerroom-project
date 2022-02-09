import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';
import style from '../index.less';
import ExtremeReport from './extreme_report';
import CostReportManager from './cost_report/CostReportManager';
import EleReportManager from './ele_report/EleReport';
import SameRateReport from './samerate_report/SameRateReport';
import AdjoinRateReport from './adjoinrate_report/AdjoinRateReport';
import RunningReportManager from './running_report/RunningReport';
import WarningListManager from './warning_list/WarningListManager';

// import Transformer from './transformer';
// import HighVoltage from './high_voltage';
// import EleMonitor from './ele_monitor';
// import TerminalMach from './terminal_mach';

const menuList = [
    { menu_code:'1', menu_name:'极值报表'},
    { menu_code:'2', menu_name:'成本报表'},
    { menu_code:'3', menu_name:'电力报表'},
    { menu_code:'4', menu_name:'同比报表'},
    { menu_code:'5', menu_name:'环比报表'},
    // { menu_code:'6', menu_name:'运行日报'},
    { menu_code:'7', menu_name:'告警列表'}
];

function EleMonitorManager({ dispatch, global, location }){
    const [subMenu, toggleSubMenu] = useState( location.query && location.query.sub ? location.query.sub : '1');
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'costReport/cancelAll'});
        }
    },[])
    return (
        <div className={style['page-container']}>
            <div className={style['card-container'] + ' ' + style['float-menu-container']} style={{ padding:'0' }}>
                <div className={style['card-title']} style={{ padding:'0 14px'}}>导航功能</div>
                <div className={style['card-content']}>
                    <Menu mode='inline' selectedKeys={[subMenu]} onClick={e=>{
                        toggleSubMenu(e.key);
                    }}>
                        {
                            menuList.map((item,index)=>(
                                <Menu.Item key={item.menu_code}>{ item.menu_name }</Menu.Item>
                            ))
                        }
                    </Menu>
                </div>
            </div>
            
            {
                subMenu === '1' 
                ?
                <ExtremeReport />
                :
                subMenu === '2'  
                ?
                <CostReportManager />
                :
                subMenu === '3' 
                ?
                <EleReportManager />
                :
                subMenu === '4' 
                ?
                <SameRateReport />
                :
                subMenu === '5' 
                ?
                <AdjoinRateReport />
                // :
                // subMenu === '6' 
                // ?
                // <RunningReportManager />
                :
                subMenu === '7' 
                ?
                <WarningListManager />
                :
                null
            }
        </div>
    )
}

export default connect(({ global, ele_monitor })=>({ global, ele_monitor }))(EleMonitorManager);