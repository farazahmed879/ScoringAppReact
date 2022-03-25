import http from '../httpService';

class MatchService {
  public async createOrUpdate(createRoleInput: any) {
    let result = await http.post('/api/services/app/Match/CreateOrEdit', createRoleInput);
    return result.data.result;
  }

  public async delete( matchId: Number) {
    let result = await http.delete(`api/services/app/Match/DeleteMatchById=${matchId}`);
    return result.data;
  }

  public async getMatchById(matchId: Number): Promise<any> {
    let result = await http.get(`api/services/app/Role/GetRoleForEdit?matchId=${matchId}`);
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
}

export default new MatchService();