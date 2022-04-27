import React, { useEffect, useState } from 'react';
import { Col, Row, Drawer, Divider, Card, Tabs, Icon, Collapse } from 'antd';
import './style.css';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const PlayerProfile = ({ visible = false, onClose }) => {
  const [stats, setStats] = useState({});
  const { Meta } = Card;
  const pStyle = {
    fontSize: 16,
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: 16,
  };

  const callback = (key) => {
    console.log(key);
  };
  return (
    <Drawer width={640} placement="right" onClose={onClose} visible={visible}>
      <div>
        <Row>
          <Col span={8}>
            <Card
              hoverable
              style={{ width: '100%' }}
              cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" height={150} width={150} />}
            ></Card>
          </Col>
          <Col span={16}>
            <ul>
              <li>Faraz Ahmed Shaikh</li>
              <li>Gulzar Cricket Club</li>
              <li>Right Handed Batsman</li>
              <li>Right Arm Leg Spin</li>
            </ul>
          </Col>
        </Row>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <Icon type="apple" />
              T20
            </span>
          }
          key="1"
        >
          <Collapse defaultActiveKey={['1']} onChange={callback}>
            <Panel header="Batting" key="1" style={{ padding: 0 }}>
              <Row>
                <Col span={24}>
                  <table id="myTable">
                    <tr>
                      <th>M</th>
                      <th>In</th>
                      <th>R</th>
                      <th>B</th>
                      <th>50</th>
                      <th>100</th>
                      <th>Avg</th>
                      <th>SR</th>
                      <th>Hs</th>
                      <th>4s</th>
                      <th>6s</th>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                    </tr>
                  </table>
                </Col>
              </Row>
            </Panel>
            <Panel header="Bowling" key="2">
              <Row>
                <Col span={24}>
                  <table id="myTable">
                    <tr>
                      <th>O</th>
                      <th>W</th>
                      <th>R</th>
                      <th>5w</th>
                      <th>M</th>
                      <th>Avg</th>
                      <th>Econ</th>
                      <th>BBI</th>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                    </tr>
                  </table>
                </Col>
              </Row>
            </Panel>
            <Panel header="Fielding" key="3">
              <Row>
                <Col span={24}>
                  <table id="myTable">
                    <tr>
                      <th>Catch</th>
                      <th>Stump</th>
                      <th>Run Out</th>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>10</td>
                      <td>10</td>
                    </tr>
                  </table>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="android" />
              One Day
            </span>
          }
          key="2"
        >
          <p style={pStyle}>Batting</p>
          <Row>
            <Col span={12}>{/* <DescriptionItem title="Full Name" content="Lily" /> */}</Col>
            <Col span={12}>{/* <DescriptionItem title="Account" content="AntDesign@example.com" /> */}</Col>
          </Row>
          <Row>
            <Col span={12}>{/* <DescriptionItem title="City" content="HangZhou" /> */}</Col>
            <Col span={12}>{/* <DescriptionItem title="Country" content="China🇨🇳" /> */}</Col>
          </Row>
          <Row>
            <Col span={12}>{/* <DescriptionItem title="Birthday" content="February 2,1900" /> */}</Col>
            <Col span={12}>{/* <DescriptionItem title="Website" content="-" /> */}</Col>
          </Row>
          <Row>
            <Col span={24}>{/* <DescriptionItem title="Message" content="Make things as simple as possible but no simpler." /> */}</Col>
          </Row>
          <Divider />
          <p style={pStyle}>Bowling</p>
          <Row>
            <Col span={12}>{/* <DescriptionItem title="Position" content="Programmer" /> */}</Col>
            <Col span={12}>{/* <DescriptionItem title="Responsibilities" content="Coding" /> */}</Col>
          </Row>
          <Row>
            <Col span={12}>{/* <DescriptionItem title="Department" content="XTech" /> */}</Col>
            <Col span={12}>{/* <DescriptionItem title="Supervisor" content={<a>Lin</a>} /> */}</Col>
          </Row>
          <Row>
            <Col span={24}>
              {/* <DescriptionItem
              title="Skills"
              content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
            /> */}
            </Col>
          </Row>
          <Divider />
          <p style={pStyle}>Fielding</p>
          <Row>
            <Col span={12}>{/* <DescriptionItem title="Email" content="AntDesign@example.com" /> */}</Col>
            <Col span={12}>{/* <DescriptionItem title="Phone Number" content="+86 181 0000 0000" /> */}</Col>
          </Row>
          <Row>
            <Col span={24}>
              {/* <DescriptionItem title="Github" content={<a href="http://github.com/ant-design/ant-design/">github.com/ant-design/ant-design/</a>} /> */}
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default PlayerProfile;
