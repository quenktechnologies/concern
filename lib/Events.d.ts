/**
 * ASEvent is the superclass of all events generated by
 * the system.
 */
export declare class ASEvent {
    time: number | [number, number] | Date;
}
/**
 * ChildSpawnedEvent
 */
export declare class ChildSpawnedEvent extends ASEvent {
    address: string;
    constructor(address: string);
}
/**
 * MessageSentEvent
 */
export declare class MessageSentEvent<M> extends ASEvent {
    to: string;
    from: string;
    message: M;
    constructor(to: string, from: string, message: M);
}
/**
 * MessageDroppedEvent
 */
export declare class MessageDroppedEvent<M> extends MessageSentEvent<M> {
}
/**
 * MessageAcceptedEvent
 */
export declare class MessageAcceptedEvent<M> extends MessageSentEvent<M> {
}
/**
 * MessageReceivedEvent
 */
export declare class MessageReceivedEvent<M> extends MessageSentEvent<M> {
}
/**
 * ReceiveStartedEvent
 */
export declare class ReceiveStartedEvent extends ASEvent {
    path: string;
    constructor(path: string);
}
/**
 * SelectStartedEvent
 */
export declare class SelectStartedEvent extends ReceiveStartedEvent {
}
/**
 * ActorRemovedEvent
 */
export declare class ActorRemovedEvent extends ASEvent {
    path: string;
    code: number;
    asker: string;
    constructor(path: string, code: number, asker: string);
}
