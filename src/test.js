import BFPointer from "./Game/BFPointer.js";
import { memory } from "./user.js";
import { delay } from "./utils/Asyncs.js";


export const other = new BFPointer(false);

other.setSpeed(100);
other.setPointer(-20);

(async function() {
    let mem = 0;
    
    other.setPointer(other.pointer+1)
    other.setOpCode("+");
    await delay(other.speed);
    while(true) {
        other.setOpCode("[");
        await delay(other.speed);
        
        other.setOpCode(">");
        other.setPointer(other.pointer+1)
        await delay(other.speed);
        
        mem = memory.getMemory(other.pointer);
        memory.setMemory(other.pointer, mem + 1);
        other.setMemory(mem + 1, mem);
        other.setOpCode("+");
        await delay(other.speed);
    
        other.setOpCode("]");
        await delay(other.speed);
    }
})();