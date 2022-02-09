import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Tabs, Spin, Radio, message } from 'antd';
import { EyeOutlined, LeftOutlined, ForkOutlined, FileExcelOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import CustomTable from '@/pages/components/CustomTable';
import AdjustBarChart from './AdjustBarChart';
import style from '../../index.less';
import XLSX from 'xlsx';
import { loadScript, downloadExcel } from '@/pages/utils/array';
const { TabPane } = Tabs;

function AdjustCostManager({ dispatch, baseCost, global }){
    const { fieldList, currentField ,fieldAttrs, currentAttr, treeLoading, startDate } = global;
    const { adjustCostInfo, baseCostInfo } = baseCost;
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
        dispatch({ type:'global/toggleTimeType', payload:'3' });
        dispatch({ type:'baseCost/fetchAdjustCost'});
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
                                        dispatch({ type:'baseCost/fetchAdjustCost'});
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
                                                        dispatch({ type:'baseCost/fetchAdjustCost'});
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
                            <CustomDatePicker noToggle={true} onDispatch={()=>{
                                dispatch({ type:'baseCost/fetchAdjustCost'});
                            }} />
                        </div>
                        <div className={style['card-content']}>
                            <div className={style['flex-container']}>
                                {/* 无功罚款 */}
                                <div className={style['flex-item']} style={{ width:'calc(( 100% - 42px)/4)', backgroundColor:'#193e6f', borderRadius:'4px'}}>
                                    <div className={style['flex-item-title']} style={{ backgroundImage:'none' }}>
                                        无功罚款
                                        
                                    </div>
                                    <div className={style['flex-item-content']} style={{ display:'flex', alignItems:'center', justifyContent:'space-around', textAlign:'center' }}>
                                        <div>
                                            <div className={style['text']}>{ adjustCostInfo.totalAdjustCost ? Math.round(adjustCostInfo.totalAdjustCost) : '-- --' }</div>
                                            <div className={style['sub-text']}>年累计(元)</div>
                                        </div>
                                        <div>
                                            <div className={style['text']}>{  adjustCostInfo.maxAdjustCost ? Math.round(adjustCostInfo.maxAdjustCost) : '-- --' }</div>
                                            <div className={style['sub-text']}>最大值(元)</div>
                                        </div>
                                        <div>
                                            <div className={style['text']}>{ adjustCostInfo.avgAdjustCost ? Math.round(adjustCostInfo.avgAdjustCost) :  '-- --' }</div>
                                            <div className={style['sub-text']}>每月平均(元)</div>
                                        </div>
                                    </div>
                                </div>
                                {/* 功率因素 */}
                                <div className={style['flex-item']} style={{ width:'calc(( 100% - 42px)/4)', backgroundColor:'#193e6f', borderRadius:'4px' }}>
                                    <div className={style['flex-item-title']} style={{ backgroundImage:'none' }}>
                                        功率因素
                                    </div>
                                    <div className={style['flex-item-content']} style={{ display:'flex', alignItems:'center', justifyContent:'space-around', textAlign:'center' }}>
                                        <div>
                                            <div className={style['text']}>{ adjustCostInfo.factorRef || '-- --' }</div>
                                            <div className={style['sub-text']}>考核值(cosΦ)</div>
                                        </div>
                                        <div>
                                            <div className={style['text']}>{ adjustCostInfo.avgFactor || '-- --' }</div>
                                            <div className={style['sub-text']}>平均值(cosΦ)</div>
                                        </div>
                                        <div>
                                            <div className={style['text']}>{ adjustCostInfo.unqualified || '-- --' }</div>
                                            <div className={style['sub-text']}>低于考核值(次)</div>
                                        </div>
                                    </div>
                                </div>
                                {/* 提示信息 */}
                                <div className={style['flex-item']} style={{ width:'calc(( 100% - 42px)/4)', backgroundColor:'#193e6f', borderRadius:'4px' }}>
                                    <div className={style['flex-item-title']} style={{ backgroundImage:'none', textAlign:'center' }}>提示</div>
                                    <div className={style['flex-item-content']} style={{ display:'flex', alignItems:'center', justifyContent:'space-around', textAlign:'center' }}>
                                        <div style={{ color:'#5eff5a', fontSize:'1.2rem'}}>当前使用状态良好</div>
                                    </div>
                                </div>
                                {/* 节俭空间 */}
                                <div className={style['flex-item']} style={{ width:'calc(( 100% - 42px)/4)', backgroundColor:'#193e6f', borderRadius:'4px' }}>
                                    <div className={style['flex-item-title']} style={{ backgroundImage:'none' }}>分析结果</div>
                                    <div className={style['flex-item-content']} style={{ display:'flex', alignItems:'center', justifyContent:'space-around', textAlign:'center' }}>
                        
                                        <div>
                                            <div className={style['text']}>{ adjustCostInfo.adjuest_save_cost ? Math.round(adjustCostInfo.adjuest_save_cost) : '-- --' }</div>
                                            <div className={style['sub-text']}>力调电费二次节俭空间(元)</div>
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
                            adjustCostInfo.view 
                            ?
                            <AdjustBarChart data={adjustCostInfo.view} />
                            :
                            <Spin className={style['spin']} size='large' />
                        }
                    </div>
                </div>
                <div className={style['card-container-wrapper']} style={{ height:'40%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>
                            <div>力调电费(无功罚款)统计表</div>
                            <div>
                                <Radio.Group className={style['float-radio-group'] + ' ' + style['small']} style={{ position:'relative' }} value='total' onChange={()=>{
                                    if ( !adjustCostInfo.view ) {
                                        message.info('正在加载数据，请稍后');
                                        return;
                                    } else {
                                        if ( !adjustCostInfo.detail.length ){
                                            message.info('数据源为空');
                                            return ;
                                        } else {
                                            let fileTitle = `${startDate.format('YYYY')}年力调电费(无功罚款)统计表`;
                                            var aoa = [], thead = [], cols = [] ;
                                            columns.forEach((item,index)=>{
                                                thead.push(item.title);
                                                cols.push({ wch:16 });
                                            })
                                            aoa.push(thead);
                                            adjustCostInfo.detail.forEach((item,index)=>{
                                                let temp = [];
                                                columns.forEach(sub=>{
                                                    temp.push(item[sub.dataIndex]);
                                                })
                                                aoa.push(temp);
                                            })
                                            var sheet = XLSX.utils.aoa_to_sheet(aoa);
                                           
                                            sheet['!cols'] = cols;
                                            downloadExcel(sheet, fileTitle + '.xlsx');
                                        }
                                    }
                                }}>
                                    <Radio.Button value='download'><FileExcelOutlined /></Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className={style['card-content']}>
                            {
                                Object.keys(adjustCostInfo).length 
                                ?
                                <CustomTable columns={columns} data={adjustCostInfo.detail} />
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

export default connect(({ baseCost, global })=>({ baseCost, global }))(AdjustCostManager);