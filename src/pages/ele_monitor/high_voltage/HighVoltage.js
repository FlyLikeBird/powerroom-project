import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin } from 'antd';
import { EyeOutlined, LeftOutlined, ForkOutlined  } from '@ant-design/icons';
import ChartContainer from './ChartContainer';
import style from '../../index.less';
import { IconFont } from '@/pages/components/IconFont';

function HighVoltage({ dispatch, incoming, global }){
    const { incomingList, currentIncoming } = global;
    const { incomingInfo, chartInfo, optionType, isLoading } = incoming;
    useEffect(()=>{
        new Promise((resolve, reject)=>{
            dispatch({type:'global/fetchIncoming', payload:{ resolve, reject }})
        })
        .then(()=>{
            dispatch({ type:'incoming/init'});
        })
        return ()=>{
            dispatch({ type:'incoming/cancelAll'});
        }
    },[])
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}>占位符</div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>进线选择</div>
                        <div className={style['card-content']}>
                            {
                                incomingList.length 
                                ?
                                <div className={style['list-container-vertical']}>
                                    {
                                        incomingList.map((item,index)=>(
                                            <div key={index} style={{ textAlign:'center', color: currentIncoming.in_id === item.in_id ? '#03a4fe' : '#a3a3ad'}} onClick={()=>{
                                                if ( item.in_id !== currentIncoming.in_id ){
                                                    dispatch({ type:'global/toggleIncoming', payload:item });
                                                    dispatch({ type:'incoming/init'});
                                                }          
                                            }}>
                                                <div><IconFont style={{ fontSize:'10rem', margin:'10px 0' }} type='iconVector1' /></div>
                                                <div>{ item.name }</div>
                                            </div>
                                        ))
                                    }
                                </div>
                                :
                                <Spin className={style['spin']} size='large' />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={style['right']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>进线状态</div>
                        <div className={style['card-content']}>
                            <div className={style['flex-container']}>
                                {
                                    incomingInfo.infoList && incomingInfo.infoList.length 
                                    ?
                                    incomingInfo.infoList.map((item,index)=>(
                                        <div key={index} className={style['flex-item']} style={{ width:'calc((100% - 56px)/5)'}}>
                                            <div className={style['flex-item-title']}>{ item.title }</div>
                                            <div className={style['flex-item-content']}>
                                                {
                                                    item.child && item.child.length 
                                                    ?
                                                    item.child.map((sub)=>(
                                                        <div style={{ height:'16%', display:'flex', alignItems:'center', }}>
                                                            <div className={style['flex-item-symbol']} style={{ backgroundColor:sub.type === 'A' ? '#eff400' : sub.type === 'B' ? '#00ff00' : sub.type === 'C' ? '#ff0000' : '#01f1e3' }}></div>
                                                            <div>{ sub.title }</div>
                                                            <div style={{ flex:'1', height:'1px', backgroundColor:'#34557e', margin:'0 6px'}}></div>
                                                            <div style={{ fontSize:'1.2rem' }}>{ sub.value ? sub.value + ' ' + sub.unit : '-- --' }</div>
                                                        </div>
                                                    ))
                                                    :
                                                    null
                                                    
                                                
                                                }
                                            </div>
                                        </div>
                                    )) 
                                    :
                                    <Spin className={style['spin']} size='large' />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        {
                            Object.keys(chartInfo).length 
                            ?
                            <ChartContainer data={chartInfo} dispatch={dispatch} startDate={global.startDate} timeType={global.timeType} optionType={optionType} isLoading={isLoading} />
                            :
                            <Spin className={style['spin']} size='large' />
                        }
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default connect(({ incoming, global })=>({ incoming, global }))(HighVoltage);