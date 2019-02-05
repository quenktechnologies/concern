import { PushMsg, PushStr, PushForeign } from '../system/vm/op/push';
import { Tell } from '../system/vm/op/tell';
import { Discard } from '../system/vm/op/discard';
import { JumpIfOne } from '../system/vm/op/jump';
import { Noop } from '../system/vm/op/noop';
import { Receive } from '../system/vm/op/receive';
import { Read } from '../system/vm/op/read';
import { Op } from '../system/vm/op';
import { Constants, Foreign, Script } from '../system/vm/script';
import { Context } from '../context';
import { System } from '../system';
import { Address } from '../address';
import { Message } from '../message';

const acceptCode = [new PushMsg(0), new Discard()];

const tellcode: Op<Context, System<Context>>[] = [

    new PushMsg(0),    //0: Push the message onto the stack. 
    new PushStr(0),    //1: Push the address onto the stack.
    new Tell(),        //2: Tell the message to the address.
    new JumpIfOne(6),  //3: Jump to the end if sending was successful
    new PushMsg(0),    //4: Put the message back on the stack.
    new Discard(),     //5: Discard it
    new Noop()         //6: Do nothing

];

const receivecode: Op<Context, System<Context>>[] = [

    new PushForeign(0),
    new Receive()

];

const notifyCode: Op<Context, System<Context>>[] = [

    new Read(),
    new JumpIfOne(3),
    new Discard(),
    new Noop()

];

/**
 * AcceptScript for discarding messages.
 */
export class AcceptScript<C extends Context, S extends System<C>>
    extends Script<C, S> {

    constructor(public msg: Message) {

        super(<Constants<C, S>>[[], [], [], [], [msg], []], acceptCode);

    }


}

export { AcceptScript as DropScript }

/**
 * TellScript for sending messages.
 */
export class TellScript<C extends Context, S extends System<C>>
    extends Script<C, S> {

    constructor(public to: Address, public msg: Message) {

        super(
            <Constants<C, S>>[[], [to], [], [], [msg], []],
            <Op<C, S>[]>tellcode);

    }

}

/**
 * ReceiveScript
 */
export class ReceiveScript<C extends Context, S extends System<C>>
    extends Script<C, S> {

    constructor(public func: Foreign<C, S>) {

        super(<Constants<C, S>>[[], [], [], [], [], [func]],            receivecode);

    }

}

/**
 * NotifyScript
 */
export class NotifyScript<C extends Context, S extends System<C>>
    extends Script<C, S> {

    constructor() {

        super(<Constants<C, S>>[[], [], [], [], [], []], notifyCode);

    }

}
