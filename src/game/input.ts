export const flightInput = { x:0, z:0, brake:false };
export const heldKeys = new Set<string>();
export function syncInput(){flightInput.x=(heldKeys.has('KeyD')||heldKeys.has('ArrowRight')?1:0)-(heldKeys.has('KeyA')||heldKeys.has('ArrowLeft')?1:0);flightInput.z=(heldKeys.has('KeyS')||heldKeys.has('ArrowDown')?1:0)-(heldKeys.has('KeyW')||heldKeys.has('ArrowUp')?1:0);flightInput.brake=heldKeys.has('Space');}
export function pressControl(key:string,down:boolean){if(down)heldKeys.add(key);else heldKeys.delete(key);syncInput();}
export function clearControls(){heldKeys.clear();syncInput();}
