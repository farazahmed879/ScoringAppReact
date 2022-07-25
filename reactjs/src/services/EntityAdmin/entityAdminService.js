import http from '../httpService';

class entityAdminService {
  async CreateOrEdit(input) {
    let result = await http.post(`/api/services/app/EntityAdmin/CreateOrEdit`, input);
    return result.data;
  }
}

export default new entityAdminService();
