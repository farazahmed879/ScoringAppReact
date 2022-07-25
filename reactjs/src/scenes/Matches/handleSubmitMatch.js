import { Modal } from "antd";
import moment from "moment";
import matchTypeConst from "../../lib/matchTypeConst";
import matchService from "../../services/match/matchService";
const success = Modal.success;
const error = Modal.error;

export const handleSubmitMatch = (matchFormik) => {
  if (!matchFormik.isValid) return;
  let req = {
    id: matchFormik.values.id,
    groundId: matchFormik.values.groundId,
    matchOvers: +matchFormik.values.matchOvers,
    matchDescription: matchFormik.values.matchDescription,
    season: +matchFormik.values.season,
    eventId: +matchFormik.values.eventId,
    tossWinningTeam: matchFormik.values.tossWinningTeam,
    team1Id: matchFormik.values.team1Id,
    team2Id: matchFormik.values.team2Id,
    eventType: matchFormik.values.eventType,
    eventStage: matchFormik.values.eventStage,
    eventStage: matchFormik.values.eventStage,
    dateOfMatch: moment(matchFormik.values.dateOfMatch).valueOf(),
    playerOTM: matchFormik.values.playerOTM,
  };

  console.log('Match Object', req);
  return matchService.createOrUpdate(req).then((res) => {
    res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
    return res.success;
  });
};