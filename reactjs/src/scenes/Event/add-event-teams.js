import React, { useEffect, useState } from 'react';
import { Button, Card, Collapse, PageHeader, Transfer, Modal, Skeleton } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import TeamService from '../../services/team/TeamService';
import { useFormik } from 'formik';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import EventService from '../../services/event/EventService';
const pageHeader = {
  border: '1px solid rgb(235, 237, 240)',
};

const listStyle = {
  width: '40%',
  height: '100%',
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

const success = Modal.success;
const error = Modal.error;
const { Panel } = Collapse;
const AddEvenTeams = () => {
  const param = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const groupTeamInitial = {
    noOfTeams: 0,
    selectedTeams: [],
    mockData: [],
  };

  const handleSubmit = () => {
    // if (groupTeamFormik.values.selectedTeams.length) {
    //   return error({ title: `No of Teams must be ${arr}` });
    // }
    setDisabled(true);
    let req = {
      eventId: +param.eventId,
      selectedTeams: groupTeamFormik.values.selectedTeams,
    };
    EventService.createGroupWiseEventTeams(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setDisabled(false);
    });
  };

  const groupTeamFormik = useFormik({
    enableReinitialize: true,
    initialValues: groupTeamInitial,
    validationSchema: null,
    onSubmit: handleSubmit,
  });

  const handleChange = (value, key, index) => {
    let obj = { ...groupTeamFormik.values };
    obj[key][index] = value;
    groupTeamFormik.setValues({ ...obj });
  };

  useEffect(() => {
    getAllTeams();
  }, []);

  const getAllTeams = () => {
    TeamService.getAll().then((res) => {
      getAllEventTeamsByEventId(res);
    });
  };

  const getAllEventTeamsByEventId = (teams) => {
    TeamService.getEventGroupWiseTeams(param.eventId).then((res) => {
      getMock(teams, res);
    });
  };

  const getMock = (teams, eventTeams) => {
    const targetKeys = [];
    const mockData = [];
    eventTeams.forEach((team, index) => {
      const groupwise = [];
      if (team && team.teams && team.teams.length > 0) {
        team.teams.forEach((item, i) => {
          const data = {
            key: item.id,
            title: `${item.name}`,
            description: `${item.contact || ' -'}`,
          };
          groupwise.push(data.key);
        });
      }

      targetKeys.push(groupwise);
    });

    teams.forEach((item, index) => {
      const data = {
        key: item.id,
        title: `${item.name}`,
        description: `${item.contact || ' -'}`,
      };
      mockData.push(data);
    });

    groupTeamFormik.setValues({
      ...groupTeamFormik.values,
      mockData: mockData,
      selectedTeams: targetKeys,
      noOfTeams: targetKeys.length,
    });

    setLoading(false);
  };
  return (
    <Card>
      <PageHeader style={pageHeader} onBack={history.goBack} title={param.event} />
      <Skeleton loading={loading}>
        <Collapse>
          {Array.from(Array(+param.group), (e, index) => (
            <Panel header={`Group-${++index}`} key={index}>
              <Transfer
                titles={['All Teams', 'Selected Teams']}
                dataSource={groupTeamFormik.values.mockData}
                showSearch
                listStyle={listStyle}
                operations={['', '']}
                targetKeys={groupTeamFormik.values.selectedTeams[--index]}
                onChange={(e) => handleChange(e, 'selectedTeams', index)}
                render={(item) => `${item.title}-${item.description}`}
              />
            </Panel>
          ))}
        </Collapse>
        <div style={footer}>
          <Button disabled={disabled} onClick={handleSubmit} type="primary">
            Save
          </Button>
        </div>
      </Skeleton>
    </Card>
  );
};
export default AddEvenTeams;
