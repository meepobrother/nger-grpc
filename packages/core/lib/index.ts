
import { Module, InjectionToken, ModuleWithProviders, Injector } from '@nger/core'
import { GrpcService } from './grpc.service';
import { GRPC_URL, GRPC_ARGS } from './tokens';
import { rpcHandler } from './handlers/rpc';
import { ArgsMetadataKey, UnaryCallMetadataKey, ClientStreamingCallMetadataKey, ServerStreamingCallMetadataKey, BidiStreamingCallMetadataKey } from './decorator';
import { IParameterDecorator, IMethodDecorator } from '@nger/decorator';
export * from './handlers/rpc'
export * from './handlers/rpcRef'
import { handleUnaryCall } from './handlers/handleUnaryCall'
import { handleClientStreamingCall } from './handlers/handleClientStreamingCall';
import { handleServerStreamingCall } from './handlers/handleServerStreamingCall';
import { handleBidiStreamingCall } from './handlers/handleBidiStreamingCall';
@Module({
    providers: [
        GrpcService,
        rpcHandler,
        {
            provide: ArgsMetadataKey,
            useValue: (handler: Function, args: any[], instance: any, injector: Injector, item: IParameterDecorator) => {
                const grpcArgs = injector.get(GRPC_ARGS, null);
                Reflect.set(args, item.parameterIndex, grpcArgs)
            }
        },
        {
            provide: UnaryCallMetadataKey,
            useValue: (handler: Function, instance: any, injector: Injector, item: IMethodDecorator) => {
                const mth = handleUnaryCall(handler, instance, injector, item)
                Reflect.set(instance, item.property, mth)
            }
        },
        {
            provide: ClientStreamingCallMetadataKey,
            useValue: (handler: Function, instance: any, injector: Injector, item: IMethodDecorator) => {
                const mth = handleClientStreamingCall(handler, instance, injector, item)
                Reflect.set(instance, item.property, mth)
            }
        },
        {
            provide: ServerStreamingCallMetadataKey,
            useValue: (handler: Function, instance: any, injector: Injector, item: IMethodDecorator) => {
                const mth = handleServerStreamingCall(handler, instance, injector, item)
                Reflect.set(instance, item.property, mth)
            }
        },
        {
            provide: BidiStreamingCallMetadataKey,
            useValue: (handler: Function, instance: any, injector: Injector, item: IMethodDecorator) => {
                const mth = handleBidiStreamingCall(handler, instance, injector, item)
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
