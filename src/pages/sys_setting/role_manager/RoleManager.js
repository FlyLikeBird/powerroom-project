import { dynamic } from 'umi';
import style from '../../index.less';
import CustomTable from '../../components/CustomTable';
function RoleManager(){
    const columns = [
        { title:'角色类型', dataIndex:'type', key:'type'},
        {
            title:'操作',
            key:'action',
            render:()=>{
                return <div><a>编辑</a></div>
            }
        }
    ];
    const data = [
        { type:'决策者' },
        { type:'管理者' },
        { type:'使用者' },

    ]
    return (
        <div style={{ height:'100%' }}>
            <div className={style['left']}></div>
            <div className={style['right']}>
                <div className={style['card-container']}>
                    <CustomTable 
                        columns={columns}
                        data={data}
                    />
                </div>
            </div>

        </div>
    )
}

export default RoleManager;
