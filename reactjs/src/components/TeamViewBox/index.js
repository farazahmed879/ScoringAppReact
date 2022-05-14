import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Empty, Tooltip, Skeleton } from 'antd';
import AppConsts from '../../lib/appconst';
import { truncateText } from '../../helper/helper';

const TeamViewBox = ({ data = [] }) => {
  return (
    <>
      {' '}
      {Object.keys(data).length ? (
        <Skeleton loading={!Object.keys(data).length}>
          <Card>
            {data.map((e, index2) => (
              <Link to={'/teamProfile/' + e.id}>
                <Card.Grid key={index2}>
                  <Tooltip title={e.name}>
                    <Card key={index2} cover={<img alt="example" src={AppConsts.dummyImage} />} bodyStyle={{ padding: 0 }}>
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
