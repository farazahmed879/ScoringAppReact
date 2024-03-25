import { Card, Row, Skeleton } from 'antd';
import React from 'react';
import getImage from '../../lib/getImage';
import ImageCard from '../ImageCard';
const ProfileHeader = ({ children, data, viewImageModal, loading }) => {
  return (
    <>
      {' '}
      <Card
        hoverable
        style={{ width: '100%', height: '200%', marginBottom: '-220px' }}
        cover={<img alt="example" src={getImage(data.profileUrl || data.url)} height={500} width={150} />}
      ></Card>
      <Row style={{ marginLeft: '20px', marginTop: '50px', display: 'flex' }}>
        <ImageCard data={data} viewImageModal={viewImageModal} />
        <Skeleton loading={loading}>
          <div style={{ marginLeft: '10px', marginTop: '5px' }}>
            <h1 style={{ color: 'white', fontSize: '33px', marginBottom: '0' }}>Name: {data.name}</h1>
            {children}
          </div>
        </Skeleton>
      </Row>
    </>
  );
};
export default ProfileHeader;
