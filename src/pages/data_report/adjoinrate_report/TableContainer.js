import React from 'react';
import { Radio, Button, message } from 'antd';
import { FileExcelOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import CustomTable from '@/pages/components/CustomTable';
import style from '../../index.less';
import { loadScript, downloadExcel } from '@/pages/utils/array';
import XLSX from 'xlsx';

function TableContainer({ data, isLoading, currentPage, pagesize, timeType, containerWidth, eleType, startDate, endDate, onDispatch }){
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
            dataIndex:'attr_name',
            fixed:'left'
        },
        {
            title:'本期用电量(kwh)',
            dataIndex:'energy'
        },
        {
            title:'上期用电量(kwh)',
            dataIndex:'sameEnergy'
        },
        {
            title:'增加量(kwh)',
            dataIndex:'differ',
            render:(value)=>{
                return (<span >{ value < 0 ? <CaretDownOutlined style={{ color:'#46ec52', marginRight:'4px' }} /> : <CaretUpOutlined style={{ color:'#f5222d', marginRight:'4px' }} /> }{ Math.abs(value) }</span>)
            }
        },
        {
            title:'环比(%)',
            dataIndex:'rate',
            render:(value)=>{
                return (<span >{ value < 0 ? <CaretDownOutlined style={{ color:'#46ec52', marginRight:'4px' }}/> : <CaretUpOutlined style={{ color:'#f5222d', marginRight:'4px' }}/> }{ Math.abs(value) }</span>)
            }
        }
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
                            let fileTitle = 
                                timeType === '1' 
                                ?
                                `${startDate.format('YYYY-MM-DD')}环比报表`
                                :
                                `${startDate.format('YYYY-MM-DD')}至${endDate.format('YYYY-MM-DD')}环比报表`
                            var aoa = [];
                            aoa.push(columns.map(i=>i.title));
                            data.forEach((item,index)=>{
                                aoa.push([`${index+1}`,item.attr_name, item.energy, item.sameEnergy, item.differ, item.rate]);
                            })                            
                            var sheet = XLSX.utils.aoa_to_sheet(aoa);
                            sheet['!cols'] = columns.map(i=>({ wch:16 }));
                            downloadExcel(sheet, fileTitle + '.xlsx' );
                            
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
                pagesize={pagesize}
                containerWidth={containerWidth}
                isLoading={isLoading}
                total={data.length}
                onDispatch={onDispatch}
            />
        </div>
        
    )
}

function areEqual(prevProps, nextProps){
    if (prevProps.data !== nextProps.data || prevProps.isLoading !== nextProps.isLoading || prevProps.currentPage !== nextProps.currentPage ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(TableContainer, areEqual);