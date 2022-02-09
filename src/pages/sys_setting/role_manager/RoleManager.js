import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Drawer, Tree, Button } from 'antd';
import style from '../../index.less';
import CustomTable from '../../components/CustomTable';
let str = '{"data":{"user_id":35,"user_name":"feichuantest","real_name":"\u98de\u8239t","auth_type":null,"email":"123@qq.com","phone":"","password":"627295a6ada23bf36ac7ee9f62f86ef3","agent_id":null,"agent_name":null,"company_id":20,"company_name":"***","role_id":2,"open_id":null,"role_name":"\u7ba1\u7406\u8005","last_login_ip":"14.21.99.50","last_login_time":1620370243,"has_login":null,"is_admin":0,"is_actived":1,"create_time":1608600420,"is_demo":1,"token":"d359a11352c7a9b953a877d26453fe96","user_type":1,"is_show_demo":null,"show_company_name":null,"show_logo_img":null,"menuData":[{"menu_code":"global_monitor","menu_name":"\u76d1\u63a7\u9875\u9762","menu_url":"","menu_id":79,"menu_level":1,"menu_icon":"","child":[{"menu_code":"power_room","menu_name":"\u914d\u7535\u623f\u5b50\u7ad9","menu_url":"","menu_id":83,"menu_level":2,"menu_icon":""}]},{"menu_code":"energy_manage","menu_name":"\u80fd\u6e90\u6210\u672c","menu_url":"","menu_id":34,"menu_level":1,"menu_icon":"","child":[{"menu_code":"cost_trend","menu_name":"\u6210\u672c\u8d8b\u52bf","menu_url":"","menu_id":94,"menu_level":2,"menu_icon":""},{"menu_code":"energy_code_report","menu_name":"\u6284\u8868\u8bb0\u5f55","menu_url":"","menu_id":93,"menu_level":2,"menu_icon":""},{"menu_code":"energy_cost_report","menu_name":"\u6210\u672c\u62a5\u8868","menu_url":"","menu_id":36,"menu_level":2,"menu_icon":""},{"menu_code":"cost_analyz","menu_name":"\u6210\u672c\u900f\u89c6","menu_url":"","menu_id":37,"menu_level":2,"menu_icon":""},{"menu_code":"ele_cost","menu_name":"\u7535\u8d39\u6210\u672c","menu_url":"","menu_id":76,"menu_level":2,"menu_icon":""}]},{"menu_code":"energy_eff","menu_name":"\u80fd\u6e90\u6548\u7387","menu_url":"","menu_id":43,"menu_level":1,"menu_icon":"","child":[{"menu_code":"eff_trend","menu_name":"\u80fd\u6548\u8d8b\u52bf","menu_url":"","menu_id":95,"menu_level":2,"menu_icon":""},{"menu_code":"energy_eff_quota","menu_name":"\u80fd\u8017\u5b9a\u989d","menu_url":"","menu_id":45,"menu_level":2,"menu_icon":""},{"menu_code":"energy_eff_chart","menu_name":"\u80fd\u6548\u56fe\u8868","menu_url":"","menu_id":46,"menu_level":2,"menu_icon":""},{"menu_code":"useless_manage","menu_name":"\u65e0\u529f\u76d1\u6d4b","menu_url":"","menu_id":50,"menu_level":2,"menu_icon":""},{"menu_code":"demand_manage","menu_name":"\u9700\u91cf\u7ba1\u7406","menu_url":"","menu_id":77,"menu_level":2,"menu_icon":""}]},{"menu_code":"alarm_manage","menu_name":"\u62a5\u8b66\u76d1\u63a7","menu_url":"","menu_id":51,"menu_level":1,"menu_icon":"","child":[{"menu_code":"alarm_trend","menu_name":"\u544a\u8b66\u8d8b\u52bf","menu_url":"","menu_id":96,"menu_level":2,"menu_icon":""},{"menu_code":"alarm_execute","menu_name":"\u544a\u8b66\u5217\u8868","menu_url":"","menu_id":57,"menu_level":2,"menu_icon":""},{"menu_code":"ele_alarm","menu_name":"\u7535\u6c14\u5b89\u5168\u76d1\u63a7","menu_url":"","menu_id":87,"menu_level":2,"menu_icon":""},{"menu_code":"over_alarm","menu_name":"\u6307\u6807\u5b89\u5168\u76d1\u63a7","menu_url":"","menu_id":88,"menu_level":2,"menu_icon":""},{"menu_code":"link_alarm","menu_name":"\u901a\u8baf\u5f02\u5e38\u76d1\u63a7","menu_url":"","menu_id":89,"menu_level":2,"menu_icon":""},{"menu_code":"alarm_setting","menu_name":"\u544a\u8b66\u8bbe\u7f6e","menu_url":"","menu_id":53,"menu_level":2,"menu_icon":""}]},{"menu_code":"analyze_manage","menu_name":"\u5206\u6790\u4e2d\u5fc3","menu_url":"","menu_id":72,"menu_level":1,"menu_icon":"","child":[{"menu_code":"energy_phase","menu_name":"\u80fd\u6e90\u8d8b\u52bf","menu_url":"","menu_id":68,"menu_level":2,"menu_icon":""},{"menu_code":"saveSpace","menu_name":"\u8282\u80fd\u7b56\u7565","menu_url":"","menu_id":80,"menu_level":2,"menu_icon":""},{"menu_code":"analyzeReport","menu_name":"\u8bca\u65ad\u62a5\u544a","menu_url":"","menu_id":81,"menu_level":2,"menu_icon":""}]},{"menu_code":"info_manage_menu","menu_name":"\u4fe1\u606f\u7ba1\u7406","menu_url":"","menu_id":23,"menu_level":1,"menu_icon":"","child":[{"menu_code":"incoming_line","menu_name":"\u8fdb\u7ebf\u7ba1\u7406","menu_url":"","menu_id":70,"menu_level":2,"menu_icon":""},{"menu_code":"quota_manage","menu_name":"\u5b9a\u989d\u7ba1\u7406","menu_url":"","menu_id":25,"menu_level":2,"menu_icon":""},{"menu_code":"manual_input","menu_name":"\u624b\u5de5\u586b\u62a5","menu_url":"","menu_id":26,"menu_level":2,"menu_icon":""},{"menu_code":"free_manage","menu_name":"\u8ba1\u8d39\u7ba1\u7406","menu_url":"","menu_id":27,"menu_level":2,"menu_icon":""},{"menu_code":"field_manage","menu_name":"\u7ef4\u5ea6\u7ba1\u7406","menu_url":"","menu_id":24,"menu_level":2,"menu_icon":""}]},{"menu_code":"system_config","menu_name":"\u7cfb\u7edf\u914d\u7f6e","menu_url":"","menu_id":65,"menu_level":1,"menu_icon":"","child":[{"menu_code":"role_manage","menu_name":"\u89d2\u8272\u6743\u9650","menu_url":"","menu_id":82,"menu_level":2,"menu_icon":""},{"menu_code":"user_manage","menu_name":"\u7528\u6237\u7ba1\u7406","menu_url":"","menu_id":66,"menu_level":2,"menu_icon":""},{"menu_code":"system_log","menu_name":"\u7cfb\u7edf\u65e5\u5fd7","menu_url":"","menu_id":67,"menu_level":2,"menu_icon":""}]}],"buttonData":[],"companys":[{"company_id":20,"company_name":"***","company_address":"\u534e\u6e2f\u9547\u5cb3\u53e4\u8def1\u53f7","agent_name":"\u534e\u7fca\u670d\u52a1\u5546","agent_id":1,"link_phone":"","account":"","company_area":null,"worker_number":null,"lng":"119.870347","lat":"32.609614","create_time":1606993138,"logo_path":"\/uploads\/images\/banner\/20210408\/2021040809034229616.png","province":"\u6c5f\u82cf\u7701","city":"\u6cf0\u5dde\u5e02","area":"\u6d77\u9675\u533a","tag":"5"}]},"code":"0","count":0,"msg":"ok"}';

