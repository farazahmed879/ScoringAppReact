import http from '../httpService';
import { UmpireDto } from './dto/UmpireDto';
import { PagedUmpireResultRequestDto } from './dto/PagedUmpireResultRequestDto';

class UmpireService {
  public async createOrUpdate(createRoleInput: any) {
    let result = await http.post('/api/services/app/Umpire/CreateOrEdit', createRoleInput);
    return result.data.result;
  }

  public async delete(id: Number) {
    let result = await http.delete(`api/services/app/Umpire/Delete?id=${id}`);
    return result.data.result;
  }

  public async getById(id: Number): Promise<UmpireDto> {
    let result = await http.get(`api/services/app/Umpire/getById?id=${id}`);
    return result.data;
  }

  public async getAll() {
    let result = await http.get('/api/services/app/Umpire/GetAll');
    return result.data.result;
  }

  public async getPaginatedAll(pagedFilterAndSortedRequest: PagedUmpireResultRequestDto) {
    let result = await http.get('/api/services/app/Umpire/GetPaginatedAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
}

export default new UmpireService();
