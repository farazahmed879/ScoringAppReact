import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Divider } from 'antd';
import CustomModal from '../../components/Modal';
import { matchType, eventStage } from '../../components/Enum/enum';
import CustomInput from '../../components/Input';

const CreateOrUpdateKnockOutMatch = ({
  matchFormik,
  isOpenModal,
  editMatch,
  handleCancel = (e) => {},
  teamList = [],
  playerList = [],
  groundList = [],
  handleSubmit = (e) => {},
}) => {
  console.log('teamList', teamList);
  console.log('playerList', playerList);
  const handleChange = (value, key) => {
    matchFormik.setValues({ ...matchFormik.values, [key]: value });
  };
  return (
    <CustomModal
      title={Object.keys(editMatch).length ? 'Edit Match' : 'Add Match'}
      isModalVisible={isOpenModal}
      handleCancel={() => handleCancel(false)}
    >
      <Form className="form" onSubmit={matchFormik.handleSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <CustomInput
              title="Match Type"
              type="select"
              disabled={true}
              options={matchType}
              handleChange={handleChange}
              value={matchFormik.values.matchTypeId}
              stateKey="matchTypeId"
              placeholder="Select Type"
              errorMessage={matchFormik.errors.matchTypeId}
            />
          </Col>
          <Col span={8}>
            {matchFormik.values.matchTypeId == 2 ? (
              <CustomInput
                title="Event"
                type="text"
                disabled={true}
                handleChange={handleChange}
                value={matchFormik.values.event}
                stateKey="eventId"
                placeholder="Select Event"
              />
            ) : null}
          </Col>
          <Col span={8}>
            {matchFormik.values.matchTypeId == 2 && matchFormik.values.eventId ? (
              <CustomInput
                title="Event Stage"
                type="select"
                disabled={true}
                handleChange={handleChange}
                options={eventStage}
                value={matchFormik.values.eventStage}
                stateKey="eventStage"
                placeholder="Select Stage"
              />
            ) : null}
          </Col>
        </Row>
        <Divider></Divider>
        <Row gutter={16}>
          <Col span={12}>
            <CustomInput
              title="Team 1"
              type="text"
              disabled={true}
              handleChange={handleChange}
              value={matchFormik.values.team1}
              stateKey="team1Id"
              placeholder="Select Team"
              errorMessage={matchFormik.errors.team1Id}
            />
          </Col>
          <Col span={12}>
            <CustomInput
              title="Team 2"
              type="text"
              readonly=""
              handleChange={handleChange}
              value={matchFormik.values.team2}
              stateKey="team2Id"
              placeholder="Select Team"
              errorMessage={matchFormik.errors.team2Id}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <CustomInput
              title="Ground"
              type="select"
              options={groundList}
              handleChange={handleChange}
              value={matchFormik.values.groundId}
              stateKey="groundId"
              placeholder="Select Ground"
            />
          </Col>
          <Col span={12}>
            <CustomInput
              title="Date of Match"
              type="datePicker"
              handleChange={handleChange}
              value={matchFormik.values.dateOfMatch}
              stateKey="dateOfMatch"
              placeholder="Select Date"
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <CustomInput
              title="Season"
              type="number"
              handleChange={handleChange}
              value={matchFormik.values.season}
              stateKey="season"
              placeholder="Optional"
            />
          </Col>
          <Col span={12}>
            <CustomInput
              title="Overs"
              type="number"
              handleChange={handleChange}
              value={matchFormik.values.matchOvers}
              stateKey="matchOvers"
              placeholder="Optional"
            />
          </Col>
        </Row>
        <Row span={16}>
          <Col gutter={8}>
            {matchFormik.values.team1Id && matchFormik.values.team2Id ? (
              <CustomInput
                title="Toss Winning Team"
                type="select"
                handleChange={handleChange}
                options={teamList}
                value={matchFormik.values.tossWinningTeam}
                stateKey="tossWinningTeam"
                placeholder="Select Team"
              />
            ) : null}
          </Col>
          {Object.keys(editMatch).length ? (
            <Col gutter={8}>
              <CustomInput
                title="Player Of the Match"
                type="select"
                options={playerList}
                handleChange={handleChange}
                value={matchFormik.values.playerOTM}
                stateKey="playerOTM"
                placeholder="Man of the match"
              />
            </Col>
          ) : null}
        </Row>
        <Row span={16}>
          <CustomInput
            title="Description"
            type="text"
            handleChange={handleChange}
            value={matchFormik.values.matchDescription}
            stateKey="matchDescription"
            placeholder="Optional"
          />
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!matchFormik.isValid} onClick={() => handleSubmit(matchFormik.handleSubmit)}>
            {Object.keys(editMatch).length ? 'Save' : 'Create'}
          </Button>
          <Button htmlType="button" onClick={() => handleCancel(false)}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </CustomModal>
  );
};
export default CreateOrUpdateKnockOutMatch;
