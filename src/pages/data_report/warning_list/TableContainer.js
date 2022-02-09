import React, { useState } from 'react';
import { Radio, Button, message, Tooltip, Modal } from 'antd';
import { FileExcelOutlined, CheckOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import CustomTable from '@/pages/components/CustomTable';
import style from '../../index.less';
import { loadScript, downloadExcel } from '@/pages/utils/array';
import AlarmForm from './AlarmForm';

const warningStatusMap = {
    '1':'未处理',
    '2':'处理中',
    '3':'已处理',
    '4':'挂起'
};
const warningType = {
    '1':'电气安全',
    '2':'指标越限',
    '3':'通讯异常'
}
function TableContainer({ data, isLoading, currentPage, pagesize, total, timeType, startDate, endDate, dispatch, cateCode, warningStatus }){
    const [current, setCurrent] = useState({});
    let visible = Object.keys(current).length ? true : false;
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * pagesize + index + 1}`;
            }
        },
        {
            title:'属性',
            width:'180px',
            ellipsis:true,
            fixed:'left',
            dataIndex:'attr_name'
        },
        {
            title:'设备名称',
            width:'180px',
            dataIndex:'meter_name',
        },
        {
            title:'告警类型',
            width:'140px',
            dataIndex:'type_name',
            ellipsis:true
        },
        {
            title:'告警时间',
            width:'160px',
            dataIndex:'record_date'
        },
        {
            title:'告警描述',
            render:(row)=>{
                return <span>{`${row.warning_info};${row.warning_value}`}</span>
            }
        },
        {
            title:'告警状态',
            width:'80px',
            render:(row)=>{
                return <span style={{ color:'#03a4fe' }}>{warningStatusMap[row.status]}</span>
            }
        },
        {
            title:'操作',
            width:'100px',
            render:(params)=>{
                return (
                    <div>
                        <Tooltip title='结单'><Button style={{ transform:'scale(0.8)' }} size='small' type="primary" shape="circle" icon={<CheckOutlined />} onClick={()=>{
                            // console.log(params);
                            params.actionType = '3';
                            setCurrent(params);
                        }} /></Tooltip>
                        <Tooltip title='挂起'><Button style={{ transform:'scale(0.8)' }} size='small' type="primary" shape="circle" icon={<CloseOutlined />} /></Tooltip>
                        <Tooltip title='添加进度'><Button style={{ transform:'scale(0.8)' }} size='small' type="primary" shape="circle" icon={<EditOutlined />} /></Tooltip>
                    </div>
                )
            }
        }
    ];
    return (
        <div>
            {/* <Radio.Group className={style['float-radio-group']} style={{ top:'14px', right:'14px' }} value='total' onChange={e=>{
                let value = e.target.value;
                if ( value === 'download'){
                    if ( isLoading ) {
                        message.info('正在加载数据，请稍后');
                        return;
                    } else {
                        if ( !data.length ){
                            message.info('数据源为空');
                            return ;
                        } else {
                            let rows = [];
                            let time = 
                                timeType === '1' 
                                ?
                                startDate.format('YYYY-MM-DD')
                                :
                                timeType === '2' || timeType === '3'
                                ?
                                startDate.format('YYYY-MM-DD') + '至' + endDate.format('YYYY-MM-DD')
                                :
                                '';
                               
                            let fileTitle = `${time}电力报表`;
                            data.forEach(item=>{
                                let obj = {
                                    '属性':item.attr_name
                                };
                               
                                dateColumns.forEach(date=>{
                                    obj[date.title+'-电费'] = item.view[date.title].cost;
                                    obj[date.title+'-电量'] = item.view[date.title].energy;
                                });
                                rows.push(obj);
                            })
                            // console.log(rows);
                            // downloadExcel(rows, fileTitle + '.xlsx' );
                        }
                    }
                }
            }}>
                <Radio.Button value='download'><FileExcelOutlined /></Radio.Button>
            </Radio.Group> */}
            <CustomTable
                columns={columns}
                data={data}
                currentPage={+currentPage}
                pagesize={pagesize}
                isLoading={isLoading}
                total={total}
                hasPagination={true}
                onDispatch={(page)=>{
                    dispatch({ type:'alarm/fetchWarningList', payload:{ page }});
                }}
                emptyText={`暂时没有${warningType[cateCode] || '' }-${warningStatusMap[warningStatus] || ''}告警`}
            />
            <Modal 
                visible={visible} 
                footer={null} 
                width='50%'
                destroyOnClose={true} 
                bodyStyle={{ padding:'40px' }}
                onCancel={()=>setCurrent({})}
            >
                <AlarmForm 
                    data={current} 
                    onClose={()=>setCurrent({})} 
                    onDispatch={(action)=>dispatch(action)}
                />
            </Modal>
        </div>
        
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.isLoading !== nextProps.isLoading  ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(TableContainer,areEqual);