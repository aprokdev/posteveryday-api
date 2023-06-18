export interface IAuth {
    signToken: (email: string) => Promise<string>;
    verifyToken: (token: string) => Promise<string>;
}
