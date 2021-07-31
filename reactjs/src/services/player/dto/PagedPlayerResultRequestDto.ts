import { PagedFilterAndSortedRequest } from "../../dto/pagedFilterAndSortedRequest";

export interface PagedPlayerResultRequestDto extends PagedFilterAndSortedRequest {
  name: string;
}