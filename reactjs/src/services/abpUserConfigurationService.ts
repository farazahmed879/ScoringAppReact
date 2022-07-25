import http from './httpService';

class AbpUserConfigurationService {
  public async getAll() {
    const result = await http.get('/AbpUserConfiguration/GetAll');
    return result;
  }

  public async getUserByContact(contact: string) {
    const result = await http.get(`/AbpUserConfiguration/GetAll?contact=${contact}`);
    return result;
  }
}

export default new AbpUserConfigurationService();
