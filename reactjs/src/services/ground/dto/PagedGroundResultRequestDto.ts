import { PagedFilterAndSortedRequest } from "../../dto/pagedFilterAndSortedRequest";

export interface PagedGroundResultRequestDto extends PagedFilterAndSortedRequest {
  name: string;
}