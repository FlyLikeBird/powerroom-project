import React, { useState } from 'react';
import { Radio, Button } from 'antd';
import { AreaChartOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import style from '../../index.less';

function CostTrendChart({ data }){
    let seriesData = [];
    let totalTip = data.tip.reduce((sum,cur)=>sum+=+cur,0);
    let totalTop = data.top.reduce((sum,cur)=>sum+=+cur,0);
    let totalMiddle = data.middle.reduce((sum,cur)=>sum+=+cur,0);
    let totalBottom = data.bottom.reduce((sum,cur)=>sum+=+cur,0);

    const [chartType, toggleChartType] = useState('line');
    if ( chartType === 'line' || chartType === 'bar' ){
        if (  totalTip ) {
            seriesData.push({
                type: chartType === 'line' ? 'line' : 'bar',
                name:'尖时段电费',
                smooth:true,
                symbol:'none',
                itemStyle:{
                    color:'#95d075'
                },
                areaStyle:{
                    color: {
                        type: 'linear',
                        x: 0,                 // 左上角x
                        y: 0,                 // 左上角y
                        x2: 1,                // 右下角x
                        y2: 0,                // 右下角y
                        colorStops: [{
                            offset: 0, color: '#95d075' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(0,0,0,0.2)' // 100% 处的颜色
                        }],
                    },
                    opacity: 0.2
                },
                stack: chartType === 'line' ? '' : 'cost',
                barWidth:14,
                data:data.tip
            })
        }
        if ( totalTop ) {
            seriesData.push({
                type: chartType === 'line' ? 'line' : 'bar',
                name:'峰时段电费',
                smooth:true,
                itemStyle:{
                    color:'#991bfa'
                },
                areaStyle:{
                    color: {
                        type: 'linear',
                        x: 0,                 // 左上角x
                        y: 0,                 // 左上角y
                        x2: 0,                // 右下角x
                        y2: 1,                // 右下角y
                        colorStops: [{
                            offset: 0, color: '#991bfa' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(0,0,0,0.2)' // 100% 处的颜色
                        }],
                    },
                    opacity:0.2
                },
                stack: chartType === 'line' ? '' : 'cost',
                barWidth:14,
                symbol:'none',
                data:data.top
            })
        }
        if ( totalMiddle ) {
            seriesData.push({
                type: chartType === 'line' ? 'line' : 'bar',
                smooth:true,
                name:'平时段电费',
                itemStyle:{
                    color:'#03a4fe'
                },
                areaStyle:{
                    color: {
                        type: 'linear',
                        x: 0,                 // 左上角x
                        y: 0,                 // 左上角y
                        x2: 0,                // 右下角x
                        y2: 1,                // 右下角y
                        colorStops: [{
                            offset: 0, color: '#03a4fe' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(0,0,0,0.2)' // 100% 处的颜色
                        }],
                    },
                    opacity:0.2
                },
                stack: chartType === 'line' ? '' : 'cost',
                barWidth:14,
                symbol:'none',
                data:data.middle
            })
        }
        if ( totalBottom ) {
            seriesData.push({
                type: chartType === 'line' ? 'line' : 'bar',
                smooth:true,
                name:'谷时段电费',
                itemStyle:{
                    color:'#4dfedf'
                },
                areaStyle:{
                    color: {
                        type: 'linear',
                        x: 0,                 // 左上角x
                        y: 0,                 // 左上角y
                        x2: 0,                // 右下角x
                        y2: 1,                // 右下角y
                        colorStops: [{
                            offset: 0, color: '#4dfedf' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(0,0,0,0.2)' // 100% 处的颜色
                        }],
                    },
                    opacity:0.2
                },
                stack: chartType === 'line' ? '' : 'cost',
                barWidth:14,
                symbol:'none',
                data:data.bottom
            })
        }
    } else if ( chartType === 'pie'){
        seriesData.push({
            type:'pie',
            radius:'80%',
            label:{ show:false},
            labelLine:{ show:false },
            data:[
                { name:'峰时段电费', value:totalTop, itemStyle:{ color:'#991bfa'}},
                { name:'平时段电费', value:totalMiddle, itemStyle:{ color:'#03a4fe'} },
                { name:'谷时段电费', value:totalBottom, itemStyle:{ color:'#4dfedf' }}
            ]
        })
    }
    return (
        <div style={{ height:'100%', position:'relative'}}>
            <Radio.Group value={chartType} size='small' className={style['chart-radio-group']} onChange={e=>{
                toggleChartType(e.target.value);
            }}>
                <Radio.Button value='line'><LineChartOutlined /></Radio.Button>
                <Radio.Button value='bar'><BarChartOutlined /></Radio.Button>
                <Radio.Button value='pie'><PieChartOutlined /></Radio.Button>

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
                        trigger: chartType === 'pie' ? 'item' : 'axis'
                    },
                    xAxis:{
                        show:chartType === 'pie' ? false : true,
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
                        show:chartType === 'pie' ? false : true,
                        type:'value',
                        name:'(单位/元)',
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

export default React.memo(CostTrendChart, areEqual);