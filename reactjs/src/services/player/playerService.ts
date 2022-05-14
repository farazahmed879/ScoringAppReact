import http from '../httpService';
import { PlayerDto } from './dto/PlayerDto';

class PlayerService {
  public async createOrUpdate(createRoleInput: any) {
    let result = await http.post('/api/services/app/Player/CreateOrEdit', createRoleInput);
    return result.data.result;
  }

  public async delete(id: Number) {
    let result = await http.delete(`api/services/app/Player/Delete=${id}`);
    return result.data;
  }

  public async getPlayerById(playerId: Number): Promise<PlayerDto> {
    let result = await http.get(`api/services/app/Player/GetById?id=${playerId}`);
    return result.data.result;
  }

  public async getAll() {
    let result = await http.get('/api/services/app/Player/GetAll');
    return result.data.result;
  }

  public async getAllByTeamId(teamId: number) {
    let result = await http.get(`/api/services/app/Player/GetAllByTeamId?teamId=${teamId}`);
    return result.data.result;
  }

  public async getPlayersByEventId(eventId: number) {
    let result = await http.get(`/api/services/app/Player/getPlayersByEventId?id=${eventId}`);
    return result.data.result;
  }

  public async getAllByMatchId(matchId: number) {
    let result = await http.get(`/api/services/app/Player/GetAllByMatchId?teamId=${matchId}`);
    return result.data.result;
  }

  public async getPaginatedAll(pagedFilterAndSortedRequest: any) {
    let result = await http.get('/api/services/app/Player/GetPaginatedAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async playerStatistics(data: any) {
    let result = await http.post('/api/services/app/Player/PlayerStatistics', data);
    return result.data.result;
  }
}

export default new PlayerService();
