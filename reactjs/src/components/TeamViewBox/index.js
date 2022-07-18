import React, {useEffect, useState, useParams} from 'react';
import { Link } from 'react-router-dom';
import { Card, Empty, Tooltip, Skeleton } from 'antd';
import TeamService from '../../services/team/TeamService';
import { truncateText } from '../../helper/helper';
import getImage from '../../lib/getImage';

const TeamViewBox = ({ data = [] }) => {
const [stats, setTeamStats] = useState({});
const param = useParams();

useEffect(() => {
  getTeamStats();
}, []);

const getTeamStats = () => {
  TeamService.getTeamStats().then((res) => {
    console.log('Team Stats', res);
    setTeamStats(res);
  });
};
  
  return (
    <>
      {' '}
      {Object.keys(data).length ? (
        <Skeleton loading={!Object.keys(data).length}>
          <Card >
            {data.map((e, index2) => (
              <Link to={'/teamProfile/' + e.id}>
                <Card.Grid key={index2} style={{width: '20%'}}>
                  <Tooltip title={e.name}>
                    <Card key={index2} cover={<img alt="example" src={getImage(stats.profileUrl)} />} bodyStyle={{ padding: 0 }}>
                      <div style={{ width: '100%', border: '1px solid lightgray', padding: '10px' }}>{truncateText(e.name, 20)}</div>
                    </Card>
                  </Tooltip>
                </Card.Grid>
              </Link>
            ))}
          </Card>
        </Skeleton>
      ) : (
        <Empty />
      )}
    </>
  );
};
export default TeamViewBox;
