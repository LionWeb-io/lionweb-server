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
await delay(5000)
socket.send( `{ "hello": "world", "time": { "day": 1, "year": "2005" } }`)     
await delay(5000)




