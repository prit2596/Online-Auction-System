export class User {
    constructor(
        public first_name: string,
        public last_name: string,
        public password: string,
        public confirm_password: string,
        public email: string,
        public address: string,
        public profilePic: File
    ){}
}
