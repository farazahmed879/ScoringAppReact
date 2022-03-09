import * as React from 'react';
import Input from 'antd/lib/input';
//import PropTypes from 'prop-types';
import { DatePicker, Select } from 'antd';
const { Option } = Select;
const OptionGenerator =
    (data) => data.map((e, index) =>
        <Option key={e.id} value={e.id}>
            {e.name}</Option>)

const CustomInput = ({ options = [], title, handleChange = (a, b) => { }, value, placeholder = "Select", stateKey = "", type = "text", errorMessage = "" }) => {
    return (
        <>
            <label>{title}</label>  <em style={{ float: "right", color: "#b10505e0" }}>{errorMessage}</em>
            {type == "select" ?
                <Select placeholder={placeholder} value={value || undefined} style={{ width: '100%' }} onChange={(e) => handleChange(e, stateKey)} >
                    {OptionGenerator(options)}
                </Select>
                : type == "datePicker" ?
                    <DatePicker style={{ width: '100%' }} onChange={handleChange} name={stateKey}></DatePicker> :
                    <Input type={type} onChange={(e) => handleChange(e.target.value, stateKey)} value={value} name={stateKey} >
                    </Input >
            }
        </>
    );
}

// CustomInput.protoType = {
//     children: JSX.Element,
//     title: PropTypes.string,
//     handleChange: PropTypes.func,
//     value: PropTypes.string,
//     placeHolder: PropTypes.string,
//     type: PropTypes.string,
//     stateKey: PropTypes.string,
// }

// CustomInput.defaultProps = {
//     children: [],
//     title: "title",
//     handleChange: () => { },
//     value: "",
//     placeHolder: "Place Holder",
//     type: "text",
//     stateKey: "stateKey",
// }

export default CustomInput;