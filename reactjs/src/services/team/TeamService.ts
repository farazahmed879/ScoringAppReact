import http from '../httpService';
//import { CreateOrUpdateTeamDto } from './dto/CreateOrUpdateTeamDto';
import { PagedTeamResultRequestDto } from './dto/PagedTeamResultRequestDto';
import { TeamDto } from './dto/TeamDto';

class TeamService {
  public async createOrUpdate(createRoleInput: any) {
    let result = await http.post('/api/services/app/Team/CreateOrEdit', createRoleInput);
    return result.data.result;
  }

  public async delete(id: Number) {
    let result = await http.delete(`api/services/app/Team/Delete?id=${id}`);
    return result.data.result;
  }

  public async getTeamById(id: Number): Promise<TeamDto> {
    let result = await http.get(`api/services/app/Team/GetById?id=${id}`);
    return result.data.result;
  }

  public async getAll() {
    let result = await http.get('/api/services/app/Team/GetAll');
    return result.data.result;
  }

  public async getPaginatedAll(pagedFilterAndSortedRequest: PagedTeamResultRequestDto) {
    let result = await http.get('/api/services/app/Team/GetPaginatedAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async createTeamPlayers(model: any) {
    let result = await http.post('/api/services/app/Player/CreateOrUpdateTeamPlayers', model);
    return result.data.result;
  }

  public async getAllEventTeams(eventId: number, group: number) {
    var url = `/api/services/app/Team/GetAllTeamsByEventId?id=${eventId}`;
    if (group && group > 0) url = url + `&group=${group}`;
    let result = await http.get(url);
    return result.data.result;
  }

  public async getEventGroupWiseTeams(eventId: number) {
    let result = await http.get(`/api/services/app/Team/GetAllTeamsByGroupWiseEventId?id=${eventId}`);
    return result.data.result;
  }

  public async getMatchTeams(matchId: number) {
    let result = await http.get(`/api/services/app/Team/GetAllTeamsByMatchId?id=${matchId}`);
    return result.data.result;
  }

  public async getAllTeamsByPlayerId(playerId: number) {
    let result = await http.get(`/api/services/app/Team/GetAllTeamsByPlayerId?id=${playerId}`);
    return result.data.result;
  }

  public async getTeamStats(data: any) {
    let result = await http.post('/api/services/app/Team/TeamStats', data);
    return result.data.result;
  }

  public async SaveImages(data: any) {
    let result = await http.post('/api/services/app/Team/SaveImages', data);
    return result.data.result;
  }
}

export default new TeamService();
