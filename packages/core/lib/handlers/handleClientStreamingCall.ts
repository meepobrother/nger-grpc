import { ServerReadableStream, sendUnaryData } from 'grpc'
import { Subject } from 'rxjs';
import { Injector, ParameterHandler, isPromise, isObservable } from '@nger/core';
import { IMethodDecorator } from '@nger/decorator'
import { GRPC_CALL, GRPC_ARGS } from '../tokens';
/**
 * 客户端发送来一个流数据
 */
export const handleClientStreamingCall =
    (old: Function, instance: any, injector: Injector, it: IMethodDecorator) =>
        (call: ServerReadableStream<any>, callback: sendUnaryData<any>) => {
            const sub = new Subject();
            call.on('data', (chunk: any) => sub.next(chunk));
            call.on('end', () => sub.complete());
            call.on('close', () => sub.complete());
            call.on('error', e => sub.error(e));
            injector.setStatic([{
                provide: GRPC_CALL,
                useValue: call
            }, {
                provide: GRPC_ARGS,
                useValue: sub.asObservable()
            }]);
            let length = it.paramTypes.length;
            const parameters = new Array(length).fill(undefined);
            it.parameters.map(it => {
                const handler = injector.get<ParameterHandler>(it.metadataKey, undefined)
                if (handler) handler(old.bind(instance), parameters, instance, injector, it)
            });
            const res = old.bind(instance)(...parameters);
            if (isPromise(res)) {
                res.then(d => callback(null, d, call.metadata))
            } else if (isObservable(res)) {
                res.toPromise().then(d => callback(null, d, call.metadata))
            }
        }