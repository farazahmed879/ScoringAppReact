import http from '../httpService';
import { GroundDto } from './dto/EventDto';

class EventService {
  public async createOrUpdate(createRoleInput: any) {
    let result = await http.post('/api/services/app/Event/CreateOrEdit', createRoleInput);
    return result.data.result;
  }

  public async delete(id: number) {
    let result = await http.delete(`api/services/app/Event/Delete?id=${id}`);
    return result.data;
  }

  public async getById(id: number): Promise<GroundDto> {
    let result = await http.get(`api/services/app/Event/getById?id=${id}`);
    return result.data;
  }

  public async getAll() {
    let result = await http.get('/api/services/app/Event/GetAll');
    return result.data.result;
  }

  public async getPaginatedAll(pagedFilterAndSortedRequest: any) {
    let result = await http.get('/api/services/app/Event/GetPaginatedAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async createEventTeams(model: any) {
    let result = await http.post('/api/services/app/Event/CreateOrUpdateEventTeams', model);
    return result.data.result;
  }

  public async getAllEventsByTeamId(id: number) {
    let result = await http.get(`/api/services/app/Event/GetAllEventsByTeamId?id=${id}`);
    return result.data.result;
  }

  public async getEventStats(eventId: number) {
    let result = await http.get(`/api/services/app/Event/GetEventStat?id=${eventId}`);
    return result.data.result;
  }
}

export default new EventService();
