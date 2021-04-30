import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import style from './monitorIndex.css';
import IndexStyle from '../index.less';
import PieChart from './components/PieChart';
import WarningBarChart from './components/WarningBarChart.js';
import WarningTrendChart from './components/WarningTrendChart.js';

import MonitorTable from './components/MonitorTable';
import bg from '../../../public/monitor_bg.jpg';
import platformIcons from '../../../public/icons/platform.png';

const IconFont = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_2517897_hi5dt2qokmi.js'
});
function MonitorIndex({ dispatch, global, monitorIndex, children }){
    const { monitorInfo } = monitorIndex;
    let isLoading = Object.keys(monitorInfo).length ? false : true;
    useEffect(()=>{
        dispatch({ type:'monitorIndex/init'});
        return ()=>{
            // dispatch({ type:''})
        }
    },[])
    return (
        <div className={style['container']} style={{ backgroundImage:`url(${bg})`}}>
            <div style={{ height:'100%', position:'relative' }}>
                {/* 左侧悬浮窗 */}
                <div className={style['left']}>
                    <div className={style['card-container']} style={{ height:'25%' }}>
                        <div className={style['card-title']}>
                            <div className={style['card-title-content']}>
                                <span className={style['symbol']}></span>
                                <span style={{ margin:'0 6px'}}>规模概要</span>
                                <span className={style['symbol']}></span>
                            </div>
                            <div className={style['symbol2']}></div>
                        </div>
                        <div className={style['card-content']}>
                            {
                                isLoading 
                                ?
                                <Spin className={style['spin']} />
                                :
                                <div className={style['flex-container']}>
                                    {
                                        monitorInfo.totalInfo.map((item,index)=>(
                                            <div className={style['flex-item']}>
                                                <div className={style['flex-icon']} style={{ backgroundImage:`url(${platformIcons})`, backgroundPosition:`-${index*38}px 0`}}></div>
                                                <div className={style['flex-content']}>
                                                    <div className={style['flex-text']}>{ item.title }</div>
                                                    <div>
                                                        <span className={style['flex-data']}>{ item.value }</span>
                                                        <span className={style['flex-unit']}>{ item.unit }</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    <div className={style['card-container']} style={{ height:'25%' }}>
                        <div className={style['card-title']}>
                            <div className={style['card-title-content']}>
                                <span className={style['symbol']}></span>
                                <span style={{ margin:'0 6px'}}>近7日告警趋势</span>
                                <span className={style['symbol']}></span>
                            </div>
                            <div className={style['symbol2']}></div>
                        </div>
                        <div className={style['card-content']}>
                            {
                                isLoading 
                                ?
                                <Spin className={style['spin']} />
                                :
                                <WarningBarChart data={monitorInfo.warningSeven} />                            
                            }
                        </div>
                    </div>
                    <div className={style['card-container']} style={{ height:'25%' }}>
                        <div className={style['card-title']}>
                            <div className={style['card-title-content']}>
                                <span className={style['symbol']}></span>
                                <span style={{ margin:'0 6px'}}>告警监控</span>
                                <span className={style['symbol']}></span>
                            </div>
                            <div className={style['symbol2']}></div>
                        </div>
                        <div className={style['card-content']}>
                            {
                                isLoading 
                                ?
                                <Spin className={style['spin']} />
                                :
                                <PieChart data={monitorInfo.orderInfo} />                            
                            }
                        </div>
                    </div>
                    <div className={style['card-container']} style={{ height:'25%' }}>
                        <div className={style['card-title']}>
                            <div className={style['card-title-content']}>
                                <span className={style['symbol']}></span>
                                <span style={{ margin:'0 6px'}}>本月未处理告警</span>
                                <span className={style['symbol']}></span>
                            </div>
                            <div className={style['symbol2']}></div>
                        </div>
                        <div className={style['card-content']}>
                            {
                                isLoading
                                ?
                                <Spin className={style['spin']} />
                                :
                                <MonitorTable data={monitorInfo.warningDetail} />                              
                            }
                        </div>
                    </div>
                </div>
                {/* 左侧悬浮窗-----结束 */}
                {/* 右侧悬浮窗 */}
                <div className={style['right']}>、
                    {/* 能耗信息 */}
                    <div className={style['card-container']} style={{ height:'25%' }}>
                        <div className={style['card-title']}>
                            <div className={style['card-title-content']}>
                                <span className={style['symbol']}></span>
                                <span style={{ margin:'0 6px'}}>能耗信息</span>
                                <span className={style['symbol']}></span>
                            </div>
                            <div className={style['symbol2']}></div>
                        </div>
                        <div className={style['card-content']}>
                            {
                                isLoading 
                                ?
                                <Spin className={style['spin']} />
                                :
                                <div className={style['flex-container']}>
                                    {
                                        monitorInfo.totalInfo.map((item,index)=>(
                                            <div className={style['flex-item']}>
                                                <div className={style['flex-icon']} style={{ backgroundImage:`url(${platformIcons})`, backgroundPosition:`-${index*38}px 0`}}></div>
                                                <div className={style['flex-content']}>
                                                    <div className={style['flex-text']}>{ item.title }</div>
                                                    <div>
                                                        <span className={style['flex-data']}>{ item.value }</span>
                                                        <span className={style['flex-unit']}>{ item.unit }</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    {/* 环境监测 */}
                    <div className={style['card-container']} style={{ height:'37%' }}>
                        <div className={style['card-title']}>
                            <div className={style['card-title-content']}>
                                <span className={style['symbol']}></span>
                                <span style={{ margin:'0 6px'}}>环境监测</span>
                                <span className={style['symbol']}></span>
                            </div>
                            <div className={style['symbol2']}></div>
                        </div>
                        <div className={style['card-content']}>
                            {
                                isLoading 
                                ?
                                <Spin className={style['spin']} />
                                :
                                <div className={style['flex-container']}>
                                    {
                                        monitorInfo.totalInfo.map((item,index)=>(
                                            <div className={style['flex-item']}>
                                                <div className={style['flex-icon']} style={{ backgroundImage:`url(${platformIcons})`, backgroundPosition:`-${index*38}px 0`}}></div>
                                                <div className={style['flex-content']}>
                                                    <div className={style['flex-text']}>{ item.title }</div>
                                                    <div>
                                                        <span className={style['flex-data']}>{ item.value }</span>
                                                        <span className={style['flex-unit']}>{ item.unit }</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {/* 右侧悬浮窗结束 ----- */}
                {/* 底部悬浮窗 */}
                <div className={style['bottom']}>
                    <div className={style['card-container']} style={{ height:'100%' }}>
                        <div className={style['card-title']} style={{ width:'30%' }}>
                            <div className={style['card-title-content']}>
                                <span className={style['symbol']}></span>
                                <span style={{ margin:'0 6px'}}>能耗趋势</span>
                                <span className={style['symbol']}></span>
                            </div>
                            <div className={style['symbol2']}></div>
                        </div>
                        <div className={style['card-content']}>
                            {
                                isLoading 
                                ?
                                <Spin className={style['spin']} />
                                :
                                <WarningTrendChart data={monitorInfo.view} />                            
                            }
                        </div>
                    </div>
                </div>
                {/* 底部悬浮窗结束----- */}
            </div>
            
        </div>
    )
}

export default connect(({ global, monitorIndex })=>({ global, monitorIndex }))(MonitorIndex);