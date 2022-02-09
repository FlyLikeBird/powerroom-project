import React, { useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Radio } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import style from '../../index.less';
import html2canvas from 'html2canvas';
function getNodesDeep(node, nodes, links, parentNode, deep = 0){
    let obj = {
        name:node.attr_name,
        key:node.attr_id,
        depth:deep,
        cost:Math.floor(node.cost),
        energy:Math.floor(node.energy)
    }
    nodes.push(obj);
    if ( parentNode ){
        links.push({ source:parentNode.name, target:node.attr_name, value:Math.floor(node.energy), cost:Math.floor(node.cost), energy:Math.floor(node.energy) })
    }
    parentNode = obj;
    if ( node.children && node.children.length ){
        node.children.forEach(item=>{
            let temp = deep;
            ++temp;
            getNodesDeep(item, nodes, links, parentNode, temp)
        })
    }
}

function FlowChart({ data, dispatch }){
    let nodes = [], links = [];
    const echartsRef = useRef();
    getNodesDeep(data, nodes, links);
    // console.log(data);
    // console.log(nodes);
    // console.log(links);
    const onEvents = {
        'click':(params)=>{
            console.log(params);
            if(params.dataType === 'node' && params.type === 'click'){
                dispatch({ type:'baseCost/fetchEnergyFlow', payload:{ clickNode:{ title:params.data.name, key:params.data.key, depth:params.data.depth } }});
            }
        }
    };
    return (
        <div style={{ height:'100%' }}>
            <div style={{ position:'absolute', left:'10px', top:'10px', zIndex:'2' }}>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'baseCost/toggleChartLoading'});
                    dispatch({ type:'baseCost/fetchEnergyFlow'});
                }} />
            </div>
            <Radio.Group style={{ position:'absolute', right:'10px', top:'10px', zIndex:'2' }} value='hello' size='small' className={style['float-radio-group']} onChange={e=>{
                if ( echartsRef.current && echartsRef.current.ele ) {
                    html2canvas(echartsRef.current.ele, { allowTaint:false, useCORS:false, backgroundColor:'#191932' })
                    .then(canvas=>{
                        let MIME_TYPE = "image/png";
                        let url = canvas.toDataURL(MIME_TYPE);
                        let linkBtn = document.createElement('a');
                        linkBtn.download = '能源流向图' ;          
                        linkBtn.href = url;
                        let event;
                        if( window.MouseEvent) {
                            event = new MouseEvent('click');
                        } else {
                            event = document.createEvent('MouseEvents');
                            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        }
                        linkBtn.dispatchEvent(event);
                    })
                }
            }}>
                <Radio.Button value='img'><PictureOutlined /></Radio.Button>
            </Radio.Group>
            <ReactEcharts
                ref={echartsRef}
                style={{ width:'100%', height:'100%'}}
                notMerge={true}
                onEvents={onEvents}
                option={{
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove'
                    },
                    series: [
                        {
                            type: 'sankey',
                            data: nodes,
                            links: links,
                            top:'8%',
                            nodeWidth:24,
                            nodeGap:12,
                            layoutIterations:0,
                            focusNodeAdjacency: true,
                            label:{
                                color:'#fff',
                                padding:[12,0,12,0],
                                formatter:params=>{
                                    return `${params.data.name}(${params.data.energy}kwh)`
                                }
                            },
                            levels: [{
                                depth: 0,
                                itemStyle: {
                                    color: '#219afa'
                                },
                                lineStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,                 // 左上角x
                                        y: 0,                 // 左上角y
                                        x2: 1,                // 右下角x
                                        y2: 0,                // 右下角y
                                        colorStops: [{
                                            offset: 0, color: '#219afa' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#e24466' // 100% 处的颜色
                                        }],
                                    },
                                    opacity: 0.2
                                }
                            }, {
                                depth: 1,
                                itemStyle: {
                                    color: '#e24466'
                                },
                                lineStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,                 // 左上角x
                                        y: 0,                 // 左上角y
                                        x2: 1,                // 右下角x
                                        y2: 0,                // 右下角y
                                        colorStops: [{
                                            offset: 0, color: '#e24466' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#693be7' // 100% 处的颜色
                                        }],
                                    },
                                    opacity: 0.2
                                }
                            }, {
                                depth: 2,
                                itemStyle: {
                                    color: '#693be7'
                                },
                                lineStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,                 // 左上角x
                                        y: 0,                 // 左上角y
                                        x2: 1,                // 右下角x
                                        y2: 0,                // 右下角y
                                        colorStops: [{
                                            offset: 0, color: '#693be7' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#45e46b' // 100% 处的颜色
                                        }],
                                    },
                                    opacity: 0.2
                                }
                            }, {
                                depth: 3,
                                itemStyle: {
                                    color: '#45e46b'
                                },
                                lineStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,                 // 左上角x
                                        y: 0,                 // 左上角y
                                        x2: 1,                // 右下角x
                                        y2: 0,                // 右下角y
                                        colorStops: [{
                                            offset: 0, color: '#45e46b' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#decbe4' // 100% 处的颜色
                                        }],
                                    },
                                    opacity: 0.2
                                }
                            }],
                            lineStyle: {
                                curveness: 0.5
                            }
                        }
                    ]
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
export default React.memo(FlowChart, areEqual);


