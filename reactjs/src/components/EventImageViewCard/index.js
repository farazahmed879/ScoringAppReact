import { Card, Empty, Tooltip } from 'antd';
import Meta from 'antd/lib/card/Meta';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import getImage from '../../lib/getImage';
const EventImageViewCard = ({ eventList = [] }) => {
  return (
    <Card>
      <div style={{ display: 'flex', margin: '10px' }}>
        {eventList.map((e, index) => (
          <Tooltip title={e.name} key={index}>
            <Link to={'/eventProfile/' + e.id}>
              <Card hoverable style={{ width: 200, margin: '10px' }} cover={<img alt="example" src={getImage(e.profileUrl || e.url)} />}>
                <Meta title={e.name} description={moment(e.startDate).format('Do MMMM YYYY') + ' To ' + moment(e.endDate).format(' Do MMMM YYYY')} />
              </Card>
            </Link>
          </Tooltip>
        ))}
      </div>
    </Card>
  );
};
export default EventImageViewCard;
