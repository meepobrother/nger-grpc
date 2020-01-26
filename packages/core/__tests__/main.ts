import { corePlatform, Module, MAIN_PATH, PLATFORM_NAME } from '@nger/core'
import { GrpcModule } from '../lib'
import { GrpcService } from '../lib/grpc.service'
import { DemoController } from './controller'
@Module({
    imports: [
        GrpcModule.forRoot('0.0.0.0:4002')
    ],
    controllers: [
        DemoController
    ]
})
export class AppModule { }
corePlatform([{
    provide: MAIN_PATH,
    useValue: __filename
}, {
    provide: PLATFORM_NAME,
    useValue: 'basic'
}]).bootstrapModule(AppModule).then(res => {
    const service = res.get(GrpcService)
    const server = service.createServer();
    server.start()
})
