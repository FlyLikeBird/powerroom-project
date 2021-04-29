import React from 'react';
import { connect } from 'dva';
import { Tree } from 'antd';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';
// import ChartContainer from './ChartContainer';
import GaugeChart from '../components/GaugeChart';
import style from '../../index.less';

  const list = [
        { 
            title:'负荷', 
            child:[
                { title:'额定容量', value:500 },
                { title:'视在功率', value:300 },
                { title:'负荷率', value:100 },
                { title:'额定容量', value:500 },
            ]
        },
      { title:'功率'},
      { title:'电流、电压'},
      { title:'温度'},
      { title:'噪声'}
  ]
const treeData = [
    { title:'配电房1'},
    { title:'配电房2'},
    { title:'配电房3'},
    { title:'配电房4'},

]
function EnvMonitor({ dispatch, ele_monitor, global }){
    console.log(ele_monitor);
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}>占位符</div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>监测点</div>
                        <div className={style['card-content']}>
                            <div className={style['list-container'] + ' ' + style['inline']}>
                                    {
                                        treeData.map((item,index)=>(
                                            <div className={style['list-item']}>
                                                <div>
                                                    <EyeOutlined />{ item.title }
                                                </div>
                                                <div>{ item.count }</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                    </div>
                </div>
            </div>
            <div className={style['right']}>
                    
                <div className={style['flex-container']} style={{ height:'10%', paddingBottom:'14px' }}>
                    {
                        list.map((item,index)=>(
                            <div className={style['flex-item']}>
                                <div className={style['flex-item-content']} style={{ height:'100%'}}>
                                    <div>{ item.title }</div>
                                </div>
                            </div>
                        )) 
                    }
                </div>
                        
                <div style={{ height:'45%', paddingBottom:'14px' }}>
                    <div className={style['card-container-wrapper'] + ' ' + style['inline']}>
                        <div className={style['card-container']}>
                            <div style={{ width:'40%', height:'100%', display:'inline-block', verticalAlign:'top' }}>
                                <GaugeChart />
                            </div>
                        </div>
                    </div>
                    <div className={style['card-container-wrapper'] + ' ' + style['inline']}>
                        <div className={style['card-container']}></div>
                    </div>

                </div>
                <div className={style['card-container-wrapper']} style={{ height:'45%'}}>
                    <div className={style['card-container']}>
                        {/* <ChartContainer data={{}} global={global} /> */}
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default connect(({ ele_monitor, global })=>({ ele_monitor, global }))(EnvMonitor);