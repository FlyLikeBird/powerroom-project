import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { Radio, Card, Button  } from 'antd';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import style from '../../index.less';

function CostTrendChart({ data, currentField, title }) {
    const { date, attr } = data;
    const [chartType, toggleChartType] = useState('line');
    const echartsRef = useRef();
    let seriesData = [];
    let legendData = [];
    if ( chartType === 'line') {
        seriesData = attr.map(item=>{
            let obj ={};
            obj.type = 'line';
            obj.name = item.attr_name;
            obj.data = item.cost;
            obj.symbol = 'none';
            obj.areaStyle = {
                opacity:0.1
            };
            legendData.push(item.attr_name);
            return obj;
        })
    } else if ( chartType === 'bar') {
        seriesData = attr.map(item=>{
            let obj ={};
            obj.type = 'bar';
            obj.name = item.attr_name;
            obj.data = item.cost;
            legendData.push(item.attr_name);
            return obj;
        })
    } else if ( chartType === 'pie') {
        seriesData.push({
            type:'pie',
            radius:'70%',
            label:{
                show:true,
                position:'inner',
                fontSize:16,
                formatter:(params)=>{
                    if ( params.data.value === 0 ){
                        return '';
                    } else {
                        return `${params.data.name}\n${params.data.value.toFixed(2)}`;
                    }              
                }
            },
            labelLine:{ show:false },
            data:attr.map(item=>{
                return {
                    name:item.attr_name,
                    value: Math.round(item.cost.reduce((sum,cur)=>sum+=Number(cur), 0))
                }
            })
        });
        legendData = attr.map(i=>i.attr_name);
    }
    
    return (    
        <div style={{ height:'100%', position:'relative' }}>
            <Radio.Group value={chartType} size='small' className={style['chart-radio-group']} onChange={e=>{
                toggleChartType(e.target.value);
            }}>
                <Radio.Button value='line'><LineChartOutlined /></Radio.Button>
                <Radio.Button value='bar'><BarChartOutlined /></Radio.Button>
                <Radio.Button value='pie'><PieChartOutlined /></Radio.Button>
            </Radio.Group>
            <ReactEcharts
                ref={echartsRef}
                notMerge={true}
                style={{ width:'100%', height:'100%'}}
                option={{
                    color:['#36637b', '#f1ac5b', '#65cae3', '#57e29f', '#62a4e2'],
                    legend:{ 
                        type:'scroll', 
                        data:legendData, 
                        top:10,
                        left:'center',
                        width:'80%',
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    tooltip:{
                        trigger: chartType === 'pie' ? 'item' : 'axis'
                    }, 
                    grid: {
                        left:20,
                        right:40,
                        top:60,
                        bottom:30,
                        containLabel:true
                    },                 
                    xAxis: {
                        show: chartType === 'pie' ? false : true,
                        type:'category',
                        data:date,
                        axisTick:{ show:false },
                        axisLabel:{
                            color:'#b7b7bf',
                            formatter:(value)=>{
                                let dateStr = value.split(' ');
                                if ( dateStr && dateStr.length > 1){
                                    return dateStr[1];
                                } else {
                                    return value;
                                }
                            }
                        }
                    },
                    yAxis:{
                        show:chartType === 'pie' ? false : true,
                        type:'value',
                        axisTick:{
                            show:false
                        },
                        axisLine:{
                            show:false
                        },
                        name:`(单位:元)`,
                        nameTextStyle:{
                            color:'#b7b7bf'
                        },
                        splitLine:{
                            lineStyle:{
                                color:'#3b3b50'
                            }
                        },
                        axisLabel:{
                            color:'#b7b7bf'
                        }
                    },
                    series:seriesData
                }}
            /> 
        </div>
            
    );
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data  ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(CostTrendChart, areEqual);
