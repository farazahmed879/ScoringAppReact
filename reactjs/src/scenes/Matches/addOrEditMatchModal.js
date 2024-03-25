import { Button, Col, Divider, Icon, Form, Popover, Row, Skeleton, Upload } from 'antd';
import moment from 'moment';
import React from 'react';
import CustomInput from '../../components/Input';
import CustomModal from '../../components/Modal';
import matchTypeConst from '../../lib/matchTypeConst';
import tournamentTypeConst from '../../lib/tournamentTypeConst';

const AddOrEditMatchModal = ({
  isOpenModal,
  isEditDataLoading,
  matchFormik,
  profile,
  handleDeletePicture,
  picture,
  handleProfileUpload,
  handlePreview,
  matchTypes,
  handleChange,
  teamList,
  groundList,
  playerList,
  gallery,
  handleCancel,
  handleUpload,
  groups,
  eventList,
}) => {

  return (
    <CustomModal title={Object.keys(matchFormik.values).length ? 'Edit Match' : 'Add Match'} isModalVisible={isOpenModal} handleCancel={handleCancel}>
      <Skeleton loading={isEditDataLoading}>
        <Form className="form" onSubmit={matchFormik.handleSubmit}>
          <Row gutter={16} className="form-container">
            <Col span={24}>
              <Popover content={!Object.keys(profile).length || <Icon type="delete" onClick={handleDeletePicture} />}>
                <span style={{ color: '#C9236A', fontStyle: 'italic' }}>{picture ? 'Required' : ''}</span>
                <Upload
                  multiple={false}
                  listType="picture-card"
                  accept=".png,.jpeg,.jpg"
                  fileList={profile}
                  type="FormFile"
                  stateKey="profile"
                  disabled={!!Object.keys(profile).length}
                  onChange={(e) => handleProfileUpload(e)}
                  beforeUpload={false}
                  onPreview={handlePreview}
                >
                  Profile
                </Upload>
              </Popover>
            </Col>
            <Col span={8}>
              <CustomInput
                title="Match Type"
                type="select"
                options={matchTypes}
                handleChange={handleChange}
                value={matchFormik.values.matchTypeId}
                stateKey="matchTypeId"
                placeholder="Select Type"
                errorMessage={matchFormik.errors.matchTypeId}
              />
            </Col>
            <Col span={8}>
              {matchFormik.values.matchTypeId == matchTypeConst.tournament || matchFormik.values.matchTypeId == matchTypeConst.series ? (
                <CustomInput
                  title="Event"
                  type="select"
                  handleChange={handleChange}
                  options={
                    matchFormik.values.id
                      ? eventList
                      : eventList.filter((i) => i.eventType == matchFormik.values.matchTypeId && i.tournamentType == tournamentTypeConst.leagueBased)
                  }
                  value={matchFormik.values.eventId}
                  stateKey="eventId"
                  placeholder="Select Event"
                />
              ) : null}
            </Col>
            <Col span={8}>
              {matchFormik.values.matchTypeId == 1 && matchFormik.values.eventId && groups.length > 0 ? (
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
          <Row gutter={16} className="form-container">
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
          <Row gutter={16} className="form-container">
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
                value={moment(matchFormik.values.dateOfMatch)}
                stateKey="dateOfMatch"
                placeholder="Select Date"
              />
            </Col>
          </Row>

          <Row gutter={16} className="form-container">
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
          <Row gutter={16} className="form-container">
            <Col span={8}>
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
            {matchFormik.values.team1Id && matchFormik.values.team2Id ? (
              <Col span={8}>
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
            ) : null}
          </Row>
          <Row gutter={16} className="form-container">
            <Col>
              <CustomInput
                title="Description"
                type="text"
                handleChange={handleChange}
                value={matchFormik.values.matchDescription}
                stateKey="matchDescription"
                placeholder="Optional"
              />
            </Col>
            <Col span={24}>
              <Upload
                className="Gallery"
                beforeUpload={() => false}
                onPreview={handlePreview}
                value={matchFormik.values.gallery}
                fileList={gallery}
                multiple={true}
                listType="picture-card"
                onChange={(e) => handleUpload(e)}
              >
                Gallery
              </Upload>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={!matchFormik.isValid} onClick={matchFormik.handleSubmit}>
              {Object.keys(matchFormik.values).length ? 'Update' : 'Add'}
            </Button>
            <Button htmlType="button" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Skeleton>
    </CustomModal>
  );
};

export default AddOrEditMatchModal;
