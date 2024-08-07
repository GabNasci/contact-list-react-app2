export interface ContactInterface {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    note: string;
    type: string;
  }

export enum Type {
  All = "Todos",
  Personal = "Pessoal",
  Professional = "Profissional"
}

export enum Option {
  Name = "name",
  Email = "email",
  Phone = "phone"
}