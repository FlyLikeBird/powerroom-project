import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';
import style from '../index.less';
import Transformer from './transformer/Transformer';
import HighVoltage from './high_voltage/HighVoltage';
import EleMonitor from './ele_monitor/EleMonitor';
import TerminalMach from './terminal_mach/TerminalMach';
import LineMonitor from './line_monitor/LineMonitor';

const menuList = [
    { menu_code:'1', menu_name:'变压器监测'},
    { menu_code:'2', menu_name:'高压进线管理'},
    { menu_code:'3', menu_name:'电气监控'},
    { menu_code:'4', menu_name:'线路监控'},
    { menu_code:'5', menu_name:'终端监控'},
];

function EleMonitorManager(){
    const [subMenu, toggleSubMenu] = useState('1');
    useEffect(()=>{
        return ()=>{
            console.log('ele-monitor unmounted');
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
                <Transformer  />
                :
                subMenu === '2' 
                ?
                <HighVoltage  />
                :
                subMenu === '3' 
                ?
                <EleMonitor />
                :
                subMenu === '4' 
                ?
                <LineMonitor />
                :
                subMenu === '5' 
                ?
                <TerminalMach />
                :
                null
            }
        </div>
    )
}

export default EleMonitorManager;