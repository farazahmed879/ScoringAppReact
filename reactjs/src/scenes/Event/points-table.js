import { Card, Col, Empty, PageHeader, Row, Tag } from 'antd';
import { min } from 'lodash';
import React from 'react';

const style = {
  marginTop: '50px',
  marginLeft: '100px',
  marginRight: '100px',
};
const PointsTable = ({ data = [] }) => {

  const isHeading = (data = []) => {
    let isMatchFound = false;
    data &&
      data.length > 0 &&
      data.forEach((group, index) => {
        group &&
          group.length > 0 &&
          group.pointsTables.forEach((match, index2) => {
            if (match) isMatchFound = true;
            return isMatchFound;
          });
      });
    return isMatchFound;
  };

  return (
    <Card style={style}>
      {data.length > 0 && isHeading(data) ? (
        <>
          <Row>
            <Col span={12}>
              <h2></h2>
            </Col>
            <Col span={2}>
              <h1>P</h1>
            </Col>
            <Col span={2}>
              <h1>W</h1>
            </Col>
            <Col span={2}>
              <h1>L</h1>
            </Col>
            <Col span={2}>
              <h1>T</h1>
            </Col>
            <Col span={2}>
              <h1>PTS</h1>
            </Col>
            <Col span={2}>
              <h1>NRR</h1>
            </Col>
          </Row>
          {data.map((group, index) => (
            <>
              {group && group.length > 0 ? (
                <>
                  {' '}
                  <div key={index}>
                    <Tag key={index} color="volcano">
                      {'Group-' + ++index}
                    </Tag>
                    <>
                      <hr />
                      {group.pointsTables.map((a, index) => (
                        <div key={index}>
                          <Row key={index}>
                            <Col span={12}>
                              <h1 style={{ marginBottom: '0' }}>{a.playerName}</h1>
                              <h1>{a.team || '-'}</h1>
                            </Col>
                            <Col span={2}>
                              <h1>{a.played || '-'}</h1>
                            </Col>
                            <Col span={2}>
                              <h1>{a.won || '-'}</h1>
                            </Col>
                            <Col span={2}>
                              <h1>{a.lost || '-'}</h1>
                            </Col>
                            <Col span={2}>
                              <h1>{a.tie || '-'}</h1>
                            </Col>
                            <Col span={2}>
                              <h1>{a.points || '-'}</h1>
                            </Col>
                            <Col span={2}>
                              <h1>{a.runRate || '-'}</h1>
                            </Col>
                          </Row>
                          <hr />
                        </div>
                      ))}
                    </>
                  </div>
                </>
              ) : null}
            </>
          ))}
        </>
      ) : (
        <Empty />
      )}
    </Card>
  );
};
export default PointsTable;
