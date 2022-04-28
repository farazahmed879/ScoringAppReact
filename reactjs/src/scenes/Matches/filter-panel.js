import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'antd';
import CustomInput from '../../components/Input';
import { battingStyleOptions, bowlingStyleOptions, matchType, playingRoleOptions } from '../../components/Enum/enum';
const FilterPanel = ({ teams = [], grounds, handleSubmit = (e) => {} }) => {
  const [filters, setFilters] = useState({
    team1: null,
    team2: null,
    groundId: null,
    type: null,
    date: '',
  });

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
  console.log('filters', filters);

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <CustomInput
            title="Team 2"
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
            options={matchType}
            handleChange={filterHandleChange}
            value={filters.type}
            stateKey="type"
            placeholder=""
            errorMessage={''}
          />
        </Col>
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
