import http from '../httpService';
import { CreateOrUpdateTeamDto } from './dto/CreateOrUpdateTeamDto';
import { PagedTeamResultRequestDto } from './dto/PagedTeamResultRequestDto';
import { TeamDto } from './dto/TeamDto';

class TeamService {
  public async createOrUpdate(createRoleInput: CreateOrUpdateTeamDto) {
    let result = await http.post('/api/services/app/Team/CreateOrEdit', createRoleInput);
    return result.data.result;
  }

  public async delete( playerId: Number) {
    let result = await http.delete(`api/services/app/Team/DeleteplayerId=${playerId}`);
    return result.data;
  }

  public async getPlayerById(playerId: Number): Promise<TeamDto> {
    let result = await http.get(`api/services/app/Team/GetRoleForEdit?playerId=${playerId}`);
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
}

export default new TeamService();
