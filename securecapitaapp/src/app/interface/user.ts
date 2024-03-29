export interface User {
    id :number;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    email: string;
    enabled: boolean;
    nonLocked: boolean;
    mfaEnabled: boolean;
    createdOn?: Date;
    imageUrl?: string;
    title?: string ;
    bio?:string ;
    roleName: string;
    permissions: string;
}


     

