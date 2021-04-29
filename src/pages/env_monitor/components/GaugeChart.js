import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

function GaugeChart(){
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                series:[
                    {
                        name: '业务指标',
                        type: 'gauge',
                        radius:'90%',
                        detail: {
                            formatter: '{value}%',
                            fontSize:16,
                            
                        },
                        data: [{value: 80, name: ''}],
                        pointer:{
                            width:2,
                        },
                        axisLine:{
                            show:true,
                            lineStyle:{
                                width:8,
                                color: [
                                    [
                                        0.5, new echarts.graphic.LinearGradient(
                                            0, 0, 1, 0, [
                                                {
                                                    offset: 0,
                                                    color: '#4cf3dc',
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#4daefa',
                                                }
                                            ]
                                        )
                                    ],
                                    [
                                        1, new echarts.graphic.LinearGradient(
                                            0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: '#4daefa',
                                                },
                                                {
                                                    offset:0.5,
                                                    color: '#ebcb39',
                                                },
                                                {
                                                    offset:0.8,
                                                    color:'#ff432c'
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#ff432c',
                                                }
                                            ]
                                        )
                                    ]
                                    
                                ]
                            }
                        }
                    }
                ]
            }}
        />
    )
}

export default GaugeChart;