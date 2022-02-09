import React, { useState } from 'react';
import { Radio } from 'antd';
import { AreaChartOutlined, BarChartOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import style from '../../index.less';

function BarChart({ data }){
    let seriesData = [];
    const [type, setType] = useState(data.view.date && data.view.date.length === 1 ? 'bar' : 'line');
    seriesData.push({
        type: type === 'bar' ? 'bar' : 'line',
        name:'容量电费',
        smooth:true,
        symbol:'none',
        areaStyle:{ opacity:0.3 },
        data:data.view.kva.map(i=>Math.floor( i * data.kva_price)),
        barMaxWidth:14,
        itemStyle:{
            color:'#4391ff'
        }
    });
    seriesData.push({
        type: type === 'bar' ? 'bar' : 'line',
        name:'需量电费',
        smooth:true,
        symbol:'none',
        data:data.view.demand.map(i=>Math.floor(i*data.demand_price)),
        areaStyle:{ opacity:0.3 },
        barMaxWidth:14,
        itemStyle:{
            color:'#28c993'
        }
    });
    return (
        <div style={{ width:'100%', height:'100%', position:'relative' }}>
            <Radio.Group size='small' className={style['chart-radio-group']} value={type} onChange={e=>setType(e.target.value)}>
                <Radio.Button key='line' value='line'><AreaChartOutlined /></Radio.Button>
                <Radio.Button key='bar' value='bar'><BarChartOutlined /></Radio.Button>
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
                        data:data.view.date
                    },
                    yAxis:{
                        type:'value',
                        splitLine:{
                            lineStyle:{
                                color:'#3b3b50'
                            }
                        },
                        axisLine:{
                            show:false
                        },
                        axisLabel:{
                            color:'#b7b7bf'
                        },
                        name:'(单位/元)',
                        nameTextStyle:{
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

export default React.memo(BarChart, areEqual);