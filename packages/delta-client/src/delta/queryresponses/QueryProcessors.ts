// @ts-nocheck
import {
    GetAvailableIdsResponse, ListPartitionsQueryResponse,
    ReconnectResponse,
    SignOffResponse, SignOnResponse
} from "@lionweb/server-delta-shared";

export function SignOnResponseFunction(msg: SignOnResponse): void {
    console.log("Called SignOnResponseFunction " + msg.messageKind);
}

export function SignOffResponseFunction(msg: SignOffResponse): void {
    console.log("Called SignOffResponseFunction " + msg.messageKind);
}

export function ListPartitionsResponseFunction(msg: ListPartitionsQueryResponse): void {
    console.log("Called ListPartitionsResponseFunction " + msg.messageKind);
}

export function GetAvailableIdsResponseFunction(msg: GetAvailableIdsResponse): void {
    console.log("Called GetAvailableIdsResponseFunction " + msg.messageKind);
}

export function ReconnectResponseFunction(msg: ReconnectResponse): void {
    console.log("Called ReconnectResponseFunction " + msg.messageKind);
}
