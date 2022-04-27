import { PagedFilterAndSortedRequest } from "../../dto/pagedFilterAndSortedRequest";

export interface PagedEventResultRequestDto extends PagedFilterAndSortedRequest {
  name: string;
}