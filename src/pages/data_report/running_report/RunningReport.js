import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Tabs, Spin, Radio, message } from 'antd';
import { EyeOutlined, LeftOutlined, FileExcelOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import TableContainer from './TableContainer';
import style from '../../index.less';
import { loadScript, downloadExcel } from '@/pages/utils/array';

const { TabPane } = Tabs;

function RunningReportManager({ dispatch, costReport, global }){
    const { fieldList, currentField ,fieldAttrs, currentAttr, treeLoading, timeType, startDate, endDate } = global;
    const { sourceData, currentPage, isLoading } = costReport;
    useEffect(()=>{
        dispatch({ type:'global/toggleTimeType', payload:'1' });
        dispatch({ type:'costReport/fetchEleReport', payload:{ isRunning:true }});
        loadScript();
        return ()=>{
            dispatch({ type:'costReport/cancelAll'});
        }
    },[])
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
                                        dispatch({ type:'costReport/fetchEleReport', payload:{ isRunning:true }});
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
                                                        dispatch({ type:'costReport/fetchEleReport', payload:{ isRunning:true }});
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
                <div className={style['card-container-wrapper']} style={{ height:'100%', padding:'0' }}>
                    <div className={style['card-container']} style={{ paddingTop:'14px' }}>
                        {
                            sourceData.length 
                            ?
                            <CustomDatePicker includeDay={true} optionStyle={{ marginBottom:'14px' }} onDispatch={()=>{
                                dispatch({ type:'costReport/fetchEleReport', payload:{ isRunning:true }});

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
                                timeType={timeType} 
                                startDate={startDate}
                                endDate={endDate}
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
           
        </div>
    )
}

export default connect(({ costReport, global })=>({ costReport, global }))(RunningReportManager);