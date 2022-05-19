import React from 'react';
import { Tooltip, Card, Empty, Tag, Skeleton } from 'antd';
import { truncateText } from '../../helper/helper';
import moment from 'moment';
const ViewMatchBox = ({ data = [] }) => {
  return (
    <>
      {Object.keys(data).length ? (
        <Skeleton loading={!Object.keys(data).length}>
          <Card>
            {data.map((e, index2) => (
              <Card.Grid key={index2}>
                <Card title={e.tournament} key={index2} hoverable={false}>
                  <div style={{ margin: '10px' }}>
                    <Tag color="red">
                      {e.ground || 'N/A'} : {moment(e.date).format('MM/DD/YYYY') || 'N/A'}
                    </Tag>
                    <Tooltip title={e.team1}>
                      <h2>
                        {truncateText(e.team1, 20)} : {e.team1Score + '/' + e.team1Wickets}
                      </h2>
                    </Tooltip>

                    <h3>vs</h3>
                    <Tooltip title={e.team2}>
                      <h2>
                        {truncateText(e.team2, 20)} : {e.team2Score + '/' + e.team2Wickets}
                      </h2>
                    </Tooltip>
                  </div>
                  <div style={{ width: '100%', border: '1px solid lightgray', padding: '10px' }}>Man of the match: {e.mom}</div>
                </Card>
              </Card.Grid>
            ))}
          </Card>
        </Skeleton>
      ) : (
        <Empty />
      )}
    </>
  );
};
export default ViewMatchBox;
