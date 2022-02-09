import React from 'react';
import { Radio, Button, message } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import CustomTable from '@/pages/components/CustomTable';
import style from '../../index.less';
import { loadScript, downloadExcel } from '@/pages/utils/array';
import XLSX from 'xlsx';
let power = [
    { title:'有功功率(W)', type:'P' },
    { title:'无功功率(var)', type:'Q'},
    { title:'视在功率(VA)', type:'S' }
];
let vol = [
    { title:'UA(V)', type:'U1' },
    { title:'UB(V)', type:'U2'},
    { title:'UC(V)', type:'U3'}
];
let ele = [
    { title:'IA(A)', type:'I1'},
    { title:'IB(A)', type:'I2'},
    { title:'IC(A)', type:'I3'},
];
let pf = [
    { title:'PFA(cosΦ)', type:'PF1' },
    { title:'PFA(cosΦ)', type:'PF2' },
    { title:'PFA(cosΦ)', type:'PF3' },
];
let category = [];
function TableContainer({ data, isLoading, currentPage, pagesize, timeType, containerWidth, eleType, startDate, endDate, onDispatch }){
    let dateColumns = [];
    if ( data && data.length ){
        if ( data[0].view ) {
            Object.keys(data[0].view).forEach(key=>{
                category = 
                    eleType === '1' 
                    ?
                    power.map(item=>{
                        let obj = {};
                        obj.title = item.title;
                        obj.type = item.type;
                        obj.children = [
                            { title:'最大值', dataIndex:['view',key,item.type,'max'], width:'100px', type:'max' },
                            { title:'最小值', dataIndex:['view',key,item.type,'min'], width:'100px', type:'min' },
                            { title:'平均值', dataIndex:['view',key,item.type,'avg'], width:'100px', type:'avg' }
                        ]
                        return obj;
                    })
                    :
                    eleType === '2' 
                    ?
                    vol.map(item=>{
                        let obj = {};
                        obj.title = item.title;
                        obj.type = item.type;
                        obj.children = [
                            { title:'最大值', dataIndex:['view',key,item.type,'max'], width:'100px', type:'max' },
                            { title:'最小值', dataIndex:['view',key,item.type,'min'], width:'100px', type:'min' },
                            { title:'平均值', dataIndex:['view',key,item.type,'avg'], width:'100px', type:'avg' }
                        ]
                        return obj;
                    })
                    :
                    eleType === '3' 
                    ?
                    ele.map(item=>{
                        let obj = {};
                        obj.title = item.title;
                        obj.type = item.type;
                        obj.children = [
                            { title:'最大值', dataIndex:['view',key,item.type,'max'], width:'100px', type:'max' },
                            { title:'最小值', dataIndex:['view',key,item.type,'min'], width:'100px', type:'min' },
                            { title:'平均值', dataIndex:['view',key,item.type,'avg'], width:'100px', type:'avg' }
                        ]
                        return obj;
                    })
                    :
                    eleType === '4' 
                    ?
                    pf.map(item=>{
                        let obj = {};
                        obj.title = item.title;
                        obj.type = item.type;
                        obj.children = [
                            { title:'最大值', dataIndex:['view',key,item.type,'max'], width:'100px', type:'max' },
                            { title:'最小值', dataIndex:['view',key,item.type,'min'], width:'100px', type:'min' },
                            { title:'平均值', dataIndex:['view',key,item.type,'avg'], width:'100px', type:'avg' }
                        ]
                        return obj;
                    })
                    :
                    [];
                dateColumns.push({
                    title:key,
                    index:key,
                    children:category
                        
                    // children: eleType === '1' ?
                    //     [
                    //         { title:'有功功率(W)',  children:[{ title:'最大值', dataIndex:['view', key, 'P', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'P', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'P', 'avg'], width:'100px'} ]},
                    //         { title:'无功功率(var)',  children:[{ title:'最大值', dataIndex:['view', key, 'Q', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'Q', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'Q', 'avg'], width:'100px'} ]},
                    //         { title:'视在功率(VA)',  children:[{ title:'最大值', dataIndex:['view', key, 'S', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'S', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'S', 'avg'], width:'100px'} ]},
                    //     ]
                    //     :
                    //     eleType === '2' ?
                    //     [
                    //         { title:'UA(V)',  children:[{ title:'最大值', dataIndex:['view', key, 'U1', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'U1', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'U1', 'avg'], width:'100px'} ]},
                    //         { title:'UB(V)',  children:[{ title:'最大值', dataIndex:['view', key, 'U2', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'U2', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'U2', 'avg'], width:'100px'} ]},
                    //         { title:'UC(V)',  children:[{ title:'最大值', dataIndex:['view', key, 'U3', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'U3', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'U3', 'avg'], width:'100px'} ]},
                    //     ]
                    //     :
                    //     eleType === '3' ?
                    //     [
                    //         { title:'IA(A)',  children:[{ title:'最大值', dataIndex:['view', key, 'I1', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'I1', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'I1', 'avg'], width:'100px'} ]},
                    //         { title:'IB(A)',  children:[{ title:'最大值', dataIndex:['view', key, 'I2', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'I2', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'I2', 'avg'], width:'100px'} ]},
                    //         { title:'IC(A)',  children:[{ title:'最大值', dataIndex:['view', key, 'I3', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'I3', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'I3', 'avg'], width:'100px'} ]},
                    //     ]
                    //     :
                    //     eleType === '4' ?
                    //     [
                    //         { title:'PFA(cosΦ)',  children:[{ title:'最大值', dataIndex:['view', key, 'PF1', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'PF1', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'PF1', 'avg'], width:'100px'} ]},
                    //         { title:'PFB(cosΦ)',  children:[{ title:'最大值', dataIndex:['view', key, 'PF2', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'PF2', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'PF2', 'avg'], width:'100px'} ]},
                    //         { title:'PFC(cosΦ)',  children:[{ title:'最大值', dataIndex:['view', key, 'PF3', 'max'], width:'100px'}, { title:'最小值', dataIndex:['view', key, 'PF3', 'min'], width:'100px'}, { title:'平均值', dataIndex:['view', key, 'PF3', 'avg'], width:'100px'} ]},
                    //     ]
                    //     :
                    //     []
                })
            });
        }
        // 重新排序
        dateColumns.sort((a,b)=>{
            let timeA = new Date(a.index).getTime();
            let timeB = new Date(b.index).getTime();
            return timeA - timeB;
        });
    }
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
                            let fileTitle = 
                                timeType === '1' 
                                ?
                                `${startDate.format('YYYY-MM-DD')}极值报表`
                                :
                                `${startDate.format('YYYY-MM-DD')}至${endDate.format('YYYY-MM-DD')}极值报表`
                            var aoa = [], thead1 = [], thead2 = [], thead3 = [];
                            // 构建表格的合并表头数据结构
                            columns.forEach((col,index)=>{
                                if ( col.children && col.children.length ){
                                    thead1.push(col.title);
                                    let outIndex = 0;
                                    category.forEach(item=>{
                                        let innerIndex = 0;
                                        thead2.push(item.title);
                                        if ( item.children && item.children.length ){
                                            item.children.forEach((sub)=>{
                                                thead3.push(sub.title);
                                                if ( outIndex !== 0 ) {
                                                    thead1.push(null);
                                                }
                                                if ( innerIndex !== 0 ) {
                                                    thead2.push(null);
                                                }
                                                ++outIndex;
                                                ++innerIndex;
                                            })
                                        }
                                    })
                                } else {
                                    thead1.push(col.title);
                                    thead2.push(null);
                                    thead3.push(null);
                                }
                            });
                           
                            aoa.push(thead1);
                            aoa.push(thead2);
                            aoa.push(thead3);
                            // 构建表格的表体数据结构
                            data.forEach((attr,index)=>{
                                let temp = [];
                                temp.push(index + 1);
                                temp.push(attr.attr_name);
                                Object.keys(attr.view).sort((a,b)=>{
                                    let timeA = new Date(a).getTime();
                                    let timeB = new Date(b).getTime();
                                    return timeA - timeB;
                                }).forEach(key=>{
                                    category.forEach(item=>{
                                        if ( item.children && item.children.length ){
                                            item.children.forEach(sub=>{
                                                temp.push(attr.view[key][item.type][sub.type]);
                                            })
                                        }
                                    })
                                });
                                aoa.push(temp);
                            })
                            var sheet = XLSX.utils.aoa_to_sheet(aoa);
                            // 合并表格表头的格式
                            let merges = [];
                            // 合并第一行表头
                            thead1.forEach((item,index)=>{
                                if ( item && item.includes('-')) {
                                    merges.push({
                                        s:{ r:0, c:index },
                                        e:{ r:0, c:index + 8 }
                                    })
                                }
                            });
                            // 合并第二行表头
                            thead2.forEach((item,index)=>{
                                if ( item ) {
                                    merges.push({
                                        s:{ r:1, c:index },
                                        e:{ r:1, c:index + 2 }
                                    })
                                }
                            });
                            // 合并第一二列
                            merges.push({
                                s:{ r:0, c:0 },
                                e:{ r:2, c:0 }
                            });
                            merges.push({
                                s:{ r:0, c:1 },
                                e:{ r:2, c:1 }
                            });
                            sheet['!cols'] = thead3.map(i=>({ wch:16 }));
                            sheet['!merges'] = merges;
                            downloadExcel(sheet, fileTitle + '.xlsx');
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
                isLoading={isLoading}
                total={data.length}
                onDispatch={onDispatch}
            />
        </div>
        
    )
}

function areEqual(prevProps, nextProps){
    if (prevProps.data !== nextProps.data || prevProps.isLoading !== nextProps.isLoading || prevProps.currentPage !== nextProps.currentPage || prevProps.pagesize !== nextProps.pagesize ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(TableContainer, areEqual);