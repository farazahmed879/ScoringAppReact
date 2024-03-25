import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'antd';
import CustomInput from '../../components/Input';
import { battingStyleOptions, bowlingStyleOptions, playingRoleOptions } from '../../components/Enum/enum';
const FilterPanel = ({ teams, handleSubmit = (e) => {} }) => {
  const [filters, setFilters] = useState({
    name: '',
    address: '',
  });

  const handleReset = () => {
    setFilters({
      name: '',
      address: '',
    });
    handleSubmit();
  };

  const filterHandleChange = (value, key) => {
    setFilters({ ...filters, [key]: value });
    //playerFormik.setValues({ ...playerFormik.values, [key]: value });
  };

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
            title="Address"
            type="text"
            handleChange={filterHandleChange}
            value={filters.address}
            stateKey="address"
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
