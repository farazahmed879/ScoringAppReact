import React, { useState } from 'react';
import { Button, Radio } from 'antd';
import CustomModal from '../../components/Modal';
import UserList from '../../components/UserList/indes';
import { Extras } from '../../lib/appconst';
import CustomInput from '../../components/Input';
const RunOutDialog = ({ isOpen, handleSubmit, team1Players = [], team2Players = [] }) => {
  const [runs, setRuns] = useState('0');
  const [buyOrlegBye, buyOrLegBye] = useState(Extras.NO_EXTRA);
  const [wideOrNoBall, setWideOrNoBall] = useState(Extras.NO_EXTRA);
  const [fielderId, setFielderId] = useState();
  const [batsman, setSelectedBatsman] = useState({});

  console.log('fielding players', team2Players);
  const handleRuns = (e) => {
    setRuns(e.target.value);
  };

  const handleWideOrNoBall = (e) => {
    setWideOrNoBall(e.target.value);
  };

  const handleBuyOrLegBye = (e) => {
    buyOrLegBye(e.target.value);
  };

  const handleChangeFielder = (e) => {
    setFielderId(e);
  };

  const onSubmit = (e) => {
    if (!Object.keys(batsman).length) return;
    const obj = {
      batsman,
      wideOrNoBall,
      buyOrlegBye,
      fielderId,
      runs,
    };
    handleSubmit(obj);
  };

  const handleSelectBatman = (e) => {
    setSelectedBatsman(e);
  };
  return (
    <CustomModal title="Run Out" isModalVisible={isOpen}>
      <>
        <div style={{ marginTop: 10 }}>
          <h3>Extras?</h3>
          <Radio.Group value={wideOrNoBall} onChange={handleWideOrNoBall}>
            <Radio.Button value={Extras.NO_EXTRA}>Legal</Radio.Button>
            <Radio.Button value={Extras.WIDE}>Wide</Radio.Button>
            <Radio.Button value={Extras.NO_BALLS}>No Ball</Radio.Button>
          </Radio.Group>
        </div>
        {wideOrNoBall != Extras.WIDE && (
          <div style={{ marginTop: 10 }}>
            {/* <h3>Extras?</h3> */}
            <Radio.Group value={buyOrlegBye} onChange={handleBuyOrLegBye}>
              <Radio.Button value={Extras.NO_EXTRA}>With bat</Radio.Button>
              <Radio.Button value={Extras.BYES}>Byes</Radio.Button>
              <Radio.Button value={Extras.LEG_BYES}>Leg Byes</Radio.Button>
            </Radio.Group>
          </div>
        )}

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
          <UserList data={team1Players} handleResponse={handleSelectBatman} selected={batsman.id} />
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="button" onClick={onSubmit} disabled={!Object.keys(batsman).length}>
            Submit
          </Button>
        </div>
      </>
    </CustomModal>
  );
};
export default RunOutDialog;
