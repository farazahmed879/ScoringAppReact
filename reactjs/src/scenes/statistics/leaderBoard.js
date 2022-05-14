import React from 'react';
import { Radio } from 'antd';
import CustomTable from '../../components/Table';
const LeaderBoard = ({ columns, data, paggination }) => {
    
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <Radio.Group defaultValue="a" buttonStyle="solid" style={{display: 'flex', justifyContent: 'space-between', margin: '20px'}}>
          <Radio.Button value="a">Most Runs</Radio.Button>
          <Radio.Button value="b">Most Wickets</Radio.Button>
          <Radio.Button value="c">Most 100s</Radio.Button>
          <Radio.Button value="d">Most 50s</Radio.Button>
          <Radio.Button value="e">Most Catches</Radio.Button>
          <Radio.Button value="f">Most Stumps</Radio.Button>
          <Radio.Button value="g">Most 4s</Radio.Button>
          <Radio.Button value="h">Most 6s</Radio.Button>
        </Radio.Group>
      </div>
      <CustomTable columns={columns} data={data} paggination={paggination}></CustomTable>;
    </>
  );
};
export default LeaderBoard;
