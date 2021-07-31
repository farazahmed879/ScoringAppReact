import { action, observable } from 'mobx';
import { GetAllPermissionsOutput } from '../services/role/dto/getAllPermissionsOutput';
import { PagedPlayerResultRequestDto } from '../services/player/dto/PagedPlayerResultRequestDto';
import playerService from '../services/player/playerService';

class PlayerStore {
  //@observable roles!: PagedResultDto<GetAllPlayerOutput>;
  //@observable roleEdit: PlayerEditModel = new PlayerEditModel();
  @observable allPermissions: GetAllPermissionsOutput[] = [];

  @action
  async getPaginatedAll(pagedFilterAndSortedRequest: PagedPlayerResultRequestDto) {
    let result = await playerService.getPaginatedAll(pagedFilterAndSortedRequest);
   return result;
  }
}

export default PlayerStore;
