import { UnaryCall, ClientStreamingCall, ServerStreamingCall, BidiStreamingCall, Grpc, Args } from "../lib/decorator";
import { Observable, of } from 'rxjs'
export interface User {
    username: string;
}
@Grpc('Demo')
export class DemoController {
    @UnaryCall()
    getUser(@Args() user: User): User {
        return user;
    }

    @ClientStreamingCall()
    async getUser2(@Args() user: Observable<User>) {
        return user.toPromise();
    }

    @ServerStreamingCall()
    getUser3(@Args() user: User): Observable<User> {
        return of(user)
    }

    @BidiStreamingCall()
    getUser4(@Args() user: Observable<User>): Observable<User> {
        return user;
    }
}