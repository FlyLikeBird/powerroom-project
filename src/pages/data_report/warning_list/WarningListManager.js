import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Tabs, Spin, Radio, Select, message } from 'antd';
import { EyeOutlined, LeftOutlined, FileExcelOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import TableContainer from './TableContainer';
import style from '../../index.less';

const { TabPane } = Tabs;
const { Option } = Select;
function WarningListManager({ dispatch, alarm, global }){
    const { fieldList, currentField ,fieldAttrs, currentAttr, treeLoading, timeType, startDate, endDate, pagesize } = global;
    const { sourceData, currentPage, total, isLoading, cateCode, warningStatus } = alarm;
    useEffect(()=>{
        dispatch({ type:'global/toggleTimeType', payload:'2' });
        dispatch({ type:'alarm/fetchWarningList'});
        return ()=>{
            dispatch({ type:'alarm/cancelAll'});
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
                                        dispatch({ type:'alarm/fetchWarningList'});
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
                                                        dispatch({ type:'alarm/fetchWarningList'});
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
                        
                        <div style={{ display:'flex', alignItems:'center', marginBottom:'14px' }}>
                            <CustomDatePicker includeDay={true} onDispatch={()=>{
                                dispatch({ type:'alarm/fetchWarningList'});
                            }} />
                            <div style={{ display:'inline-flex', alignItems:'center', color:'#fff', margin:'0 20px' }}>
                                <div>告警类型:</div>
                                <Select size='small' className={style['custom-select']} style={{ marginLeft:'6px', width:'140px' }} value={cateCode} onChange={value=>{
                                    dispatch({ type:'alarm/toggleCateCode', payload:value });
                                    dispatch({ type:'alarm/fetchWarningList'});
                                }}>
                                    <Option value='0'>全部</Option>
                                    <Option value='1'>电气安全</Option>
                                    <Option value='2'>指标越限</Option>
                                    <Option value='3'>通讯异常</Option>
                                </Select>
                            </div>
                            <div style={{ display:'inline-flex', alignItems:'center', color:'#fff', margin:'0 20px' }}>
                                <div>告警状态:</div>
                                <Select size='small' className={style['custom-select']}  style={{ marginLeft:'6px', width:'140px' }} value={warningStatus} onChange={value=>{
                                    dispatch({ type:'alarm/toggleWarningStatus', payload:value });
                                    dispatch({ type:'alarm/fetchWarningList'});
                                }}>
                                    <Option value='0'>全部</Option>
                                    <Option value='1'>未处理</Option>
                                    <Option value='2'>处理中</Option>
                                    <Option value='3'>已处理</Option>
                                    <Option value='4'>挂起</Option>
                                </Select>
                            </div>
                        </div>
                           
                       
                        <TableContainer 
                            data={sourceData} 
                            isLoading={isLoading} 
                            total={total}
                            currentPage={currentPage}
                            pagesize={pagesize}
                            timeType={timeType} 
                            startDate={startDate}
                            endDate={endDate}
                            cateCode={cateCode}
                            warningStatus={warningStatus}
                            dispatch={dispatch}
                           
                        />
                           
                        
                    </div>
                </div>
                
            </div>
           
        </div>
    )
}

export default connect(({ alarm, global })=>({ alarm, global }))(WarningListManager);