import React,{ useEffect, useRef } from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import style from './header.css';
import { Menu, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
// import logo from '../../../../public/logo-blue.png';
import avatarBg from '../../../../public/avatar-bg.png';
import AlarmCom from './AlarmCom';
import WeatherCom from './WeatherCom';
const menu = [
    { menu_code:'/', menu_name:'监控主页'},
    { menu_code:'ele_monitor', menu_name:'电气监控'},
    // { menu_code:'safe_monitor', menu_name:'安全监控'},
    { menu_code:'cost_monitor', menu_name:'成本监控'},
    // { menu_code:'env_monitor', menu_name:'环境监控'},
    { menu_code:'data_report', menu_name:'数据报表'},
    { menu_code:'sys_setting', menu_name:'系统设置'},
    // { menu_code:'model', menu_name:'测试模型库' }
    // { menu_code:'ceshi', menu_name:'测试' }
];

function Header({ dispatch, global }){
    const containerRef = useRef();
    const { currentMenu, msg, userInfo, currentCompany, thirdAgent } = global;
    // console.log(currentMenu);
    useEffect(()=>{
        handleResize();
        window.addEventListener('resize',handleResize);
        function handleResize(){
            if ( containerRef.current && containerRef.current.offsetWidth ){
                dispatch({ type:'global/setContainerWidth', payload: { containerWidth:containerRef.current.offsetWidth }});
            }
        }
    },[])
    
    return (
        <div ref={containerRef} className={style['container']}>
            <div style={{ display:'inline-flex', alignItems:'center' }}>
                <img src={Object.keys(thirdAgent).length ? thirdAgent.logo_path : ''} style={{ height:'50%' }} />
                <span className={style['title']}>
                {/* 智慧配电房监控系统 */}
                    智慧配电站
                </span>
            </div>
            <Menu className={style['header-menu-container']} mode='horizontal' selectedKeys={[currentMenu]} onClick={e=>{
                dispatch({ type:'global/toggleCurrentMenu', payload:e.key });
                let targetURL = e.key === '/' ? '' : e.key;
                history.push('/' + targetURL );
            }}>
                {
                    menu.map((item,index)=>(
                        <Menu.Item key={item.menu_code}>{ item.menu_name }</Menu.Item>
                    ))
                }
            </Menu>
            <div className={style['weather-container']}>
                <AlarmCom msg={msg} />
                <WeatherCom />
                <div style={{ display:'flex', alignItems:'center'}}>
                    <div style={{ width:'24px', height:'24px', borderRadius:'50%', backgroundColor:'#8888ac', backgroundRepeat:'no-repeat', backgroundSize:'cover', backgroundImage:`url(${avatarBg})`}}></div>
                    <div>{userInfo.user_name}</div>
                    <Tag color="blue">{ userInfo.role_name }</Tag>
                </div>
                <div style={{ cursor:'pointer', zIndex:'2' }} onClick={()=>{
                    dispatch({ type:'global/loginOut'});
                }}>
                    <Tag color='#2db7f5'>退出</Tag>
                </div>
            </div>
        </div>
    )
}

export default connect(({ global })=>({ global }))(Header);