import { Injectable, Injector, MAIN_PATH, PLATFORM_NAME } from "@nger/core";
import { Server, ServerCredentials, loadPackageDefinition, GrpcObject } from 'grpc';
import { loadSync } from '@grpc/proto-loader';
import { GRPC_URL, GRPC_SERVICES } from "./tokens";
import { isObject, isUndefined } from "./util";
import { extname } from 'path'
@Injectable()
export class GrpcService {
    server: Server;
    constructor(public injector: Injector) { }
    createServer() {
        this.server = new Server();
        const url = this.injector.get(GRPC_URL)
        this.server.bind(url, ServerCredentials.createInsecure())
        // bind event
        const services = this.injector.get(GRPC_SERVICES, null)
        const proto = this.loadProto();
        const packageName = this.injector.get<string>(PLATFORM_NAME)
        const grpcPkg = this.lookupPackage(proto, packageName)
        const serviceNames = this.getServiceNames(grpcPkg);
        if (services) {
            serviceNames.map(definition => {
                const service = services.find(it => it.name === definition.name)
                if (service) {
                    this.server.addService(definition.service.service, service.nger.create())
                }
            });
        }
        return this.server;
    }
    private lookupPackage(root: GrpcObject, packageName: string) {
        let pkg: GrpcObject = root;
        for (const name of packageName.split(/\./)) {
            pkg = pkg[name] as GrpcObject;
        }
        return pkg;
    }
    private loadProto(): GrpcObject {
        const protoPath = this.injector.get<string>(MAIN_PATH)
        const ext = extname(protoPath)
        const graphqlPath = protoPath.replace(ext, '.proto')
        const packageDefinition = loadSync(graphqlPath)
        const packageObject = loadPackageDefinition(
            packageDefinition,
        );
        return packageObject;
    }

    private getServiceNames(grpcPkg: GrpcObject) {
        const services: { name: string; service: any }[] = [];
        this.collectDeepServices('', grpcPkg, services);
        return services;
    }
    private collectDeepServices(
        name: string,
        grpcDefinition: GrpcObject,
        accumulator: { name: string; service: any }[],
    ) {
        if (!isObject(grpcDefinition)) {
            return;
        }
        const keysToTraverse = Object.keys(grpcDefinition);
        // Traverse definitions or namespace extensions
        for (const key of keysToTraverse) {
            const nameExtended = this.parseDeepServiceName(name, key);
            const deepDefinition = grpcDefinition[key] as any;
            const isServiceDefined =
                deepDefinition && !isUndefined(deepDefinition.service);
            const isServiceBoolean = isServiceDefined
                ? deepDefinition.service !== false
                : false;
            if (isServiceDefined && isServiceBoolean) {
                accumulator.push({
                    name: nameExtended,
                    service: deepDefinition,
                });
            } else {
                this.collectDeepServices(nameExtended, deepDefinition, accumulator);
            }
        }
    }
    private parseDeepServiceName(name: string, key: string): string {
        if (name.length === 0) {
            return key;
        }
        return name + '.' + key;
    }
}