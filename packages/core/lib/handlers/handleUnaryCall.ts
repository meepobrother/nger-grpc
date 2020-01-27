import { GRPC_CALL, GRPC_ARGS } from "../tokens";
import { ParameterHandler, Injector } from "@nger/core";
import { ServerUnaryCall, sendUnaryData } from "grpc";
import { IMethodDecorator } from '@nger/decorator'
/**
 * 常规输入 常规输出
 */
export const handleUnaryCall = (old: Function, instance: any, injector: Injector, it: IMethodDecorator) => (call: ServerUnaryCall<any>, callback: sendUnaryData<any>) => {
    injector.setStatic([{
        provide: GRPC_CALL,
        useValue: call
    }, {
        provide: GRPC_ARGS,
        useValue: call.request
    }]);
    let length = it.paramTypes.length;
    const parameters = new Array(length).fill(undefined);
    it.parameters.map(it => {
        const handler = injector.get<ParameterHandler>(it.metadataKey, undefined)
        if (handler) handler(old.bind(instance), parameters, instance, injector, it)
    });
    const res = old.bind(instance)(...parameters);
    callback(null, res, call.metadata)
}
