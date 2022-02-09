import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin } from 'antd';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';
import ChartContainer from './ChartContainer';
import style from '../../index.less';
import { IconFont } from '@/pages/components/IconFont';

function Transform({ dispatch, transformer, global }){
    let { userAuthed } = global;
    const { transformerInfo, machList, currentMach, isLoading, chartInfo } = transformer;
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'transformer/cancelAll'});
        }
    },[])
    useEffect(()=>{
        if ( userAuthed ){
            dispatch({ type:'transformer/initTransformer'});
        }
    },[userAuthed])
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}>占位符</div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>变压器选择</div>
                        <div className={style['card-content']}>
                            {
                                machList && machList.length
                                ?
                                <Tree
                                    className={style['dark-theme-tree']}
                                    treeData={machList}
                                    selectedKeys={[currentMach.key]}
                                    defaultExpandAll={true}
                                    showIcon={true}
                                    onSelect={(selectedKeys, {node})=>{
                                        dispatch({ type:'transformer/toggleMach', payload:{ key:node.key, title:node.title }});
                                        dispatch({ type:'transformer/fetchTransformerInfo'});
                                        dispatch({ type:'transformer/fetchMachChartInfo'});
                                        
                                    }}
                                />
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
                        <div className={style['card-title']}>变压器状态</div>
                        <div className={style['card-content']}>                             
                            <div className={style['flex-container']} style={{ position:'relative'}}>
                                {
                                    transformerInfo.infoList && transformerInfo.infoList.length
                                    ?
                                    transformerInfo.infoList.map((item,index)=>(
                                        <div key={item.title} className={style['flex-item']} style={{ width:'calc((100% - 42px)/3)'}}>
                                            <div className={style['flex-item-title']}>
                                                <IconFont style={{ fontSize:'1.2rem', marginRight:'4px' }} type={ item.title === '负荷' ? 'iconfuhe' : item.title === '功率' ? 'icongongshuai' : item.title === '电流/电压' ? 'icondianya' : ''} />{ item.title }
                                            </div>
                                            <div className={style['flex-item-content']}>
                                                {
                                                    item.child && item.child.length 
                                                    ?
                                                    item.child.map((sub)=>(
                                                        <div key={sub.title} style={{ height:'16%', display:'flex', alignItems:'center', }}>
                                                            <div className={style['flex-item-symbol']} style={{ backgroundColor:sub.type === 'A' ? '#eff400' : sub.type === 'B' ? '#00ff00' : sub.type === 'C' ? '#ff0000' : '#01f1e3' }}></div>
                                                            <div>{ sub.title }</div>
                                                            <div style={{ flex:'1', height:'1px', backgroundColor:'#34557e', margin:'0 6px'}}></div>
                                                            <div style={{ fontSize:'1.2rem' }}>{ sub.value ? ( sub.unit === 'cosΦ' ? (+sub.value).toFixed(2) : (+sub.value).toFixed(0))  + ' ' + sub.unit : '-- --' }</div>
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
                            <ChartContainer startDate={global.startDate} data={chartInfo} dispatch={dispatch} isLoading={isLoading} timeType={global.timeType} />
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

export default connect(({ transformer, global })=>({ transformer, global }))(Transform);