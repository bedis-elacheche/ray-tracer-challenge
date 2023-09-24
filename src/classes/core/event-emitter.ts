export class EventEmitter<TEvents extends Record<string, unknown[]>> {
  private events: Partial<
    Record<keyof TEvents, Array<(...args: unknown[]) => void>>
  >;

  constructor() {
    this.events = {};
  }

  emit<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    ...eventArgs: TEvents[TEventName]
  ) {
    if (!Array.isArray(this.events[eventName])) {
      return;
    }

    for (const listener of this.events[eventName]) {
      listener.apply(this, eventArgs);
    }
  }

  on<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
  ) {
    this.events[eventName] = this.events[eventName] || [];

    this.events[eventName].push(handler);
  }

  off<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
  ) {
    if (!Array.isArray(this.events[eventName])) {
      return;
    }

    this.events[eventName] = this.events[eventName].filter(
      (cb) => cb !== handler,
    );
  }

  once<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
  ) {
    this.on(eventName, function cb(...args) {
      this.off(eventName, cb);
      handler.apply(this, args);
    });
  }
}
