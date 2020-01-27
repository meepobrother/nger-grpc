import { ServerWritableStream } from 'grpc'
import { Injector, ParameterHandler, isObservable, EMPTY } from '@nger/core'
import { IMethodDecorator } from '@nger/decorator'
import { GRPC_CALL, GRPC_ARGS } from '../tokens';
import { catchError, takeUntil } from 'rxjs/operators'
import { fromEvent } from 'rxjs'
export const CANCEL_EVENT = 'cancelled';
/**
 * 常规输入 返回一个流
 */
export const handleServerStreamingCall =
    (old: Function, instance: any, injector: Injector, it: IMethodDecorator) =>
        (call: ServerWritableStream<any>) => {
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
