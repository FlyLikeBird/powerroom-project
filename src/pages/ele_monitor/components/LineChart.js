import React from 'react';
import ReactEcharts from 'echarts-for-react';

const richStyle = {
        'blue':{
            width:80,
            height:24,
            align:'center',
            borderWidth:1,
            color:'#fff',
            borderColor:'#4cb6f7',
            backgroundColor:'rgba(76,182,247,0.6)'
        },
        'purple':{
            width:80,
            height:24,
            color:'#fff',
            align:'center',
            borderWidth:1,
            borderColor:'#db22fe',
            backgroundColor:'rgba(219, 34, 254,0.6)'
        }
    }

function LineChart({ xData, yData, y2Data }){
    const seriesData = [];
    xData = ['1','2','3','4','5'];
    seriesData.push({
        type:'line',
        name:'今日',
        data:[20,30,10,7,60],
        itemStyle:{
            color:'#4cb6f7'
        },
        symbolSize:0,
        markPoint: {
            data: [
                {type: 'max', name: '今日', symbol:'circle', symbolSize:10 },
                {type: 'min', name: '今日', symbol:'circle', symbolSize:10 }
            ],
            label:{
                position:[-40,-40],
                formatter:(params)=>{
                    console.log(params);
                    return `{${params.name === '今日' ? 'blue' : 'purple'}|${params.data.value}}`;
                },
                rich:richStyle
            }
        },
        markLine: {
            data: [
                {type: 'average', name: '平均值'}
            ],
            // symbol:['circle', 'rect'],
        }
    });
    seriesData.push({
        type:'line',
        name:'昨日',
        data:[30,32,60,20,3],
        itemStyle:{
            color:'#db22fe'
        },
        markPoint: {
            data: [
                {type: 'max', name: '昨日', symbolSize:0 },
                {type: 'min', name: '昨日', symbolSize:0 }
            ],
            label:{
                formatter:(params)=>{
                    return `{${params.name === '今日' ? 'blue' : 'purple'}|${params.data.value}}`;
                },
                rich:richStyle
            }
        },
    });
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                grid:{
                    top:60,
                    bottom:20,
                    left:20,
                    right:60,
                    containLabel:true
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
                    data:xData
                },
                yAxis:{
                    type:'value',
                    splitLine:{
                        lineStyle:{
                            color:'#3b3b50'
                        }
                    }
                },
                series:seriesData
            }}
        />
    )
}

export default LineChart;