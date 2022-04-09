import { PagedFilterAndSortedRequest } from "../../dto/pagedFilterAndSortedRequest";

export interface PagedTeamScoreResultRequestDto extends PagedFilterAndSortedRequest {
  name: string;
}