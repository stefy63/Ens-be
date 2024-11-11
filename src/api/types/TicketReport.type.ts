export interface TicketReportType {
    id?: number;
    id_ticket: number;
    number: string;
    id_call_type?: number;
    id_call_result?: number;
}

export interface TicketReportRaw {
    ticket_id: number;
    ticket_op_num_history: number;
    ticket_user_num_history: number;
    category_deleted: number;
    category_category: string;
    ticket_date_time: string;
    service_service: string;
    status_status: string;
    operatordata_id: number;
    operatordata_name: string;
    operatordata_surname: string;
    userdatas_name: string;
    userdatas_surname: string;
    operator_office_office: string;
    phones: string;
}
