export class Usuario {
    constructor(
        public email: string,
        public first_name:string,
        public last_name:string,
        public role:string,
        public id?:number,
    ){}
}