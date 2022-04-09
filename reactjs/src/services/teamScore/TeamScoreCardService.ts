import http from '../httpService';
import { TeamScoreDto } from './dto/TeamScoreDto';

class TeamScoreCardService {
  public async createOrUpdate(req: any) {
    let result = await http.post('/api/services/app/TeamScores/CreateOrEdit', req);
    return result.data.result;
  }

  public async delete(id: Number) {
    let result = await http.delete(`api/services/app/TeamScores/Delete?id=${id}`);
    return result.data;
  }

  public async getTeamScoreById(id: Number): Promise<TeamScoreDto> {
    let result = await http.get(`api/services/app/TeamScores/GetById?id=${id}`);
    return result.data.result;
  }

  public async getByTeamIdAndMatchId(teamId: Number, matchId: Number) {
    let result = await http.get(`/api/services/app/TeamScores/GetByTeamIdAndMatchId?teamId=${teamId}&matchId=${matchId}`);
    return result.data.result;
  }
}

export default new TeamScoreCardService();
