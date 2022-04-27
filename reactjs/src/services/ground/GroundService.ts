import http from '../httpService';
import { GroundDto } from './dto/GroundDto';
import { PagedGroundResultRequestDto } from './dto/PagedGroundResultRequestDto';

class GroundService {
  public async createOrUpdate(createRoleInput: any) {
    let result = await http.post('/api/services/app/Ground/CreateOrEdit', createRoleInput);
    return result.data.result;
  }

  public async delete( id: Number) {
    let result = await http.delete(`api/services/app/Ground/Delete?id=${id}`);
    return result.data;
  }

  public async getById(id: Number): Promise<GroundDto> {
    let result = await http.get(`api/services/app/Ground/getById?id=${id}`);
    return result.data;
  }

  public async getAll() {
    let result = await http.get('/api/services/app/Ground/GetAll');
    return result.data.result;
  }

  public async getPaginatedAll(pagedFilterAndSortedRequest: PagedGroundResultRequestDto) {
    let result = await http.get('/api/services/app/Ground/GetPaginatedAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
}

export default new GroundService();
