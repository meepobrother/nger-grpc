import { InjectionToken } from "@nger/core";
import { RpcRef } from "./handlers/rpcRef";
export const GRPC_URL = new InjectionToken<string>(`@nger/grpc GRPC_URL`)
export const GRPC_SERVICES = new InjectionToken<{ name: string, nger: RpcRef<any> }[]>(`@nger/grpc GRPC_SERVICES`)
export const GRPC_CALL = new InjectionToken<any>(`@nger/grpc GRPC_BACK`)
export const GRPC_ARGS = new InjectionToken<any>(`@nger/grpc GRPC_ARGS`)
