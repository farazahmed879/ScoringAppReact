import http from '../httpService';
//import { CreateOrUpdateTeamDto } from './dto/CreateOrUpdateTeamDto';
import { TeamDto } from './dto/TeamDto';

class ScoreCardService {
  public async createOrUpdate(createRoleInput: any) {
    let result = await http.post('/api/services/app/PlayerScore/CreateOrEdit', createRoleInput);
    return result.data.result;
  }

  public async delete(id: Number) {
    let result = await http.delete(`api/services/app/PlayerScore/Delete?id=${id}`);
    return result.data;
  }

  public async getPlayerScoreById(id: Number): Promise<TeamDto> {
    let result = await http.get(`api/services/app/PlayerScore/GetById?id=${id}`);
    return result.data.result;
  }

  public async getAll(teamId: Number, matchId: Number) {
    let result = await http.get(`/api/services/app/PlayerScore/GetAll?teamId=${teamId}&matchId=${matchId}`);
    return result.data.result;
  }

  public async getTeamPlayersByMatchId(matchId: Number) {
    let result = await http.get(`/api/services/app/Player/GetTeamPlayersByMatchId?matchId=${matchId}`);
    return result.data.result;
  }

  public async getTeamScorecard(team1Id: Number,team2Id: Number, matchId: Number) {
    let result = await http.get(`/api/services/app/TeamScores/GetTeamScorecard?team1Id=${team1Id}&team2Id=${team2Id}&matchId=${matchId}`);
    return result.data;
  }
}

export default new ScoreCardService();
