/**
 * merge two objects easily
 * @summary (Object, Object) →  Object
 */
export const merge = (o1, o2) => Object.assign({}, o1, o2);

/**
 * oreduce
 * @summary { (Object, (*,string,Object)→ *, * ) →  *}
 */
export const oreduce = (o, f, i) => Object.keys(o).reduce((p, k) => f(p, o[k], o), i);

/**
 * pipe the results of one function into the following.
 * @summary { (... * →  *) →  * →  *}
 */
export const pipe = function() {

    let i = arguments.length;
    let args = [];

    while (i--) args[i] = arguments[i];
    return x => args.reduce((v, n) => n(v), x);

}

/**
 * fling removes a key from an object
 * @param {string} key
 * @param {object} object
 * @return {Object}
 * @summary {(string,Object) →  Object}
 */
export const fling = (s, o) => {

    if ((o == null) || (o.constructor !== Object))
        throw new TypeError('fling(): only works with object literals!');

    return Object.keys(o).reduce((o2, k) => k === s ? o2 : merge(o2, {
        [k]: o[k]
    }), {});

}

/**
 * head returns the item at index 0 of an array
 * @param {Array} list
 * @return {*}
 * @summary { Array →  * }
 */
export const head = list => list[0];

/**
 * tail returns the last item in an array
 * @param {Array} list
 * @return {*}
 * @summary {Array →  *}
 */
export const tail = list => list[list.length - 1];

/**
 * partial is a poor man's way of turning a function of arity 1-4 into
 * a function that accepts one argumment. Recognizes a Function.length of 4 max
 * @summary {(Function, *) →  (* →  *)}
 */
export const partial = (f, a) =>
    f.length === 2 ? b => f(a, b) :
    f.length === 3 ? b => c => f(a, b, c) :
    f.length === 4 ? b => c => d => f(a, b, c, d) :
    f;
