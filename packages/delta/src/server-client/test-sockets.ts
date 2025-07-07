import sm from "source-map-support"
sm.install()

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const socket = new WebSocket('ws://localhost:3005');
socket.onopen = () => {
    console.log("open socket")
}
socket.onmessage = (ev) => {
    console.log("on message socket: " + JSON.stringify(ev.data))
}
socket.onclose = (ev) => {
    console.log("close socket", ev.reason)
}
await delay(2000)
socket.send( `{ "messageKind": "CommandResponse", "commandId": "ID" }`)
socket.send( `{ "messageKind": "ChangeProperty", "commandId": "ID" }`)
await delay(2000)
// socket.close(1000, "bored ... leaving")




