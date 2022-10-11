import * as React from 'react';
import Input from 'antd/lib/input';
//import PropTypes from 'prop-types';
import { Checkbox, DatePicker, Select, Switch, Icon, disabled } from 'antd';
const { Option } = Select;
const OptionGenerator = (data) =>
  data.map((e, index) => (
    <Option key={e.id} value={e.id}>
      {e.name}
    </Option>
  ));

const CustomInput = ({
  options = [],
  title,
  handleChange = (a, b) => {},
  value,
  placeholder = 'Select',
  stateKey = '',
  type = 'text',
  errorMessage = '',
  width = '100%',
  disabled = false,
  onBlur,
}) => {
  return (
    <div style={{ width: width }}>
      <label>{title}</label> <em style={{ float: 'right', color: '#b10505e0' }}>{errorMessage}</em>
      {type == 'select' ? (
        <Select
          showSearch
          disabled={disabled}
          placeholder={placeholder}
          value={value || undefined}
          style={{ width: width }}
          onChange={(e) => handleChange(e, stateKey)}
          filterOption={(input, option) => option.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {OptionGenerator(options)}
        </Select>
      ) : type == 'datePicker' ? (
        <DatePicker value={value} style={{ width: width }} onChange={(e) => handleChange(e, stateKey)} name={stateKey}></DatePicker>
      ) : type == 'checkbox' ? (
        <Checkbox  onChange={(e) => handleChange(e.target.checked, stateKey)} name={stateKey} checked={value}></Checkbox>
      ) : type == 'switch' ? (
        <Switch
          style={{ margin: '20px' }}
          checkedChildren={<Icon type="check" />}
          onChange={(e) => handleChange(e, stateKey)}
          unCheckedChildren={<Icon type="close" />}
          defaultChecked
          name={stateKey}
        />
      ) : type == 'multiple' ? (
        <Select disabled={disabled} mode="multiple" value={value} style={{ width: '100%' }} placeholder="Please select" onChange={(e) => handleChange(e, stateKey)}>
          {OptionGenerator(options)}
        </Select>
      ) : (
        <Input
          placeholder={placeholder}
          type={type}
          onChange={(e) => handleChange(e.target.value, stateKey)}
          value={value || undefined}
          name={stateKey}
          readOnly={disabled}
          onBlur={onBlur}
        ></Input>
      )}
    </div>
  );
};

export default CustomInput;
