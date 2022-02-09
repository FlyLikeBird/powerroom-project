import React from 'react';
import ReactEcharts from 'echarts-for-react';

function LineChart({ xData, yData, y2Data, y3Data }){
    const seriesData = [];
    if ( yData ) {
        seriesData.push({
            type:'line',
            name:'A相',
            data:yData,
            itemStyle:{
                color:'#eff400'
            },
            symbolSize:0
        });
    }
    if ( y2Data ){
        seriesData.push({
            type:'line',
            name:'B相',
            data:yData,
            itemStyle:{
                color:'#00ff00'
            },
            symbolSize:0
        });
    }
    if ( y3Data ){
        seriesData.push({
            type:'line',
            name:'C相',
            data:yData,
            itemStyle:{
                color:'#ff0000'
            },
            symbolSize:0
        });
    }
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                grid:{
                    top:40,
                    bottom:20,
                    left:20,
                    right:20,
                    containLabel:true
                },
                legend:{
                    left:'center',
                    top:4,
                    show:seriesData.length > 1 ? true : false ,
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
                            color:'#4e6b91'
                        }
                    },
                    axisLabel:{
                        color:'#fff'
                    },
                    data:xData
                },
                yAxis:{
                    type:'value',
                    splitLine:{
                        lineStyle:{
                            color:'#4e6b91'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        color:'#fff'
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