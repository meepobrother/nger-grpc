import { ServerDuplexStream } from 'grpc'
import { Subject, fromEvent } from 'rxjs'
import { Injector, ParameterHandler, isObservable, EMPTY } from '@nger/core';
import { IMethodDecorator } from '@nger/decorator'
import { GRPC_ARGS, GRPC_CALL } from '../tokens';
import { takeUntil, catchError } from 'rxjs/operators'
import { CANCEL_EVENT } from './handleServerStreamingCall';
/**
 * 客户端发送流 服务端响应流
 */
export const handleBidiStreamingCall =
    (old: Function, instance: any, injector: Injector, it: IMethodDecorator) =>
        (call: ServerDuplexStream<any, any>) => {
            const sub = new Subject();
            call.on('data', (chunk: any) => sub.next(chunk));
            call.on('end', () => sub.complete());
            call.on('close', () => sub.complete());
            call.on('error', e => {
                if (
                    String(e)
                        .toLowerCase()
                        .indexOf('cancelled') > -1
                ) {
                    call.end();
                    return;
                }
                sub.error(e);
            });
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
            if (isObservable(res)) {
                res.pipe(
                    takeUntil(fromEvent(call as any, CANCEL_EVENT)),
                    catchError(err => {
                        call.emit('error', err);
                        return EMPTY;
                    })
                ).forEach(res => call.write(res)).then(res => call.end())
            } else {
                throw new Error(`server stream must return observable`)
            }
        }