export interface WelcomeMessage {
    userToken: string;
    idTicket?: number;
}

export enum TypeUser {
    Operator = 'OPERATOR',
    User = 'USER',
}

export interface IMessageToSend {
    idTicket: number;
    event: string;
    obj: any;
}
