import { Icon } from 'antd';
import React from 'react';
import getImage from '../../lib/getImage';
import './style.css';
const ImageCard = ({ data, viewImageModal }) => {
  return (
    <>
      {' '}
      {
        <div>
          <div className="img-wrapper">
            <img className="blur" alt="example" src={getImage(data.profileUrl || data.url)} height={150} width={150} />
            <div className="content fade">
              <Icon type="eye" onClick={() => viewImageModal(data)} style={{ curson: 'pointer' }} />
            </div>
          </div>
        </div>
      }
    </>
  );
};
export default ImageCard;