function RoleManager({ dispatch, global, system }){
    const { roleList } = system;
    let { userAuthed } = global;
    const [currentRole, setCurrentRole] = useState(null);
    const columns = [
        { title:'角色类型', dataIndex:'role_name', key:'type'},
        {
            title:'操作',
            key:'action',
            render:()=>{
                return <div><a>编辑</a></div>
            }
        }
    ];
    useEffect(()=>{
        if ( userAuthed ){
            dispatch({ type:'system/fetchRoleList'});
        }
    },[userAuthed])
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'system/cancelRoleList'});
        }
    },[])
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}></div>
            <div className={style['right']}>
                <div className={style['card-container']} style={{ paddingTop:'14px' }}>
                    <CustomTable 
                        columns={columns}
                        data={roleList}
                    />
                </div>
            </div>
            <Drawer
                title={`${currentRole && currentRole.role_name}-权限设置`}
                placement="right"
                closable={false}
                width="40%"
                onClose={()=>setCurrentRole(null) }
                visible={ currentRole ? true : false }
                footer={(
                    <div style={{ padding:'10px' }}>
                        <Button type='primary' style={{ marginRight:'10px' }} onClick={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'userList/editRolePermission', payload:{ currentRole, menu_data:selectedKeys, resolve, reject }})
                            })
                            .then(msg=>{
                                message.info(msg);
                                toggleVisible(false);
                            })
                            .catch(msg=>message.error(msg))
                        }}>确定</Button>
                        <Button onClick={()=>toggleVisible(false)}>取消</Button>
                    </div>
                )}
            >   
                {/* <Tree
                    className={style['tree-container']}
                    checkable
                    checkStrictly
                    defaultExpandAll
                    treeData={userMenu}
                    checkedKeys={selectedKeys}
                    onCheck={( checkedKeys , { checkedNodes, node, checked })=>{
                        let temp = checkedKeys.checked;
                        if ( node.children ){
                            if ( checked ){
                                temp = temp.concat(node.children.map(i=>i.key));
                            } else {
                                node.children.map(i=>{
                                    let index = temp.indexOf(i.key);
                                    if ( index >= 0 ) temp.splice(index, 1);
                                })
                            }
                        }
                        dispatch({ type:'userList/setPermission', payload:{ selectedKeys:temp }});
                    }}
                />        */}
            </Drawer>
        </div>
    )
}

export default connect(({ global, system })=>({ global, system }))(RoleManager);
