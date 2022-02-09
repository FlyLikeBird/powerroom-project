import React,{ useState, useEffect } from 'react';
import { Table, Pagination, Spin } from 'antd';
import style from './CustomTable.css';
import IndexStyle from '../../index.less';
let id = 0;
let timer = null;
function CustomTable({ columns, data, currentPage, total, pagesize, isLoading, size, containerWidth, onDispatch, emptyText }){
    // let pagesize = containerWidth <= 1440 ? 15 : 20;    
    // const [scrollHeight, setScrollHeight] = useState(0);  
    // useEffect(()=>{
    //     let container = document.getElementsByClassName(IndexStyle['page-container'])[0];
    //     let table = document.getElementsByClassName('ant-table-container')[0];
    //     let tableHeader = table.getElementsByClassName('ant-table-header')[0]
    //     // 异步才能正确获取table组件内部table-header的高度
    //     timer = setTimeout(()=>{
    //         // page-container总高度 - page-container的padding - card-container的padding - 日期控件的高度 - 表头的高度 - 分页符的高度
    //         let result = container.clientHeight - 28 - 28 - 38 - tableHeader.offsetHeight - 40;
    //         setScrollHeight(result);
    //     },100);
    //     function handleResize(){
    //         let container = document.getElementsByClassName(IndexStyle['page-container'])[0];
    //         let result = container.clientHeight - 28 - 28 - 38 - tableHeader.offsetHeight - 40;
    //         setScrollHeight(result);
    //     }
    //     window.addEventListener('resize', handleResize);
    //     return ()=>{
    //         window.removeEventListener('resize', handleResize);
    //         clearTimeout(timer);
    //         timer = null;
    //     }
    // },[])
    return (
            <div style={{ position:'relative' }}>
                {
                    isLoading
                    
                    ?
                    <div className={style['mask']}>
                        <Spin className={style['spin']} size='large' />
                    </div>
                    :
                    null
                }
                <Table
                    size={ size || 'small' }
                    className={style['custom-table']}
                    columns={columns}
                    dataSource={data}
                    rowKey={()=>++id}
                    pagination={
                        total > pagesize
                        ? 
                        {
                            current:currentPage,
                            total,
                            pageSize:pagesize,
                            size:'default',
                            showSizeChanger:false
                        }
                        :
                        false
                    }
                    locale={{
                        emptyText : emptyText || '暂无数据'
                    }}
                    scroll={{ 
                        x:1000
                    }}
                    onChange={(pagination)=>{
                        if ( onDispatch && typeof onDispatch === 'function' ) onDispatch(pagination.current);
                    }}
                />
            </div>
           
        
    )
}

// function areEqual(prevProps, nextProps){
//     if ( prevProps.data !== nextProps.data || prevProps.currentPage !== nextProps.currentPage  ) {
//         return false;
//     } else {
//         return true;
//     }
// }
// export default React.memo(CustomTable, areEqual);
export default CustomTable;