import http from '../httpService';
import { CreateOrUpdatePlayerDto } from './dto/CreateOrUpdatePlayerDto';
import { PagedPlayerResultRequestDto } from './dto/PagedPlayerResultRequestDto';
import { PlayerDto } from './dto/PlayerDto';

class PlayerService {
  public async createOrUpdate(createRoleInput: CreateOrUpdatePlayerDto) {
    let result = await http.post('/api/services/app/Player/CreateOrEdit', createRoleInput);
    return result.data.result;
  }

  public async delete( playerId: Number) {
    let result = await http.delete(`api/services/app/Player/DeleteplayerId=${playerId}`);
    return result.data;
  }

  public async getPlayerById(playerId: Number): Promise<PlayerDto> {
    let result = await http.get(`api/services/app/Role/GetRoleForEdit?playerId=${playerId}`);
    return result.data.result;
  }

  public async getAll() {
    let result = await http.get('/api/services/app/Player/GetAll');
    return result.data.result;
  }

  public async getPaginatedAll(pagedFilterAndSortedRequest: PagedPlayerResultRequestDto) {
    let result = await http.get('/api/services/app/Player/GetPaginatedAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
}

export default new PlayerService();
