import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Icon, PageHeader, Divider, Tag } from 'antd';
import MostRuns from './most-runs';
import './index.less';
import statisticsService from '../../services/statistics/statistics.service';
import statsConst from '../../lib/statsConst';
const StatsDashboard = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');

  let columns = [];

  useEffect(() => {
    if (filter == statsConst.mostRuns) mostRuns();
    if (filter == statsConst.mostWickets) mostWickets();
    if (filter == statsConst.mostFifties) mostFifties();
    if (filter == statsConst.mostCenturies) mostCenturies();
    if (filter == statsConst.mostFours) mostFours();
    if (filter == statsConst.mostSixes) mostSixes();
    if (filter == statsConst.mostCatches) mostCatches();
    if (filter == statsConst.mostStumps) mostStumps();
  }, [filter]);

  const handleSubmit = (e) => {
    debugger;
    setFilter(e);
  };

  const mostRuns = () => {
    let req = {};
    statisticsService.mostRuns(req).then((res) => {
      console.log('Grounds', res);
      setData(res);
      columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          render: (tags) => (
            <span>
              {tags.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a>Invite {record.name}</a>
              <Divider type="vertical" />
              <a>Delete</a>
            </span>
          ),
        },
      ];
    });
  };

  const mostWickets = () => {
    let req = {};
    statisticsService.mostWickets(req).then((res) => {
      console.log('Grounds', res);
      setData(res);
      columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          render: (tags) => (
            <span>
              {tags.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a>Invite {record.name}</a>
              <Divider type="vertical" />
              <a>Delete</a>
            </span>
          ),
        },
      ];
    });
  };

  const mostFifties = () => {
    let req = {};
    statisticsService.mostFifties(req).then((res) => {
      console.log('mostFifties', res);
      setData(res);
      columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          render: (tags) => (
            <span>
              {tags.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a>Invite {record.name}</a>
              <Divider type="vertical" />
              <a>Delete</a>
            </span>
          ),
        },
      ];
    });
  };

  const mostCenturies = () => {
    let req = {};
    statisticsService.mostCenturies(req).then((res) => {
      console.log('mostCenturies', res);
      setData(res);
      columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          render: (tags) => (
            <span>
              {tags.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a>Invite {record.name}</a>
              <Divider type="vertical" />
              <a>Delete</a>
            </span>
          ),
        },
      ];
    });
  };

  const mostFours = () => {
    let req = {};
    statisticsService.mostFours(req).then((res) => {
      console.log('mostFours', res);
      setData(res);
      columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          render: (tags) => (
            <span>
              {tags.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a>Invite {record.name}</a>
              <Divider type="vertical" />
              <a>Delete</a>
            </span>
          ),
        },
      ];
    });
  };

  const mostSixes = () => {
    let req = {};
    statisticsService.mostSixes(req).then((res) => {
      console.log('mostSixes', res);
      setData(res);
      columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          render: (tags) => (
            <span>
              {tags.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a>Invite {record.name}</a>
              <Divider type="vertical" />
              <a>Delete</a>
            </span>
          ),
        },
      ];
    });
  };

  const mostCatches = () => {
    let req = {};
    statisticsService.mostCatches(req).then((res) => {
      console.log('mostCatches', res);
      setData(res);
      columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          render: (tags) => (
            <span>
              {tags.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a>Invite {record.name}</a>
              <Divider type="vertical" />
              <a>Delete</a>
            </span>
          ),
        },
      ];
    });
  };

  const mostStumps = () => {
    let req = {};
    statisticsService.mostStumps(req).then((res) => {
      console.log('mostStumps', res);
      setData(res);
      columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          render: (tags) => (
            <span>
              {tags.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a>Invite {record.name}</a>
              <Divider type="vertical" />
              <a>Delete</a>
            </span>
          ),
        },
      ];
    });
  };

  return (
    <Card>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
          marginBottom: '10px',
        }}
        title={'Statistics'}
      />
      <Row gutter={16}>
        <Col
          className={'dashboardCard'}
          xs={{ offset: 1, span: 22 }}
          sm={{ offset: 1, span: 22 }}
          md={{ offset: 1, span: 11 }}
          lg={{ offset: 1, span: 11 }}
          xl={{ offset: 0, span: 6 }}
          xxl={{ offset: 0, span: 6 }}
        >
          <Card
            className={'dasboardCard-task'}
            bodyStyle={{ padding: 10, cursor: 'pointer' }}
            loading={false}
            bordered={false}
            onClick={() => handleSubmit(statsConst.mostRuns)}
          >
            <Col span={8}>
              <Icon className={'dashboardCardIcon'} type="check" />
            </Col>
            <Col span={16}>
              <p className={'dashboardCardName'}>Most Runs</p>
              <label className={'dashboardCardCounter'}>125</label>
            </Col>
          </Card>
        </Col>
        <Col
          className={'dashboardCard'}
          xs={{ offset: 1, span: 22 }}
          sm={{ offset: 1, span: 22 }}
          md={{ offset: 1, span: 11 }}
          lg={{ offset: 1, span: 11 }}
          xl={{ offset: 0, span: 6 }}
          xxl={{ offset: 0, span: 6 }}
        >
          <Card onClick={() => handleSubmit(statsConst.mostWickets)} className={'dasboardCard-ticket'} bodyStyle={{ padding: 10, cursor: 'pointer' }} loading={false} bordered={false}>
            <Col span={8}>
              <Icon className={'dashboardCardIcon'} type="question" />
            </Col>
            <Col span={16}>
              <p className={'dashboardCardName'}>Most Wickets</p>
              <label className={'dashboardCardCounter'}>257</label>
            </Col>
          </Card>
        </Col>
        <Col
          className={'dashboardCard'}
          xs={{ offset: 1, span: 22 }}
          sm={{ offset: 1, span: 22 }}
          md={{ offset: 1, span: 11 }}
          lg={{ offset: 1, span: 11 }}
          xl={{ offset: 0, span: 6 }}
          xxl={{ offset: 0, span: 6 }}
        >
          <Card onClick={() => handleSubmit(statsConst.mostFifties)} className={'dasboardCard-comment'} bodyStyle={{ padding: 10, cursor: 'pointer' }} loading={false} bordered={false}>
            <Col span={8}>
              <Icon className={'dashboardCardIcon'} type="message" />
            </Col>
            <Col span={16}>
              <p className={'dashboardCardName'}>Most 50s</p>
              <label className={'dashboardCardCounter'}>243</label>
            </Col>
          </Card>
        </Col>
        <Col
          className={'dashboardCard'}
          xs={{ offset: 1, span: 22 }}
          sm={{ offset: 1, span: 22 }}
          md={{ offset: 1, span: 11 }}
          lg={{ offset: 1, span: 11 }}
          xl={{ offset: 0, span: 6 }}
          xxl={{ offset: 0, span: 6 }}
        >
          <Card  onClick={() => handleSubmit(statsConst.mostCenturies)} className={'dasboardCard-visitor'} bodyStyle={{ padding: 10, cursor: 'pointer' }} loading={false} bordered={false}>
            <Col span={8}>
              <Icon className={'dashboardCardIcon'} type="user-add" />
            </Col>
            <Col span={16}>
              <p className={'dashboardCardName'}>Most Centuries</p>
              <label className={'dashboardCardCounter'}>1225</label>
            </Col>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }} gutter={16}>
        <Col
          className={'dashboardCard'}
          xs={{ offset: 1, span: 22 }}
          sm={{ offset: 1, span: 22 }}
          md={{ offset: 1, span: 11 }}
          lg={{ offset: 1, span: 11 }}
          xl={{ offset: 0, span: 6 }}
          xxl={{ offset: 0, span: 6 }}
        >
          <Card onClick={() => handleSubmit(statsConst.mostFours)} className={'dasboardCard-task'} bodyStyle={{ padding: 10, cursor: 'pointer' }} loading={false} bordered={false}>
            <Col span={8}>
              <Icon className={'dashboardCardIcon'} type="check" />
            </Col>
            <Col span={16}>
              <p className={'dashboardCardName'}>Most 4s</p>
              <label className={'dashboardCardCounter'}>125</label>
            </Col>
          </Card>
        </Col>
        <Col
          className={'dashboardCard'}
          xs={{ offset: 1, span: 22 }}
          sm={{ offset: 1, span: 22 }}
          md={{ offset: 1, span: 11 }}
          lg={{ offset: 1, span: 11 }}
          xl={{ offset: 0, span: 6 }}
          xxl={{ offset: 0, span: 6 }}
        >
          <Card onClick={() => handleSubmit(statsConst.mostSixes)} className={'dasboardCard-task'} bodyStyle={{ padding: 10, cursor: 'pointer' }} loading={false} bordered={false}>
            <Col span={8}>
              <Icon className={'dashboardCardIcon'} type="check" />
            </Col>
            <Col span={16}>
              <p className={'dashboardCardName'}>Most 6s</p>
              <label className={'dashboardCardCounter'}>125</label>
            </Col>
          </Card>
        </Col>
        <Col
          className={'dashboardCard'}
          xs={{ offset: 1, span: 22 }}
          sm={{ offset: 1, span: 22 }}
          md={{ offset: 1, span: 11 }}
          lg={{ offset: 1, span: 11 }}
          xl={{ offset: 0, span: 6 }}
          xxl={{ offset: 0, span: 6 }}
        >
          <Card onClick={() => handleSubmit(statsConst.mostCatches)} className={'dasboardCard-ticket'} bodyStyle={{ padding: 10, cursor: 'pointer' }} loading={false} bordered={false}>
            <Col span={8}>
              <Icon className={'dashboardCardIcon'} type="question" />
            </Col>
            <Col span={16}>
              <p className={'dashboardCardName'}>Most Catches</p>
              <label className={'dashboardCardCounter'}>257</label>
            </Col>
          </Card>
        </Col>
        <Col
          className={'dashboardCard'}
          xs={{ offset: 1, span: 22 }}
          sm={{ offset: 1, span: 22 }}
          md={{ offset: 1, span: 11 }}
          lg={{ offset: 1, span: 11 }}
          xl={{ offset: 0, span: 6 }}
          xxl={{ offset: 0, span: 6 }}
        >
          <Card onClick={() => handleSubmit(statsConst.mostStumps)} className={'dasboardCard-comment'} bodyStyle={{ padding: 10, cursor: 'pointer' }} loading={false} bordered={false}>
            <Col span={8}>
              <Icon className={'dashboardCardIcon'} type="message" />
            </Col>
            <Col span={16}>
              <p className={'dashboardCardName'}>Most Stumps</p>
              <label className={'dashboardCardCounter'}>243</label>
            </Col>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }} gutter={16}>
        <MostRuns columns={columns} data={data}></MostRuns>
      </Row>
    </Card>
  );
};
export default StatsDashboard;
