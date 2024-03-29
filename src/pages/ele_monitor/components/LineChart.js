import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { findMaxAndMin } from '@/pages/utils/array';
const richStyle = {
    'blue':{
        // width:80,
        padding:[0,10,0,10],
        height:20,
        align:'center',
        borderWidth:1,
        color:'#fff',
        borderColor:'#4da4fe',
        backgroundColor:'rgba(77,164,254,0.4)'
    },
    'purple':{
        // width:80,
        padding:[0,10,0,10],
        height:20,
        color:'#fff',
        align:'center',
        borderWidth:1,
        borderColor:'#7916f7',
        backgroundColor:'rgba(121, 22, 247,0.4)'
    }
}



function LineChart({ startDate, timeType, xData, yData, y2Data, unit }){
    const seriesData = [];
    let series1 = timeType === '1'  ? '今日' : timeType === '2' ? '本月' : timeType === '3' ? '本年' : '';
    let series2 = timeType === '1'  ? '昨日' : timeType === '2' ? '上月' : timeType === '3' ? '去年' : '';
    seriesData.push({
        type:'line',
        name:series1,
        data:yData,
        itemStyle:{
            color:'#4da4fe'
        },
        symbolSize:0,
        markPoint: {
            data: [
                {type: 'max', name: series1, symbol:'circle', symbolSize:6 },
                {type: 'min', name: series1, symbol:'circle', symbolSize:6 }
            ],
            label:{
                position:[-40,-30],
                formatter:(params)=>{
                    // console.log(params);
                    return `{${params.name === series1 ? 'blue' : 'purple'}|${ params.data.type === 'max' ? '最大值' : '最小值'}:${Math.round(params.data.value)}}`;
                },
                rich:richStyle
            }
        },
        // markLine: {
        //     data: [
        //         {type: 'average', name: '平均值'}
        //     ],
        // }
    });
    seriesData.push({
        type:'line',
        name:series2,
        data:y2Data,
        itemStyle:{
            color:'#7916f7'
        },
        symbolSize:0,
        markPoint: {
            data: [
                {type: 'max', name: series2, symbol:'circle', symbolSize:6 },
                {type: 'min', name: series2, symbol:'circle', symbolSize:6 }
            ],
            label:{
                position:[-40,-30],
                formatter:(params)=>{
                    return `{${params.name === series2 ? 'purple' : 'blue'}|${ params.data.type === 'max' ? '最大值' : '最小值'}:${Math.round(params.data.value)}}`;
                },
                rich:richStyle
            }
        },
        // markLine: {
        //     data: [
        //         {type: 'average', name: '平均值'}
        //     ],
        // }
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
                    right:180,
                    containLabel:true
                },
                legend:[
                    {
                        left:'center',
                        top:4,
                        data:seriesData.map(i=>i.name),
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    {
                    right:0,
                    top:'middle',
                    orient:'vertical',
                    data:seriesData.map(i=>i.name),
                    itemWidth:0,
                    itemHeight:0,
                    textStyle:{
                        color:'#fff',
                        rich: {                   
                            time: {
                                width:60,
                                height:30,
                                fontSize: 12,
                                lineHeight: 16,
                                color: '#b7b7bf',
                                align:'left'
                            },
                            num:{
                                width:60,
                                height:30,
                                fontSize: 12,
                                lineHeight: 16,
                                color: '#fff',
                                align:'left',
                                padding:[0,0,0,4]
                            },
                            value: {
                                width:40,
                                height:30,
                                fontSize: 12,
                                lineHeight: 16,
                                color: '#b7b7bf',
                                align:'left'
                            },
                            
                        }
                    },
                    formatter:name=>{
                        let temp = findMaxAndMin( name === series1 ? yData : y2Data );
                        let prefixTime = timeType === '1' ? '': timeType === '2' ? startDate.format('MM') : timeType === '3' ? startDate.format('YYYY') :'';
                        let maxDate = xData[temp.max ? temp.max.index : ''];
                        let minDate = xData[temp.min ? temp.min.index : ''];
                        let maxValueArr = maxDate ? (maxDate + '').split('-') :[];
                        let maxValue = maxValueArr[maxValueArr.length-1];
                        let minValueArr = minDate ? (minDate + '').split('-') : [];
                        let minValue = minValueArr[minValueArr.length-1]; 
                        let maxTime = maxValue ? prefixTime + ( prefixTime ? '-' : '' ) + maxValue : '-- --'; 
                        let minTime = minValue ? prefixTime + ( prefixTime ? '-' : '') + minValue : '-- --'; 
                        return `
                            {value|${name}}{num|}{time|时间}\n
                            {value|最大值:}{num|${temp.max ? temp.max.value : ''}}{num|${maxTime}}\n
                            {value|最小值:}{num|${temp.min ? temp.min.value : ''}}{num|${minTime}}\n
                            {value|平均值:}{num|${temp.avg ? temp.avg : ''}}
                            `;
                    }

                }],
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
                    name:`(单位:${unit})`,
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
    if ( prevProps.xData !== nextProps.xData  ) {
        return false;
    } else {
        return true;
    }
}
export default LineChart;