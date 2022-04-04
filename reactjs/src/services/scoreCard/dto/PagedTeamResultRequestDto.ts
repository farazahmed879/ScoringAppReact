import { PagedFilterAndSortedRequest } from "../../dto/pagedFilterAndSortedRequest";

export interface PagedTeamResultRequestDto extends PagedFilterAndSortedRequest {
  name: string;
}