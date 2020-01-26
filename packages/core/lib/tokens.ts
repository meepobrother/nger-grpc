import { InjectionToken } from "@nger/core";
import { RpcRef } from "./handlers/rpcRef";
export const GRPC_URL = new InjectionToken<string>(`GRPC_URL`)
export const GRPC_SERVICES = new InjectionToken<{ name: string, nger: RpcRef<any> }[]>(`GRPC_SERVICES`)
export const GRPC_CALL_BACK = new InjectionToken<any>(`GRPC_BACK`)
export const GRPC_CALL = new InjectionToken<any>(`GRPC_BACK`)
