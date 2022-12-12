import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dictionary } from '@empathyco/x-utils';
import { XPriorityQueue } from '@empathyco/x-priority-queue';
import { WireMetadata, WirePayload, XEvent, XEventPayload } from '../wiring/index';
import { Emitter, Emitters, XBus } from './x-bus.types';
import { logDevtoolsXEvent } from './devtools/timeline.devtools';
import { BaseXBus } from './x-bus';

// Move to another file and pass the priority to the emit function
const eventsPriorities: Dictionary<number> = {
  RequestChanged: 2,
  DataChanged: 4,
  User: 6,
  Url: 8,
  External: 10,
  DataProvided: 12,
  LifecycleHooks: 12,
  DataReceived: 14
};

export class XBusPriorityQueue implements XBus {
  protected emitters: Emitters = {};
  protected pendingEmit!: number;
  public constructor(protected queue: XPriorityQueue<XEvent> = new XPriorityQueue()) {}

  async emit<Event extends XEvent>(
    event: Event,
    payload?: XEventPayload<Event>,
    metadata: WireMetadata = { moduleName: null }
  ): Promise<void> {
    // Payload is defined here as an optional argument (which is wrong), but as this
    // implementation must be used with the type XBus there is no problem
    const value: WirePayload<XEventPayload<Event>> = {
      eventPayload: payload as any,
      metadata
    };
    logDevtoolsXEvent(event, value);
    this.queue.push(event, this.getDefaultPriority(event), {
      replaceable: false,
      ...value
    });
    // const emitter = this.emitters[event];
    if (!this.pendingEmit) {
      await this.flushQueue();
    }
  }

  protected flushQueue(): Promise<void> {
    return new Promise(resolve => {
      this.pendingEmit = setTimeout(() => {
        while (!this.queue.isEmpty()) {
          const element = this.queue.pop();
          if (element) {
            const { metadata } = element;
            const emitter = this.getOrCreateEmitter(element.key);
            emitter.next({
              eventPayload: metadata.eventPayload as any,
              metadata: metadata.metadata as any
            });
          }
        }
        this.pendingEmit = 0;
        resolve();
      });
    });
  }

  on<Event extends XEvent>(
    event: Event,
    withMetadata = false
  ): Observable<WirePayload<XEventPayload<Event>> | XEventPayload<Event>> {
    return withMetadata
      ? this.getOrCreateEmitter(event)
      : this.getOrCreateEmitter(event).pipe(map(value => value.eventPayload));
  }

  protected getDefaultPriority(event: XEvent): number {
    for (const eventGroup in eventsPriorities) {
      if (event.indexOf(eventGroup) !== -1) {
        return eventsPriorities[eventGroup];
      }
    }
    return 1;
  }

  protected getOrCreateEmitter<Event extends XEvent>(event: Event): Emitter<Event> {
    // TODO I Don't get why the types are not working here
    return (
      this.emitters[event] ??
      (this.emitters[event] = new ReplaySubject<WirePayload<XEventPayload<Event>>>(1) as any)
    );
  }
}

export const bus: XBus = new BaseXBus();
