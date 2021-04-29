import React from 'react';
import { connect } from 'dva';
import { Tree } from 'antd';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';
import ChartContainer from './ChartContainer';
import style from '../../index.less';
import product from '../../../../public/inline.png';
const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      icon:<span><EyeOutlined /><LeftOutlined /></span>,
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          disabled: true,
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              disableCheckbox: true,
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [{ title: <span style={{ color: '#1890ff' }}>sss</span>, key: '0-0-1-0' }],
        },
      ],
    },
  ];

const list = [
    { title:'物联网关', img:product },
    { title:'智能电表', img:product}
]

const machTypes = [
    { key:'total', title:'全部设备', count:30 },
    { key:'1', title:'智能电表', count:30 },
    { key:'2', title:'智能空调', count:30 },
    { key:'3', title:'智能水表', count:30 },
    { key:'4', title:'摄像头', count:30 },
    { key:'5', title:'母排温度', count:30 },
]
function Transform({ dispatch, ele_monitor, global }){
    console.log(ele_monitor);
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}>占位符</div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>硬件种类</div>
                        <div className={style['card-content']}>
                            <div className={style['list-container']}>
                                {
                                    machTypes.map((item,index)=>(
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
                <div className={style['card-container']}>
                    <div className={style['card-content']}>
                        <div className={style['inline-container']} >
                            <div className={style['inline-container-main']}>
                                {
                                    list.map((item,index)=>(
                                        <div className={style['inline-item-wrapper']}>
                                            <div className={style['inline-item']}>
                                                <div className={style['inline-item-title']}>{ item.title }</div>
                                                <div className={style['inline-item-content']}>
                                                    <div><img src={item.img} style={{ width:'30%' }} /></div>
                                                    <div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default connect(({ ele_monitor, global })=>({ ele_monitor, global }))(Transform);