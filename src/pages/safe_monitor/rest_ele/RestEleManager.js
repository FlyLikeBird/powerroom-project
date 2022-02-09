import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tabs, Spin, Tree } from 'antd';
import style from '../../index.less';
import ChartContainer from './ChartContainer';

const { TabPane } = Tabs;
function RestEleManager({ dispatch, global, safeMonitor }){
    const { fieldList, currentField ,fieldAttrs, currentAttr, treeLoading } = global;
    const { chartInfo, isLoading } = safeMonitor;
    useEffect(()=>{
        dispatch({ type:'safeMonitor/fetchRestEle'});
        return ()=>{
            dispatch({ type:'safeMonitor/cancelAll'});
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
                                        dispatch({ type:'safeMonitor/fetchRestEle'});
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
                                                        dispatch({ type:'safeMonitor/fetchRestEle'});
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
                <div className={style['card-container']} style={{ padding:'0' }}>
                    <ChartContainer dispatch={dispatch} data={chartInfo} isLoading={isLoading} />
                </div>
            </div>

        </div>
    )
}

export default connect(({ global, safeMonitor })=>({ global, safeMonitor }))(RestEleManager);
