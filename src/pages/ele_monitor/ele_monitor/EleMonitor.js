import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Tabs, Spin } from 'antd';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';
import ChartContainer from './ChartContainer';
import style from '../../index.less';
const { TabPane } = Tabs;

function EleMonitor({ dispatch, eleMonitor, global }){
    const { fieldList, currentField, fieldAttrs, currentAttr, treeLoading } = global;
    const { chartInfo, optionType, isLoading } = eleMonitor;
    useEffect(()=>{
        dispatch({ type:'eleMonitor/fetchChartInfo'});
        return ()=>{
            dispatch({ type:'eleMonitor/cancelAll'});
        }
    },[])
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}>占位符</div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>维度选择</div>
                        <div className={style['card-content']}>
                            <Tabs  
                                className={style['dark-theme-tabs']}
                                activeKey={currentField.field_id + ''}                        
                                onChange={fieldKey=>{
                                    let field = fieldList.filter(i=>i.field_id == fieldKey )[0];
                                    dispatch({type:'global/toggleField', payload:field } );
                                    new Promise((resolve, reject)=>{
                                        dispatch({type:'global/fetchFieldAttrs', payload:{ resolve, reject } })
                                    }).then(()=>{
                                        dispatch({type:'eleMonitor/fetchChartInfo' });
                                    })
                            }}>
                                {                       
                                    fieldList.map(field=>(
                                        <TabPane 
                                            key={field.field_id} 
                                            tab={field.field_name}
                                        >
                                            {
                                                treeLoading
                                                ?
                                                <Spin className={style['spin']} size='large' />
                                                :
                                                <Tree
                                                    className={style['dark-theme-tree']}
                                                    defaultExpandAll={true}
                                                    defaultSelectedKeys={[currentAttr.key]}
                                                    treeData={fieldAttrs}
                                                    onSelect={(selectedKeys, {node})=>{
                                                        
                                                        dispatch({type:'global/toggleAttr', payload:{ key:node.key, title:node.title } });
                                                        dispatch({type:'eleMonitor/fetchChartInfo' });
                                                    }}
                                                />
                                            }
                                        </TabPane>
                                    ))
                                }
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style['right']}>
                <div className={style['card-container-wrapper']} style={{ height:'100%'}}>
                    <div className={style['card-container']}>
                        {
                            Object.keys(chartInfo).length 
                            ?
                            <ChartContainer data={chartInfo} isLoading={isLoading} startDate={global.startDate} timeType={global.timeType} optionType={optionType} dispatch={dispatch} />
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

export default connect(({ eleMonitor, global })=>({ eleMonitor, global }))(EleMonitor);