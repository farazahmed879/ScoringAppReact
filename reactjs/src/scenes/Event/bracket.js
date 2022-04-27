import React, { useEffect, useState } from 'react';
import { Button, Card,  Modal, Row, Col, Radio, Transfer, Descriptions } from 'antd';
import { Link, useParams } from 'react-router-dom';
import CustomInput from '../../components/Input';
import TeamService from '../../services/team/TeamService';
import EventService from '../../services/event/EventService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ViewBracket from './viewBracket';
const success = Modal.success;
const error = Modal.error;
const Bracket = () => {
  //const [teamList, setTeamList] = useState([]);
  const [viewBracket, setViewBracket] = useState(true);
  //const [selectedTeamList, setSelectedTeamList] = useState([]);
  const param = useParams();

  const bracketInitial = {
    radio: 0,
    noOfTeams: 0,
    selectedTeams: [],
    mockData: [],
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
      //console.log('Teams', res);
      //setTeamList(res);
      getAllEventTeamsByEventId(res);
    });
  };

  const getAllEventTeamsByEventId = (teams) => {
    TeamService.getAllEventTeams(param.eventId).then((res) => {
      //console.log('Selected Teams', res);
     // setSelectedTeamList(res);
      getMock(teams, res);
    });
  };

  const getMock = (teams, eventTeams) => {
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
    });
    //setState({ mockData, targetKeys });
  };

  const handleSubmit = (e) => {
    let req = {
      eventId: +param.eventId,
      teamIds: bracketFormik.values.selectedTeams,
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

 // console.log('Bracket Values', bracketFormik.values);

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  return (
    <Card>
      {!viewBracket ? (
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
            <div style={{ marginTop: '24px', padding: '10px', border: 'solid' }}>
              <Descriptions title="How-To">
                <Descriptions.Item label="1">Enter in order they will play (1 vs 2, 3 vs 4, 5 vs 6, etc)</Descriptions.Item>
                <Descriptions.Item label="2">This Generator is only applicable of Knock-out bases</Descriptions.Item>
                <Descriptions.Item label="3">No of Team must be in series(4,8,16,32,64,128 .... etc)</Descriptions.Item>
                <Descriptions.Item label="4">Selected Teams must be equal to the no of teams</Descriptions.Item>
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
              Generate
            </Button>
          </div>
        </div>
      ) : (
        <ViewBracket formikData={bracketFormik.values}/>
      )}
    </Card>
  );
};
export default Bracket;
