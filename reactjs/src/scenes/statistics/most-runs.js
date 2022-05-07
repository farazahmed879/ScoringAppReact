import React from 'react';
import { Card, Table } from 'antd';
const mostRuns = ({ columns = [], data = [] }) => {
  return (
    <>
      <Table columns={columns} dataSource={data} />
    </>
  );
};
export default mostRuns;
