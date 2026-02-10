
import {
    AdditionalInfo,
    DeltaAdminRequest,
    DeltaAdminResponse,
    DeltaCommand,
    DeltaEvent,
    DeltaRequest,
    DeltaResponse
} from "./types/index.js"

export type MessageFromClient = DeltaCommand | DeltaRequest | DeltaAdminRequest
export type MessageToClient = DeltaEvent | DeltaResponse | DeltaAdminResponse

export function findDistributableInfos(delta: MessageFromClient | MessageToClient): AdditionalInfo[] {
    return delta.additionalInfo.filter(info => info.distribute)
} 

    
