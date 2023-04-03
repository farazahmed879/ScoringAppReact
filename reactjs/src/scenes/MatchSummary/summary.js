import React from 'react';
import { Col, PageHeader, Row, Skeleton, Tag } from 'antd';

const Summary = ({
  loading = false,
  team1Score = {},
  team2Score = {},
  firstInningTop3Batsman = [],
  firstInningTop3Bowler = [],
  secondInningTop3Batsman = [],
  secondInningTop3Bowler = [],
  matchDetails = {},
  isShowResult = false
}) => {
  return (
    <Skeleton loading={loading}>
      <Row style={{ textAlign: 'left', marginLeft: '15%', marginRight: '15%' }}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          title={team1Score.name + ' - ' + team1Score.score + '/' + team1Score.wickets + '(' + team1Score.overs + ')'}
        />

        <Col span={12} style={{ padding: '10px' }}>
          {firstInningTop3Batsman.map((data, index) => (
            <Row key={index}>
              <Col span={20}>
                <h1>{data.playerName}</h1>
              </Col>
              <Col span={4}>
                <h1>
                  {data.runs} ({data.balls})
                </h1>
              </Col>
            </Row>
          ))}
        </Col>
        <Col span={12} style={{ padding: '10px' }}>
          {firstInningTop3Bowler.map((data, index) => (
            <Row key={index}>
              <Col span={20}>
                <h1>{data.playerName || '-'}</h1>
              </Col>
              <Col span={4}>
                <h1>
                  {data.wickets || '-'}/{data.runs || '-'} ({data.overs || '-'})
                </h1>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
      <Row style={{ textAlign: 'left', marginLeft: '15%', marginRight: '15%', marginTop: '20px' }}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          title={team2Score.name + ' - ' + team2Score.score + '/' + team2Score.wickets + '(' + team2Score.overs + ')'}
        />
        <Col span={12} style={{ padding: '10px' }}>
          {secondInningTop3Batsman.map((data, index) => (
            <Row key={index}>
              <Col span={20}>
                <h1>{data.playerName}</h1>
              </Col>
              <Col span={4}>
                <h1>
                  {data.runs} ({data.balls})
                </h1>
              </Col>
            </Row>
          ))}
        </Col>
        <Col span={12} style={{ padding: '10px' }}>
          {secondInningTop3Bowler.map((data, index) => (
            <Row key={index}>
              <Col span={20}>
                <h1>{data.playerName || '-'}</h1>
              </Col>
              <Col span={4}>
                <h1>
                  {data.wickets || '-'}/{data.runs || '-'} ({data.overs || '-'})
                </h1>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
      <Row style={{ textAlign: 'left', marginTop: '10px', marginLeft: '15%', marginRight: '15%' }}>
        <h1>Toss: {matchDetails.toss || 'N/A'}</h1>
        <h1>Ground: {matchDetails.ground || 'N/A'}</h1>
      </Row>
      {isShowResult && (
        <Row style={{ textAlign: 'center', font: 20 }}>
          <h2>{matchDetails.matchResult || 'N/A'}</h2>
        </Row>
      )}
    </Skeleton>
  );
};
export default Summary;
