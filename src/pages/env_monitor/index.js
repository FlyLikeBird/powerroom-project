import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';
import style from '../index.less';
import EnvMonitor from './env_monitor';


const menuList = [
    { menu_code:'1', menu_name:'摄像头监控'},
    { menu_code:'2', menu_name:'环境监控'},
];

function EnvMonitorManager({ dispatch, global }){
    const [subMenu, toggleSubMenu] = useState('2');
    useEffect(()=>{
        return ()=>{
            console.log('ele-monitor unmounted');
        }
    },[])
    return (
        <div className={style['page-container']}>
            <div className={style['card-container'] + ' ' + style['float-menu-container']}>
                <div className={style['card-title']}>导航功能</div>
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
                subMenu === '2'  
                ?
                <EnvMonitor  />
                :
                subMenu === '12' 
                ?
                <HighVoltage  />
                :
                subMenu === '3' 
                ?
                <EleMonitor />
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

export default connect(({ global, ele_monitor })=>({ global, ele_monitor }))(EnvMonitorManager);