import React from 'react';
import ReactEcharts from 'echarts-for-react';

function WarningBarChart({ data }){
    let seriesData = [];
    seriesData.push({
        type:'bar',
        name:'电力安全',
        itemStyle:{
            color: {
                type: 'linear',
                x: 0,                 // 左上角x
                y: 0,                 // 左上角y
                x2: 0,                // 右下角x
                y2: 1,                // 右下角y
                colorStops: [{
                    offset: 0, color: '#23b7f6' // 0% 处的颜色
                }, {
                    offset: 1, color: 'rgba(35, 183, 246,0.6)' // 100% 处的颜色
                }],
            },  
        },
        barWidth:10,
        barGap:'0',
        data:[10,20,30,40,50,60,70]
    });
    seriesData.push({
        type:'bar',
        name:'环境安全',
        itemStyle:{
            color: {
                type: 'linear',
                x: 0,                 // 左上角x
                y: 0,                 // 左上角y
                x2: 0,                // 右下角x
                y2: 1,                // 右下角y
                colorStops: [{
                    offset: 0, color: '#ff8481' // 0% 处的颜色
                }, {
                    offset: 1, color: 'rgba(255, 132, 129, 0.6)' // 100% 处的颜色
                }],
            },  
        },
        barWidth:10,
        barGap:'0',
        data:[10,20,40,40,70,60,70]

    })
    
    return (
        <ReactEcharts
            style={{ width:'100%', height:'100%' }}
            notMerge={true}
            option={{
                legend: {
                    show:true,
                    left:'center',
                    top:4,
                    textStyle:{
                        color:'#fff'
                    },
                    itemWidth:16,
                    itemHeight:6
                },
                grid:{
                    top:40,
                    left:10,
                    right:20,
                    bottom:10,
                    containLabel:true
                },
                xAxis:{
                    type:'category',
                    data:data.date,
                    axisTick:{
                        show:false
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#999b9d'
                        }
                    }
                },
                yAxis:{
                    type:'value',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#212a2d'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        color:'#999b9d'
                    }
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

export default React.memo(WarningBarChart, areEqual);