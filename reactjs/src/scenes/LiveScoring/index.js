import { Button, Card, Col, Divider, Dropdown, Icon, Menu, PageHeader, Radio, Row } from 'antd';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { set } from 'lodash';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const LiveScoring = () => {
  const history = useHistory();

  let totalOvers = 5;

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  function handleMenuClick(e) {
    console.log('click', e);
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">1st item</Menu.Item>
      <Menu.Item key="2">2nd item</Menu.Item>
      <Menu.Item key="3">3rd item</Menu.Item>
    </Menu>
  );


  const[score , setScore] =useState(0)
  const[plyOne,setPlyOne] =useState([]) //ply one
  const[plyTwo,setPlyTwo] =useState([]) //ply two
  const[bowler , setBowler] = useState([])  
  const[currentRate , setCurrentRate] = useState(0)
  const[requiredRate , setRequiredRate] = useState(0)
  const[target , setTarget] = useState(200)
  const[inning , setInning] = useState(1)
  const[wicket , setWicket] = useState(0)
  const[plyOneId , setPlyOneId] = useState(1)
  const[plyTwoId , setPlyTwoId] = useState(2)
  const[strike , setStrike] = useState(plyOneId)
  const[remainingBalls , setRemainingBalls] = useState(totalOvers * 6)
  const[balls , setBalls] = useState(0)
  
  
  let handleOver = (ball) => {
     
debugger
    let valueAfterPoint = ball.toString().split('.')[1]
    if(valueAfterPoint === undefined ? valueAfterPoint : valueAfterPoint.toString().split('')[0] == 5){
     
      setBalls((Math.round(ball)))

    }
    else{

      setBalls(ball + 0.1)
    }
    setRemainingBalls(remainingBalls - 1)
  }

  let handlePlayerSwitch = (num) => {

    if(strike === plyOneId){

      if(num === 3 || num === 1 || num === 5){

        setStrike(plyTwoId)

      }
      setPlyOne([...plyOne, num])
    }

    else if(strike === plyTwoId){
 
      if(num === 3 || num === 1 || num === 5){

        setStrike(plyOneId)

      }
      setPlyTwo([...plyTwo,num])

    }

    }


  

  let updateScore = (btnclicked) => {


   let runsRequired = target - score;
   

    setScore(score + btnclicked)
    setCurrentRate(score/balls)
    handleOver(balls)
    setRequiredRate(runsRequired / remainingBalls)
    setBowler([...bowler , btnclicked])
    handlePlayerSwitch(btnclicked)
    
  }

  
  return (
    <>
      <Card>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          onBack={history.goBack}
          title={'Start Match'}
        />
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card style={{ height: '200px' }}>
              <Col span={24}>
                <Col span={12}>
                  <h4>
                    India, 1<sup>st</sup> Inning
                  </h4>
                  <section style={{ fontSize: '30px' }}>
                    <h2>
                      {score} - {wicket}<sub>({balls.toFixed(1)})</sub>
                    </h2>
                  </section>
                  <h4>
                    Pakistan <sub>(Yet to bat)</sub>
                  </h4>
                </Col>
                <Col span={12}>
                  <h4>CRR :</h4>
                  <section style={{ fontSize: '20px' }}>
                    <h4>{currentRate.toFixed(2)}</h4>
                  </section>
                </Col>
              </Col>
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ height: '200px' }}>
              {' '}
              <h1>Batsman</h1>
              <Radio.Group value={strike} style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
                <Radio value={plyOneId} >Player 1 : {plyOne.join(' ')}</Radio>
                <Radio value={plyTwoId}>Player 2 : {plyTwo.join(' ')}</Radio>
              </Radio.Group>
              <h1>Bowler</h1>
              <Radio radioStyle={radioStyle} value={1}>
                Bowler 1 : {bowler.join(' ')}
              </Radio>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            {' '}
            <Card>
              <Row>
                <h1>
                  {' '}
                  Inning : 1<sup>st</sup>
                </h1>
              </Row>
              <Row>
                <h1> Target : {target}</h1>
              </Row>
              <Row>
                <h1>Runs : {score}</h1>
              </Row>
              <Row>
                <h1>Run Rate : {currentRate.toFixed(2)}</h1>
              </Row>
              <Row>
                <h1>Required Run Rate : {requiredRate.toFixed(2)}</h1>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              {' '}
              <Col
                style={{
                  margin: '5px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-evenly',
                }}
              >
                <Button style={{ margin: '10px', height: '60px', width: '60px' }} value='1' onClick={() => updateScore(1)} >1</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }} value='2' onClick={() => updateScore(2)}>2</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }} value='3' onClick={() => updateScore(3)}>3</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }} value='4' onClick={() => updateScore(4)}>4</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }} value='5' onClick={() => updateScore(5)}>5</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }} value='6' onClick={() => updateScore(6)}>6</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }} value='7' onClick={() => updateScore(7)}>7</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }} value='8' onClick={() => updateScore(8)}>8</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }} value='9' onClick={() => updateScore(9)}>9</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }} value='10'onClick={() => updateScore(10)}>10</Button>
                <Dropdown overlay={menu}>
                  <Button style={{ margin: '10px', height: '60px', width: '60px' }}>
                    B <Icon type="down" />
                  </Button>
                </Dropdown>
                <Dropdown overlay={menu}>
                  <Button style={{ margin: '10px', height: '60px', width: '60px' }}>
                    LB <Icon type="down" />
                  </Button>
                </Dropdown>
                <Dropdown overlay={menu}>
                  <Button style={{ margin: '10px', height: '60px', width: '60px' }}>
                    W <Icon type="down" />
                  </Button>
                </Dropdown>
                <Dropdown overlay={menu}>
                  <Button style={{ margin: '10px', height: '60px', width: '60px' }}>
                    N <Icon type="down" />
                  </Button>
                </Dropdown>
              </Col>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default LiveScoring;
