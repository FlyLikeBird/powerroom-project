import React, { useState } from 'react';
import { Radio } from 'antd';
import { AreaChartOutlined, BarChartOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';

function BarChart({ data }){
    let seriesData = [];
    seriesData.push({
        type:'bar',
        name:'无功罚款',
        barWidth:10,
        data:data.adjustCost,
        itemStyle:{
            color: {
                type: 'linear',
                x: 0,                 // 左上角x
                y: 0,                 // 左上角y
                x2: 0,                // 右下角x
                y2: 1,                // 右下角y
                colorStops: [{
                    offset: 0, color: '#da22fe' // 0% 处的颜色
                }, {
                    offset: 1, color: '#7f19f8' // 100% 处的颜色
                }],
            },  
        },
        yAxisIndex:1,
    });
    seriesData.push({
        type:'line',
        name:'功率因素',
        symbol:'none',
        data:data.factor,
        itemStyle:{
            color:'#4da5fe'
        },
        yAxisIndex:0
    });
    return (
       
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
                    yAxis:[
                        {
                            show:true,
                            type:'value',
                            name:'功率因素(cosΦ)',
                            nameTextStyle:{
                                color:'#b7b7bf'
                            },
                            splitLine:{
                                lineStyle:{
                                    color:'#3b3b50'
                                }
                            },
                            position:'right',
                            axisLine:{ show:false },
                            axisTick:{ show:false },
                            axisLabel:{
                                color:'#b7b7bf'
                            }
                        },
                        {
                            show:true,
                            type:'value',
                            name:'无功罚款(元)',
                            nameTextStyle:{
                                color:'#b7b7bf'
                            },
                            splitLine:{ show:false },
                            axisLine:{ show:false },
                            axisTick:{ show:false },
                            axisLabel:{
                                color:'#b7b7bf'
                            }
                        },
                    ],
                    
                    series:seriesData
                }}
            />
        
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