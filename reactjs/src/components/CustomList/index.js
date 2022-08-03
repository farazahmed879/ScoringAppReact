import { Avatar, Button, List, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import CustomInput from '../Input';
const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;



const CustomList = ({title, list, initLoading, handleChange}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
 console.log('list ' ,list);
//   const onLoadMore = () => {
//     setLoading(true);
//     setList(
//       data.concat(
//         [...new Array(count)].map(() => ({
//           loading: true,
//           name: {},
//           picture: {},
//         })),
//       ),
//     );
//     fetch(fakeDataUrl)
//       .then((res) => res.json())
//       .then((res) => {
//         const newData = data.concat(res.results);
//         setData(newData);
//         setList(newData);
//         setLoading(false); // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
//         // In real scene, you can using public method of react-virtualized:
//         // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized

//         window.dispatchEvent(new Event('resize'));
//       });
//   };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        {/* <Button onClick={onLoadMore}>loading more</Button> */}
      </div>
    ) : null;
  return (
    <>
    <div>
        {title}
    </div>
    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={loadMore}
      dataSource={list}
      renderItem={(item) => (
        <List.Item
          actions={[<CustomInput type={"checkbox"} handleChange={handleChange} stateKey={item.id}/>]}
        >
          <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
              avatar={<Avatar src={item.picture.large} />}
              title={item.name?.title}
              description=""
            />
            <div>{item.playerRole}</div>
          </Skeleton>
        </List.Item>
      )}
    />
    </>
  );
};

export default CustomList;