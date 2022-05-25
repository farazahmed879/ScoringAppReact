import React from 'react';
import { Button, Table } from 'antd';

const ViewFallOfWicket = ({ data, visible }) => {
  const columns = [
    {
      title: 'One',
      dataIndex: 'first',
    },
    {
      title: 'Two',
      dataIndex: 'second',
    },
    {
      title: 'Three',
      dataIndex: 'third',
    },
    {
      title: 'Four',
      dataIndex: 'fourth',
    },
    {
      title: 'Five',
      dataIndex: 'fifth',
    },
    {
      title: 'Six',
      dataIndex: 'sixth',
    },
    {
      title: 'Seven',
      dataIndex: 'seventh',
    },
    {
      title: 'Eight',
      dataIndex: 'eight',
    },
    {
      title: 'Nine',
      dataIndex: 'ninth',
    },
    {
      title: 'Ten',
      dataIndex: 'tenth',
    },
  ];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
        <Button type="primary" shape="round" icon="plus" onClick={visible}>
          {Object.keys(data).length ? 'Edit Fall of Wickets' : 'Add Fall of Wickets'}
        </Button>
      </div>

      <Table columns={columns} dataSource={data} pagination={false} style={{ width: '100%' }} />
    </>
  );
};
export default ViewFallOfWicket;
