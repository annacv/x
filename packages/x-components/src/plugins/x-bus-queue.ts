import { XEvent } from '../wiring/index';

// PRIORITY QUEUE METHODS
interface QueueMethods<T> {
  enqueue(item: T): void;
  dequeue(item: T): void;
  size(): number;
}

// PRIORITY QUEUE CLASSES
abstract class PriorityQueue<T> {
  protected items: Array<T> = [];
  size(): number {
    return this.items.length;
  }
}
console.log(PriorityQueue);

// Main queue that will store PreSearchQueue, SearchQueue, PostSearchQueue
class XBusQueue<Queue> extends PriorityQueue<Queue> implements QueueMethods<Queue> {
  public constructor(protected items: Queue[]) {
    super();
  }
  enqueue(item: Queue): void {
    if (this.size() === 0) {
      this.items.push(item);
    } else {
      const lastItem = this.items[this.size()];
      this.orderByPriority(lastItem, item);
    }
  }
  orderByPriority(lastItem: Queue, newItem: Queue): void {
    this.items.sort((lastItem, newItem) => lastItem.priority - newItem.priority);
  }
  dequeue(item: Queue): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}
console.log(XBusQueue);

// (sub)Queue that will store events as QueueItems
class Queue extends PriorityQueue<Queue> implements QueueMethods<Queue> {
  public constructor(
    protected items: QueueItem<EventAction>[],
    protected priority: number,
    public queueConfig: Record<QueueName, QueueInfo>
  ) {
    super();
  }
  dequeue(item: QueueItem<EventAction>): void {}

  enqueue(item: QueueItem<EventAction>): void {}
}
console.log(Queue);

// QueueItem, the event added to the (sub)Queue
class QueueItem<T> {
  public constructor(
    protected item: XEvent,
    public eventConfig: Record<EventAction, QueuedEvent>
  ) {}
}

// CONFIGS
interface QueueInfo {
  priority: number;
  maxSimultaneousRequests?: number;
}
type QueueName = 'PreSearchQueue' | 'SearchQueue' | 'PostSearchQueue';

interface QueuedEvent {
  event: XEvent;
  params: {
    priority: number;
    readonly cancellable?: boolean;
  };
  location: string;
}
// /* EventsPriority = { RequestChanged: 2, DataChanged: 4, User: 6, Url: 8,
// External: 10, DataProvided: 12, LifecycleHooks: 14, DataReceived: 16 } */
type EventAction =
  | 'RequestChanged'
  | 'DataChanged'
  | 'User'
  | 'Url'
  | 'External'
  | 'DataProvided'
  | 'LifecycleHooks'
  | 'DataReceived';

// INSTANCES

// QueuedEvent
const queuedEvent = {
  event: 'NextQueriesRequestChanged',
  params: { priority: 2, cancellable: true },
  location: 'next-query'
};
const event = new QueueItem<EventAction>('NextQueriesRequestChanged', { event: 'RequestChanged', queuedEvent });

// RequestChanged: {
//   event: 'NextQueriesRequestChanged',
//     params: { priority: 2, cancellable: true },
//   location: 'next-query' }
// }

// Queue
// const preSearchQueue = new Queue<PreSearchQueue>(
//   PreSearchQueue: { priority: 2, maxSimultaneousRequests: 2 }
// );
// const SearchQueue = new Queue<SearchQueue>(
//   SearchQueue: { priority: 4, maxSimultaneousRequests: 2 }
// );
// const postSearchQueue = new Queue<PostSearch>(
//   PostSearchQueue: { priority: 6 }
// );
//
// // XBusQueue
// const xBusQueue = new XBusQueue<Queue[]>(
//   [preSearchQueue, preSearchQueue, postSearchQueue]
// );
