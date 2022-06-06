import { Button, Col, Divider, Form, Row } from 'antd';
import React from 'react';
import CustomInput from '../../components/Input';
import CustomModal from '../../components/Modal';
const CreateOrUpdateLeagueBasedMatch = ({
  teamList = [],
  playerList = [],
  groundList = [],
  groups = [],
  stats,
  editMatch,
  matchFormik,
  isOpenModal,
  handleSubmit = (e) => {},
  handleCancel = (e) => {},
}) => {
  const handleChange = (value, key) => {
    matchFormik.setValues({ ...matchFormik.values, [key]: value });
  };

  console.log('groups', groups);
  console.log('teamList', teamList);
  return (
    <CustomModal title="Add Match" isModalVisible={isOpenModal} handleCancel={() => handleCancel(false)}>
      <Form className="form" onSubmit={matchFormik.handleSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <CustomInput
              title="Match Type"
              type="text"
              disabled={true}
              value={'Tournament'}
              stateKey="matchTypeId"
              placeholder="Select Type"
              errorMessage={matchFormik.errors.matchTypeId}
            />
          </Col>
          <Col span={8}>
            <CustomInput title="Event" type="text" disabled={true} value={stats.event} placeholder="Select Event" />
          </Col>
          <Col span={8}>
            {stats.type == 2 && stats.groups > 1 ? (
              <CustomInput
                title="Group"
                type="select"
                handleChange={handleChange}
                options={groups}
                value={matchFormik.values.group}
                stateKey="group"
                placeholder="Select Group"
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
              options={teamList.filter(i=> i.id != matchFormik.values.team2Id)}
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
              options={teamList.filter(i=> i.id != matchFormik.values.team1Id)}
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
export default CreateOrUpdateLeagueBasedMatch;
