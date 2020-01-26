import { INgerDecorator } from "@nger/decorator";
import { Injector, PropertyHandler, MethodHandler } from "@nger/di";
export class RpcRef<T> {
    nger: INgerDecorator<T>;
    injector: Injector;
    constructor(nger: INgerDecorator<T>, injector: Injector) {
        this.nger = nger;
        this.injector = injector;
    }
    create(_injector?: Injector) {
        const injector = _injector || this.injector;
        const instance = injector.get(this.nger.type)
        this.nger.properties.map(it => {
            if (it.metadataKey) {
                const handler = injector.get<PropertyHandler>(it.metadataKey)
                if (handler) {
                    const old = Reflect.get(instance, it.property)
                    handler(old, instance, injector, it)
                }
            }
        });
        this.nger.methods.map(it => {
            const handler = injector.get<MethodHandler>(it.metadataKey as any, null);
            const old = Reflect.get(instance, it.property)
            if (handler) {
                handler(old, instance, injector, it)
            }
        })
        return instance;
    }
}
