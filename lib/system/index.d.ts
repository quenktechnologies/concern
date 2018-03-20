import * as Promise from 'bluebird';
import * as actor from '../actor';
import * as log from './log';
import { Maybe } from 'afpl/lib/monad/Maybe';
import { Either, Left, Right } from 'afpl/lib/monad/Either';
import { Event } from './log/event';
import { Envelope } from './Envelope';
export { ActorSystem } from './ActorSystem';
export { PsuedoSystem } from './PsuedoSystem';
export { Envelope };
export { Left as _Left, Right as _Right };
/**
 * SEPERATOR used to seperate parent addresses from children.
 */
export declare const SEPERATOR = "/";
/**
 * DEAD_ADDRESS
 */
export declare const DEAD_ADDRESS = "<null>";
/**
 * Configuration for the System.
 */
export interface Configuration {
    log: log.LogPolicy;
}
/**
 * Message type.
 */
export declare type Message = any;
/**
 * ActorTable is a table of actor addresses pointing
 * to their respective actor.
 */
export interface ActorTable {
    [key: string]: actor.Actor;
}
/**
 * System interface of the actor system.
 */
export interface System {
    /**
     * toAddress turns an actor instance into an address.
     *
     * Unknown actors result in an error returning the invalid address.
     */
    toAddress(a: actor.Actor): Maybe<string>;
    /**
     * putChild creates a new child actor for a parent within the system.
     */
    putChild(parent: actor.Actor, t: actor.Template): actor.Address;
    /**
     * discard a message.
     *
     * An event will be logged to the system log.
     */
    discard(m: Envelope): System;
    /**
     * putActor replaces an actor's context within the system.
     */
    putActor(path: string, actor: actor.Actor): System;
    /**
     * putMessage places an enveloped message into an actor's mailbox.
     *
     * Messages are enveloped to help the system keep track of
     * communication. The message may be processed or stored
     * depending on the target actor's state at the time.
     * If the target actor does not exist, the message is dropped.
     */
    putMessage(m: Envelope): System;
    /**
     * putError puts an error into the system's error handling workflow.
     * @param {actor.Actor} src - Actor causing the error.
     * @param {Error} err
     */
    putError(src: actor.Actor, err: Error): System;
    /**
     * askMessage allows an actor to ignore incomming messages unless
     * they have been sent by a specific actor.
     */
    askMessage<R>(m: Envelope, time?: number): Promise<R>;
    /**
     * removeActor from the system.
     */
    removeActor(parent: actor.Actor, address: actor.Address): System;
    /**
     * log an event to the system log.
     */
    log(e: Event): System;
}
/**
 * mkChildPath produces the path for a child actor given its parent's path.
 *
 * This takes into account the fact that the parent path may be '/' and
 * should therefore no SEPERATOR should be added.
 */
export declare const mkChildPath: (seperator: string) => (id: string) => (parent: string) => string;
/**
 * validateId validates the id to be used for an actor.
 *
 * Current rules require the id to not contain slashes
 * or be '$'.
 */
export declare const validateId: (seperator: string) => (id: string) => Either<Error, string> | Left<Error, string> | Right<Error, string>;
