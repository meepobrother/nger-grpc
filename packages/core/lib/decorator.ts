import { createMethodDecorator, createClassDecorator, createParameterDecorator } from '@nger/decorator'
import { InjectionToken } from '@nger/core'
export const GrpcMetadataKey = `@nger/grpc Rpc`
export interface GrpcOptions {
    path: string | InjectionToken<string>;
}
export const Grpc = createClassDecorator<GrpcOptions | string | InjectionToken<string>>(GrpcMetadataKey, it => {
    const options = it.options;
    if (options instanceof InjectionToken) {
        it.options = {
            path: options
        }
    }
    else if (typeof options === 'string') {
        it.options = {
            path: options
        }
    } else if (options) {
        it.options = options;
    } else {
        it.options = {
            path: it.type.name
        }
    }
})
/**
 * 普通
 */
export const UnaryCallMetadataKey = `UnaryCallMetadataKey`
export interface UnaryCallOptions { }
export const UnaryCall = createMethodDecorator<UnaryCallOptions>(UnaryCallMetadataKey)

export const ClientStreamingCallMetadataKey = `ClientStreamingCallMetadataKey`
export interface ClientStreamingCallOptions { }
export const ClientStreamingCall = createMethodDecorator<ClientStreamingCallOptions>(ClientStreamingCallMetadataKey)

export const ServerStreamingCallMetadataKey = `ServerStreamingCallMetadataKey`;
export interface ServerStreamingCallOptions{}
export const ServerStreamingCall = createMethodDecorator<ServerStreamingCallOptions>(ServerStreamingCallMetadataKey)

export const BidiStreamingCallMetadataKey = `BidiStreamingCallMetadataKey`;
export interface BidiStreamingCallOptions{}
export const BidiStreamingCall = createMethodDecorator<BidiStreamingCallOptions>(BidiStreamingCallMetadataKey)

export const ArgsMetadataKey = `@nger/grpc Args`
export interface ArgsOptions { }
export const Args = createParameterDecorator<ArgsOptions>(ArgsMetadataKey)
