import { ParticipationInfo } from "./queries/index.js"
import { WebSocket } from "ws"

export const activeSockets: Map<WebSocket, ParticipationInfo> = new Map<WebSocket, ParticipationInfo>()
    
