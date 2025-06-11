
export interface UserType {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
}
enum UserRole {
    TRAINER = "TRAINER", 
    CLIENT = "CLIENT"
}
