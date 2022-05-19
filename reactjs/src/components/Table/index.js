import React from 'react';
import { Card, Empty, Table, Skeleton } from 'antd';
const CustomTable = ({ columns = [], data = [], pagination = false, handleTableChange, scroll = {}, loading = true }) => {
  console.log('data', data);
  console.log(',columns', columns);
  return (
    <Skeleton loading={loading}>
      <Table columns={columns} dataSource={data} pagination={pagination} scroll={{ scroll }} onChange={handleTableChange} />
    </Skeleton>
  );
};
export default CustomTable;
