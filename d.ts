declare module "eris" {
    interface Client {
        getUser(id: string): Promise<any>
    }
    interface Guild {
        getMember(id: string): Promise<any>
    }
}