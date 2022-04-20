import React from 'react';
import { Button, Card, Form, Row, Drawer, Col } from 'antd';
import CustomInput from '../../components/Input';

const TeamScoreDrawer = ({ visible = false, onClose, formikData, data }) => {
  const handleChangeTeamScore = (value, key) => {
    formikData.setValues({ ...formikData.values, [key]: value });
  };

  return (
    <Drawer
      title={Object.keys(data).length ? 'Edit Team Score' : 'Add Team Score'}
      width={360}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Col span={8}>
            <CustomInput
              title="Total Score"
              type="number"
              handleChange={handleChangeTeamScore}
              value={formikData.values.totalScore}
              stateKey="totalScore"
              placeholder=""
              errorMessage={formikData.errors.totalScore}
            />
          </Col>
          <Col span={8}>
            <CustomInput
              title="Wickets"
              type="number"
              handleChange={handleChangeTeamScore}
              value={formikData.values.wickets}
              stateKey="wickets"
              placeholder=""
              errorMessage={formikData.errors.wickets}
            />
          </Col>
          <Col span={8}>
            <CustomInput
              title="Overs"
              type="number"
              handleChange={handleChangeTeamScore}
              value={formikData.values.overs}
              stateKey="overs"
              placeholder=""
              errorMessage={formikData.errors.overs}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <CustomInput
              title="Byes"
              type="number"
              handleChange={handleChangeTeamScore}
              value={formikData.values.byes}
              stateKey="byes"
              placeholder=""
              errorMessage={formikData.errors.byes}
            />
          </Col>
          <Col span={12}>
            <CustomInput
              title="Leg Byes"
              type="number"
              handleChange={handleChangeTeamScore}
              value={formikData.values.legByes}
              stateKey="legByes"
              placeholder=""
              errorMessage={formikData.errors.legByes}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <CustomInput
              title="Wide balls"
              type="number"
              handleChange={handleChangeTeamScore}
              value={formikData.values.wideballs}
              stateKey="wideballs"
              placeholder=""
              errorMessage={formikData.errors.wideballs}
            />
          </Col>
          <Col span={12}>
            <CustomInput
              title="No Balls"
              type="number"
              handleChange={handleChangeTeamScore}
              value={formikData.values.noBalls}
              stateKey="noBalls"
              placeholder=""
              errorMessage={formikData.errors.noBalls}
            />
          </Col>
        </Row>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button disabled={!formikData.isValid} onClick={formikData.handleSubmit} type="primary">
            Submit
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};
export default TeamScoreDrawer;
