import React from 'react';
import { Button, Row, Col, Drawer, Form } from 'antd';
import CustomInput from '../../components/Input';

const FallofWicket = ({ formikData, onClose, visible,data }) => {
  const handleChange = (value, key) => {
    formikData.setValues({ ...formikData.values, [key]: value });
  };
  return (
    <Drawer
      title={Object.keys(data).length ? 'Edit Fall of Wicket' : 'Add Fall of Wicket'}
      width={360}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Col span={8}>
            <CustomInput
              title="One"
              type="number"
              handleChange={handleChange}
              value={formikData.values.first}
              stateKey="first"
              placeholder=""
              errorMessage={formikData.errors.first}
            />
          </Col>
          <Col span={8}>
            <CustomInput
              title="Two"
              type="number"
              handleChange={handleChange}
              value={formikData.values.second}
              stateKey="second"
              placeholder=""
              errorMessage={formikData.errors.second}
            />
          </Col>
          <Col span={8}>
            <CustomInput
              title="Three"
              type="number"
              handleChange={handleChange}
              value={formikData.values.third}
              stateKey="third"
              placeholder=""
              errorMessage={formikData.errors.third}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <CustomInput
              title="Four"
              type="number"
              handleChange={handleChange}
              value={formikData.values.fourth}
              stateKey="fourth"
              placeholder=""
              errorMessage={formikData.errors.fourth}
            />
          </Col>
          <Col span={8}>
            <CustomInput
              title="Five"
              type="number"
              handleChange={handleChange}
              value={formikData.values.fifth}
              stateKey="fifth"
              placeholder=""
              errorMessage={formikData.errors.fifth}
            />
          </Col>
          <Col span={8}>
            <CustomInput
              title="Six"
              type="number"
              handleChange={handleChange}
              value={formikData.values.sixth}
              stateKey="sixth"
              placeholder=""
              errorMessage={formikData.errors.sixth}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <CustomInput
              title="Seven"
              type="number"
              handleChange={handleChange}
              value={formikData.values.seventh}
              stateKey="seventh"
              placeholder=""
              errorMessage={formikData.errors.seventh}
            />
          </Col>
          <Col span={8}>
            <CustomInput
              title="Eight"
              type="number"
              handleChange={handleChange}
              value={formikData.values.eight}
              stateKey="eight"
              placeholder=""
              errorMessage={formikData.errors.eight}
            />
          </Col>
          <Col span={8}>
            <CustomInput
              title="Nine"
              type="number"
              handleChange={handleChange}
              value={formikData.values.ninth}
              stateKey="ninth"
              placeholder=""
              errorMessage={formikData.errors.ninth}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <CustomInput
              title="Ten"
              type="number"
              handleChange={handleChange}
              value={formikData.values.tenth}
              stateKey="tenth"
              placeholder=""
              errorMessage={formikData.errors.tenth}
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
export default FallofWicket;
