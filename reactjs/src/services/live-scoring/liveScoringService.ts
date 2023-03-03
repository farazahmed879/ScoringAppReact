import http from '../httpService';

class liveScoringService {
  public async updateLiveScore(input: any) {
    let result = await http.post('/api/services/app/LiveScore/Submit', input);
    return result.data;
  }

  public async Get(matchId: Number) {
    let result = await http.get(`/api/services/app/LiveScore/Get?matchId=${matchId}`);
    return result.data;
  }

  public async getPlayers(matchId: Number, teamId: Number): Promise<any> {
    let result = await http.get(`/api/services/app/LiveScore/GetPlayers?matchId=${matchId}&teamId=${teamId}`);
    return result.data;
  }

  public async changeBowler(input: any) {
    let result = await http.post('/api/services/app/LiveScore/ChangeBowler', input);
    return result.data;
  }

  public async updateNewBatsman(input: any) {
    let result = await http.put('/api/services/app/LiveScore/UpdateNewBatsman', input);
    return result.data;
  }

  public async changeBatsman(input: any) {
    let result = await http.post('/api/services/app/LiveScore/ChangeBatsman', input);
    return result.data;
  }

  // this service is used for StartMatch or FirstInning 
  public async startMatch(model: any) {
    let result = await http.post('/api/services/app/Match/CreateMatchDetails', model);
    return result.data.result;
  }

// this service is used for StartMatch or SeconsdInning
  public async startSecondInning(input: any) {
    let result = await http.put('/api/services/app/Match/UpdateMatchDetails', input);
    return result.data;
  }
}

export default new liveScoringService();
