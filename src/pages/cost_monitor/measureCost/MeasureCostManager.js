import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Tabs, Spin } from 'antd';
import { EyeOutlined, LeftOutlined, ForkOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import CustomTable from '@/pages/components/CustomTable';
import MeasureBarChart from './MeasureBarChart';
import style from '../../index.less';
const { TabPane } = Tabs;

function MeasureCostManager({ dispatch, baseCost, global }){
    const { fieldList, currentField ,fieldAttrs, currentAttr, treeLoading } = global;
    const { measureCostInfo } = baseCost;
    let columns = [
        {
            title:'时间',
            dataIndex:'date'
        },
        {
            title:'总有功电量',
            dataIndex:'useEnergy'
        },
        {
            title:'总无功电量',
            dataIndex:'uselessEnergy'
        },
        {
            title:'实际功率因素',
            dataIndex:'factor'
        },
        {
            title:'功率因素考核值',
            dataIndex:'factorRef'
        },
        {
            title:'基本电费',
            dataIndex:'baseCost'
        },
        {
            title:'电度电费',
            dataIndex:'eleCost'
        },
        {
            title:'力调系数',
            dataIndex:'ratio'
        },
        {
            title:'力调电费',
            dataIndex:'adjustcost'
        }
    ];
    useEffect(()=>{
        dispatch({ type:'global/toggleTimeType', payload:'2'});
        dispatch({ type:'baseCost/fetchMeasureCost'});
        return ()=>{
            dispatch({ type:'baseCost/cancelAll'});
            dispatch({ type:'global/toggleTimeType', payload:'1'});
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
                                        dispatch({ type:'baseCost/fetchMeasureCost'});
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
                                                        dispatch({ type:'baseCost/fetchMeasureCost'});
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
                <div className={style['card-container-wrapper']} style={{ height:'20%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>
                            <CustomDatePicker noDay={true} onDispatch={()=>{
                                dispatch({ type:'baseCost/fetchMeasureCost'});
                            }} />
                        </div>
                        <div className={style['card-content']}>
                            <div className={style['flex-container']}>
                                {
                                    measureCostInfo.measureInfoList && measureCostInfo.measureInfoList.length 
                                    ?
                                    measureCostInfo.measureInfoList.map((item,index)=>(
                                        <div key={index} className={style['flex-item']} style={{ width:'calc(( 100% - 42px)/4)', backgroundColor:'#193e6f', borderRadius:'4px'}}>
                                            <div className={style['flex-item-title']} style={{ backgroundImage:'none'}}>{ item.title }</div>
                                            <div className={style['flex-item-content']} style={{ display:'flex', alignItems:'center', justifyContent:'space-around', textAlign:'center' }}>
                                                {
                                                    item.child.map((sub,index)=>(
                                                        <div key={sub.title}>
                                                            <div>
                                                                <div className={style['text']}>{ sub.value ? `${sub.value}${sub.unit === '%' ? '%' : ''} `: '-- --' }</div>
                                                                <div className={style['sub-text']}>{ `${sub.title}(${sub.unit})`}</div>
                                                            </div>
                                                        </div>
                                                    ))
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
                <div className={style['card-container-wrapper']} style={{ height:'80%'}}>
                    <div className={style['card-container']}>
                        {
                            measureCostInfo.view
                            ?
                            <MeasureBarChart data={measureCostInfo.view} />
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