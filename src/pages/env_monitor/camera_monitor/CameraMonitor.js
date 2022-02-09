import React, { useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Radio, Button } from 'antd';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';
// import ChartContainer from './ChartContainer';
import style from '../../index.less';

const treeData = [
    { title:'配电房1'},
    { title:'配电房2'},
    { title:'配电房3'},
    { title:'配电房4'},
]
function initCamera(token, containerRef, channel){
    if ( containerRef.current.childNodes[0] ) {
        containerRef.current.removeChild(containerRef.current.childNodes[0]);
    }
    var iframe = document.createElement('iframe');
    iframe.style.width = containerRef.current.offsetWidth + 'px';
    iframe.style.height = containerRef.current.offsetHeight + 'px';
    iframe.src = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://888888@open.ys7.com/F62907491/${channel.channelNo}.live&accessToken=${token}`;        
    containerRef.current.appendChild(iframe);
}

function CameraMonitor({ dispatch, envMonitor, global }){
    const containerRef = useRef();
    const { cameraList, channelList, accessToken, currentChannel } = envMonitor;
    useEffect(()=>{
        dispatch({ type:'envMonitor/init' });
    },[]);
    useEffect(()=>{
        if ( Object.keys(currentChannel).length ){
            initCamera(accessToken, containerRef, currentChannel);
        }
    },[currentChannel]);
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}></div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>监测点</div>
                        <div className={style['card-content']}>
                            <div className={style['list-container'] + ' ' + style['inline']}>
                                    {
                                        cameraList.length 
                                        ?
                                        cameraList.map((item,index)=>(
                                            <div key={index} className={style['list-item']}>
                                                <div>
                                                    <EyeOutlined />{ item.camera_mach_name }
                                                </div>
                                                <div></div>
                                            </div>
                                        ))
                                        :
                                        <Spin className={style['spin']} size='large' />

                                    }
                                </div>
                            </div>
                    </div>
                </div>
            </div>
            <div className={style['right']}>
                <div className={style['card-container']} >
                    <div style={{ height:'40px'}}>
                        <Radio.Group value={currentChannel.channelNo} style={{ left:'14px' }} size='small' className={style['chart-radio-group']} onChange={e=>{
                            // toggleShowType(e.target.value);
                            let temp = channelList.filter(i=>i.channelNo === e.target.value )[0];
                            dispatch({ type:'envMonitor/toggleChannel', payload:temp });
                        }}>
                            {
                                channelList.length 
                                ?
                                channelList.map((item,index)=>(
                                    <Radio.Button value={item.channelNo}>{ item.channelName }</Radio.Button>
                                ))
                                :
                                null
                            }

                        </Radio.Group>              
                    </div>
                    <div style={{ height:'calc( 100% - 40px)'}} ref={containerRef}></div>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default connect(({ envMonitor, global })=>({ envMonitor, global }))(CameraMonitor);