import { v4 as uuidv4 } from 'uuid';

function pad(num: number) {
    let numStr = num.toString();
    while (numStr.length < 2) numStr = "0" + num;
    return numStr;
}

export const initialUser = (id: number) => {
    return {
        id: `KPU-${pad(id)}`,
        name: '',
        password: '',
        status: 0,

    }
}