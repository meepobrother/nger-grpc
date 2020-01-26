
import { Module, InjectionToken, ModuleWithProviders, Injector } from '@nger/core'
import { GrpcService } from './grpc.service';
import { GRPC_URL, GRPC_CALL, GRPC_CALL_BACK } from './tokens';
import { rpcHandler } from './handlers/rpc';
import { GrpcArgsMetadataKey, GrpcMethodMetadataKey } from './decorator';
import { IParameterDecorator, IMethodDecorator } from '@nger/decorator';
export * from './handlers/rpc'
export * from './handlers/rpcRef'
import { handleUnaryCall } from './handlers/handleUnaryCall'
@Module({
    providers: [
        GrpcService,
        rpcHandler,
        {
            provide: GrpcArgsMetadataKey,
            useValue: (handler: Function, args: any[], instance: any, injector: Injector, item: IParameterDecorator) => {
                const call = injector.get(GRPC_CALL, null);
                const request = call.request;
                const options = item.options;
                if (options) { } else {
                    Reflect.set(args, item.parameterIndex, request)
                }
            }
        },
        {
            provide: GrpcMethodMetadataKey,
            useValue: (handler: Function, instance: any, injector: Injector, item: IMethodDecorator) => {
                const mth = handleUnaryCall(handler, instance, injector, item)
                Reflect.set(instance, item.property, mth)
            }
        }
    ]
})
export class GrpcModule {
    static forRoot(url: string | InjectionToken<string>): ModuleWithProviders {
        return {
            ngModule: GrpcModule,
            providers: [{
                provide: GRPC_URL,
                useFactory: (injector: Injector) => {
                    return url instanceof InjectionToken ? injector.get(url) : url;
                },
                deps: [Injector]
            }]
        }
    }
}
