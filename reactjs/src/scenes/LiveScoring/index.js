import { Button, Card, Col, Divider, Dropdown, Icon, Menu, PageHeader, Radio, Row } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

const LiveScoring = () => {
  const history = useHistory();

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
                      19 - 0<sub>(1.0)</sub>
                    </h2>
                  </section>
                  <h4>
                    Pakistan <sub>(Yet to bat)</sub>
                  </h4>
                </Col>
                <Col span={12}>
                  <h4>CRR :</h4>
                  <section style={{ fontSize: '20px' }}>
                    <h4>19.00</h4>
                  </section>
                </Col>
              </Col>
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ height: '200px' }}>
              {' '}
              <h1>Batsman</h1>
              <Radio.Group style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
                <Radio value={1}>Player 1</Radio>
                <Radio value={2}>Player 2</Radio>
              </Radio.Group>
              <h1>Bowler</h1>
              <Radio radioStyle={radioStyle} value={1}>
                Bowler 1
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
                <h1> Target : 000</h1>
              </Row>
              <Row>
                <h1>Runs : 000</h1>
              </Row>
              <Row>
                <h1>Run Rate : 000</h1>
              </Row>
              <Row>
                <h1>Current Run Rate : 000</h1>
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
                <Button style={{ margin: '10px', height: '60px', width: '60px' }}>1</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }}>2</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }}>3</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }}>4</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }}>5</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }}>6</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }}>7</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }}>8</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }}>9</Button>
                <Button style={{ margin: '10px', height: '60px', width: '60px' }}>10</Button>
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
