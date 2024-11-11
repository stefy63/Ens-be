import { PaginationRequest } from "../requests/PaginationRequest";

export class PaginationResponse extends PaginationRequest {
    // The total number of elements
    public totalElements: number;
    // The total number of pages
    public totalPages: number;
}
