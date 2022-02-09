import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin } from 'antd';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';
import style from '../../index.less';
import { IconFont } from '@/pages/components/IconFont';
import EleLinesContainer from './EleLinesContainer';
const list = ['a','b','c','d','e'];
function LineMonitor({ dispatch, eleMonitor, global }){
    const { eleLoading, eleScenes, currentScene, eleDetail, detailLoading } = eleMonitor;
    useEffect(()=>{
        dispatch({ type:'eleMonitor/fetchEleLines'});
        return ()=>{
            dispatch({ type:'eleMonitor/cancelAll'});
        }
    },[])
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}></div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>进线选择</div>
                        <div className={style['card-content']}>
                            <div className={style['list-container']}>
                                {
                                    eleScenes.length 
                                    ?
                                    eleScenes.map((item,index)=>(
                                        <div className={ item.scene_id === currentScene.scene_id ? style['list-item'] + ' ' + style['selected'] : style['list-item']} key={item.scene_id} onClick={()=>{
                                            dispatch({ type:'eleMonitor/toggleCurrentScene', payload:item });
                                        }}>{ item.scene_name }</div>
                                    ))
                                    :
                                    <Spin className={style['spin']} size='large' />
                                }
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className={style['right']}>
                <div className={style['card-container']}>
                    <div className={style['card-content']} style={{ height:'100%' }}>                             
                        {
                            eleLoading 
                            ?
                            <Spin className={style['spin']} size='large' />
                            :
                            eleScenes.length 
                            ?
                            <EleLinesContainer 
                                currentScene={currentScene}
                                dispatch={dispatch} 
                                isLoading={detailLoading} 
                                eleDetail={eleDetail} 
                                startDate={global.startDate} 
                                timeType={global.timeType} 
                            />
                            :
                            <div className={style['empty-text']}>还没有配置电路图</div>
                        }
                        
                    </div>
                </div>
                
            </div>
            <div>

            </div>
        </div>
    )
}

export default connect(({ eleMonitor, global })=>({ eleMonitor, global }))(LineMonitor);