import React from 'react';
import { Row, Col, Card } from 'antd';
const Scorecard = ({ batsman = [], bowler = [], teamScore, matchDetails }) => {
  console.log(teamScore);

  const handleHowOut = (data) => {
    // console.log('data', data);
    switch (data.howOut) {
      case 1: {
        return 'Not out';
      }
      case 2: {
        return 'b ' + data.bowler;
      }
      case 3: {
        return 'ct ' + data.fielder + ' b ' + data.bowler;
      }
      case 4: {
        return 'st ' + data.fielder + ' b ' + data.bowler;
      }
      case 5: {
        return 'h/w ' + data.bowler;
      }
      case 6: {
        return 'lbw ' + data.bowler;
      }
      case 7: {
        return 'run out ' + data.fielder;
      }
      default: {
        return 'N/A'
      }
    }
  };

  return (
    <Card>
      <Row>
        <Col span={14}>
          <h2>Batsman</h2>
        </Col>
        <Col span={2}>
          <h2>R</h2>
        </Col>
        <Col span={2}>
          <h2>B</h2>
        </Col>
        <Col span={2}>
          <h2>4s</h2>
        </Col>
        <Col span={2}>
          <h2>6s</h2>
        </Col>
        <Col span={2}>
          <h2>S/R</h2>
        </Col>
      </Row>
      <hr />
      {batsman.map((a, index) => (
        <div key={index}>
          <Row>
            <Col span={14}>
              <h1 style={{ marginBottom: '0' }}>{a.playerName}</h1>
              {/* <h6>{a.bowler}</h6> */}
              <h5>{handleHowOut(a)}</h5>
            </Col>
            <Col span={2}>
              <h1>{a.runs || '-'}</h1>
            </Col>
            <Col span={2}>
              <h1>{a.balls || '-'}</h1>
            </Col>
            <Col span={2}>
              <h1>{a.four || '-'}</h1>
            </Col>
            <Col span={2}>
              <h1>{a.six || '-'}</h1>
            </Col>
            <Col span={2}>
              <h1>{((a.runs * 100) / a.balls).toFixed(2)}</h1>
            </Col>
          </Row>
          <hr />
        </div>
      ))}
      <Row>
        <Col span={14}>
          <h1>Extras</h1>
        </Col>
        <Col span={10}>
          <h1>
            {teamScore.extras} (NB {teamScore.noBall}, W {teamScore.wide}, LB {teamScore.legBye}, B {teamScore.bye})
          </h1>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col span={14}>
          <h1>Total Runs</h1>
        </Col>
        <Col span={10}>
          <h1>
            {' '}
            {teamScore.score} ({teamScore.wickets} wkts , {teamScore.overs} ov )
          </h1>
        </Col>
      </Row>
      <Row style={{ marginTop: '40px' }}>
        <Col span={14}>
          <h2>Bowling</h2>
        </Col>
        <Col span={2}>
          <h2>O</h2>
        </Col>
        <Col span={2}>
          <h2>M</h2>
        </Col>
        <Col span={2}>
          <h2>R</h2>
        </Col>
        <Col span={2}>
          <h2>W</h2>
        </Col>
        <Col span={2}>
          <h2>Econ</h2>
        </Col>
      </Row>
      <hr />
      {bowler.map((a, index) => (
        <div key={index}>
          <Row>
            <Col span={14}>
              <h4>{a.playerName}</h4>
            </Col>
            <Col span={2}>
              <h4>{a.overs || '-'}</h4>
            </Col>
            <Col span={2}>
              <h3>{a.maiden || '-'}</h3>
            </Col>
            <Col span={2}>
              <h3>{a.runs || '-'}</h3>
            </Col>
            <Col span={2}>
              <h3>{a.wickets || '-'}</h3>
            </Col>
            <Col span={2}>
              <h3>{(a.runs / a.overs).toFixed(2) || '-'}</h3>
            </Col>
          </Row>
          <hr />
        </div>
      ))}
      <Row>
        <Col span={14}>
          <h1>Toss : </h1>
        </Col>
        <Col span={10}>
          <h1>{matchDetails.toss}</h1>
        </Col>
      </Row>
      <Row>
        <Col span={14}>
          <h1>Ground : </h1>
        </Col>
        <Col span={10}>
          <h1>{matchDetails.stadium}</h1>
        </Col>
      </Row>
    </Card>
  );
};
export default Scorecard;
