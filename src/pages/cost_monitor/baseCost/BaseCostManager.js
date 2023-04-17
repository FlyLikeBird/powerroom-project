import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Tabs, Spin, Radio, message } from 'antd';
import { EyeOutlined, LeftOutlined, ForkOutlined, FileExcelOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import CustomTable from '@/pages/components/CustomTable';
import BarChart from './BarChart';
import style from '../../index.less';
import { IconFont } from '@/pages/components/IconFont';
import { loadScript, downloadExcel } from '@/pages/utils/array';

import XLSX from 'xlsx';
const { TabPane } = Tabs;

function BaseCostManager({ dispatch, baseCost, global }){
    const { incomingList, currentIncoming, startDate, userAuthed } = global;
    const { baseCostInfo } = baseCost;
    let columns = [
        {
            title:'时间',
            dataIndex:'date'
        },
        {
            title:'监控点',
            dataIndex:'mach_name'
        },
        {
            title:'按容量计算',
            children:[
                {
                    title:'容量(kva)',
                    dataIndex:'total_kva'
                },
                {
                    title:'单价(元/kva·月)',
                    dataIndex:'kva_price'
                },
                {
                    title:'电费(元)',
                    dataIndex:'kva_amount'
                }
            ]
        },
        {
            title:'按需量计算',
            children:[
                {
                    title:'本月最大需量(kva)',
                    dataIndex:'maxDemand'
                },
                {
                    title:'单价(元/kva·月)',
                    dataIndex:'demand_price'
                },
                {
                    title:'电费(元)',
                    dataIndex:'demand_amount'
                }
            ]
        },
        {
            title:'差价(元)',
            dataIndex:'d_value',
            render:(value)=>(<a>{(+value).toFixed(2)}</a>)
        }
    ];
    useEffect(()=>{
        
        return ()=>{
            dispatch({ type:'baseCost/cancelAll'});
            dispatch({ type:'global/toggleTimeType', payload:'1'});
        }
    },[]);
    useEffect(()=>{
        if ( userAuthed ){
            dispatch({ type:'global/toggleTimeType', payload:'3'});
            dispatch({ type:'baseCost/init'});
        }
    },[userAuthed])
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}>占位符</div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>进线选择</div>
                        <div className={style['card-content']}>
                            {
                                incomingList.length 
                                ?
                                <div className={style['list-container-vertical']}>
                                    {
                                        incomingList.map((item, index)=>(
                                            <div key={index} style={{ textAlign:'center', color: currentIncoming.in_id === item.in_id ? '#03a4fe' : '#a3a3ad'}} onClick={()=>{
                                                let temp = incomingList.filter(i=>i.in_id === currentIncoming.in_id )[0];
                                                dispatch({ type:'global/toggleIncoming', payload:temp });
                                                dispatch({ type:'baseCost/fetchBaseCost'});
                                            }}>
                                                <div><IconFont style={{ fontSize:'10rem', margin:'10px 0' }} type='iconVector1' /></div>
                                                <div>{ item.name }</div>
                                            </div>
                                        ))
                                    }
                                </div>
                                :
                                <Spin className={style['spin']} size='large' />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={style['right']}>
                <div className={style['card-container-wrapper']} style={{ height:'20%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>
                            <CustomDatePicker noToggle={true} onDispatch={()=>{
                                dispatch({ type:'baseCost/fetchBaseCost'});
                            }} />
                        </div>
                        <div className={style['card-content']}>
                            <div className={style['flex-container']}>
                                {/* 按容量计算 */}
                                <div className={style['flex-item']} style={{ width:'calc((100% - 28px)/3)', backgroundColor:'#193e6f', borderRadius:'4px'}}>
                                    <div className={style['flex-item-title']} style={{ backgroundImage:'none' }}>
                                        按容量计算
                                        {
                                            baseCostInfo.calc_type === 2 
                                            ?
                                            <span className={style['tag']} style={{ backgroundColor:'#4ca2fe'}}>现在</span>
                                            :
                                            null
                                        }
                                        {
                                            baseCostInfo.kva_amount <= baseCostInfo.demand_amount 
                                            ?
                                            <span className={style['tag']} style={{ backgroundColor:'#7917f8'}}>建议</span>
                                            :
                                            null
                                        }
                                    </div>
                                    <div className={style['flex-item-content']} style={{ display:'flex', alignItems:'center', justifyContent:'space-around', textAlign:'center' }}>
                                        <div>
                                            <div className={style['text']}>{ baseCostInfo.total_kva ? Math.round(baseCostInfo.total_kva) : '-- --' }</div>
                                            <div className={style['sub-text']}>变压器容量(kva)</div>
                                        </div>
                                        <div>
                                            <div className={style['text']}>{ baseCostInfo.kva_price || '-- --' }</div>
                                            <div className={style['sub-text']}>单价(元/kw)</div>
                                        </div>
                                        <div>
                                            <div className={style['text']}>{ baseCostInfo.kva_amount ? Math.round(baseCostInfo.kva_amount) :  '-- --' }</div>
                                            <div className={style['sub-text']}>基本电费(元)</div>
                                        </div>
                                    </div>
                                </div>
                                {/* 按需量计算 */}
                                <div className={style['flex-item']} style={{ width:'calc((100% - 28px)/3)', backgroundColor:'#193e6f', borderRadius:'4px' }}>
                                    <div className={style['flex-item-title']} style={{ backgroundImage:'none' }}>
                                        按需量计算
                                        {
                                            baseCostInfo.calc_type === 1 
                                            ?
                                            <span className={style['tag']} style={{ backgroundColor:'#4ca2fe'}}>现在</span>
                                            :
                                            null
                                        }
                                        {
                                            baseCostInfo.kva_amount > baseCostInfo.demand_amount 
                                            ?
                                            <span className={style['tag']} style={{ backgroundColor:'#7917f8'}}>建议</span>
                                            :
                                            null
                                        }
                                    </div>
                                    <div className={style['flex-item-content']} style={{ display:'flex', alignItems:'center', justifyContent:'space-around', textAlign:'center' }}>
                                        <div>
                                            <div className={style['text']}>{ baseCostInfo.maxDemand ? Math.round(baseCostInfo.maxDemand) : '-- --' }</div>
                                            <div className={style['sub-text']}>本月最大需量(kw)</div>
                                        </div>
                                        <div>
                                            <div className={style['text']}>{ baseCostInfo.demand_price || '-- --' }</div>
                                            <div className={style['sub-text']}>单价(元/kw)</div>
                                        </div>
                                        <div>
                                            <div className={style['text']}>{ baseCostInfo.demand_amount ? Math.round(baseCostInfo.demand_amount) : '-- --' }</div>
                                            <div className={style['sub-text']}>基本电费(元)</div>
                                        </div>
                                    </div>
                                </div>
                                {/* 基本电费差价 */}
                                <div className={style['flex-item']} style={{ width:'calc((100% - 28px)/3)', backgroundColor:'#193e6f', borderRadius:'4px' }}>
                                    <div className={style['flex-item-title']} style={{ backgroundImage:'none' }}>分析结果</div>
                                    <div className={style['flex-item-content']} style={{ display:'flex', alignItems:'center', justifyContent:'space-around', textAlign:'center' }}>
                                        <div>
                                            <div className={style['text']}>{ baseCostInfo.kva_amount && baseCostInfo.demand_amount ? Math.round(Math.abs( baseCostInfo.kva_amount - baseCostInfo.demand_amount )):  '-- --' }</div>
                                            <div className={style['sub-text']}>基本电费差价(元)</div>
                                        </div>
                                        <div>
                                            <div className={style['text']}>{ baseCostInfo.demand_save_cost ? Math.round(baseCostInfo.demand_save_cost) : '-- --' }</div>
                                            <div className={style['sub-text']}>需量电费二次节俭空间(元)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style['card-container-wrapper']} style={{ height:'40%'}}>
                    <div className={style['card-container']}>
                        {
                            baseCostInfo.view 
                            ?
                            <BarChart data={baseCostInfo} />
                            :
                            <Spin className={style['spin']} size='large' />
                        }
                    </div>
                </div>
                <div className={style['card-container-wrapper']} style={{ height:'40%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>
                            <div>需量/容量计费分析</div>
                            <Radio.Group className={style['float-radio-group'] + ' ' + style['small']} style={{ position:'relative' }} value='total' onChange={()=>{
                                if ( !baseCostInfo.view ) {
                                    message.info('正在加载数据，请稍后');
                                    return;
                                } else {
                                    if ( !baseCostInfo.detail.length ){
                                        message.info('数据源为空');
                                        return ;
                                    } else {
                                        let fileTitle = `${startDate.format('YYYY')}年需量容量计费分析`;
                                        var aoa = [];
                                        var thead1 = ['时间','监控点','按容量计算',null,null,'按需量计算',null,null,'差价(元)'];
                                        var thead2 = [null,null,'容量(kva)','单价(元/kva·月)','电费(元)','本月最大需量(kva)','单价(元/kva·月)','电费(元)',null];
                                        aoa.push(thead1);
                                        aoa.push(thead2);
                                        
                                        baseCostInfo.detail.forEach((item,index)=>{
                                            let temp = [];
                                            temp.push(item.date);
                                            temp.push(item.mach_name);
                                            temp.push(item.total_kva);
                                            temp.push(item.kva_price);
                                            temp.push(item.kva_amount);
                                            temp.push(item.maxDemand);
                                            temp.push(item.demand_price);
                                            temp.push(item.demand_amount);
                                            temp.push(item.d_value);
                                            aoa.push(temp);
                                        })
                                        var sheet = XLSX.utils.aoa_to_sheet(aoa);
                                        // 合并表格表头的格式
                                        let merges = [];
                                        merges.push({
                                            s:{ r:0, c:2 },
                                            e:{ r:0, c:4 }
                                        });
                                        merges.push({
                                            s:{ r:0, c:5 },
                                            e:{ r:0, c:7 }
                                        });
                                        merges.push({
                                            s:{ r:0, c:0 },
                                            e:{ r:1, c:0 }
                                        });
                                        merges.push({
                                            s:{ r:0, c:1 },
                                            e:{ r:1, c:1 }
                                        });
                                        merges.push({
                                            s:{ r:0, c:8 },
                                            e:{ r:1, c:8 }
                                        });
                                        sheet['!cols'] = thead2.map(i=>({ wch:16 }));
                                        sheet['!merges'] = merges;
                                        downloadExcel(sheet, fileTitle + '.xlsx');
                                    }
                                }
                            }}>
                                <Radio.Button value='download'><FileExcelOutlined /></Radio.Button>
                            </Radio.Group>
                        </div>
                        
                        <div className={style['card-content']}>
                            {
                                Object.keys(baseCostInfo).length 
                                ?
                                <CustomTable columns={columns} data={baseCostInfo.detail} />
                                :
                                <Spin className={style['spin']} size='large' />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default connect(({ baseCost, global })=>({ baseCost, global }))(BaseCostManager);