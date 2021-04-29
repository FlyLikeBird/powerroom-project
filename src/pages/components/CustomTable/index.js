import React from 'react';
import { Table } from 'antd';
import style from './CustomTable.css';
function CustomTable({ columns, data, size }){
    return (
        <Table
            size={ size || 'small' }
            className={style['custom-table']}
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    )
}

export default CustomTable;