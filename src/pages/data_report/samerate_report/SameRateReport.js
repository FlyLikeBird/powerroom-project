import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Tabs, Spin, Radio, Select, message } from 'antd';
import { EyeOutlined, LeftOutlined, FileExcelOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import TableContainer from './TableContainer';
import style from '../../index.less';
import { loadScript, downloadExcel } from '@/pages/utils/array';

const { TabPane } = Tabs;
const { Option } = Select;

function SameRateReport({ dispatch, costReport, global }){
    const { fieldList, currentField ,fieldAttrs, currentAttr, treeLoading, timeType, startDate, endDate, containerWidth, pagesize } = global;
    const { sourceData, currentPage, isLoading } = costReport;
    useEffect(()=>{
        dispatch({ type:'costReport/fetchSameRate'});
        loadScript();
        return ()=>{
            dispatch({ type:'costReport/cancelAll'});
        }
    },[]);
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}></div>
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
                                        dispatch({ type:'costReport/fetchSameRate'});
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
                                                        dispatch({ type:'costReport/fetchSameRate'});
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
                    <div className={style['card-container']} style={{ paddingTop:'14px' }}>
                        {
                            sourceData.length 
                            ?
                            <CustomDatePicker optionStyle={{ marginBottom:'14px' }} includeDay={true} onDispatch={()=>{
                                dispatch({ type:'costReport/fetchSameRate'});
                            }} />
                            :
                            null
                        }
                        {
                            sourceData.length 
                            ?
                            <TableContainer 
                                data={sourceData} 
                                isLoading={isLoading} 
                                currentPage={currentPage}
                                pagesize={pagesize}
                                timeType={timeType} 
                                startDate={startDate}
                                endDate={endDate}
                                containerWidth={containerWidth}
                                onDispatch={(payload)=>{
                                    dispatch({ type:'costReport/setPage', payload });
                                }}
                            />
                            :
                            <Spin className={style['spin']} size='large' />
                        }
                        
                    </div>
                
            </div>
           
        </div>
    )
}

export default connect(({ costReport, global })=>({ costReport, global }))(SameRateReport);