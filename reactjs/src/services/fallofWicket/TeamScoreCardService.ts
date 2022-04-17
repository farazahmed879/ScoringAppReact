import http from '../httpService';

class FallofWicketService {
  public async createOrUpdate(req: any) {
    let result = await http.post('/api/services/app/FallofWicket/CreateOrEdit', req);
    return result.data.result;
  }

  public async delete(id: Number) {
    let result = await http.delete(`api/services/app/FallofWicket/Delete?id=${id}`);
    return result.data;
  }

  public async getTeamScoreById(id: Number): Promise<any> {
    let result = await http.get(`api/services/app/FallofWicket/GetById?id=${id}`);
    return result.data.result;
  }

  public async getByTeamIdAndMatchId(teamId: Number, matchId: Number) {
    let result = await http.get(`/api/services/app/FallofWicket/GetByTeamIdAndMatchId?teamId=${teamId}&matchId=${matchId}`);
    return result.data.result;
  }
}

export default new FallofWicketService();
