import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Row, Col, Radio, Transfer, Descriptions, Tabs } from 'antd';
import { Link, useParams } from 'react-router-dom';
import CustomInput from '../../components/Input';
import TeamService from '../../services/team/TeamService';
import EventService from '../../services/event/EventService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ViewBracket from './viewBracket';
import ViewBracket1 from './viewBracket1';
import MatchService from '../../services/match/matchService';
const success = Modal.success;
const error = Modal.error;
const { TabPane } = Tabs;
const Bracket = () => {
  //const [teamList, setTeamList] = useState([]);
  const [viewBracket, setViewBracket] = useState(false);
  //const [selectedTeamList, setSelectedTeamList] = useState([]);
  const param = useParams();
  const arr = [4, 8, 16, 32, 64, 128];
  const bracketInitial = {
    radio: 1,
    noOfTeams: 0,
    selectedTeams: [],
    mockData: [],
    //stage2Teams: [],
    isCreateMatch: false,
    matches: [],
  };

  const bracketValidation = Yup.object().shape({
    radio: Yup.number().required('Required'),
    noOfTeams: Yup.number().required('Required'),
  });

  useEffect(() => {
    getAllTeams();
  }, []);

  const getAllTeams = () => {
    TeamService.getAll().then((res) => {
      getAllEventTeamsByEventId(res);
    });
  };

  const getAllEventTeamsByEventId = (teams) => {
    TeamService.getAllEventTeams(param.eventId).then((res) => {
      getAllMatchesByEventId(teams, res);
    });
  };

  const getAllMatchesByEventId = (teams, eventTeams) => {
    MatchService.getAllMatchesByEventId(param.eventId).then((res) => {
      //getTeamsOfStage(teams,eventTeams,res);
      getMock(teams, eventTeams, res);
    //  console.log(JSON.stringify(res));
    });
  };

  const getTeamsOfStage = (teams, eventTeams, matches) => {
    MatchService.getTeamsOfStage(param.eventId).then((res) => {
     // console.log('Stage Teams', res);
      getMock(teams, eventTeams, res, matches);
      //getMock(teams, res);
    });
  };

  const getMock = (teams, eventTeams, matches) => {
    const targetKeys = [];
    const mockData = [];
    eventTeams.forEach((item, index) => {
      const data = {
        key: item.id,
        title: `${item.name}`,
        description: `${item.contact || ' -'}`,
      };
      targetKeys.push(data.key);
    });

    teams.forEach((item, index) => {
      const data = {
        key: item.id,
        title: `${item.name}`,
        description: `${item.contact || ' -'}`,
      };
      mockData.push(data);
    });
    let radio = 0;
    if (targetKeys.length > 0) {
      radio = 1;
    }
    bracketFormik.setValues({
      ...bracketFormik.values,
      mockData: mockData,
      selectedTeams: targetKeys,
      radio: radio,
      noOfTeams: targetKeys.length,
      //stage2Teams: stage2Teams,
      matches: matches,
    });
    //setState({ mockData, targetKeys });
  };
  const handleSubmit = (e) => {
    if (!arr.includes(bracketFormik.values.selectedTeams.length)) {
      return error({ title: `No of Teams must be ${arr}` });
    }
    let req = {
      eventId: +param.eventId,
      teamIds: bracketFormik.values.selectedTeams,
      isCreateMatch: bracketFormik.values.isCreateMatch,
    };
    EventService.createEventTeams(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setViewBracket(res.success ? true : false);
    });
  };

  const bracketFormik = useFormik({
    enableReinitialize: true,
    initialValues: bracketInitial,
    validationSchema: bracketValidation,
    onSubmit: handleSubmit,
  });

  const handleChange = (value, key) => {
    bracketFormik.setValues({ ...bracketFormik.values, [key]: value });
  };

  //console.log('Bracket Values', bracketFormik.values);

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  return (
    <Card>
      <Tabs tabPosition={'top'}>
        <TabPane tab="Bracket Details" key="1">
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Radio.Group onChange={(e) => handleChange(e.target.value, 'radio')} value={bracketFormik.values.radio}>
                  <Radio style={radioStyle} value={1}>
                    Yes, I will enter them below
                  </Radio>
                  <Radio style={radioStyle} value={2}>
                    No, I want a blank bracket
                  </Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <CustomInput
                  type="text"
                  handleChange={handleChange}
                  value={bracketFormik.values.noOfTeams}
                  stateKey="name"
                  placeholder="No of Teams"
                  errorMessage={bracketFormik.errors.noOfTeams}
                />
              </Col>
            </Row>
            {bracketFormik.values.radio == 1 ? (
              <Row gutter={16}>
                <Col span={12}>
                  <CustomInput
                    title="I want to create all matches Automatically"
                    type="checkbox"
                    handleChange={handleChange}
                    value={bracketFormik.values.isCreateMatch}
                    stateKey="isCreateMatch"
                  />
                </Col>
              </Row>
            ) : null}
            {bracketFormik.values.radio == 1 ? (
              <div style={{ marginTop: '24px', padding: '10px' }}>
                <Descriptions title="How-To">
                  <Descriptions.Item label="1">Enter in order they will play (1 vs 2, 3 vs 4, 5 vs 6, etc)</Descriptions.Item>
                  <Descriptions.Item label="2">This Generator is only applicable of Knock-out bases</Descriptions.Item>
                  <Descriptions.Item label="3">No of Team must be in series(4,8,16,32,64,128 .... etc)</Descriptions.Item>
                  <Descriptions.Item label="4">Selected Teams must be equal to the no of teams</Descriptions.Item>
                  <Descriptions.Item label="4">Tournament Matches will be created automatically</Descriptions.Item>
                  <Descriptions.Item label="5">Once Team has been selected will not be edited make sure before generate</Descriptions.Item>
                </Descriptions>
                <Transfer
                  titles={['All Players', 'Selected Players']}
                  dataSource={bracketFormik.values.mockData}
                  showSearch
                  listStyle={{
                    width: '40%',
                    height: '100%',
                  }}
                  operations={['', '']}
                  targetKeys={bracketFormik.values.selectedTeams}
                  onChange={(e) => handleChange(e, 'selectedTeams')}
                  render={(item) => `${item.title}-${item.description}`}
                />
              </div>
            ) : null}

            <div
              style={{
                right: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
                marginTop: '20px',
              }}
            >
              <Button style={{ marginRight: 8 }}>
                <Link to={'/events'}>Back</Link>
              </Button>
              <Button onClick={handleSubmit} type="primary">
                Save
              </Button>
            </div>
          </div>
        </TabPane>
        <TabPane tab="View Bracket" key="2">
          <ViewBracket1 formikData={bracketFormik.values} />
        </TabPane>
      </Tabs>
    </Card>
  );
};
export default Bracket;
