import React, { useState } from 'react';
import { Radio } from 'antd';
import CustomModal from '../../components/Modal';
import UserList from '../../components/UserList/indes';
import { Extras } from '../../lib/appconst';
import CustomInput from '../../components/Input';
const RunOutDialog = ({ isOpen, handleSubmit, handleSelectedBowler, team1Players = [], team2Players = [] }) => {
  const [runs, setRuns] = useState('0');
  const [extra, setExtra] = useState(Extras.NO_EXTRA);
  const [fielderId, setFielderId] = useState();

  console.log('fielding players', team2Players);
  const handleRuns = (e) => {
    setRuns(e.target.value);
  };
  const handleExtra = (e) => {
    setExtra(e.target.value);
  };

  const handleChangeFielder = (e) => {
    debugger;
    setFielderId(e);
  };

  // const handleSelectedBowler = (e) => {
  //   setExtra(e.target.value);
  // };
  return (
    <CustomModal title="Run Out" isModalVisible={isOpen}>
      <>
        <h3>Extras?</h3>
        <Radio.Group value={extra} onChange={handleExtra}>
          <Radio.Button value={Extras.NO_EXTRA}>With bat</Radio.Button>
          <Radio.Button value={Extras.BYES}>Byes</Radio.Button>
          <Radio.Button value={Extras.LEG_BYES}>Leg Byes</Radio.Button>
        </Radio.Group>
        <div style={{ marginTop: 10 }}>
          <h3>Runs</h3>
          <Radio.Group value={runs} onChange={handleRuns}>
            <Radio.Button value="0">0</Radio.Button>
            <Radio.Button value="1">1</Radio.Button>
            <Radio.Button value="2">2</Radio.Button>
            <Radio.Button value="3">3</Radio.Button>
            <Radio.Button value="4">4</Radio.Button>
            <Radio.Button value="5">5</Radio.Button>
            <Radio.Button value="6">6</Radio.Button>
            <Radio.Button value="7">7</Radio.Button>
          </Radio.Group>
        </div>
        <div style={{ marginTop: 10 }}>
          <h3>Fielder</h3>
          <CustomInput type="select" options={team2Players} handleChange={handleChangeFielder} value={fielderId} stateKey="fielder" placeholder="" />
        </div>

        <div style={{ marginTop: 10 }}>
          <h3>Which Batman got out?</h3>
          <UserList data={team1Players} handleResponse={(e) => handleSelectedBowler({ e, runs, extra, fielderId })} />
        </div>
      </>
    </CustomModal>
  );
};
export default RunOutDialog;
