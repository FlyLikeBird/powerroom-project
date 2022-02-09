import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';
import style from '../index.less';
import RoleManager from './role_manager/RoleManager';
import UserSetting from './user_setting/UserSetting';
import LogManager from './log_manager/LogManager';

const menuList = [
    { menu_code:'1', menu_name:'角色权限'},
    { menu_code:'2', menu_name:'用户设置'},
    { menu_code:'3', menu_name:'日志管理'},
];

function SysSetting({ dispatch, global }){
    const [subMenu, toggleSubMenu] = useState('1');
    useEffect(()=>{
        return ()=>{
            console.log('ele-monitor unmounted');
        }
    },[])
    return (
        <div className={style['page-container']}>
            <div className={style['card-container'] + ' ' + style['float-menu-container']} style={{ height:'calc( 100% - 28px)', padding:'0' }}>
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
                <RoleManager />
                :
                subMenu === '2' 
                ?
                <UserSetting />
                :
                subMenu === '3' 
                ?
                <LogManager />
                :
                null
            }
        </div>
    )
}

export default connect(({ global, ele_monitor })=>({ global, ele_monitor }))(SysSetting);