import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Pagination, Modal } from 'antd';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';
import ChartContainer from './ChartContainer';
import style from '../../index.less';
import product from '../../../../public/inline.png';
import { IconFont } from '@/pages/components/IconFont';
import MachDetail from './MachDetail';
import CameraManager from './CameraManager';

const iconsMap = {
    'all':'iconVector-4',
    'ele':'iconVector-3',
    'switch':'iconUnion-1',
    'gas':'lala',
    'water':'lala',
    'camera':'iconVector',
    'bar_temp':'iconUnion'
};

function Transform({ dispatch, terminalMach, global }){
    const { typeList, currentType, machList, currentMach, total, isLoading, currentPage, machLoading, machDetailInfo } = terminalMach;
    let visible = Object.keys(currentMach).length ? true : false;
    let [cameraVisible, toggleCameraVisible] = useState(false);
    useEffect(()=>{
        dispatch({ type:'terminalMach/init'});
        return ()=>{
            dispatch({ type:'terminalMach/cancelAll'});
        }
    },[])
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
                                    typeList && typeList.length 
                                    ?
                                    typeList.map((item,index)=>(
                                        <div className={ currentType.key === item.key ? style['list-item'] + ' ' + style['selected']: style['list-item']} onClick={()=>{
                                            dispatch({ type:'terminalMach/toggleMachType', payload:item });
                                            dispatch({ type:'terminalMach/fetchSeriesMach'});
                                        }}>
                                            <div>
                                                <IconFont type={iconsMap[item.key]} style={{ fontSize:'1.2rem', marginRight:'6px' }}/>{ item.title }
                                            </div>
                                            <div>{ item.count }</div>
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
                <div className={style['card-container']}>
                    <div className={style['card-content']} style={{ height:'100%' }}>
                        <div className={style['inline-container']} >
                            <div className={style['inline-container-main']}>
                                {
                                    isLoading 
                                    ?
                                    <Spin className={style['spin']} size='large' />
                                    :
                                    machList.length 
                                    ?
                                    machList.map((item,index)=>(
                                        <div className={style['inline-item-wrapper']}>
                                            <div className={style['inline-item']} onClick={()=>{
                                                // 如果是摄像头
                                                if ( item.energy_type === 5 ){
                                                    toggleCameraVisible(true);
                                                } else {
                                                    dispatch({ type:'terminalMach/setCurrentMach', payload:item });
                                                }
                                            }}>
                                                <div className={style['inline-item-title']} style={{ padding:'0 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                                                    <div>{ item.meter_name }</div>
                                                    <div className={style['tag']} style={{ backgroundColor:item.rule_name ? '#ff2d2e' : '#01f1e3'}}>{ item.rule_name ? '异常' :'正常' }</div>
                                                </div>
                                                <div className={style['inline-item-content']}>
                                                    <div style={{ width:'40%' }}><img src={item.img_path} style={{ width:'100%' }} /></div>
                                                    {
                                                        // currentType.key === 'all' 
                                                        false
                                                        ?
                                                        <div>
                                                            <div className={style['text']}>
                                                                <span>编号:</span>
                                                                <span>{ item.register_code }</span>
                                                            </div>
                                                            <div>
                                                                <span>编号:</span>
                                                                <span>{ item.register_code }</span>
                                                            </div>
                                                            <div>
                                                                <span>编号:</span>
                                                                <span>{ item.register_code }</span>
                                                            </div>
                                                            <div>
                                                                <span>编号:</span>
                                                                <span>{ item.register_code }</span>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div>
                                                            <div className={style['text-container']}>
                                                                <span>编号:</span>
                                                                <span className={style['text']}>{ item.register_code }</span>
                                                            </div>
                                                            <div className={style['text-container']}>
                                                                <span>支路:</span>
                                                                <span className={style['text']}>{ item.branch_name }</span>
                                                            </div>
                                                            <div className={style['text-container']}>
                                                                <span>区域:</span>
                                                                <span className={style['text']}>{ item.region_name }</span>
                                                            </div>
                                                            <div className={style['text-container']}>
                                                                <span>告警:</span>
                                                                <span className={style['text']} style={{ color:'#ffa63f' }}>{ item.rule_name || '-- --' }</span>
                                                            </div>
                                                        </div>
                                                    }
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    <div className={style['empty-text']}>暂时没有这种设备</div>
                                }
                            </div>
                            {/* 分页符 */}
                            {
                                total > 12
                                ?                                
                                <Pagination className={style['custom-pagination']} pageSize={12} current={currentPage} total={total} showSizeChanger={false} onChange={page=>{
                                    dispatch({ type:'terminalMach/fetchSeriesMach', payload:{ page }});
                                }} />
                                :
                                null
                            }
                        </div>
                    </div>
                    {/* 设备详情modal */}
                    <MachDetail 
                        visible={visible}
                        machLoading={machLoading}
                        dispatch={dispatch}
                        currentMach={currentMach}
                        data={machDetailInfo}
                    /> 
                    <Modal 
                        visible={cameraVisible}
                        footer={null}
                        className={style['custom-modal']}
                        width='86vw'
                        height='86vh'
                        destroyOnClose={true}
                        onCancel={()=>{
                            toggleCameraVisible(false);
                        }}
                    >
                        <CameraManager dispatch={dispatch} />
                    </Modal>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default connect(({ terminalMach, global })=>({ terminalMach, global }))(Transform);