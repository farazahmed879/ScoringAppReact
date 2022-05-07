import http from '../httpService';

class StatisticsService {

  public async mostRuns(data: any) {
    let result = await http.post('/api/services/app/Statistics/MostRuns', data);
    return result.data.result;
  }

  public async mostWickets(data: any) {
    let result = await http.post('/api/services/app/Statistics/MostWickets', data);
    return result.data.result;
  }

  public async mostFifties(data: any) {
    let result = await http.post('/api/services/app/Statistics/MostFifties', data);
    return result.data.result;
  }

  public async mostCenturies(data: any) {
    let result = await http.post('/api/services/app/Statistics/MostCenturies', data);
    return result.data.result;
  }

  public async mostFours(data: any) {
    let result = await http.post('/api/services/app/Statistics/MostFours', data);
    return result.data.result;
  }

  public async mostCatches(data: any) {
    let result = await http.post('/api/services/app/Statistics/MostCatches', data);
    return result.data.result;
  }

  public async mostStumps(data: any) {
    let result = await http.post('/api/services/app/Statistics/MostStumps', data);
    return result.data.result;
  }
}

export default new StatisticsService();
