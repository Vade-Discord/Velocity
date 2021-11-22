declare module "eris" {
    interface Client {
        getUser(id: string): Promise<any>
    }
}