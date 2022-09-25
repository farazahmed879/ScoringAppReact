import http from '../httpService';

class liveScoringService {
  public async updateLiveScore(input: any) {
    let result = await http.put('/api/services/app/LiveScore/UpdateLiveScore', input);
    return result.data;
  }

  public async Get(matchId: Number) {
    let result = await http.get(`/api/services/app/LiveScore/Get?matchId=${matchId}`);
    return result.data;
  }

  public async getPlayers(matchId: Number,teamId: Number): Promise<any> {
    let result = await http.get(`/api/services/app/LiveScore/GetPlayers?matchId=${matchId}&teamId=${teamId}`);
    return result.data;
  }

}

export default new liveScoringService();
