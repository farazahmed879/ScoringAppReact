import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedUmpireResultRequestDto extends PagedFilterAndSortedRequest {
  name: string;
}
