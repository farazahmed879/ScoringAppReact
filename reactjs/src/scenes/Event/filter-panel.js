import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'antd';
import CustomInput from '../../components/Input';
import { battingStyleOptions, bowlingStyleOptions, playingRoleOptions } from '../../components/Enum/enum';
const FilterPanel = ({ handleSubmit = (e) => {}}) => {
  const [filters, setFilters] = useState({
    name: '',
    playingRole: 0,
    battingStyle: 0,
    bowlingStyle: 0,
  });

  const callback = (key) => {
    console.log(key);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      playingRole: 0,
      battingStyle: 0,
      bowlingStyle: 0,
    });
  };

  const filterHandleChange = (value, key) => {
    setFilters({ ...filters, [key]: value });
    //playerFormik.setValues({ ...playerFormik.values, [key]: value });
  };
  console.log("filters",filters);

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <CustomInput
            title="Name"
            type="text"
            handleChange={filterHandleChange}
            value={filters.name}
            stateKey="name"
            placeholder=""
            errorMessage={''}
          />
        </Col>
        <Col span={12}>
          <CustomInput
            title="Playing Role"
            type="select"
            options={playingRoleOptions}
            handleChange={filterHandleChange}
            value={filters.playingRole}
            stateKey="playingRole"
            placeholder=""
            errorMessage={''}
          />
        </Col>
        <Col span={12}>
          <CustomInput
            title="Batting Style"
            type="select"
            options={battingStyleOptions}
            handleChange={filterHandleChange}
            value={filters.battingStyle}
            stateKey="battingStyle"
            placeholder=""
            errorMessage={''}
          />
        </Col>
        <Col span={12}>
          <CustomInput
            title="Bowling Style"
            type="select"
            options={bowlingStyleOptions}
            handleChange={filterHandleChange}
            value={filters.bowlingStyle}
            stateKey="bowlingStyle"
            placeholder=""
            errorMessage={''}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Button type="primary" htmlType="submit" onClick={()=> handleSubmit(filters)}>
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
