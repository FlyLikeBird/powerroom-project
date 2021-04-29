import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';
import style from '../index.less';
import EnergyFlowContainer from './energy_flow';

const menuList = [
    { menu_code:'1', menu_name:'基本电费监测'},
    { menu_code:'2', menu_name:'力调电费监测'},
    { menu_code:'3', menu_name:'计量电费监测'},
    { menu_code:'4', menu_name:'电费成本趋势'},
    { menu_code:'5', menu_name:'能源流向图'},
];

function CostMonitorManager({ dispatch, global }){
    const [subMenu, toggleSubMenu] = useState('5');
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
                subMenu === '5'  
                ?
                <EnergyFlowContainer />
                :
                null
            }
        </div>
    )
}

export default connect(({ global, ele_monitor })=>({ global, ele_monitor }))(CostMonitorManager);