import React from 'react';
import { Radio, Button, message } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import CustomTable from '@/pages/components/CustomTable';
import style from '../../index.less';
import { loadScript, downloadExcel } from '@/pages/utils/array';

function TableContainer({ data, isLoading, currentPage, timeType, startDate, endDate, onDispatch }){
    let dateColumns = [];
    let isDay = timeType === '1' ? true : false;
    if ( data && data.length ){
        if ( data[0].view ) {
            Object.keys(data[0].view).forEach(key=>{
                dateColumns.push({
                    title:key,
                    index:isDay ? key.split(':')[0] : key,
                    children:[
                        { title:'A相电压(v)', dataIndex:['view',key,'U1'], width:'110px' },
                        { title:'B相电压(v)', dataIndex:['view',key,'U2'], width:'110px' },
                        { title:'C相电压(v)', dataIndex:['view',key,'U3'], width:'110px' },
                        { title:'平均相电压(v)', dataIndex:['view',key,'Uavg'], width:'110px' },
                        { title:'AB线电压(v)', dataIndex:['view',key,'U12'], width:'110px' },
                        { title:'BC线电压(v)', dataIndex:['view',key,'U23'], width:'110px' },
                        { title:'CA线电压(v)', dataIndex:['view',key,'U31'], width:'110px' },
                        { title:'平均线电压', dataIndex:['view',key,'Ullavg'], width:'110px' },
                    
                    
                    ]
                })
            });
        }
        // 重新排序
        dateColumns.sort((a,b)=>{
            return a.index - b.index;
        })
    }
    let columns = [
        {
            title:'属性',
            width:'180px',
            ellipsis:true,
            fixed:'left',
            dataIndex:'attr_name'
        },
        ...dateColumns
    ];
    return (
        <div>
            <Radio.Group className={style['float-radio-group']} style={{ top:'14px', right:'14px' }} value='total' onChange={e=>{
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
            </Radio.Group>
            <CustomTable
                columns={columns}
                data={data}
                currentPage={currentPage}
                isLoading={isLoading}
                total={data.length}
                onDispatch={onDispatch}
            />
        </div>
        
    )
}

export default TableContainer;