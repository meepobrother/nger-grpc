import { GrpcMethod, Grpc, GrpcArgs } from "../lib/decorator";
export interface User {
    username: string;
}
@Grpc('Demo')
export class DemoController {
    @GrpcMethod()
    getUser(@GrpcArgs() user: User): User { 
        return user;
    }
}