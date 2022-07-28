import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Empty, Tooltip, Skeleton } from 'antd';
import AppConsts from '../../lib/appconst';
import { truncateText } from '../../helper/helper';
import getImage from '../../lib/getImage';
import ImageCard from '../ImageCard';
import ViewImage from '../ViewImage';

const ViewGallery = ({ data = [] }) => {
  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const handlePreviewCancel = () => {
    setPreview(!preview);
  };

  const viewImageModal = (file) => {
    debugger;
    if (Object.keys(file).length) {
      setPreviewImage(file.profileUrl || file.url);
    }
    setPreview(true);
  };
  return (
    <>
      <Card>
        {data.map((e, index2) => (
          <Card.Grid style={{ width: '20%', padding: '10px' }}>
            {/* <Card cover={<img alt="example" src={getImage(e.url)} />} bodyStyle={{ padding: 0 }}></Card> */}
            <ImageCard data={e} viewImageModal={viewImageModal} />
          </Card.Grid>
        ))}
        <ViewImage preview={preview} previewImage={previewImage} handlePreviewCancel={handlePreviewCancel} />
      </Card>
    </>
  );
};
export default ViewGallery;
