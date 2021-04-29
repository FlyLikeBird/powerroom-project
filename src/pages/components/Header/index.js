import React from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import style from './header.css';
import { Menu, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import logo from '../../../../public/logo.png';
import AlarmCom from './AlarmCom';
import WeatherCom from './WeatherCom';
const menu = [
    { menu_code:'/', menu_name:'监控主页'},
    { menu_code:'ele_monitor', menu_name:'电气监控'},
    { menu_code:'safe_monitor', menu_name:'安全监控'},
    { menu_code:'cost_monitor', menu_name:'成本监控'},
    { menu_code:'env_monitor', menu_name:'环境监控'},
    { menu_code:'data_report', menu_name:'数据报表'},
    { menu_code:'sys_setting', menu_name:'系统设置'},
];

function Header({ dispatch, global }){
    const { currentMenu, msg, userInfo } = global;
    return (
        <div className={style['container']}>
            <div>
                <img src={logo} style={{ height:'80%' }} />
                <span>智慧配电房监控系统</span>
            </div>
            <Menu className={style['header-menu-container']} mode='horizontal' selectedKeys={[currentMenu]} onClick={e=>{
                dispatch({ type:'global/toggleCurrentMenu', payload:e.key });
                let targetURL = e.key === '/' ? '' : e.key;
                history.push('/' + targetURL );
            }}>
                {
                    menu.map((item,index)=>(
                        <Menu.Item key={item.menu_code} icon={<EyeOutlined />}>{ item.menu_name }</Menu.Item>
                    ))
                }
            </Menu>
            <div className={style['weather-container']}>
                <AlarmCom msg={msg} />
                <WeatherCom />
                <div>
                    {userInfo.user_name}
                    <Tag color="blue">{ userInfo.role_name }</Tag>
                </div>
                <div style={{ cursor:'pointer' }}>
                    <Tag color='#2db7f5' onClick={()=>{
                        onDispatch({ type:'user/loginOut'});
                    }}>退出</Tag>
                </div>
            </div>
        </div>
    )
}

export default connect(({ global })=>({ global }))(Header);