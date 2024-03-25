import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'antd';
import CustomInput from '../../components/Input';
import { battingStyleOptions, bowlingStyleOptions, matchTypes, playingRoleOptions } from '../../components/Enum/enum';
import { useFormik } from 'formik';
import matchTypeConst from '../../lib/matchTypeConst';
import EventService from '../../services/event/EventService';
import tournamentTypeConst from '../../lib/tournamentTypeConst';
const FilterPanel = ({ teams = [], grounds = [], groups = [], handleSubmit = (e) => {} }) => {
  const [filters, setFilters] = useState({
    team1: null,
    team2: null,
    groundId: null,
    type: null,
    date: '',
    eventId: null,
  });
  const [eventList, setEventList] = useState([]);

  const callback = (key) => {
    console.log(key);
  };

  const handleReset = () => {
    setFilters({
      team1: null,
      team2: null,
      groundId: null,
      type: null,
      date: '',
    });
    handleSubmit();
  };

  const filterHandleChange = (value, key) => {
    setFilters({ ...filters, [key]: value });
    //playerFormik.setValues({ ...playerFormik.values, [key]: value });
  };
  const getAllEvents = () => {
    EventService.getAll().then((res) => {
      setEventList(res);
    });
  };

  useEffect(() => {
    if (filters.type == matchTypeConst.friendly) {
      var obj = filters;
      obj.eventId = '';
      obj.group = 0;
      setFilters({ ...filters, obj });
    }
    if (filters.type == matchTypeConst.tournament || filters.type == matchTypeConst.series) {
      if (!filters.event) {
        var a = filters;
        a.team1Id = '';
        a.team2Id = '';
        setFilters({ ...filters, a });
      }
      getAllEvents();
    }
  }, [filters.type]);

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <CustomInput
            title="Team 1"
            type="select"
            options={teams.filter((i) => i.id != filters.team2)}
            handleChange={filterHandleChange}
            value={filters.team1}
            stateKey="team1"
            placeholder=""
            errorMessage={''}
          />
        </Col>
        <Col span={12}>
          <CustomInput
            title="Team 2"
            type="select"
            options={teams.filter((i) => i.id != filters.team1)}
            handleChange={filterHandleChange}
            value={filters.team2}
            stateKey="team2"
            placeholder=""
            errorMessage={''}
          />
        </Col>
        <Col span={12}>
          <CustomInput
            title="Ground"
            type="select"
            options={grounds}
            handleChange={filterHandleChange}
            value={filters.groundId}
            stateKey="groundId"
            placeholder=""
            errorMessage={''}
          />
        </Col>
        <Col span={12}>
          <CustomInput
            title="Match Type"
            type="select"
            options={matchTypes}
            handleChange={filterHandleChange}
            value={filters.type}
            stateKey="type"
            placeholder=""
            errorMessage={''}
          />
        </Col>
        {filters.type == matchTypeConst.tournament || filters.type == matchTypeConst.series ? (
          <Col span={12}>
            <CustomInput
              title="Event"
              type="select"
              handleChange={filterHandleChange}
              options={eventList.filter((i) => i.eventType == filters.type && i.tournamentType == tournamentTypeConst.leagueBased)}
              value={filters.eventId}
              stateKey="eventId"
              placeholder="Select Event"
            />
          </Col>
        ) : null}
        <Col span={12}>
          <CustomInput
            title="Date"
            type="datePicker"
            handleChange={filterHandleChange}
            value={filters.date}
            stateKey="date"
            placeholder=""
            errorMessage={''}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Button type="primary" htmlType="submit" onClick={() => handleSubmit(filters)}>
            Submit
          </Button>
          <Button htmlType="button" onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </>
  );
};
export default FilterPanel;
