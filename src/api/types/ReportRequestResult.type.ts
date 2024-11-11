type Service = 'OPERATOR' | 'USER' | 'TICKET';

export interface ReportResult {
    operatorActive: number;
    userActive: number;
    ticket: any;
}

export interface ReportRequest {
    service: Service;
    fromDate?: Date;
    toDate?: Date;
}
