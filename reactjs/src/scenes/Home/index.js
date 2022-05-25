import { Card, PageHeader, Tag } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <Card>
      <PageHeader
        title="ScoreExec"
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        subTitle="Next Stop Cricket"
        tags={<Tag color="blue">Running</Tag>}

        avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
      >
        {/* <Content
          extraContent={<img src="https://gw.alipayobjects.com/mdn/mpaas_user/afts/img/A*KsfVQbuLRlYAAAAAAAAAAABjAQAAAQ/original" alt="content" />}
        >
          {content}
        </Content> */}
      </PageHeader>
      ,
    </Card>
  );
  {
    /* return <Card>!Home Component <Link to={'/user/login'}>Login</Link> </Card> */
  }
};
export default Home;
