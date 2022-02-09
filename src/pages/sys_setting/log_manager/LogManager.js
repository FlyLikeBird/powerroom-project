import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import style from '../../index.less';
import CustomTable from '../../components/CustomTable';

const buttons = [
    { title:'登录日志', code:'login'},
    { title:'操作日志', code:'operation' }
];
function LogManager({ dispatch, system }){
    const { logList, total, currentPage } = system;
    const [logType, toggleLogType]  = useState('login');
    const columns = [
        {
            title:'日志类型',
            dataIndex:'log_type',
            render:(text)=>(
                <span>{ text == '1' ? '操作日志' : '登录日志'}</span>
            )
        },
        {
            title:'登录用户',
            dataIndex:'action_user'
        },
        {
            title:'登录IP',
            dataIndex:'ip',
        },
        // {
        //     title:'所属公司',
        //     dataIndex:'company_id',
        //     render:(text)=>{
        //         let filterCompany = companyList.filter(i=>i.company_id == text)[0];
        //         return <div>{ filterCompany ? filterCompany.company_name : '' }</div>
        //     }
        // },
        {
            title:'操作行为',
            dataIndex:'action_desc'
        },
        {
            title:'登录时间',
            dataIndex:'action_time'
        }
    ];
    
    useEffect(()=>{
        return ()=>[
            dispatch({ type:'system/cancelLogList'})
        ]
    },[])
    useEffect(()=>{
        dispatch({ type:'system/fetchLogList', payload:{ logType, page:null }});
    },[logType])
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}></div>
            <div className={style['right']}>
                <div className={style['card-container']}>
                    <div className={style['button-group-container']} style={{ marginBottom:'14px' }}>
                        {
                            buttons.map((item,index)=>(
                                <div key={index} className={ item.code === logType ? style['button-group-item'] + ' ' + style['selected'] : style['button-group-item']} onClick={e=>{
                                    toggleLogType(item.code);
                                }}>{ item.title }</div>
                            ))
                        }
                    </div>
                    <CustomTable
                        columns={columns}
                        data={logList}
                        total={total}
                        currentPage={currentPage}
                        onDispatch={page=>{
                            dispatch({ type:'system/fetchLogList', payload:{ logType, page }});
                        }}
                    />
                </div>
            </div>

        </div>
    )
}

export default connect(({ system })=>({ system }))(LogManager);
