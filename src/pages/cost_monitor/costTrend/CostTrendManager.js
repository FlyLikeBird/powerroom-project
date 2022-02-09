import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Tabs, Spin } from 'antd';
import { EyeOutlined, LeftOutlined, ForkOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import CustomTable from '@/pages/components/CustomTable';
import CostTrendChart from './CostTrendChart';
import style from '../../index.less';
const { TabPane } = Tabs;

function MeasureCostManager({ dispatch, baseCost, global }){
    const { fieldList, currentField ,fieldAttrs, currentAttr, treeLoading } = global;
    const { costTrendInfo, selectedKeys, trendLoading } = baseCost;
    
    useEffect(()=>{
        if ( fieldAttrs.length ) {
            let node = fieldAttrs[0];
            let temp = [];
            if ( node.children && node.children.length ) {
                temp.push(node.key);
                node.children.map(i=>temp.push(i.key));
            } else {
                temp.push(node.key);
            }
            dispatch({ type:'baseCost/select', payload:temp });
        }
        dispatch({ type:'baseCost/fetchCostTrend'});
        return ()=>{
            dispatch({ type:'baseCost/cancelAll'});
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
                                    }).then((attrs)=>{
                                        let temp = [];
                                        if ( attrs.length && attrs[0].children ) {
                                            temp.push(attrs[0].key);
                                            attrs[0].children.map(i=>temp.push(i.key));
                                        } else if ( attrs.length ) {
                                            temp.push(attrs[0].key);
                                        }
                                        dispatch({ type:'baseCost/select', payload:temp });
                                        dispatch({ type:'baseCost/fetchCostTrend'});
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
                                                    checkable
                                                    checkStrictly
                                                    className={style['dark-theme-tree']}
                                                    defaultExpandAll={true}
                                                    checkedKeys={selectedKeys}
                                                    onCheck={(checkedKeys, e)=>{
                                                        let { checked, checkedNodes, node }  = e;
                                                        if ( node.children && node.children.length  ){
                                                            if ( checked ){
                                                                node.children.map(i=>{
                                                                    if(!checkedKeys.checked.includes(i.key)) {
                                                                        checkedKeys.checked.push(i.key);
                                                                    }
                                                                });
                                                            } else {
                                                                let childKeys = node.children.map(i=>i.key);
                                                                checkedKeys.checked = checkedKeys.checked.filter(key=>{
                                                                    return !childKeys.includes(key);
                                                                });
                                                            }
                                                        }
                                                        // console.log(node);
                                                        // console.log(checkedKeys);
                                                        dispatch({type:'baseCost/select', payload:checkedKeys.checked });
                                                        dispatch({ type:'baseCost/fetchCostTrend'});
                                                    }}
                                                    treeData={fieldAttrs}
                                                    
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
                <div className={style['card-container-wrapper']} style={{ height:'20%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>
                            <CustomDatePicker onDispatch={()=>{
                                dispatch({ type:'baseCost/fetchCostTrend'});
                            }} />
                        </div>
                        <div className={style['card-content']}>
                            <div className={style['flex-container']}>
                                {
                                    costTrendInfo.infoList && costTrendInfo.infoList.length 
                                    ?
                                    costTrendInfo.infoList.map((item)=>(
                                        <div className={style['flex-item']} style={{ width:'calc(( 100% - 42px)/4)', backgroundColor:'#193e6f', borderRadius:'4px'}}>
                                            <div className={style['flex-item-content']} style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'space-around', textAlign:'center' }}>                                           
                                                <div>
                                                    <div>
                                                        <div className={style['text']}>{ item.value ? `${item.value}${item.unit === '%' ? '%' : ''} `: '-- --' }</div>
                                                        <div className={style['sub-text']}>{ `${item.title}(${item.unit})`}</div>
                                                    </div>
                                                </div>                                            
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
                <div className={style['card-container-wrapper']} style={{ height:'80%'}}>
                    <div className={style['card-container']}>
                        {
                            Object.keys(costTrendInfo).length 
                            ?
                            <CostTrendChart data={costTrendInfo} loading={trendLoading} />
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

export default connect(({ baseCost, global })=>({ baseCost, global }))(MeasureCostManager);