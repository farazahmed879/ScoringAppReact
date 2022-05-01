import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Divider } from 'antd';
import CustomModal from '../../components/Modal';
import { matchType, eventStage } from '../../components/Enum/enum';

const CreateOrUpdateKnockOutMatch = ({ matchFormik,isOpenModal,editMatch }) => {
  const handleChange = (value, key) => {
    matchFormik.setValues({ ...matchFormik.values, [key]: value });
  };

  return (
    <CustomModal
      title={Object.keys(editMatch).length ? 'Edit Match' : 'Add Match'}
      isModalVisible={isOpenModal}
      handleCancel={() => {
        setIsOpenModal(false);
      }}
    >
      <Form className="form" onSubmit={matchFormik.handleSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <CustomInput
              title="Match Type"
              type="select"
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
                type="select"
                handleChange={handleChange}
                options={matchFormik.values.id ? eventList : eventList.filter((i) => i.eventType != 1)}
                value={matchFormik.values.eventId}
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
              type="select"
              options={teamList.filter((i) => i.id != matchFormik.values.team2Id)}
              handleChange={handleChange}
              value={matchFormik.values.team1Id}
              stateKey="team1Id"
              placeholder="Select Team"
              errorMessage={matchFormik.errors.team1Id}
            />
          </Col>
          <Col span={12}>
            <CustomInput
              title="Team 2"
              type="select"
              options={teamList.filter((i) => i.id != matchFormik.values.team1Id)}
              handleChange={handleChange}
              value={matchFormik.values.team2Id}
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
                options={teamList.filter((i) => i.id == matchFormik.values.team1Id || i.id == matchFormik.values.team2Id)}
                value={matchFormik.values.tossWinningTeam}
                stateKey="tossWinningTeam"
                placeholder="Select Team"
              />
            ) : null}
          </Col>
          <Col gutter={8}>
            <CustomInput
              title="Player Of the Match"
              type="select"
              handleChange={handleChange}
              options={playerList}
              value={matchFormik.values.playerOTM}
              stateKey="playerOTM"
              placeholder="Man of the match"
            />
          </Col>
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
          <Button type="primary" htmlType="submit" disabled={!matchFormik.isValid} onClick={matchFormik.handleSubmit}>
            {mode == 'Add Match' ? 'Add' : 'Update'}
          </Button>
          <Button htmlType="button" onClick={() => setIsOpenModal(false)}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </CustomModal>
  );
};
export default CreateOrUpdateKnockOutMatch;
