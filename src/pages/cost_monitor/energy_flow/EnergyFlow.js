import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tabs, Spin, Tree } from 'antd';
import FlowChart from './FlowChart';
import style from '../../index.less';
import Loading from '@/pages/components/Loading';
const { TabPane } = Tabs;
function EnergyFlow({ dispatch, global, baseCost }){
    const { fieldList, currentField ,fieldAttrs, currentAttr, treeLoading } = global;
    const { flowChartInfo, chartLoading } = baseCost;
    useEffect(()=>{
        if ( fieldAttrs.length ) {
            dispatch({ type:'global/toggleAttr', payload:fieldAttrs[0] });
        }
        dispatch({ type:'baseCost/fetchEnergyFlow'});
        return ()=>{
            dispatch({ type:'baseCost/cancelAll'});
        }
    },[]);
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
                                        dispatch({ type:'baseCost/toggleChartLoading'});
                                        dispatch({ type:'baseCost/fetchEnergyFlow'});
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
                                                    selectedKeys={[currentAttr.key]}
                                                    treeData={fieldAttrs}
                                                    onSelect={(selectedKeys, {node})=>{                                                   
                                                        dispatch({type:'global/toggleAttr', payload:{ key:node.key, title:node.title } });
                                                        dispatch({ type:'baseCost/toggleChartLoading'});
                                                        dispatch({ type:'baseCost/fetchEnergyFlow'});
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
                <div className={style['card-container']}>
                    {
                        chartLoading 
                        ?
                        <Loading />
                        :
                        null
                    }
                    {
                        !flowChartInfo.empty 
                        ?
                        <FlowChart data={flowChartInfo} dispatch={dispatch} />
                        :
                        <div className={style['text']} style={{ color:'#fff', fontSize:'1.2rem', position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}>能流图数据源为空</div>
                    }
                </div>
            </div>

        </div>
    )
}

export default connect(({ global, baseCost })=>({ global, baseCost }))(EnergyFlow);
