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
export const GrpcMethodMetadataKey = `RpcMethodMetadataKey`
export interface GrpcMethodOptions { }
export const GrpcMethod = createMethodDecorator<GrpcMethodOptions>(GrpcMethodMetadataKey)

export const GrpcStreamMetadataKey = `GrpcStreamMetadataKey`
export interface GrpcStreamOptions { }
export const GrpcStream = createParameterDecorator<GrpcStreamOptions>(GrpcStreamMetadataKey)

export const GrpcArgsMetadataKey = `GrpcArgsMetadataKey`
export interface GrpcArgsOptions { }
export const GrpcArgs = createParameterDecorator<GrpcArgsOptions>(GrpcArgsMetadataKey)

export const GrpcNextMetadataKey = `GrpcNextMetadataKey`
export interface GrpcNextOptions { }
export const GrpcNext = createParameterDecorator<GrpcNextOptions>(GrpcNextMetadataKey)
