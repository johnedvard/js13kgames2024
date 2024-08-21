import { EventEmitter } from "events";

const emitter = new EventEmitter();

export const emit = (evt: string, data?: any) => emitter.emit(evt, data);
export const on = (evt: string, callback: (...args: any[]) => void) =>
  emitter.on(evt, callback);
export const off = (evt: string, callback: (...args: any[]) => void) =>
  emitter.off(evt, callback);
