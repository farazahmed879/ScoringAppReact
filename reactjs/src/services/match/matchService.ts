import http from '../httpService';

class MatchService {
  public async createOrUpdate(input: any) {
    let result = await http.post('/api/services/app/Match/CreateOrEdit', input);
    return result.data.result;
  }

  public async delete(matchId: Number) {
    let result = await http.delete(`api/services/app/Match/DeleteMatchById=${matchId}`);
    return result.data;
  }

  public async getMatchById(matchId: Number): Promise<any> {
    let result = await http.get(`api/services/app/Match/GetById?id=${matchId}`);
    return result.data.result;
  }

  public async EditEventMatch(matchId: Number): Promise<any> {
    let result = await http.post(`/api/services/app/Match/EditEventMatch?id=${matchId}`);
    return result.data.result;
  }

  public async getAll() {
    let result = await http.get('/api/services/app/Match/GetAll');
    return result.data.result;
  }

  public async getPaginatedAll(pagedFilterAndSortedRequest: any) {
    let result = await http.get('/api/services/app/Match/GetPaginatedAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllMatchesByEventId(id: number) {
    let result = await http.get(`/api/services/app/Match/GetAllStagedMatchesByEventId?eventId=${id}`);
    return result.data.result;
  }

  public async getAllMatchesByPlayerId(id: number, matchResultFilter: number) {
    let result = await http.get(`/api/services/app/Match/GetMatchesByPlayerId?id=${id}&matchResultFilter=${matchResultFilter}`);
    return result.data.result;
  }

  public async getMOMByPlayerId(id: number) {
    let result = await http.get(`/api/services/app/Match/GetMOMByPlayerId?id=${id}`);
    return result.data.result;
  }

  public async getAllMatchesByTeamId(id: number, matchResultFilter: number) {
    let result = await http.get(`/api/services/app/Match/GetMatchesByTeamId?id=${id}&matchResultFilter=${matchResultFilter}`);
    return result.data.result;
  }

  public async getMatchesViewByEventId(id: number) {
    let result = await http.get(`/api/services/app/Match/GetMatchesByEventId?id=${id}`);
    return result.data.result;
  }
}

export default new MatchService();
