import NodeEventEmitter from "node:events";

export class EventEmitter<TEvents extends Record<string, unknown[]>> {
  private _emitter = new NodeEventEmitter();

  protected emit<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    ...eventArg: TEvents[TEventName]
  ) {
    this._emitter.emit(eventName, ...eventArg);
  }

  on<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
  ) {
    this._emitter.on(eventName, handler);
  }

  off<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
  ) {
    this._emitter.off(eventName, handler);
  }
}
