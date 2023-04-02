import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import genderConst from '../../lib/genderConst';
import { playingRoleOptions } from '../../components/Enum/enum';
import getImage from '../../lib/getImage';
import playerService from '../../services/player/playerService';
import { useHistory, useParams } from 'react-router-dom';
import ChooseOppeners from './chooseOppeners';
import liveScoringService from '../../services/live-scoring/liveScoringService';
import { InningConst, IsLiveOrMannual, MatchStatus, ScoringBy } from '../../lib/appconst';
import { Button, Card, Form, Modal, PageHeader } from 'antd';

const NewInning = () => {
  const error = Modal.error;
  const history = useHistory();

  const [team1AllPlayers, setTeam1AllPlayers] = useState([]);
  const [team2AllPlayers, setTeam2AllPlayers] = useState([]);
  const [team1SelectedPlayers, setTeam1SelectedPlayers] = useState([]);
  const [team2SelectedPlayers, setTeam2SelectedPlayers] = useState([]);
  const [initLoading, setInitLoading] = useState([]);
  const [team1List, setTeam1List] = useState([]);
  const [team2List, setTeam2List] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const param = useParams();
  useEffect(() => {
    getAllPlayerByTeamId(param.matchId, param.team1Id);
    getAllPlayerByTeamId(param.matchId, param.team2Id);
  }, []);

  const startMatchInitial = {
    striker: '',
    nonStriker: '',
    bowler: '',
  };
  const startMatchValidation = Yup.object().shape({
    striker: Yup.string().required('Required'),
    nonStriker: Yup.string().required('Required'),
    bowler: Yup.string().required('Required'),
  });

  const handleSubmit = () => {
    const teamPlayers = [];
    team2SelectedPlayers.forEach((playerId) => {
      const teamPlayer = {
        playerId: playerId,
        position: startMatchFormik.values.striker == playerId ? 1 : startMatchFormik.values.nonStriker == playerId ? 2 : null,
        matchId: param.matchId,
        teamId: param.team2Id,
        isPlayedInning: startMatchFormik.values.striker == playerId || startMatchFormik.values.nonStriker == playerId ? true : false,
        IsStriker: startMatchFormik.values.striker == playerId,
      };
      teamPlayers.push(teamPlayer);
    });
    team1SelectedPlayers.forEach((playerId) => {
      const teamPlayer = {
        playerId: playerId,
        position: null,
        matchId: param.matchId,
        teamId: param.team1Id,
        isPlayedInning: false,
        isBowling: startMatchFormik.values.bowler == playerId,
      };
      teamPlayers.push(teamPlayer);
    });
    const req = {
      status: MatchStatus.STARTED,
      matchId: param.matchId,
      scoringBy: ScoringBy.WEBAPP,
      IsLiveOrMannual: IsLiveOrMannual.LIVE,
      players: teamPlayers,
      team1Id: param.team2Id,
      team2Id: param.team1Id,
      Inning: InningConst.SECOND_INNING,
    };
    liveScoringService.startSecondInning(req).then((res) => {
      res.success
        ? history.push(
            '/liveScoring/team1/' + param.team1Id + '/' + param.team1 + '/team2/' + param.team2Id + '/' + param.team2 + '/match/' + param.matchId
          )
        : error({ title: res.successMessage });
      setIsLoading(false);
    });
  };

  const startMatchFormik = useFormik({
    enableReinitialize: true,
    initialValues: startMatchInitial,
    validationSchema: startMatchValidation,
    onSubmit: handleSubmit,
  });

  const handleChange = (value, key) => {
    startMatchFormik.setValues({ ...startMatchFormik.values, [key]: value });
  };

  const getAllPlayerByTeamId = (matchId, teamId) => {
    setInitLoading(true);
    playerService.getTeamPlayersByMatchId(matchId, teamId).then((res) => {
      setInitLoading(false);

      if (teamId == param.team1Id) {
        const team1PlayerIds = res.map((item) => item.id);
        setTeam1AllPlayers(res);
        setTeam1SelectedPlayers(team1PlayerIds);
      }
      if (teamId == param.team2Id) {
        const team2PlayerIds = res.map((item) => item.id);
        setTeam2AllPlayers(res);
        setTeam2SelectedPlayers(team2PlayerIds);
      }
    });
  };

  return (
    <Card>
      <Form onSubmit={startMatchFormik.handleSubmit}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          onBack={history.goBack}
          title={'Second Inning'}
        />
        <ChooseOppeners
          team1AllPlayers={team2AllPlayers}
          team1SelectedPlayers={team2SelectedPlayers}
          startMatchFormik={startMatchFormik}
          handleChange={handleChange}
          team2AllPlayers={team1AllPlayers}
          team2SelectedPlayers={team1SelectedPlayers}
        />
        <Form.Item>
          <Button style={{ display: 'flex', float: 'right' }} htmlType="submit" type="primary" disabled={isLoading}>
            Start
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NewInning;
