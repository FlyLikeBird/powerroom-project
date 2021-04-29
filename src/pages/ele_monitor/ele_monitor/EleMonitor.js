import React from 'react';
import { connect } from 'dva';
import { Tree } from 'antd';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';
import ChartContainer from './ChartContainer';
import style from '../../index.less';
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
function EleMonitor({ dispatch, ele_monitor, global }){
    console.log(ele_monitor);
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}>
                <div className={style['card-container-wrapper']} style={{ height:'36%'}}>占位符</div>
                <div className={style['card-container-wrapper']} style={{ height:'64%'}}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>进线选择</div>
                        <div className={style['card-content']}>
                            <Tree
                                className={style['dark-theme-tree']}
                                treeData={treeData}
                                defaultExpandAll={true}
                                showIcon={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={style['right']}>
                <div className={style['card-container-wrapper']} style={{ height:'100%'}}>
                    <div className={style['card-container']}>
                        <ChartContainer data={{}} global={global} />
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default connect(({ ele_monitor, global })=>({ ele_monitor, global }))(EleMonitor);