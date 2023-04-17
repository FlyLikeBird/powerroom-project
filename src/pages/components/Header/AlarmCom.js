import React, { useState, useEffect, useRef } from 'react';
import { Popover, Badge } from 'antd';
import { history } from 'umi';
import { createFromIconfontCN, AlertOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import ScrollTable from '../ScrollTable';
let firstMsg = true;
let alarmTimer = null;

function isFullscreen(){
    return document.fullscreenElement    ||
           document.msFullscreenElement  ||
           document.mozFullScreenElement ||
           document.webkitFullscreenElement || false;
}
function enterFullScreen(el){
    try {
        if ( document.documentElement.requestFullscreen ) {
            document.documentElement.requestFullscreen();
        }
        // let func = el.requestFullscreen || el.msRequestFullscreen || el.mozRequestFullscreen || el.webkitRequestFullscreen ;
        // if ( func && typeof func === 'function' ) func.call(el);
    } catch(err){
        console.log(err);
    }
    
}

function cancelFullScreen(el ){
    // let func = el.cancelFullsceen || el.msCancelFullsceen || el.mozCancelFullsceen || el.webkitCancelFullsceen 
    //         || document.exitFullscreen || document.msExitFullscreen || document.mozExitFullscreen || document.webkitExitFullscreen ;
    // if ( func && typeof func === 'function' ) func();
    if ( typeof document.exitFullscreen === 'function' ) {
        document.exitFullscreen();
    }
}

const IconFont = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_2314993_bryih7jtrtn.js'
});
function AlarmCom({ msg }){
    const containerRef = useRef();
    const [muted, setMuted] = useState(false);
    useEffect(()=>{  
        var video = document.createElement('video');
        video.style.position = 'absolute';
        video.style.right = '0';
        video.id = 'my-audio';
        video.src = '/alarm.mp4';
        video.muted = true;
        video.autoPlay = true;
        video.loop = true;
        containerRef.current.appendChild(video);
        return ()=>{
            firstMsg = true;
            clearTimeout(alarmTimer);
            alarmTimer = null;
        }
    },[]);
    useEffect(()=>{
        if ( Object.keys(msg).length ){
            if ( !firstMsg && !muted ){
                function run(){   
                    let audio = document.getElementById('my-audio');
                    if ( audio ) {
                        audio.currentTime = 0;
                        audio.muted = false;
                        alarmTimer = setTimeout(()=>{
                            audio.muted = true;
                        },5000);
                    }  
                }
                run();
            } 
            firstMsg = false;
        }
    },[msg])
    // console.log(msg);
    let isFulled = isFullscreen();
    return (
        <div ref={containerRef} style={{ cursor:'pointer', display:'inline-flex', alignItems:'center'  }}>
            {
                isFulled
                ?
                <FullscreenExitOutlined style={{ fontSize:'1.4rem', margin:'0 10px' }} onClick={()=>{
                    cancelFullScreen();
                }} />
                :
                <FullscreenOutlined style={{ fontSize:'1.4rem', margin:'0 10px' }} onClick={()=>{
                    enterFullScreen();
                }} />
            }
            <AlertOutlined style={{ marginRight:'6px', fontSize:'1.2rem' }} onClick={()=>{
                history.push('/data_report' + `${ window.location.search ? window.location.search + '&&sub=4' : '?sub=4'}`);
            }} />
            <Popover content={<ScrollTable data={ msg.detail || []}/>}>
                <Badge count={msg.count} onClick={()=>{}} />
            </Popover>
            {/* <video id='my-audio' src={AlarmSound} muted={true} autoPlay={true} loop={true} style={{ position:'absolute', left:'100%' }}></video> */}
            <IconFont style={{ fontSize:'1.2rem', margin:'0 10px'}} type={ muted ? 'iconsound-off' : 'iconsound'} onClick={()=>{
                setMuted(!muted);
                let audio = document.getElementById('my-audio');
                if ( audio ){
                    if ( muted ){
                        audio.muted = false;
                    } else {
                        audio.muted = true;
                    }
                }
                
            }}></IconFont>
            <span style={{ margin:'0 6px' }}>|</span>
        </div>
    )
}

export default AlarmCom;