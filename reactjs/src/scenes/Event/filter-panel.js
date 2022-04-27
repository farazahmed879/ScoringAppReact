import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'antd';
import CustomInput from '../../components/Input';
import { eventTypes } from '../../components/Enum/enum';
const FilterPanel = ({ handleSubmit = (e) => {} }) => {
  const [filters, setFilters] = useState({
    name: '',
    type: 0,
    starDate: '',
    endDate: '',
  });

  const callback = (key) => {
    console.log(key);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      type: 0,
      starDate: '',
      endDate: '',
    });
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
            title="Type"
            type="select"
            options={eventTypes}
            handleChange={filterHandleChange}
            value={filters.type}
            stateKey="type"
            placeholder=""
            errorMessage={''}
          />
        </Col>
        <Col span={12}>
          <CustomInput
            title="Start Date"
            type="datePicker"
            handleChange={filterHandleChange}
            value={filters.starDate}
            stateKey="startDate"
            placeholder=""
            errorMessage={''}
          />
        </Col>
        <Col span={12}>
          <CustomInput
            title="End Date"
            type="datePicker"
            handleChange={filterHandleChange}
            value={filters.endDate}
            stateKey="endDate"
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
