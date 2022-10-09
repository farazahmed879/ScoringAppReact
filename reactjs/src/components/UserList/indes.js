import { List, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import getImage from '../../lib/getImage';

const UserList = ({ data = [], handleResponse, selected = 0 }) => {
  const [isHovering, setIsHovering] = useState(0);

  const handleMouseOver = (item) => {
    setIsHovering(item.id);
  };

  const handleMouseOut = () => {
    setIsHovering(0);
  };
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          style={{ cursor: 'pointer', backgroundColor: isHovering == item.id ? '#90EE90' : selected == item.id ? 'green' : '' }}
          onMouseOver={() => handleMouseOver(item)}
          onMouseOut={handleMouseOut}
          onClick={() => handleResponse(item)}
        >
          <List.Item.Meta avatar={<Avatar src={getImage(item.profileUrl)} />} title={item.name} description="Player Role" />
        </List.Item>
      )}
    />
  );
};
export default UserList;
