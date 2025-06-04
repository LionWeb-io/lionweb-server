import sm from "source-map-support"

sm.install()

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const socket = new WebSocket('ws://localhost:3005');
socket.onopen = () => {
    console.log("open socket2")
}
socket.onmessage = (ev) => {
    console.log("on message socket2: " + JSON.stringify(ev.data))
}
socket.onclose = (ev) => {
    console.log("close socket2", ev.reason)
}
await delay(5000)
socket.send( `{ "hello": "world2", "time": { "day": 1, "year": "2005" } }`)     
await delay(5000)




