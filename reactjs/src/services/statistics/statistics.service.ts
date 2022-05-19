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

  public async mostSixes(data: any) {
    let result = await http.post('/api/services/app/Statistics/MostSixes', data);
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

  public async mostMaidens(data: any) {
    let result = await http.post('/api/services/app/Statistics/MostMaidens', data);
    return result.data.result;
  }

  public async mostRunOuts(data: any) {
    let result = await http.post('/api/services/app/Statistics/MostRunouts', data);
    return result.data.result;
  }

  public async highestWicketsInAnInning(data: any) {
    let result = await http.post('/api/services/app/Statistics/highestWicketsInAnInning', data);
    return result.data.result;
  }

  public async highestRunsInAnInning(data: any) {
    let result = await http.post('/api/services/app/Statistics/highestRunsInAnInning', data);
    return result.data.result;
  }
}

export default new StatisticsService();
