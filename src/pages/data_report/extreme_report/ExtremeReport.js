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

function ExtremeReport({ dispatch, costReport, global }){
    const { fieldList, currentField ,fieldAttrs, currentAttr, treeLoading, timeType, startDate, endDate, containerWidth, userAuthed, pagesize } = global;
    const { sourceData, currentPage, eleType, isLoading } = costReport;
    useEffect(()=>{
        
        return ()=>{
            dispatch({ type:'costReport/cancelAll'});
        }
    },[]);
    useEffect(()=>{
        if ( userAuthed ){
            dispatch({ type:'costReport/fetchExtremeReport'});
            loadScript();
        }
    },[userAuthed])
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
                                        dispatch({ type:'costReport/fetchExtremeReport'});
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
                                                        dispatch({ type:'costReport/fetchExtremeReport'});
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
                            <div style={{ display:'flex', alignItems:'center', marginBottom:'14px' }}>
                                <CustomDatePicker style={{ marginRight:'14px' }} includeDay={true} onDispatch={()=>{
                                    dispatch({ type:'costReport/fetchExtremeReport'});

                                }} />
                                <div style={{ display:'inline-flex', alignItems:'center', color:'#fff', margin:'0 20px' }}>
                                    <div>电力类别:</div>
                                    <Select size='small' className={style['custom-select']} style={{ marginLeft:'6px', width:'140px' }} value={eleType} onChange={value=>{
                                        dispatch({ type:'costReport/toggleEleType', payload:value });
                                        dispatch({ type:'costReport/fetchExtremeReport'});
                                    }}>
                                        <Option value='1'>功率</Option>
                                        <Option value='2'>电压</Option>
                                        <Option value='3'>电流</Option>
                                        <Option value='4'>功率因素</Option>
                                    </Select>
                                </div>
                            </div>
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
                                eleType={eleType}
                                pagesize={pagesize}
                                startDate={startDate}
                                endDate={endDate}
                                containerWidth={containerWidth}
                                onDispatch={(payload)=>{
                                    console.log(payload);
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

export default connect(({ costReport, global })=>({ costReport, global }))(ExtremeReport);