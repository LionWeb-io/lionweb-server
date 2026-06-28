import { VAR } from "./data.js"

export const setup = () => {
    VAR.value = "changed value"
    console.log(`setup spinned up! VAR is '${VAR.value}`);
};
