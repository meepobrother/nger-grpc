import { StaticProvider, Injector, INJECTOR_SCOPE, getNger, ControllerMethodHandler, InjectionToken } from "@nger/core";
import { GrpcMetadataKey, GrpcOptions } from "../decorator";
import { IClassDecorator } from '@nger/decorator';
import { GRPC_SERVICES } from "../tokens";
import { RpcRef } from "./rpcRef";
export const rpcHandler: StaticProvider = {
    provide: GrpcMetadataKey,
    useValue: (
        init: any,
        ctrl: IClassDecorator<any, GrpcOptions>,
        injector: Injector
    ) => {
        const controllerInjector = injector.create([{
            provide: INJECTOR_SCOPE,
            useValue: ctrl.type.name
        }], ctrl.type.name);
        const nger = getNger(controllerInjector, ctrl.type);
        const ref = new RpcRef(nger, controllerInjector)
        const options = ctrl.options;
        let name = ctrl.type.name;
        if (options) name = options.path instanceof InjectionToken ? injector.get(options.path) : options.path;
        injector.setStatic([{
            provide: GRPC_SERVICES,
            useValue: {
                name,
                nger: ref
            },
            multi: true
        }])
    }
}
