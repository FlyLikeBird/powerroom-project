import React from 'react';
import ReactEcharts from 'echarts-for-react';

const richStyle = {
        'blue':{
            width:80,
            height:20,
            align:'center',
            borderWidth:1,
            color:'#fff',
            borderColor:'#4cb6f7',
            backgroundColor:'rgba(76,182,247,0.6)'
        },
        'purple':{
            width:80,
            height:20,
            color:'#fff',
            align:'center',
            borderWidth:1,
            borderColor:'#db22fe',
            backgroundColor:'rgba(219, 34, 254,0.6)'
        }
    }

function LineChart({ timeType, xData, yData, y2Data }){
    const seriesData = [];
    if ( yData ){
        seriesData.push({
            type:'line',
            name:'',
            data:yData,
            itemStyle:{
                color:'#4cb6f7'
            },
            symbolSize:0,
            // markPoint: {
            //     data: [
            //         {type: 'max', name: series1, symbol:'circle', symbolSize:10 },
            //         {type: 'min', name: series1, symbol:'circle', symbolSize:10 }
            //     ],
            //     label:{
            //         position:[-40,-30],
            //         formatter:(params)=>{
            //             return `{${params.name === series1 ? 'blue' : 'purple'}|${params.data.value}}`;
            //         },
            //         rich:richStyle
            //     }
            // },
            // markLine: {
            //     data: [
            //         {type: 'average', name: '平均值'}
            //     ],
            //     // symbol:['circle', 'rect'],
            // }
        });
    }
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                grid:{
                    top:80,
                    bottom:20,
                    left:40,
                    right:40,
                    containLabel:true
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
                    data:xData
                },
                yAxis:{
                    type:'value',
                    name:'(单位/mA)',
                    nameTextStyle:{
                        color:'#fff'
                    },
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
                },
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
export default LineChart;