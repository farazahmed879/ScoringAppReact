import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Card, Empty, Tooltip, Skeleton } from 'antd';
import playerService from '../../services/player/playerService';
import { truncateText } from '../../helper/helper';
import getImage from '../../lib/getImage';

const PlayerViewBox = ({ data = [] }) => {
  return (
    <>
      {Object.keys(data).length ? (
        <Skeleton loading={!Object.keys(data).length}>
          <Card key={data.id}>
            {data.map((e, index2) => (
              <Link to={'/playerProfile/' + e.id}>
                <Card.Grid key={index2} style={{width: '20%'}}>
                  <Tooltip title={e.name}>
                    <Card key={index2} cover={<img alt="example" src={getImage(e.url)} />} bodyStyle={{ padding: 0 }}>
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
export default PlayerViewBox;
