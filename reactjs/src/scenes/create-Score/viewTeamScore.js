import React from 'react';
import { Button } from 'antd';

const ViewTeamScore = ({ data, opemTeamScoreModal }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
      <h1>
        {data.teamId || 'N/A'} Score {data.totalScore || 'N/A'} runs in {data.overs || 'N/A'} overs and lost
        {data.wickets || 'N/A'} wickets
      </h1>
      <Button type="primary" shape="round" icon="plus" onClick={opemTeamScoreModal}>
        {Object.keys(data).length ? 'Edit Team Score' : 'Add Team Score'}
      </Button>
    </div>
  );
};
export default ViewTeamScore;
