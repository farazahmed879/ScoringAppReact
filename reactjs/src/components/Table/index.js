import React from 'react';
import { Card, Empty, Table, Skeleton } from 'antd';
const CustomTable = ({ columns = [], data = [], pagination = false, handleTableChange , scroll = {} }) => {
  return (
    <Skeleton loading={!Object.keys(data).length}>
      <Table columns={columns} dataSource={data} pagination={pagination} scroll={{ scroll }} onChange={handleTableChange} />
    </Skeleton>
  );
};
export default CustomTable;
