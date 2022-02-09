import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';
import RestEleManager from './rest_ele/RestEleManager';
import style from '../index.less';

const menuList = [
    { menu_code:'1', menu_name:'母排线缆温度'},
    { menu_code:'2', menu_name:'剩余电流监测'},
    { menu_code:'3', menu_name:'三相不平衡'},
    { menu_code:'4', menu_name:'谐波监控'},

];

function SafeMonitorManager({ dispatch, global }){
    const [subMenu, toggleSubMenu] = useState('2');
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
                
            }
            {
                subMenu === '2' 
                ?
                <RestEleManager />
                :
                null
            }
        </div>
    )
}

export default connect(({ global, ele_monitor })=>({ global, ele_monitor }))(SafeMonitorManager);