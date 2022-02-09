import React, { useState } from 'react';
import { Radio } from 'antd';
import { AreaChartOutlined, BarChartOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import style from '../../index.less';
function MeasureBarChart({ data }){
    let seriesData = [];
    const [showType, toggleShowType] = useState('cost');
    let title = showType === 'cost' ? '电费' : '电量';
    if ( data.tipCost.filter(i=>i).length !== 0 ) {
        seriesData.push({
            type:'bar',
            name:`尖时段${title}`,
            stack:'measure',
            itemStyle:{
                color:'#fd6e4c'
            },
            barMaxWidth:14,
            data: showType === 'cost' ? data.tipCost : data.tipEnergy
        });
    }
    if ( data.topCost.filter(i=>i).length !== 0 ){
        seriesData.push({
            type:'bar',
            name:`峰时段${title}`,
            stack:'measure',
            itemStyle:{
                color:'#991bfa'
            },
            barMaxWidth:14,
            data: showType === 'cost' ? data.topCost : data.topEnergy
        });
    }
    if ( data.middleCost.filter(i=>i).length !== 0){
        seriesData.push({
            type:'bar',
            name:`平时段${title}`,
            stack:'measure',
            itemStyle:{
                color:'#03a4fe'
            },
            barMaxWidth:14,
            data: showType === 'cost' ? data.middleCost : data.middleEnergy
        });
    }
    if ( data.bottomCost.filter(i=>i).length !== 0){
        seriesData.push({
            type:'bar',
            name:`谷时段${title}`,
            stack:'measure',
            itemStyle:{
                color:'#4dfedf'
            },
            barMaxWidth:14,
            data: showType === 'cost' ? data.bottomCost : data.bottomEnergy
        });
    }
    
    return (
        <div style={{ height:'100%', position:'relative'}}>
            <Radio.Group value={showType} size='small' className={style['chart-radio-group']} onChange={e=>{
                toggleShowType(e.target.value);
            }}>
                <Radio.Button value='cost'>电费</Radio.Button>
                <Radio.Button value='energy'>电量</Radio.Button>

            </Radio.Group>
            <ReactEcharts
                notMerge={true}
                style={{ width:'100%', height:'100%' }}
                option={{
                    grid:{
                        top:40,
                        bottom:20,
                        left:20,
                        right:60,
                        containLabel:true
                    },
                    legend:{
                        left:'center',
                        top:6,
                        data:seriesData.map(i=>i.name),
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    tooltip:{
                        trigger:'axis'
                    },
                    xAxis:{
                        type:'category',
                        axisTick:{ show:false },
                        axisLine:{
                            lineStyle:{
                                color:'#3b3b50'
                            }
                        },
                        axisLabel:{
                            color:'#b7b7bf'
                        },
                        data:data.date
                    },
                    yAxis:{
                        show:true,
                        type:'value',
                        name:`(单位/${showType === 'cost' ? '元' : 'kwh'})`,
                        nameTextStyle:{
                            color:'#b7b7bf'
                        },
                        splitLine:{
                            lineStyle:{
                                color:'#3b3b50'
                            }
                        },
                        axisLine:{ show:false },
                        axisTick:{ show:false },
                        axisLabel:{
                            color:'#b7b7bf'
                        }
                    },
                    series:seriesData
                }}
            />
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data  ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(MeasureBarChart, areEqual);