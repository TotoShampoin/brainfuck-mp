import Display from "./Display/Display.js";
import { canvas } from "./ui.js";
import { memory, user } from "./user.js";

// import { other } from "./test.js";

const display = new Display(canvas);

display.follow = true;

function loop() {
    display.display(memory, [], user);
    requestAnimationFrame(loop);
}
loop();

window.user = user;
