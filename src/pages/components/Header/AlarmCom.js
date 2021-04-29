import React, { useState, useEffect } from 'react';
import { Popover, Badge } from 'antd';
import { createFromIconfontCN, AlertOutlined } from '@ant-design/icons';
import ScrollTable from '../ScrollTable';
let firstMsg = true;
let alarmTimer = null;

const IconFont = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_2314993_bryih7jtrtn.js'
});
function AlarmCom(msg){
    const [muted, setMuted] = useState(false);
    useEffect(()=>{  
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
    return (
        <div style={{ cursor:'pointer', display:'inline-flex', alignItems:'center'  }}>
            <AlertOutlined style={{ marginRight:'6px', fontSize:'1.2rem' }} />
            <Popover content={<ScrollTable data={ msg.detail || []}/>}>
                <Badge count={msg.count} onClick={()=>{}} />
            </Popover>
            <IconFont style={{ fontSize:'1.2rem', margin:'0 10px'}} type={ muted ? 'iconsound-off' : 'iconsound'} onClick={()=>{
                setMuted(!muted);
                let audio = document.getElementById('my-audio');
                if ( muted ){
                    audio.muted = false;
                } else {
                    audio.muted = true;
                }
            }}></IconFont>
            <span style={{ margin:'0 6px' }}>|</span>
        </div>
    )
}

export default AlarmCom;