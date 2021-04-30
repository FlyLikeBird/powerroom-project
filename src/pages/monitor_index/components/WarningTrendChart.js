import React from 'react';
import ReactEcharts from 'echarts-for-react';

function WarningTrendChart({ data }){
    let seriesData = [];
    seriesData.push({
        type:'bar',
        name:'今日能耗',
        itemStyle:{
            color:'#04fde7'
        },
        barWidth:14,
        data:[10,20,30,40,50,60,70],
        z:3
    });
    seriesData.push({
        type:'line',
        name:'昨日能耗',
        itemStyle:{
            color:'#017dc7',
        },
        symbol:'none',
        smooth:true,
        areaStyle:{
            color:'#017dc7',
            opacity:0.2
        },
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

export default React.memo(WarningTrendChart, areEqual);