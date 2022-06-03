import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Row, Col, Radio, Transfer, Descriptions, Tabs, PageHeader, Skeleton } from 'antd';
import { Link, useParams, useHistory } from 'react-router-dom';
import CustomInput from '../../components/Input';
import TeamService from '../../services/team/TeamService';
import EventService from '../../services/event/EventService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ViewBracket from './viewBracket';
import ViewBracket2 from './viewBracket2';
import MatchService from '../../services/match/matchService';
const success = Modal.success;
const error = Modal.error;
const { TabPane } = Tabs;

const pageHeader = {
  border: '1px solid rgb(235, 237, 240)',
};
const footer = {
  right: 0,
  bottom: 0,
  width: '100%',
  borderTop: '1px solid #e9e9e9',
  padding: '10px 16px',
  background: '#fff',
  textAlign: 'right',
  marginTop: '20px',
};

const listStyle = {
  width: '40%',
  height: '100%',
};

const Bracket = () => {
  //const [teamList, setTeamList] = useState([]);
  const [viewBracket, setViewBracket] = useState(false);
  const [loading, setLoading] = useState(true);
  //const [selectedTeamList, setSelectedTeamList] = useState([]);
  const param = useParams();
  const history = useHistory();
  const arr = [4, 8, 16, 32, 64, 128];
  const bracketInitial = {
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
      getAllEventTeamsByEventId(res);
    });
  };

  const getAllEventTeamsByEventId = (teams) => {
    TeamService.getAllEventTeams(param.eventId,undefined).then((res) => {
      getAllMatchesByEventId(teams, res);
    });
  };

  const getAllMatchesByEventId = (teams, eventTeams) => {
    MatchService.getAllMatchesByEventId(param.eventId).then((res) => {
      getMock(teams, eventTeams, res);
      setLoading(false);
    });
  };

  const getMock = (teams, eventTeams, res) => {
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
    bracketFormik.setValues({
      ...bracketFormik.values,
      mockData: mockData,
      selectedTeams: targetKeys,
      noOfTeams: targetKeys.length,
      matches: res ? res.eventMatches: [],
      winner: res ? res.winner: 'Winner',
    });
    //setState({ mockData, targetKeys });
  };
  const handleSubmit = (e) => {
    if (!arr.includes(bracketFormik.values.selectedTeams.length)) {
      return error({ title: `No of Teams must be ${arr}` });
    }
    let req = {
      eventId: +param.eventId,
      teamIds: bracketFormik.values.selectedTeams
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
  return (
    <Skeleton loading={loading}>
      <Card>
        <PageHeader style={pageHeader} onBack={history.goBack} title={param.event} />
        <Tabs tabPosition={'top'}>
          <TabPane tab="Bracket Details" key="1">
            <div>
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
                    titles={['All Teaams', 'Selected Teams']}
                    dataSource={bracketFormik.values.mockData}
                    showSearch
                    listStyle={listStyle}
                    operations={['', '']}
                    targetKeys={bracketFormik.values.selectedTeams}
                    onChange={(e) => handleChange(e, 'selectedTeams')}
                    render={(item) => `${item.title}-${item.description}`}
                  />
                </div>

              <div style={footer}>
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
            <ViewBracket2 formikData={bracketFormik.values} event={param.event} loading={loading} />
          </TabPane>
        </Tabs>
      </Card>
    </Skeleton>
  );
};
export default Bracket;
