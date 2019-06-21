/**
 * html2pdf.js v0.9.1
 * Copyright (c) 2019 Erik Koopmans
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.html2pdf = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var es6Promise = createCommonjsModule(function (module, exports) {
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.5+7f2b526d
 */

(function (global, factory) {
	module.exports = factory();
}(commonjsGlobal, (function () { function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var TRY_CATCH_ERROR = { error: null };

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    TRY_CATCH_ERROR.error = error;
    return TRY_CATCH_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === TRY_CATCH_ERROR) {
      reject(promise, TRY_CATCH_ERROR.error);
      TRY_CATCH_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = void 0,
      failed = void 0;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof commonjsGlobal !== 'undefined') {
    local = commonjsGlobal;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));




});

var auto = es6Promise.polyfill();

var jspdf_min = createCommonjsModule(function (module) {
!function(t){"function"==typeof undefined&&undefined.amd?undefined(t):t();}(function(){function ae(t){return(ae="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var t,e,r,n,N,v,b,A,l,i,s,o,a,c,u,f,h,p=function(ie){function se(s){if("object"!==ae(s))throw new Error("Invalid Context passed to initialize PubSub (jsPDF-module)");var o={};this.subscribe=function(t,e,r){if(r=r||!1, "string"!=typeof t||"function"!=typeof e||"boolean"!=typeof r)throw new Error("Invalid arguments passed to PubSub.subscribe (jsPDF-module)");o.hasOwnProperty(t)||(o[t]={});var n=Math.random().toString(35);return o[t][n]=[e,!!r], n}, this.unsubscribe=function(t){for(var e in o)if(o[e][t])return delete o[e][t], 0===Object.keys(o[e]).length&&delete o[e], !0;return!1}, this.publish=function(t){if(o.hasOwnProperty(t)){var e=Array.prototype.slice.call(arguments,1),r=[];for(var n in o[t]){var i=o[t][n];try{i[0].apply(s,e);}catch(t){ie.console&&console.error("jsPDF PubSub Error",t.message,t);}i[1]&&r.push(n);}r.length&&r.forEach(this.unsubscribe);}}, this.getTopics=function(){return o};}function oe(t){var e=arguments[1],i=arguments[2],r=arguments[3],n=[],s=1,o="string"==typeof t?t:"p";"object"===ae(t=t||{})&&(o=t.orientation, e=t.unit||e, i=t.format||i, r=t.compress||t.compressPdf||r, n=t.filters||(!0===r?["FlateEncode"]:n), s="number"==typeof t.userUnit?Math.abs(t.userUnit):1), e=e||"mm", o=(""+(o||"P")).toLowerCase();var a=t.putOnlyUsedFonts||!0,K={},c={internal:{},__private__:{}};c.__private__.PubSub=se;var u="1.3",l=c.__private__.getPdfVersion=function(){return u},f=(c.__private__.setPdfVersion=function(t){u=t;}, {a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]}),h=(c.__private__.getPageFormats=function(){return f}, c.__private__.getPageFormat=function(t){return f[t]});"string"==typeof i&&(i=h(i)), i=i||h("a4");var p,Z=c.f2=c.__private__.f2=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f2");return t.toFixed(2)},$=c.__private__.f3=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f3");return t.toFixed(3)},d="00000000000000000000000000000000",m=c.__private__.getFileId=function(){return d},y=c.__private__.setFileId=function(t){return t=t||"12345678901234567890123456789012".split("").map(function(){return"ABCDEF0123456789".charAt(Math.floor(16*Math.random()))}).join(""), d=t};c.setFileId=function(t){return y(t), this}, c.getFileId=function(){return m()};var g=c.__private__.convertDateToPDFDate=function(t){var e=t.getTimezoneOffset(),r=e<0?"+":"-",n=Math.floor(Math.abs(e/60)),i=Math.abs(e%60),s=[r,q(n),"'",q(i),"'"].join("");return["D:",t.getFullYear(),q(t.getMonth()+1),q(t.getDate()),q(t.getHours()),q(t.getMinutes()),q(t.getSeconds()),s].join("")},w=c.__private__.convertPDFDateToDate=function(t){var e=parseInt(t.substr(2,4),10),r=parseInt(t.substr(6,2),10)-1,n=parseInt(t.substr(8,2),10),i=parseInt(t.substr(10,2),10),s=parseInt(t.substr(12,2),10),o=parseInt(t.substr(14,2),10);parseInt(t.substr(16,2),10), parseInt(t.substr(20,2),10);return new Date(e,r,n,i,s,o,0)},L=c.__private__.setCreationDate=function(t){var e;if(void 0===t&&(t=new Date), "object"===ae(t)&&"[object Date]"===Object.prototype.toString.call(t))e=g(t);else{if(!/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|\-0[0-9]|\-1[0-1])\'(0[0-9]|[1-5][0-9])\'?$/.test(t))throw new Error("Invalid argument passed to jsPDF.setCreationDate");e=t;}return p=e},N=c.__private__.getCreationDate=function(t){var e=p;return"jsDate"===t&&(e=w(p)), e};c.setCreationDate=function(t){return L(t), this}, c.getCreationDate=function(t){return N(t)};var v,b,A,x,S,Q,k,_,q=c.__private__.padd2=function(t){return("0"+parseInt(t)).slice(-2)},I=!1,M=[],F=[],P=0,tt=(c.__private__.setCustomOutputDestination=function(t){b=t;}, c.__private__.resetCustomOutputDestination=function(t){b=void 0;}, c.__private__.out=function(t){var e;return t="string"==typeof t?t:t.toString(), (e=void 0===b?I?M[v]:F:b).push(t), I||(P+=t.length+1), e}),C=c.__private__.write=function(t){return tt(1===arguments.length?t.toString():Array.prototype.join.call(arguments," "))},E=c.__private__.getArrayBuffer=function(t){for(var e=t.length,r=new ArrayBuffer(e),n=new Uint8Array(r);e--;)n[e]=t.charCodeAt(e);return r},B=[["Helvetica","helvetica","normal","WinAnsiEncoding"],["Helvetica-Bold","helvetica","bold","WinAnsiEncoding"],["Helvetica-Oblique","helvetica","italic","WinAnsiEncoding"],["Helvetica-BoldOblique","helvetica","bolditalic","WinAnsiEncoding"],["Courier","courier","normal","WinAnsiEncoding"],["Courier-Bold","courier","bold","WinAnsiEncoding"],["Courier-Oblique","courier","italic","WinAnsiEncoding"],["Courier-BoldOblique","courier","bolditalic","WinAnsiEncoding"],["Times-Roman","times","normal","WinAnsiEncoding"],["Times-Bold","times","bold","WinAnsiEncoding"],["Times-Italic","times","italic","WinAnsiEncoding"],["Times-BoldItalic","times","bolditalic","WinAnsiEncoding"],["ZapfDingbats","zapfdingbats","normal",null],["Symbol","symbol","normal",null]],et=(c.__private__.getStandardFonts=function(t){return B}, t.fontSize||16),R=(c.__private__.setFontSize=c.setFontSize=function(t){return et=t, this}, c.__private__.getFontSize=c.getFontSize=function(){return et}),rt=t.R2L||!1,j=(c.__private__.setR2L=c.setR2L=function(t){return rt=t, this}, c.__private__.getR2L=c.getR2L=function(t){return rt}, c.__private__.setZoomMode=function(t){var e=[void 0,null,"fullwidth","fullheight","fullpage","original"];if(/^\d*\.?\d*\%$/.test(t))A=t;else if(isNaN(t)){if(-1===e.indexOf(t))throw new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "'+t+'" is not recognized.');A=t;}else A=parseInt(t,10);}),T=(c.__private__.getZoomMode=function(){return A}, c.__private__.setPageMode=function(t){if(-1==[void 0,null,"UseNone","UseOutlines","UseThumbs","FullScreen"].indexOf(t))throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "'+t+'" is not recognized.');x=t;}),O=(c.__private__.getPageMode=function(){return x}, c.__private__.setLayoutMode=function(t){if(-1==[void 0,null,"continuous","single","twoleft","tworight","two"].indexOf(t))throw new Error('Layout mode must be one of continuous, single, twoleft, tworight. "'+t+'" is not recognized.');S=t;}),D=(c.__private__.getLayoutMode=function(){return S}, c.__private__.setDisplayMode=c.setDisplayMode=function(t,e,r){return j(t), O(e), T(r), this}, {title:"",subject:"",author:"",keywords:"",creator:""}),z=(c.__private__.getDocumentProperty=function(t){if(-1===Object.keys(D).indexOf(t))throw new Error("Invalid argument passed to jsPDF.getDocumentProperty");return D[t]}, c.__private__.getDocumentProperties=function(t){return D}, c.__private__.setDocumentProperties=c.setProperties=c.setDocumentProperties=function(t){for(var e in D)D.hasOwnProperty(e)&&t[e]&&(D[e]=t[e]);return this}, c.__private__.setDocumentProperty=function(t,e){if(-1===Object.keys(D).indexOf(t))throw new Error("Invalid arguments passed to jsPDF.setDocumentProperty");return D[t]=e}, 0),U=[],nt={},W={},H=0,G=[],X=[],it=new se(c),J=t.hotfixes||[],Y=c.__private__.newObject=function(){var t=V();return st(t,!0), t},V=c.__private__.newObjectDeferred=function(){return U[++z]=function(){return P}, z},st=function(t,e){return e="boolean"==typeof e&&e, U[t]=P, e&&tt(t+" 0 obj"), t},ot=c.__private__.newAdditionalObject=function(){var t={objId:V(),content:""};return X.push(t), t},at=V(),ct=V(),ut=c.__private__.decodeColorString=function(t){var e=t.split(" ");if(2===e.length&&("g"===e[1]||"G"===e[1])){var r=parseFloat(e[0]);e=[r,r,r,"r"];}for(var n="#",i=0;i<3;i++)n+=("0"+Math.floor(255*parseFloat(e[i])).toString(16)).slice(-2);return n},lt=c.__private__.encodeColorString=function(t){var e;"string"==typeof t&&(t={ch1:t});var r=t.ch1,n=t.ch2,i=t.ch3,s=t.ch4,o=(t.precision, "draw"===t.pdfColorType?["G","RG","K"]:["g","rg","k"]);if("string"==typeof r&&"#"!==r.charAt(0)){var a=new RGBColor(r);if(a.ok)r=a.toHex();else if(!/^\d*\.?\d*$/.test(r))throw new Error('Invalid color "'+r+'" passed to jsPDF.encodeColorString.')}if("string"==typeof r&&/^#[0-9A-Fa-f]{3}$/.test(r)&&(r="#"+r[1]+r[1]+r[2]+r[2]+r[3]+r[3]), "string"==typeof r&&/^#[0-9A-Fa-f]{6}$/.test(r)){var c=parseInt(r.substr(1),16);r=c>>16&255, n=c>>8&255, i=255&c;}if(void 0===n||void 0===s&&r===n&&n===i)if("string"==typeof r)e=r+" "+o[0];else switch(t.precision){case 2:e=Z(r/255)+" "+o[0];break;case 3:default:e=$(r/255)+" "+o[0];}else if(void 0===s||"object"===ae(s)){if(s&&!isNaN(s.a)&&0===s.a)return e=["1.000","1.000","1.000",o[1]].join(" ");if("string"==typeof r)e=[r,n,i,o[1]].join(" ");else switch(t.precision){case 2:e=[Z(r/255),Z(n/255),Z(i/255),o[1]].join(" ");break;default:case 3:e=[$(r/255),$(n/255),$(i/255),o[1]].join(" ");}}else if("string"==typeof r)e=[r,n,i,s,o[2]].join(" ");else switch(t.precision){case 2:e=[Z(r/255),Z(n/255),Z(i/255),Z(s/255),o[2]].join(" ");break;case 3:default:e=[$(r/255),$(n/255),$(i/255),$(s/255),o[2]].join(" ");}return e},ft=c.__private__.getFilters=function(){return n},ht=c.__private__.putStream=function(t){var e=(t=t||{}).data||"",r=t.filters||ft(),n=t.alreadyAppliedFilters||[],i=t.addLength1||!1,s=e.length,o={};!0===r&&(r=["FlateEncode"]);var a=t.additionalKeyValues||[],c=(o=void 0!==oe.API.processDataByFilters?oe.API.processDataByFilters(e,r):{data:e,reverseChain:[]}).reverseChain+(Array.isArray(n)?n.join(" "):n.toString());0!==o.data.length&&(a.push({key:"Length",value:o.data.length}), !0===i&&a.push({key:"Length1",value:s})), 0!=c.length&&(c.split("/").length-1==1?a.push({key:"Filter",value:c}):a.push({key:"Filter",value:"["+c+"]"})), tt("<<");for(var u=0;u<a.length;u++)tt("/"+a[u].key+" "+a[u].value);tt(">>"), 0!==o.data.length&&(tt("stream"), tt(o.data), tt("endstream"));},pt=c.__private__.putPage=function(t){t.mediaBox;var e=t.number,r=t.data,n=t.objId,i=t.contentsObjId;st(n,!0);G[v].mediaBox.topRightX, G[v].mediaBox.bottomLeftX, G[v].mediaBox.topRightY, G[v].mediaBox.bottomLeftY;tt("<</Type /Page"), tt("/Parent "+t.rootDictionaryObjId+" 0 R"), tt("/Resources "+t.resourceDictionaryObjId+" 0 R"), tt("/MediaBox ["+parseFloat(Z(t.mediaBox.bottomLeftX))+" "+parseFloat(Z(t.mediaBox.bottomLeftY))+" "+Z(t.mediaBox.topRightX)+" "+Z(t.mediaBox.topRightY)+"]"), null!==t.cropBox&&tt("/CropBox ["+Z(t.cropBox.bottomLeftX)+" "+Z(t.cropBox.bottomLeftY)+" "+Z(t.cropBox.topRightX)+" "+Z(t.cropBox.topRightY)+"]"), null!==t.bleedBox&&tt("/BleedBox ["+Z(t.bleedBox.bottomLeftX)+" "+Z(t.bleedBox.bottomLeftY)+" "+Z(t.bleedBox.topRightX)+" "+Z(t.bleedBox.topRightY)+"]"), null!==t.trimBox&&tt("/TrimBox ["+Z(t.trimBox.bottomLeftX)+" "+Z(t.trimBox.bottomLeftY)+" "+Z(t.trimBox.topRightX)+" "+Z(t.trimBox.topRightY)+"]"), null!==t.artBox&&tt("/ArtBox ["+Z(t.artBox.bottomLeftX)+" "+Z(t.artBox.bottomLeftY)+" "+Z(t.artBox.topRightX)+" "+Z(t.artBox.topRightY)+"]"), "number"==typeof t.userUnit&&1!==t.userUnit&&tt("/UserUnit "+t.userUnit), it.publish("putPage",{objId:n,pageContext:G[e],pageNumber:e,page:r}), tt("/Contents "+i+" 0 R"), tt(">>"), tt("endobj");var s=r.join("\n");return st(i,!0), ht({data:s,filters:ft()}), tt("endobj"), n},dt=c.__private__.putPages=function(){var t,e,r=[];for(t=1;t<=H;t++)G[t].objId=V(), G[t].contentsObjId=V();for(t=1;t<=H;t++)r.push(pt({number:t,data:M[t],objId:G[t].objId,contentsObjId:G[t].contentsObjId,mediaBox:G[t].mediaBox,cropBox:G[t].cropBox,bleedBox:G[t].bleedBox,trimBox:G[t].trimBox,artBox:G[t].artBox,userUnit:G[t].userUnit,rootDictionaryObjId:at,resourceDictionaryObjId:ct}));st(at,!0), tt("<</Type /Pages");var n="/Kids [";for(e=0;e<H;e++)n+=r[e]+" 0 R ";tt(n+"]"), tt("/Count "+H), tt(">>"), tt("endobj"), it.publish("postPutPages");},mt=function(){!function(){for(var t in nt)nt.hasOwnProperty(t)&&(!1===a||!0===a&&K.hasOwnProperty(t))&&(e=nt[t], it.publish("putFont",{font:e,out:tt,newObject:Y,putStream:ht}), !0!==e.isAlreadyPutted&&(e.objectNumber=Y(), tt("<<"), tt("/Type /Font"), tt("/BaseFont /"+e.postScriptName), tt("/Subtype /Type1"), "string"==typeof e.encoding&&tt("/Encoding /"+e.encoding), tt("/FirstChar 32"), tt("/LastChar 255"), tt(">>"), tt("endobj")));var e;}(), it.publish("putResources"), st(ct,!0), tt("<<"), function(){for(var t in tt("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"), tt("/Font <<"), nt)nt.hasOwnProperty(t)&&(!1===a||!0===a&&K.hasOwnProperty(t))&&tt("/"+t+" "+nt[t].objectNumber+" 0 R");tt(">>"), tt("/XObject <<"), it.publish("putXobjectDict"), tt(">>");}(), tt(">>"), tt("endobj"), it.publish("postPutResources");},yt=function(t,e,r){W.hasOwnProperty(e)||(W[e]={}), W[e][r]=t;},gt=function(t,e,r,n,i){i=i||!1;var s="F"+(Object.keys(nt).length+1).toString(10),o={id:s,postScriptName:t,fontName:e,fontStyle:r,encoding:n,isStandardFont:i,metadata:{}};return it.publish("addFont",{font:o,instance:this}), void 0!==s&&(nt[s]=o, yt(s,e,r)), s},wt=c.__private__.pdfEscape=c.pdfEscape=function(t,e){return function(t,e){var r,n,i,s,o,a,c,u,l;if(i=(e=e||{}).sourceEncoding||"Unicode", o=e.outputEncoding, (e.autoencode||o)&&nt[Q].metadata&&nt[Q].metadata[i]&&nt[Q].metadata[i].encoding&&(s=nt[Q].metadata[i].encoding, !o&&nt[Q].encoding&&(o=nt[Q].encoding), !o&&s.codePages&&(o=s.codePages[0]), "string"==typeof o&&(o=s[o]), o)){for(c=!1, a=[], r=0, n=t.length;r<n;r++)(u=o[t.charCodeAt(r)])?a.push(String.fromCharCode(u)):a.push(t[r]), a[r].charCodeAt(0)>>8&&(c=!0);t=a.join("");}for(r=t.length;void 0===c&&0!==r;)t.charCodeAt(r-1)>>8&&(c=!0), r--;if(!c)return t;for(a=e.noBOM?[]:[254,255], r=0, n=t.length;r<n;r++){if((l=(u=t.charCodeAt(r))>>8)>>8)throw new Error("Character at position "+r+" of string '"+t+"' exceeds 16bits. Cannot be encoded into UCS-2 BE");a.push(l), a.push(u-(l<<8));}return String.fromCharCode.apply(void 0,a)}(t,e).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")},Lt=c.__private__.beginPage=function(t,e){var r,n="string"==typeof e&&e.toLowerCase();if("string"==typeof t&&(r=h(t.toLowerCase()))&&(t=r[0], e=r[1]), Array.isArray(t)&&(e=t[1], t=t[0]), (isNaN(t)||isNaN(e))&&(t=i[0], e=i[1]), n){switch(n.substr(0,1)){case"l":t<e&&(n="s");break;case"p":e<t&&(n="s");}"s"===n&&(r=t, t=e, e=r);}(14400<t||14400<e)&&(console.warn("A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400"), t=Math.min(14400,t), e=Math.min(14400,e)), i=[t,e], I=!0, M[++H]=[], G[H]={objId:0,contentsObjId:0,userUnit:Number(s),artBox:null,bleedBox:null,cropBox:null,trimBox:null,mediaBox:{bottomLeftX:0,bottomLeftY:0,topRightX:Number(t),topRightY:Number(e)}}, vt(H);},Nt=function(){Lt.apply(this,arguments), Dt(Ot), tt(Yt), 0!==te&&tt(te+" J"), 0!==re&&tt(re+" j"), it.publish("addPage",{pageNumber:H});},vt=function(t){0<t&&t<=H&&(v=t);},bt=c.__private__.getNumberOfPages=c.getNumberOfPages=function(){return M.length-1},At=function(t,e,r){var n,i=void 0;return r=r||{}, t=void 0!==t?t:nt[Q].fontName, e=void 0!==e?e:nt[Q].fontStyle, n=t.toLowerCase(), void 0!==W[n]&&void 0!==W[n][e]?i=W[n][e]:void 0!==W[t]&&void 0!==W[t][e]?i=W[t][e]:!1===r.disableWarning&&console.warn("Unable to look up font label for font '"+t+"', '"+e+"'. Refer to getFontList() for available fonts."), i||r.noFallback||null==(i=W.times[e])&&(i=W.times.normal), i},xt=c.__private__.putInfo=function(){for(var t in Y(), tt("<<"), tt("/Producer (jsPDF "+oe.version+")"), D)D.hasOwnProperty(t)&&D[t]&&tt("/"+t.substr(0,1).toUpperCase()+t.substr(1)+" ("+wt(D[t])+")");tt("/CreationDate ("+p+")"), tt(">>"), tt("endobj");},St=c.__private__.putCatalog=function(t){var e=(t=t||{}).rootDictionaryObjId||at;switch(Y(), tt("<<"), tt("/Type /Catalog"), tt("/Pages "+e+" 0 R"), A||(A="fullwidth"), A){case"fullwidth":tt("/OpenAction [3 0 R /FitH null]");break;case"fullheight":tt("/OpenAction [3 0 R /FitV null]");break;case"fullpage":tt("/OpenAction [3 0 R /Fit]");break;case"original":tt("/OpenAction [3 0 R /XYZ null null 1]");break;default:var r=""+A;"%"===r.substr(r.length-1)&&(A=parseInt(A)/100), "number"==typeof A&&tt("/OpenAction [3 0 R /XYZ null null "+Z(A)+"]");}switch(S||(S="continuous"), S){case"continuous":tt("/PageLayout /OneColumn");break;case"single":tt("/PageLayout /SinglePage");break;case"two":case"twoleft":tt("/PageLayout /TwoColumnLeft");break;case"tworight":tt("/PageLayout /TwoColumnRight");}x&&tt("/PageMode /"+x), it.publish("putCatalog"), tt(">>"), tt("endobj");},kt=c.__private__.putTrailer=function(){tt("trailer"), tt("<<"), tt("/Size "+(z+1)), tt("/Root "+z+" 0 R"), tt("/Info "+(z-1)+" 0 R"), tt("/ID [ <"+d+"> <"+d+"> ]"), tt(">>");},_t=c.__private__.putHeader=function(){tt("%PDF-"+u), tt("%ºß¬à");},qt=c.__private__.putXRef=function(){var t=1,e="0000000000";for(tt("xref"), tt("0 "+(z+1)), tt("0000000000 65535 f "), t=1;t<=z;t++){"function"==typeof U[t]?tt((e+U[t]()).slice(-10)+" 00000 n "):void 0!==U[t]?tt((e+U[t]).slice(-10)+" 00000 n "):tt("0000000000 00000 n ");}},It=c.__private__.buildDocument=function(){I=!1, P=z=0, F=[], U=[], X=[], at=V(), ct=V(), it.publish("buildDocument"), _t(), dt(), function(){it.publish("putAdditionalObjects");for(var t=0;t<X.length;t++){var e=X[t];st(e.objId,!0), tt(e.content), tt("endobj");}it.publish("postPutAdditionalObjects");}(), mt(), xt(), St();var t=P;return qt(), kt(), tt("startxref"), tt(""+t), tt("%%EOF"), I=!0, F.join("\n")},Mt=c.__private__.getBlob=function(t){return new Blob([E(t)],{type:"application/pdf"})},Ft=c.output=c.__private__.output=((_=function(t,e){e=e||{};var r=It();switch("string"==typeof e?e={filename:e}:e.filename=e.filename||"generated.pdf", t){case void 0:return r;case"save":c.save(e.filename);break;case"arraybuffer":return E(r);case"blob":return Mt(r);case"bloburi":case"bloburl":if(void 0!==ie.URL&&"function"==typeof ie.URL.createObjectURL)return ie.URL&&ie.URL.createObjectURL(Mt(r))||void 0;console.warn("bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser.");break;case"datauristring":case"dataurlstring":return"data:application/pdf;filename="+e.filename+";base64,"+btoa(r);case"dataurlnewwindow":var n='<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe src="'+this.output("datauristring")+'"></iframe></body></html>',i=ie.open();if(null!==i&&i.document.write(n), i||"undefined"==typeof safari)return i;case"datauri":case"dataurl":return ie.document.location.href="data:application/pdf;filename="+e.filename+";base64,"+btoa(r);default:return null}}).foo=function(){try{return _.apply(this,arguments)}catch(t){var e=t.stack||"";~e.indexOf(" at ")&&(e=e.split(" at ")[1]);var r="Error in function "+e.split("\n")[0].split("<")[0]+": "+t.message;if(!ie.console)throw new Error(r);ie.console.error(r,t), ie.alert&&alert(r);}}, (_.foo.bar=_).foo),Pt=function(t){return!0===Array.isArray(J)&&-1<J.indexOf(t)};switch(e){case"pt":k=1;break;case"mm":k=72/25.4;break;case"cm":k=72/2.54;break;case"in":k=72;break;case"px":k=1==Pt("px_scaling")?.75:96/72;break;case"pc":case"em":k=12;break;case"ex":k=6;break;default:throw new Error("Invalid unit: "+e)}L(), y();var Ct=c.__private__.getPageInfo=function(t){if(isNaN(t)||t%1!=0)throw new Error("Invalid argument passed to jsPDF.getPageInfo");return{objId:G[t].objId,pageNumber:t,pageContext:G[t]}},Et=c.__private__.getPageInfoByObjId=function(t){for(var e in G)if(G[e].objId===t)break;if(isNaN(t)||t%1!=0)throw new Error("Invalid argument passed to jsPDF.getPageInfoByObjId");return Ct(e)},Bt=c.__private__.getCurrentPageInfo=function(){return{objId:G[v].objId,pageNumber:v,pageContext:G[v]}};c.addPage=function(){return Nt.apply(this,arguments), this}, c.setPage=function(){return vt.apply(this,arguments), this}, c.insertPage=function(t){return this.addPage(), this.movePage(v,t), this}, c.movePage=function(t,e){if(e<t){for(var r=M[t],n=G[t],i=t;e<i;i--)M[i]=M[i-1], G[i]=G[i-1];M[e]=r, G[e]=n, this.setPage(e);}else if(t<e){for(r=M[t], n=G[t], i=t;i<e;i++)M[i]=M[i+1], G[i]=G[i+1];M[e]=r, G[e]=n, this.setPage(e);}return this}, c.deletePage=function(){return function(t){0<t&&t<=H&&(M.splice(t,1), --H<v&&(v=H), this.setPage(v));}.apply(this,arguments), this};c.__private__.text=c.text=function(t,e,r,i){var n;"number"!=typeof t||"number"!=typeof e||"string"!=typeof r&&!Array.isArray(r)||(n=r, r=e, e=t, t=n);var s=arguments[3],o=arguments[4],a=arguments[5];if("object"===ae(s)&&null!==s||("string"==typeof o&&(a=o, o=null), "string"==typeof s&&(a=s, s=null), "number"==typeof s&&(o=s, s=null), i={flags:s,angle:o,align:a}), (s=s||{}).noBOM=s.noBOM||!0, s.autoencode=s.autoencode||!0, isNaN(e)||isNaN(r)||null==t)throw new Error("Invalid arguments passed to jsPDF.text");if(0===t.length)return f;var c,u="",l="number"==typeof i.lineHeightFactor?i.lineHeightFactor:Tt,f=i.scope||this;function h(t){for(var e,r=t.concat(),n=[],i=r.length;i--;)"string"==typeof(e=r.shift())?n.push(e):Array.isArray(t)&&1===e.length?n.push(e[0]):n.push([e[0],e[1],e[2]]);return n}function p(t,e){var r;if("string"==typeof t)r=e(t)[0];else if(Array.isArray(t)){for(var n,i,s=t.concat(),o=[],a=s.length;a--;)"string"==typeof(n=s.shift())?o.push(e(n)[0]):Array.isArray(n)&&"string"===n[0]&&(i=e(n[0],n[1],n[2]), o.push([i[0],i[1],i[2]]));r=o;}return r}var d=!1,m=!0;if("string"==typeof t)d=!0;else if(Array.isArray(t)){for(var y,g=t.concat(),w=[],L=g.length;L--;)("string"!=typeof(y=g.shift())||Array.isArray(y)&&"string"!=typeof y[0])&&(m=!1);d=m;}if(!1===d)throw new Error('Type of text must be string or Array. "'+t+'" is not recognized.');var N=nt[Q].encoding;"WinAnsiEncoding"!==N&&"StandardEncoding"!==N||(t=p(t,function(t,e,r){return[(n=t, n=n.split("\t").join(Array(i.TabLen||9).join(" ")), wt(n,s)),e,r];var n;})), "string"==typeof t&&(t=t.match(/[\r?\n]/)?t.split(/\r\n|\r|\n/g):[t]);var v=et/f.internal.scaleFactor,b=v*(Tt-1);switch(i.baseline){case"bottom":r-=b;break;case"top":r+=v-b;break;case"hanging":r+=v-2*b;break;case"middle":r+=v/2-b;}0<(R=i.maxWidth||0)&&("string"==typeof t?t=f.splitTextToSize(t,R):"[object Array]"===Object.prototype.toString.call(t)&&(t=f.splitTextToSize(t.join(" "),R)));var A={text:t,x:e,y:r,options:i,mutex:{pdfEscape:wt,activeFontKey:Q,fonts:nt,activeFontSize:et}};it.publish("preProcessText",A), t=A.text;o=(i=A.options).angle;var x=f.internal.scaleFactor,S=[];if(o){o*=Math.PI/180;var k=Math.cos(o),_=Math.sin(o);S=[Z(k),Z(_),Z(-1*_),Z(k)];}void 0!==(B=i.charSpace)&&(u+=$(B*x)+" Tc\n");i.lang;var q=-1,I=void 0!==i.renderingMode?i.renderingMode:i.stroke,M=f.internal.getCurrentPageInfo().pageContext;switch(I){case 0:case!1:case"fill":q=0;break;case 1:case!0:case"stroke":q=1;break;case 2:case"fillThenStroke":q=2;break;case 3:case"invisible":q=3;break;case 4:case"fillAndAddForClipping":q=4;break;case 5:case"strokeAndAddPathForClipping":q=5;break;case 6:case"fillThenStrokeAndAddToPathForClipping":q=6;break;case 7:case"addToPathForClipping":q=7;}var F=void 0!==M.usedRenderingMode?M.usedRenderingMode:-1;-1!==q?u+=q+" Tr\n":-1!==F&&(u+="0 Tr\n"), -1!==q&&(M.usedRenderingMode=q);a=i.align||"left";var P=et*l,C=f.internal.pageSize.getWidth(),E=(x=f.internal.scaleFactor, nt[Q]),B=i.charSpace||$t,R=i.maxWidth||0,j=(s={}, []);if("[object Array]"===Object.prototype.toString.call(t)){var T,O;w=h(t);"left"!==a&&(O=w.map(function(t){return f.getStringUnitWidth(t,{font:E,charSpace:B,fontSize:et})*et/x}));var D,z=Math.max.apply(Math,O),U=0;if("right"===a){e-=O[0], t=[];var W=0;for(L=w.length;W<L;W++)z-O[W], T=0===W?(D=Ht(e), Gt(r)):(D=(U-O[W])*x, -P), t.push([w[W],D,T]), U=O[W];}else if("center"===a){e-=O[0]/2, t=[];for(W=0, L=w.length;W<L;W++)(z-O[W])/2, T=0===W?(D=Ht(e), Gt(r)):(D=(U-O[W])/2*x, -P), t.push([w[W],D,T]), U=O[W];}else if("left"===a){t=[];for(W=0, L=w.length;W<L;W++)T=0===W?Gt(r):-P, D=0===W?Ht(e):0, t.push(w[W]);}else{if("justify"!==a)throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');t=[];for(R=0!==R?R:C, W=0, L=w.length;W<L;W++)T=0===W?Gt(r):-P, D=0===W?Ht(e):0, W<L-1&&j.push(((R-O[W])/(w[W].split(" ").length-1)*x).toFixed(2)), t.push([w[W],D,T]);}}!0===("boolean"==typeof i.R2L?i.R2L:rt)&&(t=p(t,function(t,e,r){return[t.split("").reverse().join(""),e,r]}));A={text:t,x:e,y:r,options:i,mutex:{pdfEscape:wt,activeFontKey:Q,fonts:nt,activeFontSize:et}};it.publish("postProcessText",A), t=A.text, c=A.mutex.isHex;w=h(t);t=[];var H,G,X,J=0,Y=(L=w.length, "");for(W=0;W<L;W++)Y="", Array.isArray(w[W])?(H=parseFloat(w[W][1]), G=parseFloat(w[W][2]), X=(c?"<":"(")+w[W][0]+(c?">":")"), J=1):(H=Ht(e), G=Gt(r), X=(c?"<":"(")+w[W]+(c?">":")")), void 0!==j&&void 0!==j[W]&&(Y=j[W]+" Tw\n"), 0!==S.length&&0===W?t.push(Y+S.join(" ")+" "+H.toFixed(2)+" "+G.toFixed(2)+" Tm\n"+X):1===J||0===J&&0===W?t.push(Y+H.toFixed(2)+" "+G.toFixed(2)+" Td\n"+X):t.push(Y+X);t=0===J?t.join(" Tj\nT* "):t.join(" Tj\n"), t+=" Tj\n";var V="BT\n/"+Q+" "+et+" Tf\n"+(et*l).toFixed(2)+" TL\n"+Kt+"\n";return V+=u, V+=t, tt(V+="ET"), K[Q]=!0, f}, c.__private__.lstext=c.lstext=function(t,e,r,n){return console.warn("jsPDF.lstext is deprecated"), this.text(t,e,r,{charSpace:n})}, c.__private__.clip=c.clip=function(t){tt("evenodd"===t?"W*":"W"), tt("n");}, c.__private__.clip_fixed=c.clip_fixed=function(t){console.log("clip_fixed is deprecated"), c.clip(t);};var Rt=c.__private__.isValidStyle=function(t){var e=!1;return-1!==[void 0,null,"S","F","DF","FD","f","f*","B","B*"].indexOf(t)&&(e=!0), e},jt=c.__private__.getStyle=function(t){var e="S";return"F"===t?e="f":"FD"===t||"DF"===t?e="B":"f"!==t&&"f*"!==t&&"B"!==t&&"B*"!==t||(e=t), e};c.__private__.line=c.line=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw new Error("Invalid arguments passed to jsPDF.line");return this.lines([[r-t,n-e]],t,e)}, c.__private__.lines=c.lines=function(t,e,r,n,i,s){var o,a,c,u,l,f,h,p,d,m,y,g;if("number"==typeof t&&(g=r, r=e, e=t, t=g), n=n||[1,1], s=s||!1, isNaN(e)||isNaN(r)||!Array.isArray(t)||!Array.isArray(n)||!Rt(i)||"boolean"!=typeof s)throw new Error("Invalid arguments passed to jsPDF.lines");for(tt($(Ht(e))+" "+$(Gt(r))+" m "), o=n[0], a=n[1], u=t.length, m=e, y=r, c=0;c<u;c++)2===(l=t[c]).length?(m=l[0]*o+m, y=l[1]*a+y, tt($(Ht(m))+" "+$(Gt(y))+" l")):(f=l[0]*o+m, h=l[1]*a+y, p=l[2]*o+m, d=l[3]*a+y, m=l[4]*o+m, y=l[5]*a+y, tt($(Ht(f))+" "+$(Gt(h))+" "+$(Ht(p))+" "+$(Gt(d))+" "+$(Ht(m))+" "+$(Gt(y))+" c"));return s&&tt(" h"), null!==i&&tt(jt(i)), this}, c.__private__.rect=c.rect=function(t,e,r,n,i){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||!Rt(i))throw new Error("Invalid arguments passed to jsPDF.rect");return tt([Z(Ht(t)),Z(Gt(e)),Z(r*k),Z(-n*k),"re"].join(" ")), null!==i&&tt(jt(i)), this}, c.__private__.triangle=c.triangle=function(t,e,r,n,i,s,o){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i)||isNaN(s)||!Rt(o))throw new Error("Invalid arguments passed to jsPDF.triangle");return this.lines([[r-t,n-e],[i-r,s-n],[t-i,e-s]],t,e,[1,1],o,!0), this}, c.__private__.roundedRect=c.roundedRect=function(t,e,r,n,i,s,o){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i)||isNaN(s)||!Rt(o))throw new Error("Invalid arguments passed to jsPDF.roundedRect");var a=4/3*(Math.SQRT2-1);return this.lines([[r-2*i,0],[i*a,0,i,s-s*a,i,s],[0,n-2*s],[0,s*a,-i*a,s,-i,s],[2*i-r,0],[-i*a,0,-i,-s*a,-i,-s],[0,2*s-n],[0,-s*a,i*a,-s,i,-s]],t+i,e,[1,1],o), this}, c.__private__.ellipse=c.ellipse=function(t,e,r,n,i){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||!Rt(i))throw new Error("Invalid arguments passed to jsPDF.ellipse");var s=4/3*(Math.SQRT2-1)*r,o=4/3*(Math.SQRT2-1)*n;return tt([Z(Ht(t+r)),Z(Gt(e)),"m",Z(Ht(t+r)),Z(Gt(e-o)),Z(Ht(t+s)),Z(Gt(e-n)),Z(Ht(t)),Z(Gt(e-n)),"c"].join(" ")), tt([Z(Ht(t-s)),Z(Gt(e-n)),Z(Ht(t-r)),Z(Gt(e-o)),Z(Ht(t-r)),Z(Gt(e)),"c"].join(" ")), tt([Z(Ht(t-r)),Z(Gt(e+o)),Z(Ht(t-s)),Z(Gt(e+n)),Z(Ht(t)),Z(Gt(e+n)),"c"].join(" ")), tt([Z(Ht(t+s)),Z(Gt(e+n)),Z(Ht(t+r)),Z(Gt(e+o)),Z(Ht(t+r)),Z(Gt(e)),"c"].join(" ")), null!==i&&tt(jt(i)), this}, c.__private__.circle=c.circle=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||!Rt(n))throw new Error("Invalid arguments passed to jsPDF.circle");return this.ellipse(t,e,r,r,n)};c.setFont=function(t,e){return Q=At(t,e,{disableWarning:!1}), this}, c.setFontStyle=c.setFontType=function(t){return Q=At(void 0,t), this};c.__private__.getFontList=c.getFontList=function(){var t,e,r,n={};for(t in W)if(W.hasOwnProperty(t))for(e in n[t]=r=[], W[t])W[t].hasOwnProperty(e)&&r.push(e);return n};c.addFont=function(t,e,r,n){gt.call(this,t,e,r,n=n||"Identity-H");};var Tt,Ot=t.lineWidth||.200025,Dt=c.__private__.setLineWidth=c.setLineWidth=function(t){return tt((t*k).toFixed(2)+" w"), this},zt=(c.__private__.setLineDash=oe.API.setLineDash=function(t,e){if(t=t||[], e=e||0, isNaN(e)||!Array.isArray(t))throw new Error("Invalid arguments passed to jsPDF.setLineDash");return t=t.map(function(t){return(t*k).toFixed(3)}).join(" "), e=parseFloat((e*k).toFixed(3)), tt("["+t+"] "+e+" d"), this}, c.__private__.getLineHeight=c.getLineHeight=function(){return et*Tt}),Ut=(zt=c.__private__.getLineHeight=c.getLineHeight=function(){return et*Tt}, c.__private__.setLineHeightFactor=c.setLineHeightFactor=function(t){return"number"==typeof(t=t||1.15)&&(Tt=t), this}),Wt=c.__private__.getLineHeightFactor=c.getLineHeightFactor=function(){return Tt};Ut(t.lineHeight);var Ht=c.__private__.getHorizontalCoordinate=function(t){return t*k},Gt=c.__private__.getVerticalCoordinate=function(t){return G[v].mediaBox.topRightY-G[v].mediaBox.bottomLeftY-t*k},Xt=c.__private__.getHorizontalCoordinateString=function(t){return Z(t*k)},Jt=c.__private__.getVerticalCoordinateString=function(t){return Z(G[v].mediaBox.topRightY-G[v].mediaBox.bottomLeftY-t*k)},Yt=t.strokeColor||"0 G",Vt=(c.__private__.getStrokeColor=c.getDrawColor=function(){return ut(Yt)}, c.__private__.setStrokeColor=c.setDrawColor=function(t,e,r,n){return Yt=lt({ch1:t,ch2:e,ch3:r,ch4:n,pdfColorType:"draw",precision:2}), tt(Yt), this}, t.fillColor||"0 g"),Kt=(c.__private__.getFillColor=c.getFillColor=function(){return ut(Vt)}, c.__private__.setFillColor=c.setFillColor=function(t,e,r,n){return Vt=lt({ch1:t,ch2:e,ch3:r,ch4:n,pdfColorType:"fill",precision:2}), tt(Vt), this}, t.textColor||"0 g"),Zt=c.__private__.getTextColor=c.getTextColor=function(){return ut(Kt)},$t=(c.__private__.setTextColor=c.setTextColor=function(t,e,r,n){return Kt=lt({ch1:t,ch2:e,ch3:r,ch4:n,pdfColorType:"text",precision:3}), this}, t.charSpace||0),Qt=c.__private__.getCharSpace=c.getCharSpace=function(){return $t},te=(c.__private__.setCharSpace=c.setCharSpace=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.setCharSpace");return $t=t, this}, 0);c.CapJoinStyles={0:0,butt:0,but:0,miter:0,1:1,round:1,rounded:1,circle:1,2:2,projecting:2,project:2,square:2,bevel:2};c.__private__.setLineCap=c.setLineCap=function(t){var e=c.CapJoinStyles[t];if(void 0===e)throw new Error("Line cap style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return tt((te=e)+" J"), this};var ee,re=0;c.__private__.setLineJoin=c.setLineJoin=function(t){var e=c.CapJoinStyles[t];if(void 0===e)throw new Error("Line join style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return tt((re=e)+" j"), this}, c.__private__.setMiterLimit=c.setMiterLimit=function(t){if(t=t||0, isNaN(t))throw new Error("Invalid argument passed to jsPDF.setMiterLimit");return ee=parseFloat(Z(t*k)), tt(ee+" M"), this};for(var ne in c.save=function(n,t){if(n=n||"generated.pdf", (t=t||{}).returnPromise=t.returnPromise||!1, !1!==t.returnPromise)return new Promise(function(t,e){try{var r=ce(Mt(It()),n);"function"==typeof ce.unload&&ie.setTimeout&&setTimeout(ce.unload,911), t(r);}catch(t){e(t.message);}});ce(Mt(It()),n), "function"==typeof ce.unload&&ie.setTimeout&&setTimeout(ce.unload,911);}, oe.API)oe.API.hasOwnProperty(ne)&&("events"===ne&&oe.API.events.length?function(t,e){var r,n,i;for(i=e.length-1;-1!==i;i--)r=e[i][0], n=e[i][1], t.subscribe.apply(t,[r].concat("function"==typeof n?[n]:n));}(it,oe.API.events):c[ne]=oe.API[ne]);return c.internal={pdfEscape:wt,getStyle:jt,getFont:function(){return nt[At.apply(c,arguments)]},getFontSize:R,getCharSpace:Qt,getTextColor:Zt,getLineHeight:zt,getLineHeightFactor:Wt,write:C,getHorizontalCoordinate:Ht,getVerticalCoordinate:Gt,getCoordinateString:Xt,getVerticalCoordinateString:Jt,collections:{},newObject:Y,newAdditionalObject:ot,newObjectDeferred:V,newObjectDeferredBegin:st,getFilters:ft,putStream:ht,events:it,scaleFactor:k,pageSize:{getWidth:function(){return(G[v].mediaBox.topRightX-G[v].mediaBox.bottomLeftX)/k},setWidth:function(t){G[v].mediaBox.topRightX=t*k+G[v].mediaBox.bottomLeftX;},getHeight:function(){return(G[v].mediaBox.topRightY-G[v].mediaBox.bottomLeftY)/k},setHeight:function(t){G[v].mediaBox.topRightY=t*k+G[v].mediaBox.bottomLeftY;}},output:Ft,getNumberOfPages:bt,pages:M,out:tt,f2:Z,f3:$,getPageInfo:Ct,getPageInfoByObjId:Et,getCurrentPageInfo:Bt,getPDFVersion:l,hasHotfix:Pt}, Object.defineProperty(c.internal.pageSize,"width",{get:function(){return(G[v].mediaBox.topRightX-G[v].mediaBox.bottomLeftX)/k},set:function(t){G[v].mediaBox.topRightX=t*k+G[v].mediaBox.bottomLeftX;},enumerable:!0,configurable:!0}), Object.defineProperty(c.internal.pageSize,"height",{get:function(){return(G[v].mediaBox.topRightY-G[v].mediaBox.bottomLeftY)/k},set:function(t){G[v].mediaBox.topRightY=t*k+G[v].mediaBox.bottomLeftY;},enumerable:!0,configurable:!0}), function(t){for(var e=0,r=B.length;e<r;e++){var n=gt(t[e][0],t[e][1],t[e][2],B[e][3],!0),i=t[e][0].split("-");yt(n,i[0],i[1]||"");}it.publish("addFonts",{fonts:nt,dictionary:W});}(B), Q="F1", Nt(i,o), it.publish("initialized"), c}return oe.API={events:[]}, oe.version="1.5.3", "function"==typeof undefined&&undefined.amd?undefined("jsPDF",function(){return oe}):"undefined"!='object'&&module.exports?(module.exports=oe, module.exports.jsPDF=oe):ie.jsPDF=oe, oe}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||Function('return typeof this === "object" && this.content')()||Function("return this")());
/** @license
   * jsPDF addImage plugin
   * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
   *               2013 Chris Dowling, https://github.com/gingerchris
   *               2013 Trinh Ho, https://github.com/ineedfat
   *               2013 Edwin Alejandro Perez, https://github.com/eaparango
   *               2013 Norah Smith, https://github.com/burnburnrocket
   *               2014 Diego Casorran, https://github.com/diegocr
   *               2014 James Robb, https://github.com/jamesbrobb
   *
   * Licensed under the MIT License
   */
/** @license
   * jsPDF addImage plugin
   * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
   *               2013 Chris Dowling, https://github.com/gingerchris
   *               2013 Trinh Ho, https://github.com/ineedfat
   *               2013 Edwin Alejandro Perez, https://github.com/eaparango
   *               2013 Norah Smith, https://github.com/burnburnrocket
   *               2014 Diego Casorran, https://github.com/diegocr
   *               2014 James Robb, https://github.com/jamesbrobb
   *
   * Licensed under the MIT License
   */
!function(v){var b="addImage_",c={PNG:[[137,80,78,71]],TIFF:[[77,77,0,42],[73,73,42,0]],JPEG:[[255,216,255,224,void 0,void 0,74,70,73,70,0],[255,216,255,225,void 0,void 0,69,120,105,102,0,0]],JPEG2000:[[0,0,0,12,106,80,32,32]],GIF87a:[[71,73,70,56,55,97]],GIF89a:[[71,73,70,56,57,97]],BMP:[[66,77],[66,65],[67,73],[67,80],[73,67],[80,84]]},u=v.getImageFileTypeByImageData=function(t,e){var r,n;e=e||"UNKNOWN";var i,s,o,a="UNKNOWN";for(o in v.isArrayBufferView(t)&&(t=v.arrayBufferToBinaryString(t)), c)for(i=c[o], r=0;r<i.length;r+=1){for(s=!0, n=0;n<i[r].length;n+=1)if(void 0!==i[r][n]&&i[r][n]!==t.charCodeAt(n)){s=!1;break}if(!0===s){a=o;break}}return"UNKNOWN"===a&&"UNKNOWN"!==e&&(console.warn('FileType of Image not recognized. Processing image as "'+e+'".'), a=e), a},r=function t(e){for(var r=this.internal.newObject(),n=this.internal.write,i=this.internal.putStream,s=(0, this.internal.getFilters)();-1!==s.indexOf("FlateEncode");)s.splice(s.indexOf("FlateEncode"),1);e.n=r;var o=[];if(o.push({key:"Type",value:"/XObject"}), o.push({key:"Subtype",value:"/Image"}), o.push({key:"Width",value:e.w}), o.push({key:"Height",value:e.h}), e.cs===this.color_spaces.INDEXED?o.push({key:"ColorSpace",value:"[/Indexed /DeviceRGB "+(e.pal.length/3-1)+" "+("smask"in e?r+2:r+1)+" 0 R]"}):(o.push({key:"ColorSpace",value:"/"+e.cs}), e.cs===this.color_spaces.DEVICE_CMYK&&o.push({key:"Decode",value:"[1 0 1 0 1 0 1 0]"})), o.push({key:"BitsPerComponent",value:e.bpc}), "dp"in e&&o.push({key:"DecodeParms",value:"<<"+e.dp+">>"}), "trns"in e&&e.trns.constructor==Array){for(var a="",c=0,u=e.trns.length;c<u;c++)a+=e.trns[c]+" "+e.trns[c]+" ";o.push({key:"Mask",value:"["+a+"]"});}"smask"in e&&o.push({key:"SMask",value:r+1+" 0 R"});var l=void 0!==e.f?["/"+e.f]:void 0;if(i({data:e.data,additionalKeyValues:o,alreadyAppliedFilters:l}), n("endobj"), "smask"in e){var f="/Predictor "+e.p+" /Colors 1 /BitsPerComponent "+e.bpc+" /Columns "+e.w,h={w:e.w,h:e.h,cs:"DeviceGray",bpc:e.bpc,dp:f,data:e.smask};"f"in e&&(h.f=e.f), t.call(this,h);}e.cs===this.color_spaces.INDEXED&&(this.internal.newObject(), i({data:this.arrayBufferToBinaryString(new Uint8Array(e.pal))}), n("endobj"));},A=function(){var t=this.internal.collections[b+"images"];for(var e in t)r.call(this,t[e]);},x=function(){var t,e=this.internal.collections[b+"images"],r=this.internal.write;for(var n in e)r("/I"+(t=e[n]).i,t.n,"0","R");},S=function(t){return"function"==typeof v["process"+t.toUpperCase()]},k=function(t){return"object"===ae(t)&&1===t.nodeType},_=function(t,e){if("IMG"===t.nodeName&&t.hasAttribute("src")){var r=""+t.getAttribute("src");if(0===r.indexOf("data:image/"))return unescape(r);var n=v.loadFile(r);if(void 0!==n)return btoa(n)}if("CANVAS"===t.nodeName){var i=t;return t.toDataURL("image/jpeg",1)}(i=document.createElement("canvas")).width=t.clientWidth||t.width, i.height=t.clientHeight||t.height;var s=i.getContext("2d");if(!s)throw"addImage requires canvas to be supported by browser.";return s.drawImage(t,0,0,i.width,i.height), i.toDataURL("png"==(""+e).toLowerCase()?"image/png":"image/jpeg")},q=function(t,e){var r;if(e)for(var n in e)if(t===e[n].alias){r=e[n];break}return r};v.color_spaces={DEVICE_RGB:"DeviceRGB",DEVICE_GRAY:"DeviceGray",DEVICE_CMYK:"DeviceCMYK",CAL_GREY:"CalGray",CAL_RGB:"CalRGB",LAB:"Lab",ICC_BASED:"ICCBased",INDEXED:"Indexed",PATTERN:"Pattern",SEPARATION:"Separation",DEVICE_N:"DeviceN"}, v.decode={DCT_DECODE:"DCTDecode",FLATE_DECODE:"FlateDecode",LZW_DECODE:"LZWDecode",JPX_DECODE:"JPXDecode",JBIG2_DECODE:"JBIG2Decode",ASCII85_DECODE:"ASCII85Decode",ASCII_HEX_DECODE:"ASCIIHexDecode",RUN_LENGTH_DECODE:"RunLengthDecode",CCITT_FAX_DECODE:"CCITTFaxDecode"}, v.image_compression={NONE:"NONE",FAST:"FAST",MEDIUM:"MEDIUM",SLOW:"SLOW"}, v.sHashCode=function(t){var e,r=0;if(0===(t=t||"").length)return r;for(e=0;e<t.length;e++)r=(r<<5)-r+t.charCodeAt(e), r|=0;return r}, v.isString=function(t){return"string"==typeof t}, v.validateStringAsBase64=function(t){(t=t||"").toString().trim();var e=!0;return 0===t.length&&(e=!1), t.length%4!=0&&(e=!1), !1===/^[A-Za-z0-9+\/]+$/.test(t.substr(0,t.length-2))&&(e=!1), !1===/^[A-Za-z0-9\/][A-Za-z0-9+\/]|[A-Za-z0-9+\/]=|==$/.test(t.substr(-2))&&(e=!1), e}, v.extractInfoFromBase64DataURI=function(t){return/^data:([\w]+?\/([\w]+?));\S*;*base64,(.+)$/g.exec(t)}, v.extractImageFromDataUrl=function(t){var e=(t=t||"").split("base64,"),r=null;if(2===e.length){var n=/^data:(\w*\/\w*);*(charset=[\w=-]*)*;*$/.exec(e[0]);Array.isArray(n)&&(r={mimeType:n[1],charset:n[2],data:e[1]});}return r}, v.supportsArrayBuffer=function(){return"undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array}, v.isArrayBuffer=function(t){return!!this.supportsArrayBuffer()&&t instanceof ArrayBuffer}, v.isArrayBufferView=function(t){return!!this.supportsArrayBuffer()&&("undefined"!=typeof Uint32Array&&(t instanceof Int8Array||t instanceof Uint8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array))}, v.binaryStringToUint8Array=function(t){for(var e=t.length,r=new Uint8Array(e),n=0;n<e;n++)r[n]=t.charCodeAt(n);return r}, v.arrayBufferToBinaryString=function(t){if("function"==typeof atob)return atob(this.arrayBufferToBase64(t))}, v.arrayBufferToBase64=function(t){for(var e,r="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=new Uint8Array(t),s=i.byteLength,o=s%3,a=s-o,c=0;c<a;c+=3)r+=n[(16515072&(e=i[c]<<16|i[c+1]<<8|i[c+2]))>>18]+n[(258048&e)>>12]+n[(4032&e)>>6]+n[63&e];return 1==o?r+=n[(252&(e=i[a]))>>2]+n[(3&e)<<4]+"==":2==o&&(r+=n[(64512&(e=i[a]<<8|i[a+1]))>>10]+n[(1008&e)>>4]+n[(15&e)<<2]+"="), r}, v.createImageInfo=function(t,e,r,n,i,s,o,a,c,u,l,f,h){var p={alias:a,w:e,h:r,cs:n,bpc:i,i:o,data:t};return s&&(p.f=s), c&&(p.dp=c), u&&(p.trns=u), l&&(p.pal=l), f&&(p.smask=f), h&&(p.p=h), p}, v.addImage=function(t,e,r,n,i,s,o,a,c){var u="";if("string"!=typeof e){var l=s;s=i, i=n, n=r, r=e, e=l;}if("object"===ae(t)&&!k(t)&&"imageData"in t){var f=t;t=f.imageData, e=f.format||e||"UNKNOWN", r=f.x||r||0, n=f.y||n||0, i=f.w||i, s=f.h||s, o=f.alias||o, a=f.compression||a, c=f.rotation||f.angle||c;}var h=this.internal.getFilters();if(void 0===a&&-1!==h.indexOf("FlateEncode")&&(a="SLOW"), "string"==typeof t&&(t=unescape(t)), isNaN(r)||isNaN(n))throw console.error("jsPDF.addImage: Invalid coordinates",arguments), new Error("Invalid coordinates passed to jsPDF.addImage");var p,d,m,y,g,w,L,N=function(){var t=this.internal.collections[b+"images"];return t||(this.internal.collections[b+"images"]=t={}, this.internal.events.subscribe("putResources",A), this.internal.events.subscribe("putXobjectDict",x)), t}.call(this);if(!((p=q(t,N))||(k(t)&&(t=_(t,e)), (null==(L=o)||0===L.length)&&(o="string"==typeof(w=t)?v.sHashCode(w):v.isArrayBufferView(w)?v.sHashCode(v.arrayBufferToBinaryString(w)):null), p=q(o,N)))){if(this.isString(t)&&(""!==(u=this.convertStringToImageData(t))?t=u:void 0!==(u=v.loadFile(t))&&(t=u)), e=this.getImageFileTypeByImageData(t,e), !S(e))throw new Error("addImage does not support files of type '"+e+"', please ensure that a plugin for '"+e+"' support is added.");if(this.supportsArrayBuffer()&&(t instanceof Uint8Array||(d=t, t=this.binaryStringToUint8Array(t))), !(p=this["process"+e.toUpperCase()](t,(g=0, (y=N)&&(g=Object.keys?Object.keys(y).length:function(t){var e=0;for(var r in t)t.hasOwnProperty(r)&&e++;return e}(y)), g),o,((m=a)&&"string"==typeof m&&(m=m.toUpperCase()), m in v.image_compression?m:v.image_compression.NONE),d)))throw new Error("An unknown error occurred whilst processing the image")}return function(t,e,r,n,i,s,o,a){var c=function(t,e,r){return t||e||(e=t=-96), t<0&&(t=-1*r.w*72/t/this.internal.scaleFactor), e<0&&(e=-1*r.h*72/e/this.internal.scaleFactor), 0===t&&(t=e*r.w/r.h), 0===e&&(e=t*r.h/r.w), [t,e]}.call(this,r,n,i),u=this.internal.getCoordinateString,l=this.internal.getVerticalCoordinateString;if(r=c[0], n=c[1], o[s]=i, a){a*=Math.PI/180;var f=Math.cos(a),h=Math.sin(a),p=function(t){return t.toFixed(4)},d=[p(f),p(h),p(-1*h),p(f),0,0,"cm"];}this.internal.write("q"), a?(this.internal.write([1,"0","0",1,u(t),l(e+n),"cm"].join(" ")), this.internal.write(d.join(" ")), this.internal.write([u(r),"0","0",u(n),"0","0","cm"].join(" "))):this.internal.write([u(r),"0","0",u(n),u(t),l(e+n),"cm"].join(" ")), this.internal.write("/I"+i.i+" Do"), this.internal.write("Q");}.call(this,r,n,i,s,p,p.i,N,c), this}, v.convertStringToImageData=function(t){var e,r="";if(this.isString(t)){var n;e=null!==(n=this.extractImageFromDataUrl(t))?n.data:t;try{r=atob(e);}catch(t){throw v.validateStringAsBase64(e)?new Error("atob-Error in jsPDF.convertStringToImageData "+t.message):new Error("Supplied Data is not a valid base64-String jsPDF.convertStringToImageData ")}}return r};var l=function(t,e){return t.subarray(e,e+5)};v.processJPEG=function(t,e,r,n,i,s){var o,a=this.decode.DCT_DECODE;if(!this.isString(t)&&!this.isArrayBuffer(t)&&!this.isArrayBufferView(t))return null;if(this.isString(t)&&(o=function(t){var e;if("JPEG"!==u(t))throw new Error("getJpegSize requires a binary string jpeg file");for(var r=256*t.charCodeAt(4)+t.charCodeAt(5),n=4,i=t.length;n<i;){if(n+=r, 255!==t.charCodeAt(n))throw new Error("getJpegSize could not find the size of the image");if(192===t.charCodeAt(n+1)||193===t.charCodeAt(n+1)||194===t.charCodeAt(n+1)||195===t.charCodeAt(n+1)||196===t.charCodeAt(n+1)||197===t.charCodeAt(n+1)||198===t.charCodeAt(n+1)||199===t.charCodeAt(n+1))return e=256*t.charCodeAt(n+5)+t.charCodeAt(n+6), [256*t.charCodeAt(n+7)+t.charCodeAt(n+8),e,t.charCodeAt(n+9)];n+=2, r=256*t.charCodeAt(n)+t.charCodeAt(n+1);}}(t)), this.isArrayBuffer(t)&&(t=new Uint8Array(t)), this.isArrayBufferView(t)&&(o=function(t){if(65496!=(t[0]<<8|t[1]))throw new Error("Supplied data is not a JPEG");for(var e,r=t.length,n=(t[4]<<8)+t[5],i=4;i<r;){if(n=((e=l(t,i+=n))[2]<<8)+e[3], (192===e[1]||194===e[1])&&255===e[0]&&7<n)return{width:((e=l(t,i+5))[2]<<8)+e[3],height:(e[0]<<8)+e[1],numcomponents:e[4]};i+=2;}throw new Error("getJpegSizeFromBytes could not find the size of the image")}(t), t=i||this.arrayBufferToBinaryString(t)), void 0===s)switch(o.numcomponents){case 1:s=this.color_spaces.DEVICE_GRAY;break;case 4:s=this.color_spaces.DEVICE_CMYK;break;default:case 3:s=this.color_spaces.DEVICE_RGB;}return this.createImageInfo(t,o.width,o.height,s,8,a,e,r)}, v.processJPG=function(){return this.processJPEG.apply(this,arguments)}, v.getImageProperties=function(t){var e,r,n="";if(k(t)&&(t=_(t)), this.isString(t)&&(""!==(n=this.convertStringToImageData(t))?t=n:void 0!==(n=v.loadFile(t))&&(t=n)), r=this.getImageFileTypeByImageData(t), !S(r))throw new Error("addImage does not support files of type '"+r+"', please ensure that a plugin for '"+r+"' support is added.");if(this.supportsArrayBuffer()&&(t instanceof Uint8Array||(t=this.binaryStringToUint8Array(t))), !(e=this["process"+r.toUpperCase()](t)))throw new Error("An unknown error occurred whilst processing the image");return{fileType:r,width:e.w,height:e.h,colorSpace:e.cs,compressionMode:e.f,bitsPerComponent:e.bpc}};}(p.API), t=p.API, p.API.events.push(["addPage",function(t){this.internal.getPageInfo(t.pageNumber).pageContext.annotations=[];}]), t.events.push(["putPage",function(t){for(var e=this.internal.getPageInfoByObjId(t.objId),r=t.pageContext.annotations,n=function(t){if(void 0!==t&&""!=t)return!0},i=!1,s=0;s<r.length&&!i;s++)switch((c=r[s]).type){case"link":if(n(c.options.url)||n(c.options.pageNumber)){i=!0;break}case"reference":case"text":case"freetext":i=!0;}if(0!=i){this.internal.write("/Annots ["), this.internal.pageSize.height;var o=this.internal.getCoordinateString,a=this.internal.getVerticalCoordinateString;for(s=0;s<r.length;s++){var c;switch((c=r[s]).type){case"reference":this.internal.write(" "+c.object.objId+" 0 R ");break;case"text":var u=this.internal.newAdditionalObject(),l=this.internal.newAdditionalObject(),f=c.title||"Note";y="<</Type /Annot /Subtype /Text "+(p="/Rect ["+o(c.bounds.x)+" "+a(c.bounds.y+c.bounds.h)+" "+o(c.bounds.x+c.bounds.w)+" "+a(c.bounds.y)+"] ")+"/Contents ("+c.contents+")", y+=" /Popup "+l.objId+" 0 R", y+=" /P "+e.objId+" 0 R", y+=" /T ("+f+") >>", u.content=y;var h=u.objId+" 0 R";y="<</Type /Annot /Subtype /Popup "+(p="/Rect ["+o(c.bounds.x+30)+" "+a(c.bounds.y+c.bounds.h)+" "+o(c.bounds.x+c.bounds.w+30)+" "+a(c.bounds.y)+"] ")+" /Parent "+h, c.open&&(y+=" /Open true"), y+=" >>", l.content=y, this.internal.write(u.objId,"0 R",l.objId,"0 R");break;case"freetext":var p="/Rect ["+o(c.bounds.x)+" "+a(c.bounds.y)+" "+o(c.bounds.x+c.bounds.w)+" "+a(c.bounds.y+c.bounds.h)+"] ",d=c.color||"#000000";y="<</Type /Annot /Subtype /FreeText "+p+"/Contents ("+c.contents+")", y+=" /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#"+d+")", y+=" /Border [0 0 0]", y+=" >>", this.internal.write(y);break;case"link":if(c.options.name){var m=this.annotations._nameMap[c.options.name];c.options.pageNumber=m.page, c.options.top=m.y;}else c.options.top||(c.options.top=0);p="/Rect ["+o(c.x)+" "+a(c.y)+" "+o(c.x+c.w)+" "+a(c.y+c.h)+"] ";var y="";if(c.options.url)y="<</Type /Annot /Subtype /Link "+p+"/Border [0 0 0] /A <</S /URI /URI ("+c.options.url+") >>";else if(c.options.pageNumber)switch(y="<</Type /Annot /Subtype /Link "+p+"/Border [0 0 0] /Dest ["+this.internal.getPageInfo(c.options.pageNumber).objId+" 0 R", c.options.magFactor=c.options.magFactor||"XYZ", c.options.magFactor){case"Fit":y+=" /Fit]";break;case"FitH":y+=" /FitH "+c.options.top+"]";break;case"FitV":c.options.left=c.options.left||0, y+=" /FitV "+c.options.left+"]";break;case"XYZ":default:var g=a(c.options.top);c.options.left=c.options.left||0, void 0===c.options.zoom&&(c.options.zoom=0), y+=" /XYZ "+c.options.left+" "+g+" "+c.options.zoom+"]";}""!=y&&(y+=" >>", this.internal.write(y));}}this.internal.write("]");}}]), t.createAnnotation=function(t){var e=this.internal.getCurrentPageInfo();switch(t.type){case"link":this.link(t.bounds.x,t.bounds.y,t.bounds.w,t.bounds.h,t);break;case"text":case"freetext":e.pageContext.annotations.push(t);}}, t.link=function(t,e,r,n,i){this.internal.getCurrentPageInfo().pageContext.annotations.push({x:t,y:e,w:r,h:n,options:i,type:"link"});}, t.textWithLink=function(t,e,r,n){var i=this.getTextWidth(t),s=this.internal.getLineHeight()/this.internal.scaleFactor;return this.text(t,e,r), r+=.2*s, this.link(e,r-s,i,s,n), i}, t.getTextWidth=function(t){var e=this.internal.getFontSize();return this.getStringUnitWidth(t)*e/this.internal.scaleFactor}, e=p.API, (r=function(){var e=void 0;Object.defineProperty(this,"pdf",{get:function(){return e},set:function(t){e=t;}});var r=150;Object.defineProperty(this,"width",{get:function(){return r},set:function(t){r=isNaN(t)||!1===Number.isInteger(t)||t<0?150:t, this.getContext("2d").pageWrapXEnabled&&(this.getContext("2d").pageWrapX=r+1);}});var n=300;Object.defineProperty(this,"height",{get:function(){return n},set:function(t){n=isNaN(t)||!1===Number.isInteger(t)||t<0?300:t, this.getContext("2d").pageWrapYEnabled&&(this.getContext("2d").pageWrapY=n+1);}});var i=[];Object.defineProperty(this,"childNodes",{get:function(){return i},set:function(t){i=t;}});var s={};Object.defineProperty(this,"style",{get:function(){return s},set:function(t){s=t;}}), Object.defineProperty(this,"parentNode",{get:function(){return!1}});}).prototype.getContext=function(t,e){var r;if("2d"!==(t=t||"2d"))return null;for(r in e)this.pdf.context2d.hasOwnProperty(r)&&(this.pdf.context2d[r]=e[r]);return(this.pdf.context2d._canvas=this).pdf.context2d}, r.prototype.toDataURL=function(){throw new Error("toDataURL is not implemented.")}, e.events.push(["initialized",function(){this.canvas=new r, this.canvas.pdf=this;}]), function(t,e){var c,i,s,u,l,f=function(t){return t=t||{}, this.isStrokeTransparent=t.isStrokeTransparent||!1, this.strokeOpacity=t.strokeOpacity||1, this.strokeStyle=t.strokeStyle||"#000000", this.fillStyle=t.fillStyle||"#000000", this.isFillTransparent=t.isFillTransparent||!1, this.fillOpacity=t.fillOpacity||1, this.font=t.font||"10px sans-serif", this.textBaseline=t.textBaseline||"alphabetic", this.textAlign=t.textAlign||"left", this.lineWidth=t.lineWidth||1, this.lineJoin=t.lineJoin||"miter", this.lineCap=t.lineCap||"butt", this.path=t.path||[], this.transform=void 0!==t.transform?t.transform.clone():new B, this.globalCompositeOperation=t.globalCompositeOperation||"normal", this.globalAlpha=t.globalAlpha||1, this.clip_path=t.clip_path||[], this.currentPoint=t.currentPoint||new C, this.miterLimit=t.miterLimit||10, this.lastPoint=t.lastPoint||new C, this.ignoreClearRect="boolean"!=typeof t.ignoreClearRect||t.ignoreClearRect, this};t.events.push(["initialized",function(){this.context2d=new r(this), c=this.internal.f2, this.internal.f3, i=this.internal.getCoordinateString, s=this.internal.getVerticalCoordinateString, u=this.internal.getHorizontalCoordinate, l=this.internal.getVerticalCoordinate;}]);var r=function(t){Object.defineProperty(this,"canvas",{get:function(){return{parentNode:!1,style:!1}}}), Object.defineProperty(this,"pdf",{get:function(){return t}});var e=!1;Object.defineProperty(this,"pageWrapXEnabled",{get:function(){return e},set:function(t){e=Boolean(t);}});var r=!1;Object.defineProperty(this,"pageWrapYEnabled",{get:function(){return r},set:function(t){r=Boolean(t);}});var n=0;Object.defineProperty(this,"posX",{get:function(){return n},set:function(t){isNaN(t)||(n=t);}});var i=0;Object.defineProperty(this,"posY",{get:function(){return i},set:function(t){isNaN(t)||(i=t);}});var s=!1;Object.defineProperty(this,"autoPaging",{get:function(){return s},set:function(t){s=Boolean(t);}});var o=0;Object.defineProperty(this,"lastBreak",{get:function(){return o},set:function(t){o=t;}});var a=[];Object.defineProperty(this,"pageBreaks",{get:function(){return a},set:function(t){a=t;}});var c=new f;Object.defineProperty(this,"ctx",{get:function(){return c},set:function(t){t instanceof f&&(c=t);}}), Object.defineProperty(this,"path",{get:function(){return c.path},set:function(t){c.path=t;}});var u=[];Object.defineProperty(this,"ctxStack",{get:function(){return u},set:function(t){u=t;}}), Object.defineProperty(this,"fillStyle",{get:function(){return this.ctx.fillStyle},set:function(t){var e;e=h(t), this.ctx.fillStyle=e.style, this.ctx.isFillTransparent=0===e.a, this.ctx.fillOpacity=e.a, this.pdf.setFillColor(e.r,e.g,e.b,{a:e.a}), this.pdf.setTextColor(e.r,e.g,e.b,{a:e.a});}}), Object.defineProperty(this,"strokeStyle",{get:function(){return this.ctx.strokeStyle},set:function(t){var e=h(t);this.ctx.strokeStyle=e.style, this.ctx.isStrokeTransparent=0===e.a, this.ctx.strokeOpacity=e.a, 0===e.a?this.pdf.setDrawColor(255,255,255):(this.pdf.setDrawColor(e.r,e.g,e.b));}}), Object.defineProperty(this,"lineCap",{get:function(){return this.ctx.lineCap},set:function(t){-1!==["butt","round","square"].indexOf(t)&&(this.ctx.lineCap=t, this.pdf.setLineCap(t));}}), Object.defineProperty(this,"lineWidth",{get:function(){return this.ctx.lineWidth},set:function(t){isNaN(t)||(this.ctx.lineWidth=t, this.pdf.setLineWidth(t));}}), Object.defineProperty(this,"lineJoin",{get:function(){return this.ctx.lineJoin},set:function(t){-1!==["bevel","round","miter"].indexOf(t)&&(this.ctx.lineJoin=t, this.pdf.setLineJoin(t));}}), Object.defineProperty(this,"miterLimit",{get:function(){return this.ctx.miterLimit},set:function(t){isNaN(t)||(this.ctx.miterLimit=t, this.pdf.setMiterLimit(t));}}), Object.defineProperty(this,"textBaseline",{get:function(){return this.ctx.textBaseline},set:function(t){this.ctx.textBaseline=t;}}), Object.defineProperty(this,"textAlign",{get:function(){return this.ctx.textAlign},set:function(t){-1!==["right","end","center","left","start"].indexOf(t)&&(this.ctx.textAlign=t);}}), Object.defineProperty(this,"font",{get:function(){return this.ctx.font},set:function(t){var e;if(this.ctx.font=t, null!==(e=/^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z]+?)\s*$/i.exec(t))){var r=e[1],n=(e[2], e[3]),i=e[4],s=e[5],o=e[6];i="px"===s?Math.floor(parseFloat(i)):"em"===s?Math.floor(parseFloat(i)*this.pdf.getFontSize()):Math.floor(parseFloat(i)), this.pdf.setFontSize(i);var a="";("bold"===n||700<=parseInt(n,10)||"bold"===r)&&(a="bold"), "italic"===r&&(a+="italic"), 0===a.length&&(a="normal");for(var c="",u=o.toLowerCase().replace(/"|'/g,"").split(/\s*,\s*/),l={arial:"Helvetica",verdana:"Helvetica",helvetica:"Helvetica","sans-serif":"Helvetica",fixed:"Courier",monospace:"Courier",terminal:"Courier",courier:"Courier",times:"Times",cursive:"Times",fantasy:"Times",serif:"Times"},f=0;f<u.length;f++){if(void 0!==this.pdf.internal.getFont(u[f],a,{noFallback:!0,disableWarning:!0})){c=u[f];break}if("bolditalic"===a&&void 0!==this.pdf.internal.getFont(u[f],"bold",{noFallback:!0,disableWarning:!0}))c=u[f], a="bold";else if(void 0!==this.pdf.internal.getFont(u[f],"normal",{noFallback:!0,disableWarning:!0})){c=u[f], a="normal";break}}if(""===c)for(f=0;f<u.length;f++)if(l[u[f]]){c=l[u[f]];break}c=""===c?"Times":c, this.pdf.setFont(c,a);}}}), Object.defineProperty(this,"globalCompositeOperation",{get:function(){return this.ctx.globalCompositeOperation},set:function(t){this.ctx.globalCompositeOperation=t;}}), Object.defineProperty(this,"globalAlpha",{get:function(){return this.ctx.globalAlpha},set:function(t){this.ctx.globalAlpha=t;}}), Object.defineProperty(this,"ignoreClearRect",{get:function(){return this.ctx.ignoreClearRect},set:function(t){this.ctx.ignoreClearRect=Boolean(t);}});};r.prototype.fill=function(){n.call(this,"fill",!1);}, r.prototype.stroke=function(){n.call(this,"stroke",!1);}, r.prototype.beginPath=function(){this.path=[{type:"begin"}];}, r.prototype.moveTo=function(t,e){if(isNaN(t)||isNaN(e))throw console.error("jsPDF.context2d.moveTo: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.moveTo");var r=this.ctx.transform.applyToPoint(new C(t,e));this.path.push({type:"mt",x:r.x,y:r.y}), this.ctx.lastPoint=new C(t,e);}, r.prototype.closePath=function(){var t=new C(0,0),e=0;for(e=this.path.length-1;-1!==e;e--)if("begin"===this.path[e].type&&"object"===ae(this.path[e+1])&&"number"==typeof this.path[e+1].x){t=new C(this.path[e+1].x,this.path[e+1].y), this.path.push({type:"lt",x:t.x,y:t.y});break}"object"===ae(this.path[e+2])&&"number"==typeof this.path[e+2].x&&this.path.push(JSON.parse(JSON.stringify(this.path[e+2]))), this.path.push({type:"close"}), this.ctx.lastPoint=new C(t.x,t.y);}, r.prototype.lineTo=function(t,e){if(isNaN(t)||isNaN(e))throw console.error("jsPDF.context2d.lineTo: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.lineTo");var r=this.ctx.transform.applyToPoint(new C(t,e));this.path.push({type:"lt",x:r.x,y:r.y}), this.ctx.lastPoint=new C(r.x,r.y);}, r.prototype.clip=function(){this.ctx.clip_path=JSON.parse(JSON.stringify(this.path)), n.call(this,null,!0);}, r.prototype.quadraticCurveTo=function(t,e,r,n){if(isNaN(r)||isNaN(n)||isNaN(t)||isNaN(e))throw console.error("jsPDF.context2d.quadraticCurveTo: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo");var i=this.ctx.transform.applyToPoint(new C(r,n)),s=this.ctx.transform.applyToPoint(new C(t,e));this.path.push({type:"qct",x1:s.x,y1:s.y,x:i.x,y:i.y}), this.ctx.lastPoint=new C(i.x,i.y);}, r.prototype.bezierCurveTo=function(t,e,r,n,i,s){if(isNaN(i)||isNaN(s)||isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw console.error("jsPDF.context2d.bezierCurveTo: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo");var o=this.ctx.transform.applyToPoint(new C(i,s)),a=this.ctx.transform.applyToPoint(new C(t,e)),c=this.ctx.transform.applyToPoint(new C(r,n));this.path.push({type:"bct",x1:a.x,y1:a.y,x2:c.x,y2:c.y,x:o.x,y:o.y}), this.ctx.lastPoint=new C(o.x,o.y);}, r.prototype.arc=function(t,e,r,n,i,s){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i))throw console.error("jsPDF.context2d.arc: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.arc");if(s=Boolean(s), !this.ctx.transform.isIdentity){var o=this.ctx.transform.applyToPoint(new C(t,e));t=o.x, e=o.y;var a=this.ctx.transform.applyToPoint(new C(0,r)),c=this.ctx.transform.applyToPoint(new C(0,0));r=Math.sqrt(Math.pow(a.x-c.x,2)+Math.pow(a.y-c.y,2));}Math.abs(i-n)>=2*Math.PI&&(n=0, i=2*Math.PI), this.path.push({type:"arc",x:t,y:e,radius:r,startAngle:n,endAngle:i,counterclockwise:s});}, r.prototype.arcTo=function(t,e,r,n,i){throw new Error("arcTo not implemented.")}, r.prototype.rect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw console.error("jsPDF.context2d.rect: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.rect");this.moveTo(t,e), this.lineTo(t+r,e), this.lineTo(t+r,e+n), this.lineTo(t,e+n), this.lineTo(t,e), this.lineTo(t+r,e), this.lineTo(t,e);}, r.prototype.fillRect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw console.error("jsPDF.context2d.fillRect: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.fillRect");if(!b.call(this)){var i={};"butt"!==this.lineCap&&(i.lineCap=this.lineCap, this.lineCap="butt"), "miter"!==this.lineJoin&&(i.lineJoin=this.lineJoin, this.lineJoin="miter"), this.beginPath(), this.rect(t,e,r,n), this.fill(), i.hasOwnProperty("lineCap")&&(this.lineCap=i.lineCap), i.hasOwnProperty("lineJoin")&&(this.lineJoin=i.lineJoin);}}, r.prototype.strokeRect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw console.error("jsPDF.context2d.strokeRect: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.strokeRect");A.call(this)||(this.beginPath(), this.rect(t,e,r,n), this.stroke());}, r.prototype.clearRect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw console.error("jsPDF.context2d.clearRect: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.clearRect");this.ignoreClearRect||(this.fillStyle="#ffffff", this.fillRect(t,e,r,n));}, r.prototype.save=function(t){t="boolean"!=typeof t||t;for(var e=this.pdf.internal.getCurrentPageInfo().pageNumber,r=0;r<this.pdf.internal.getNumberOfPages();r++)this.pdf.setPage(r+1), this.pdf.internal.out("q");if(this.pdf.setPage(e), t){this.ctx.fontSize=this.pdf.internal.getFontSize();var n=new f(this.ctx);this.ctxStack.push(this.ctx), this.ctx=n;}}, r.prototype.restore=function(t){t="boolean"!=typeof t||t;for(var e=this.pdf.internal.getCurrentPageInfo().pageNumber,r=0;r<this.pdf.internal.getNumberOfPages();r++)this.pdf.setPage(r+1), this.pdf.internal.out("Q");this.pdf.setPage(e), t&&0!==this.ctxStack.length&&(this.ctx=this.ctxStack.pop(), this.fillStyle=this.ctx.fillStyle, this.strokeStyle=this.ctx.strokeStyle, this.font=this.ctx.font, this.lineCap=this.ctx.lineCap, this.lineWidth=this.ctx.lineWidth, this.lineJoin=this.ctx.lineJoin);}, r.prototype.toDataURL=function(){throw new Error("toDataUrl not implemented.")};var h=function(t){var e,r,n,i;if(!0===t.isCanvasGradient&&(t=t.getColor()), !t)return{r:0,g:0,b:0,a:0,style:t};if(/transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/.test(t))i=n=r=e=0;else{var s=/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(t);if(null!==s)e=parseInt(s[1]), r=parseInt(s[2]), n=parseInt(s[3]), i=1;else if(null!==(s=/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/.exec(t)))e=parseInt(s[1]), r=parseInt(s[2]), n=parseInt(s[3]), i=parseFloat(s[4]);else{if(i=1, "string"==typeof t&&"#"!==t.charAt(0)){var o=new RGBColor(t);t=o.ok?o.toHex():"#000000";}4===t.length?(e=t.substring(1,2), e+=e, r=t.substring(2,3), r+=r, n=t.substring(3,4), n+=n):(e=t.substring(1,3), r=t.substring(3,5), n=t.substring(5,7)), e=parseInt(e,16), r=parseInt(r,16), n=parseInt(n,16);}}return{r:e,g:r,b:n,a:i,style:t}},b=function(){return this.ctx.isFillTransparent||0==this.globalAlpha},A=function(){return Boolean(this.ctx.isStrokeTransparent||0==this.globalAlpha)};r.prototype.fillText=function(t,e,r,n){if(isNaN(e)||isNaN(r)||"string"!=typeof t)throw console.error("jsPDF.context2d.fillText: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.fillText");if(n=isNaN(n)?void 0:n, !b.call(this)){r=o.call(this,r);var i=P(this.ctx.transform.rotation),s=this.ctx.transform.scaleX;a.call(this,{text:t,x:e,y:r,scale:s,angle:i,align:this.textAlign,maxWidth:n});}}, r.prototype.strokeText=function(t,e,r,n){if(isNaN(e)||isNaN(r)||"string"!=typeof t)throw console.error("jsPDF.context2d.strokeText: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.strokeText");if(!A.call(this)){n=isNaN(n)?void 0:n, r=o.call(this,r);var i=P(this.ctx.transform.rotation),s=this.ctx.transform.scaleX;a.call(this,{text:t,x:e,y:r,scale:s,renderingMode:"stroke",angle:i,align:this.textAlign,maxWidth:n});}}, r.prototype.measureText=function(t){if("string"!=typeof t)throw console.error("jsPDF.context2d.measureText: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.measureText");var e=this.pdf,r=this.pdf.internal.scaleFactor,n=e.internal.getFontSize(),i=e.getStringUnitWidth(t)*n/e.internal.scaleFactor;return new function(t){var e=(t=t||{}).width||0;return Object.defineProperty(this,"width",{get:function(){return e}}), this}({width:i*=Math.round(96*r/72*1e4)/1e4})}, r.prototype.scale=function(t,e){if(isNaN(t)||isNaN(e))throw console.error("jsPDF.context2d.scale: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.scale");var r=new B(t,0,0,e,0,0);this.ctx.transform=this.ctx.transform.multiply(r);}, r.prototype.rotate=function(t){if(isNaN(t))throw console.error("jsPDF.context2d.rotate: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.rotate");var e=new B(Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0);this.ctx.transform=this.ctx.transform.multiply(e);}, r.prototype.translate=function(t,e){if(isNaN(t)||isNaN(e))throw console.error("jsPDF.context2d.translate: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.translate");var r=new B(1,0,0,1,t,e);this.ctx.transform=this.ctx.transform.multiply(r);}, r.prototype.transform=function(t,e,r,n,i,s){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i)||isNaN(s))throw console.error("jsPDF.context2d.transform: Invalid arguments",arguments), new Error("Invalid arguments passed to jsPDF.context2d.transform");var o=new B(t,e,r,n,i,s);this.ctx.transform=this.ctx.transform.multiply(o);}, r.prototype.setTransform=function(t,e,r,n,i,s){t=isNaN(t)?1:t, e=isNaN(e)?0:e, r=isNaN(r)?0:r, n=isNaN(n)?1:n, i=isNaN(i)?0:i, s=isNaN(s)?0:s, this.ctx.transform=new B(t,e,r,n,i,s);}, r.prototype.drawImage=function(t,e,r,n,i,s,o,a,c){var u=this.pdf.getImageProperties(t),l=1,f=1,h=1,p=1;void 0!==n&&void 0!==a&&(h=a/n, p=c/i, l=u.width/n*a/n, f=u.height/i*c/i), void 0===s&&(s=e, o=r, r=e=0), void 0!==n&&void 0===a&&(a=n, c=i), void 0===n&&void 0===a&&(a=u.width, c=u.height);var d=this.ctx.transform.decompose(),m=P(d.rotate.shx);d.scale.sx, d.scale.sy;for(var y,g=new B,w=((g=(g=(g=g.multiply(d.translate)).multiply(d.skew)).multiply(d.scale)).applyToPoint(new C(a,c)), g.applyToRectangle(new E(s-e*h,o-r*p,n*l,i*f))),L=_.call(this,w),N=[],v=0;v<L.length;v+=1)-1===N.indexOf(L[v])&&N.push(L[v]);if(N.sort(), this.autoPaging)for(var b=N[0],A=N[N.length-1],x=b;x<A+1;x++){if(this.pdf.setPage(x), 0!==this.ctx.clip_path.length){var S=this.path;y=JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path=q(y,this.posX,-1*this.pdf.internal.pageSize.height*(x-1)+this.posY), I.call(this,"fill",!0), this.path=S;}var k=JSON.parse(JSON.stringify(w));k=q([k],this.posX,-1*this.pdf.internal.pageSize.height*(x-1)+this.posY)[0], this.pdf.addImage(t,"jpg",k.x,k.y,k.w,k.h,null,null,m);}else this.pdf.addImage(t,"jpg",w.x,w.y,w.w,w.h,null,null,m);};var _=function(t,e,r){var n=[];switch(e=e||this.pdf.internal.pageSize.width, r=r||this.pdf.internal.pageSize.height, t.type){default:case"mt":case"lt":n.push(Math.floor((t.y+this.posY)/r)+1);break;case"arc":n.push(Math.floor((t.y+this.posY-t.radius)/r)+1), n.push(Math.floor((t.y+this.posY+t.radius)/r)+1);break;case"qct":var i=L(this.ctx.lastPoint.x,this.ctx.lastPoint.y,t.x1,t.y1,t.x,t.y);n.push(Math.floor(i.y/r)+1), n.push(Math.floor((i.y+i.h)/r)+1);break;case"bct":var s=N(this.ctx.lastPoint.x,this.ctx.lastPoint.y,t.x1,t.y1,t.x2,t.y2,t.x,t.y);n.push(Math.floor(s.y/r)+1), n.push(Math.floor((s.y+s.h)/r)+1);break;case"rect":n.push(Math.floor((t.y+this.posY)/r)+1), n.push(Math.floor((t.y+t.h+this.posY)/r)+1);}for(var o=0;o<n.length;o+=1)for(;this.pdf.internal.getNumberOfPages()<n[o];)w.call(this);return n},w=function(){var t=this.fillStyle,e=this.strokeStyle,r=this.font,n=this.lineCap,i=this.lineWidth,s=this.lineJoin;this.pdf.addPage(), this.fillStyle=t, this.strokeStyle=e, this.font=r, this.lineCap=n, this.lineWidth=i, this.lineJoin=s;},q=function(t,e,r){for(var n=0;n<t.length;n++)switch(t[n].type){case"bct":t[n].x2+=e, t[n].y2+=r;case"qct":t[n].x1+=e, t[n].y1+=r;case"mt":case"lt":case"arc":default:t[n].x+=e, t[n].y+=r;}return t},n=function(t,e){for(var r,n,i=this.fillStyle,s=this.strokeStyle,o=(this.font, this.lineCap),a=this.lineWidth,c=this.lineJoin,u=JSON.parse(JSON.stringify(this.path)),l=JSON.parse(JSON.stringify(this.path)),f=[],h=0;h<l.length;h++)if(void 0!==l[h].x)for(var p=_.call(this,l[h]),d=0;d<p.length;d+=1)-1===f.indexOf(p[d])&&f.push(p[d]);for(h=0;h<f.length;h++)for(;this.pdf.internal.getNumberOfPages()<f[h];)w.call(this);if(f.sort(), this.autoPaging){var m=f[0],y=f[f.length-1];for(h=m;h<y+1;h++){if(this.pdf.setPage(h), this.fillStyle=i, this.strokeStyle=s, this.lineCap=o, this.lineWidth=a, this.lineJoin=c, 0!==this.ctx.clip_path.length){var g=this.path;r=JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path=q(r,this.posX,-1*this.pdf.internal.pageSize.height*(h-1)+this.posY), I.call(this,t,!0), this.path=g;}n=JSON.parse(JSON.stringify(u)), this.path=q(n,this.posX,-1*this.pdf.internal.pageSize.height*(h-1)+this.posY), !1!==e&&0!==h||I.call(this,t,e);}}else I.call(this,t,e);this.path=u;},I=function(t,e){if(("stroke"!==t||e||!A.call(this))&&("stroke"===t||e||!b.call(this))){var r=[];this.ctx.globalAlpha;this.ctx.fillOpacity<1&&this.ctx.fillOpacity;for(var n,i=this.path,s=0;s<i.length;s++){var o=i[s];switch(o.type){case"begin":r.push({begin:!0});break;case"close":r.push({close:!0});break;case"mt":r.push({start:o,deltas:[],abs:[]});break;case"lt":var a=r.length;if(!isNaN(i[s-1].x)){var c=[o.x-i[s-1].x,o.y-i[s-1].y];if(0<a)for(;0<=a;a--)if(!0!==r[a-1].close&&!0!==r[a-1].begin){r[a-1].deltas.push(c), r[a-1].abs.push(o);break}}break;case"bct":c=[o.x1-i[s-1].x,o.y1-i[s-1].y,o.x2-i[s-1].x,o.y2-i[s-1].y,o.x-i[s-1].x,o.y-i[s-1].y];r[r.length-1].deltas.push(c);break;case"qct":var u=i[s-1].x+2/3*(o.x1-i[s-1].x),l=i[s-1].y+2/3*(o.y1-i[s-1].y),f=o.x+2/3*(o.x1-o.x),h=o.y+2/3*(o.y1-o.y),p=o.x,d=o.y;c=[u-i[s-1].x,l-i[s-1].y,f-i[s-1].x,h-i[s-1].y,p-i[s-1].x,d-i[s-1].y];r[r.length-1].deltas.push(c);break;case"arc":r.push({deltas:[],abs:[],arc:!0}), Array.isArray(r[r.length-1].abs)&&r[r.length-1].abs.push(o);}}n=e?null:"stroke"===t?"stroke":"fill";for(s=0;s<r.length;s++){if(r[s].arc)for(var m=r[s].abs,y=0;y<m.length;y++){var g=m[y];if(void 0!==g.startAngle){var w=P(g.startAngle),L=P(g.endAngle),N=g.x,v=g.y;x.call(this,N,v,g.radius,w,L,g.counterclockwise,n,e);}else M.call(this,g.x,g.y);}if(!r[s].arc&&!0!==r[s].close&&!0!==r[s].begin){N=r[s].start.x, v=r[s].start.y;F.call(this,r[s].deltas,N,v,null,null);}}n&&S.call(this,n), e&&k.call(this);}},o=function(t){var e=this.pdf.internal.getFontSize()/this.pdf.internal.scaleFactor,r=e*(this.pdf.internal.getLineHeightFactor()-1);switch(this.ctx.textBaseline){case"bottom":return t-r;case"top":return t+e-r;case"hanging":return t+e-2*r;case"middle":return t+e/2-r;case"ideographic":return t;case"alphabetic":default:return t}};r.prototype.createLinearGradient=function(){var t=function(){};return t.colorStops=[], t.addColorStop=function(t,e){this.colorStops.push([t,e]);}, t.getColor=function(){return 0===this.colorStops.length?"#000000":this.colorStops[0][1]}, t.isCanvasGradient=!0, t}, r.prototype.createPattern=function(){return this.createLinearGradient()}, r.prototype.createRadialGradient=function(){return this.createLinearGradient()};var x=function(t,e,r,n,i,s,o,a){this.pdf.internal.scaleFactor;for(var c=g(n),u=g(i),l=m.call(this,r,c,u,s),f=0;f<l.length;f++){var h=l[f];0===f&&p.call(this,h.x1+t,h.y1+e), d.call(this,t,e,h.x2,h.y2,h.x3,h.y3,h.x4,h.y4);}a?k.call(this):S.call(this,o);},S=function(t){switch(t){case"stroke":this.pdf.internal.out("S");break;case"fill":this.pdf.internal.out("f");}},k=function(){this.pdf.clip();},p=function(t,e){this.pdf.internal.out(i(t)+" "+s(e)+" m");},a=function(t){var e;switch(t.align){case"right":case"end":e="right";break;case"center":e="center";break;case"left":case"start":default:e="left";}var r=this.ctx.transform.applyToPoint(new C(t.x,t.y)),n=this.ctx.transform.decompose(),i=new B;i=(i=(i=i.multiply(n.translate)).multiply(n.skew)).multiply(n.scale);for(var s,o=this.pdf.getTextDimensions(t.text),a=this.ctx.transform.applyToRectangle(new E(t.x,t.y,o.w,o.h)),c=i.applyToRectangle(new E(t.x,t.y-o.h,o.w,o.h)),u=_.call(this,c),l=[],f=0;f<u.length;f+=1)-1===l.indexOf(u[f])&&l.push(u[f]);if(l.sort(), !0===this.autoPaging)for(var h=l[0],p=l[l.length-1],d=h;d<p+1;d++){if(this.pdf.setPage(d), 0!==this.ctx.clip_path.length){var m=this.path;s=JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path=q(s,this.posX,-1*this.pdf.internal.pageSize.height*(d-1)+this.posY), I.call(this,"fill",!0), this.path=m;}var y=JSON.parse(JSON.stringify(a));if(y=q([y],this.posX,-1*this.pdf.internal.pageSize.height*(d-1)+this.posY)[0], .01<=t.scale){var g=this.pdf.internal.getFontSize();this.pdf.setFontSize(g*t.scale);}this.pdf.text(t.text,y.x,y.y,{angle:t.angle,align:e,renderingMode:t.renderingMode,maxWidth:t.maxWidth}), .01<=t.scale&&this.pdf.setFontSize(g);}else{if(.01<=t.scale){g=this.pdf.internal.getFontSize();this.pdf.setFontSize(g*t.scale);}this.pdf.text(t.text,r.x+this.posX,r.y+this.posY,{angle:t.angle,align:e,renderingMode:t.renderingMode,maxWidth:t.maxWidth}), .01<=t.scale&&this.pdf.setFontSize(g);}},M=function(t,e,r,n){r=r||0, n=n||0, this.pdf.internal.out(i(t+r)+" "+s(e+n)+" l");},F=function(t,e,r){return this.pdf.lines(t,e,r,null,null)},d=function(t,e,r,n,i,s,o,a){this.pdf.internal.out([c(u(r+t)),c(l(n+e)),c(u(i+t)),c(l(s+e)),c(u(o+t)),c(l(a+e)),"c"].join(" "));},m=function(t,e,r,n){var i=2*Math.PI,s=e;(s<i||i<s)&&(s%=i);var o=r;(o<i||i<o)&&(o%=i);for(var a=[],c=Math.PI/2,u=n?-1:1,l=e,f=Math.min(i,Math.abs(o-s));1e-5<f;){var h=l+u*Math.min(f,c);a.push(y.call(this,t,l,h)), f-=Math.abs(h-l), l=h;}return a},y=function(t,e,r){var n=(r-e)/2,i=t*Math.cos(n),s=t*Math.sin(n),o=i,a=-s,c=o*o+a*a,u=c+o*i+a*s,l=4/3*(Math.sqrt(2*c*u)-u)/(o*s-a*i),f=o-l*a,h=a+l*o,p=f,d=-h,m=n+e,y=Math.cos(m),g=Math.sin(m);return{x1:t*Math.cos(e),y1:t*Math.sin(e),x2:f*y-h*g,y2:f*g+h*y,x3:p*y-d*g,y3:p*g+d*y,x4:t*Math.cos(r),y4:t*Math.sin(r)}},P=function(t){return 180*t/Math.PI},g=function(t){return t*Math.PI/180},L=function(t,e,r,n,i,s){var o=t+.5*(r-t),a=e+.5*(n-e),c=i+.5*(r-i),u=s+.5*(n-s),l=Math.min(t,i,o,c),f=Math.max(t,i,o,c),h=Math.min(e,s,a,u),p=Math.max(e,s,a,u);return new E(l,h,f-l,p-h)},N=function(t,e,r,n,i,s,o,a){for(var c,u,l,f,h,p,d,m,y,g,w,L,N,v=r-t,b=n-e,A=i-r,x=s-n,S=o-i,k=a-s,_=0;_<41;_++)m=(p=(u=t+(c=_/40)*v)+c*((f=r+c*A)-u))+c*(f+c*(i+c*S-f)-p), y=(d=(l=e+c*b)+c*((h=n+c*x)-l))+c*(h+c*(s+c*k-h)-d), N=0==_?(L=g=m, w=y):(g=Math.min(g,m), w=Math.min(w,y), L=Math.max(L,m), Math.max(N,y));return new E(Math.round(g),Math.round(w),Math.round(L-g),Math.round(N-w))},C=function(t,e){var r=t||0;Object.defineProperty(this,"x",{enumerable:!0,get:function(){return r},set:function(t){isNaN(t)||(r=parseFloat(t));}});var n=e||0;Object.defineProperty(this,"y",{enumerable:!0,get:function(){return n},set:function(t){isNaN(t)||(n=parseFloat(t));}});var i="pt";return Object.defineProperty(this,"type",{enumerable:!0,get:function(){return i},set:function(t){i=t.toString();}}), this},E=function(t,e,r,n){C.call(this,t,e), this.type="rect";var i=r||0;Object.defineProperty(this,"w",{enumerable:!0,get:function(){return i},set:function(t){isNaN(t)||(i=parseFloat(t));}});var s=n||0;return Object.defineProperty(this,"h",{enumerable:!0,get:function(){return s},set:function(t){isNaN(t)||(s=parseFloat(t));}}), this},B=function(t,e,r,n,i,s){var o=[];return Object.defineProperty(this,"sx",{get:function(){return o[0]},set:function(t){o[0]=Math.round(1e5*t)/1e5;}}), Object.defineProperty(this,"shy",{get:function(){return o[1]},set:function(t){o[1]=Math.round(1e5*t)/1e5;}}), Object.defineProperty(this,"shx",{get:function(){return o[2]},set:function(t){o[2]=Math.round(1e5*t)/1e5;}}), Object.defineProperty(this,"sy",{get:function(){return o[3]},set:function(t){o[3]=Math.round(1e5*t)/1e5;}}), Object.defineProperty(this,"tx",{get:function(){return o[4]},set:function(t){o[4]=Math.round(1e5*t)/1e5;}}), Object.defineProperty(this,"ty",{get:function(){return o[5]},set:function(t){o[5]=Math.round(1e5*t)/1e5;}}), Object.defineProperty(this,"rotation",{get:function(){return Math.atan2(this.shx,this.sx)}}), Object.defineProperty(this,"scaleX",{get:function(){return this.decompose().scale.sx}}), Object.defineProperty(this,"scaleY",{get:function(){return this.decompose().scale.sy}}), Object.defineProperty(this,"isIdentity",{get:function(){return 1===this.sx&&(0===this.shy&&(0===this.shx&&(1===this.sy&&(0===this.tx&&0===this.ty))))}}), this.sx=isNaN(t)?1:t, this.shy=isNaN(e)?0:e, this.shx=isNaN(r)?0:r, this.sy=isNaN(n)?1:n, this.tx=isNaN(i)?0:i, this.ty=isNaN(s)?0:s, this};B.prototype.multiply=function(t){var e=t.sx*this.sx+t.shy*this.shx,r=t.sx*this.shy+t.shy*this.sy,n=t.shx*this.sx+t.sy*this.shx,i=t.shx*this.shy+t.sy*this.sy,s=t.tx*this.sx+t.ty*this.shx+this.tx,o=t.tx*this.shy+t.ty*this.sy+this.ty;return new B(e,r,n,i,s,o)}, B.prototype.decompose=function(){var t=this.sx,e=this.shy,r=this.shx,n=this.sy,i=this.tx,s=this.ty,o=Math.sqrt(t*t+e*e),a=(t/=o)*r+(e/=o)*n;r-=t*a, n-=e*a;var c=Math.sqrt(r*r+n*n);return a/=c, t*(n/=c)<e*(r/=c)&&(t=-t, e=-e, a=-a, o=-o), {scale:new B(o,0,0,c,0,0),translate:new B(1,0,0,1,i,s),rotate:new B(t,e,-e,t,0,0),skew:new B(1,0,a,1,0,0)}}, B.prototype.applyToPoint=function(t){var e=t.x*this.sx+t.y*this.shx+this.tx,r=t.x*this.shy+t.y*this.sy+this.ty;return new C(e,r)}, B.prototype.applyToRectangle=function(t){var e=this.applyToPoint(t),r=this.applyToPoint(new C(t.x+t.w,t.y+t.h));return new E(e.x,e.y,r.x-e.x,r.y-e.y)}, B.prototype.clone=function(){var t=this.sx,e=this.shy,r=this.shx,n=this.sy,i=this.tx,s=this.ty;return new B(t,e,r,n,i,s)};}(p.API,"undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||Function('return typeof this === "object" && this.content')()||Function("return this")()), n=p.API, N=n.getCharWidthsArray=function(t,e){var r,n,i,s=(e=e||{}).font||this.internal.getFont(),o=e.fontSize||this.internal.getFontSize(),a=e.charSpace||this.internal.getCharSpace(),c=e.widths?e.widths:s.metadata.Unicode.widths,u=c.fof?c.fof:1,l=e.kerning?e.kerning:s.metadata.Unicode.kerning,f=l.fof?l.fof:1,h=0,p=c[0]||u,d=[];for(r=0, n=t.length;r<n;r++)i=t.charCodeAt(r), "function"==typeof s.metadata.widthOfString?d.push((s.metadata.widthOfGlyph(s.metadata.characterToGlyph(i))+a*(1e3/o)||0)/1e3):d.push((c[i]||p)/u+(l[i]&&l[i][h]||0)/f), h=i;return d}, v=n.getArraySum=function(t){for(var e=t.length,r=0;e;)r+=t[--e];return r}, b=n.getStringUnitWidth=function(t,e){var r=(e=e||{}).fontSize||this.internal.getFontSize(),n=e.font||this.internal.getFont(),i=e.charSpace||this.internal.getCharSpace();return"function"==typeof n.metadata.widthOfString?n.metadata.widthOfString(t,r,i)/r:v(N.apply(this,arguments))}, A=function(t,e,r,n){for(var i=[],s=0,o=t.length,a=0;s!==o&&a+e[s]<r;)a+=e[s], s++;i.push(t.slice(0,s));var c=s;for(a=0;s!==o;)a+e[s]>n&&(i.push(t.slice(c,s)), a=0, c=s), a+=e[s], s++;return c!==s&&i.push(t.slice(c,s)), i}, l=function(t,e,r){r||(r={});var n,i,s,o,a,c,u=[],l=[u],f=r.textIndent||0,h=0,p=0,d=t.split(" "),m=N.apply(this,[" ",r])[0];if(c=-1===r.lineIndent?d[0].length+2:r.lineIndent||0){var y=Array(c).join(" "),g=[];d.map(function(t){1<(t=t.split(/\s*\n/)).length?g=g.concat(t.map(function(t,e){return(e&&t.length?"\n":"")+t})):g.push(t[0]);}), d=g, c=b.apply(this,[y,r]);}for(s=0, o=d.length;s<o;s++){var w=0;if(n=d[s], c&&"\n"==n[0]&&(n=n.substr(1), w=1), i=N.apply(this,[n,r]), e<f+h+(p=v(i))||w){if(e<p){for(a=A.apply(this,[n,i,e-(f+h),e]), u.push(a.shift()), u=[a.pop()];a.length;)l.push([a.shift()]);p=v(i.slice(n.length-(u[0]?u[0].length:0)));}else u=[n];l.push(u), f=p+c, h=m;}else u.push(n), f+=h+p, h=m;}if(c)var L=function(t,e){return(e?y:"")+t.join(" ")};else L=function(t){return t.join(" ")};return l.map(L)}, n.splitTextToSize=function(t,e,r){var n,i=(r=r||{}).fontSize||this.internal.getFontSize(),s=function(t){var e={0:1},r={};if(t.widths&&t.kerning)return{widths:t.widths,kerning:t.kerning};var n=this.internal.getFont(t.fontName,t.fontStyle),i="Unicode";return n.metadata[i]?{widths:n.metadata[i].widths||e,kerning:n.metadata[i].kerning||r}:{font:n.metadata,fontSize:this.internal.getFontSize(),charSpace:this.internal.getCharSpace()}}.call(this,r);n=Array.isArray(t)?t:t.split(/\r?\n/);var o=1*this.internal.scaleFactor*e/i;s.textIndent=r.textIndent?1*r.textIndent*this.internal.scaleFactor/i:0, s.lineIndent=r.lineIndent;var a,c,u=[];for(a=0, c=n.length;a<c;a++)u=u.concat(l.apply(this,[n[a],o,s]));return u}, i=p.API, o={codePages:["WinAnsiEncoding"],WinAnsiEncoding:(s=function(t){for(var e="klmnopqrstuvwxyz",r={},n=0;n<e.length;n++)r[e[n]]="0123456789abcdef"[n];var i,s,o,a,c,u={},l=1,f=u,h=[],p="",d="",m=t.length-1;for(n=1;n!=m;)c=t[n], n+=1, "'"==c?s=s?(a=s.join(""), i):[]:s?s.push(c):"{"==c?(h.push([f,a]), f={}, a=i):"}"==c?((o=h.pop())[0][o[1]]=f, a=i, f=o[0]):"-"==c?l=-1:a===i?r.hasOwnProperty(c)?(p+=r[c], a=parseInt(p,16)*l, l=1, p=""):p+=c:r.hasOwnProperty(c)?(d+=r[c], f[a]=parseInt(d,16)*l, l=1, a=i, d=""):d+=c;return u})("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")}, a={Unicode:{Courier:o,"Courier-Bold":o,"Courier-BoldOblique":o,"Courier-Oblique":o,Helvetica:o,"Helvetica-Bold":o,"Helvetica-BoldOblique":o,"Helvetica-Oblique":o,"Times-Roman":o,"Times-Bold":o,"Times-BoldItalic":o,"Times-Italic":o}}, c={Unicode:{"Courier-Oblique":s("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-BoldItalic":s("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),"Helvetica-Bold":s("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),Courier:s("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-BoldOblique":s("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Bold":s("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"),Symbol:s("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"),Helvetica:s("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),"Helvetica-BoldOblique":s("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),ZapfDingbats:s("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-Bold":s("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Italic":s("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),"Times-Roman":s("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),"Helvetica-Oblique":s("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")}}, i.events.push(["addFont",function(t){var e,r,n,i=t.font,s="Unicode";(e=c[s][i.postScriptName])&&((r=i.metadata[s]?i.metadata[s]:i.metadata[s]={}).widths=e.widths, r.kerning=e.kerning), (n=a[s][i.postScriptName])&&((r=i.metadata[s]?i.metadata[s]:i.metadata[s]={}).encoding=n).codePages&&n.codePages.length&&(i.encoding=n.codePages[0]);}]), u=p, "undefined"!=typeof self&&self||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||"undefined"!=typeof window&&window||Function("return this")(), u.API.events.push(["addFont",function(t){var e=t.font,r=t.instance;if(void 0!==r&&r.existsFileInVFS(e.postScriptName)){var n=r.getFileFromVFS(e.postScriptName);if("string"!=typeof n)throw new Error("Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('"+e.postScriptName+"').");e.metadata=u.API.TTFFont.open(e.postScriptName,e.fontName,n,e.encoding), e.metadata.Unicode=e.metadata.Unicode||{encoding:{},kerning:{},widths:[]}, e.metadata.glyIdsUsed=[0];}else if(!1===e.isStandardFont)throw new Error("Font does not exist in vFS, import fonts or remove declaration doc.addFont('"+e.postScriptName+"').")}]), function(h,t){var e=h.API;var y=e.pdfEscape16=function(t,e){for(var r,n=e.metadata.Unicode.widths,i=["","0","00","000","0000"],s=[""],o=0,a=t.length;o<a;++o){if(r=e.metadata.characterToGlyph(t.charCodeAt(o)), e.metadata.glyIdsUsed.push(r), e.metadata.toUnicode[r]=t.charCodeAt(o), -1==n.indexOf(r)&&(n.push(r), n.push([parseInt(e.metadata.widthOfGlyph(r),10)])), "0"==r)return s.join("");r=r.toString(16), s.push(i[4-r.length],r);}return s.join("")},p=function(t){var e,r,n,i,s,o,a;for(s="/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange", n=[], o=0, a=(r=Object.keys(t).sort(function(t,e){return t-e})).length;o<a;o++)e=r[o], 100<=n.length&&(s+="\n"+n.length+" beginbfchar\n"+n.join("\n")+"\nendbfchar", n=[]), i=("0000"+t[e].toString(16)).slice(-4), e=("0000"+(+e).toString(16)).slice(-4), n.push("<"+e+"><"+i+">");return n.length&&(s+="\n"+n.length+" beginbfchar\n"+n.join("\n")+"\nendbfchar\n"), s+="endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend"};e.events.push(["putFont",function(t){!function(t,e,r,n){if(t.metadata instanceof h.API.TTFFont&&"Identity-H"===t.encoding){for(var i=t.metadata.Unicode.widths,s=t.metadata.subset.encode(t.metadata.glyIdsUsed,1),o="",a=0;a<s.length;a++)o+=String.fromCharCode(s[a]);var c=r();n({data:o,addLength1:!0}), e("endobj");var u=r();n({data:p(t.metadata.toUnicode),addLength1:!0}), e("endobj");var l=r();e("<<"), e("/Type /FontDescriptor"), e("/FontName /"+t.fontName), e("/FontFile2 "+c+" 0 R"), e("/FontBBox "+h.API.PDFObject.convert(t.metadata.bbox)), e("/Flags "+t.metadata.flags), e("/StemV "+t.metadata.stemV), e("/ItalicAngle "+t.metadata.italicAngle), e("/Ascent "+t.metadata.ascender), e("/Descent "+t.metadata.decender), e("/CapHeight "+t.metadata.capHeight), e(">>"), e("endobj");var f=r();e("<<"), e("/Type /Font"), e("/BaseFont /"+t.fontName), e("/FontDescriptor "+l+" 0 R"), e("/W "+h.API.PDFObject.convert(i)), e("/CIDToGIDMap /Identity"), e("/DW 1000"), e("/Subtype /CIDFontType2"), e("/CIDSystemInfo"), e("<<"), e("/Supplement 0"), e("/Registry (Adobe)"), e("/Ordering ("+t.encoding+")"), e(">>"), e(">>"), e("endobj"), t.objectNumber=r(), e("<<"), e("/Type /Font"), e("/Subtype /Type0"), e("/ToUnicode "+u+" 0 R"), e("/BaseFont /"+t.fontName), e("/Encoding /"+t.encoding), e("/DescendantFonts ["+f+" 0 R]"), e(">>"), e("endobj"), t.isAlreadyPutted=!0;}}(t.font,t.out,t.newObject,t.putStream);}]);e.events.push(["putFont",function(t){!function(t,e,r,n){if(t.metadata instanceof h.API.TTFFont&&"WinAnsiEncoding"===t.encoding){t.metadata.Unicode.widths;for(var i=t.metadata.rawData,s="",o=0;o<i.length;o++)s+=String.fromCharCode(i[o]);var a=r();n({data:s,addLength1:!0}), e("endobj");var c=r();n({data:p(t.metadata.toUnicode),addLength1:!0}), e("endobj");var u=r();for(e("<<"), e("/Descent "+t.metadata.decender), e("/CapHeight "+t.metadata.capHeight), e("/StemV "+t.metadata.stemV), e("/Type /FontDescriptor"), e("/FontFile2 "+a+" 0 R"), e("/Flags 96"), e("/FontBBox "+h.API.PDFObject.convert(t.metadata.bbox)), e("/FontName /"+t.fontName), e("/ItalicAngle "+t.metadata.italicAngle), e("/Ascent "+t.metadata.ascender), e(">>"), e("endobj"), t.objectNumber=r(), o=0;o<t.metadata.hmtx.widths.length;o++)t.metadata.hmtx.widths[o]=parseInt(t.metadata.hmtx.widths[o]*(1e3/t.metadata.head.unitsPerEm));e("<</Subtype/TrueType/Type/Font/ToUnicode "+c+" 0 R/BaseFont/"+t.fontName+"/FontDescriptor "+u+" 0 R/Encoding/"+t.encoding+" /FirstChar 29 /LastChar 255 /Widths "+h.API.PDFObject.convert(t.metadata.hmtx.widths)+">>"), e("endobj"), t.isAlreadyPutted=!0;}}(t.font,t.out,t.newObject,t.putStream);}]);var u=function(t){var e,r,n=t.text||"",i=t.x,s=t.y,o=t.options||{},a=t.mutex||{},c=a.pdfEscape,u=a.activeFontKey,l=a.fonts,f=(a.activeFontSize, ""),h=0,p="",d=l[r=u].encoding;if("Identity-H"!==l[r].encoding)return{text:n,x:i,y:s,options:o,mutex:a};for(p=n, r=u, "[object Array]"===Object.prototype.toString.call(n)&&(p=n[0]), h=0;h<p.length;h+=1)l[r].metadata.hasOwnProperty("cmap")&&(e=l[r].metadata.cmap.unicode.codeMap[p[h].charCodeAt(0)]), e?f+=p[h]:p[h].charCodeAt(0)<256&&l[r].metadata.hasOwnProperty("Unicode")?f+=p[h]:f+="";var m="";return parseInt(r.slice(1))<14||"WinAnsiEncoding"===d?m=function(t){for(var e="",r=0;r<t.length;r++)e+=""+t.charCodeAt(r).toString(16);return e}(c(f,r)):"Identity-H"===d&&(m=y(f,l[r])), a.isHex=!0, {text:m,x:i,y:s,options:o,mutex:a}};e.events.push(["postProcessText",function(t){var e=t.text||"",r=t.x,n=t.y,i=t.options,s=t.mutex,o=(i.lang, []),a={text:e,x:r,y:n,options:i,mutex:s};if("[object Array]"===Object.prototype.toString.call(e)){var c=0;for(c=0;c<e.length;c+=1)"[object Array]"===Object.prototype.toString.call(e[c])&&3===e[c].length?o.push([u(Object.assign({},a,{text:e[c][0]})).text,e[c][1],e[c][2]]):o.push(u(Object.assign({},a,{text:e[c]})).text);t.text=o;}else t.text=u(Object.assign({},a,{text:e})).text;}]);}(p,"undefined"!=typeof self&&self||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||"undefined"!=typeof window&&window||Function("return this")()), f=p.API, h=function(t){return void 0!==t&&(void 0===t.vFS&&(t.vFS={}), !0)}, f.existsFileInVFS=function(t){return!!h(this.internal)&&void 0!==this.internal.vFS[t]}, f.addFileToVFS=function(t,e){return h(this.internal), this.internal.vFS[t]=e, this}, f.getFileFromVFS=function(t){return h(this.internal), void 0!==this.internal.vFS[t]?this.internal.vFS[t]:null}, function(h){var n=h.BlobBuilder||h.WebKitBlobBuilder||h.MSBlobBuilder||h.MozBlobBuilder;h.URL=h.URL||h.webkitURL||function(t,e){return(e=document.createElement("a")).href=t, e};var r=h.Blob,p=URL.createObjectURL,d=URL.revokeObjectURL,s=h.Symbol&&h.Symbol.toStringTag,t=!1,e=!1,m=!!h.ArrayBuffer,i=n&&n.prototype.append&&n.prototype.getBlob;try{t=2===new Blob(["ä"]).size, e=2===new Blob([new Uint8Array([1,2])]).size;}catch(t){}function o(t){return t.map(function(t){if(t.buffer instanceof ArrayBuffer){var e=t.buffer;if(t.byteLength!==e.byteLength){var r=new Uint8Array(t.byteLength);r.set(new Uint8Array(e,t.byteOffset,t.byteLength)), e=r.buffer;}return e}return t})}function a(t,e){e=e||{};var r=new n;return o(t).forEach(function(t){r.append(t);}), e.type?r.getBlob(e.type):r.getBlob()}function c(t,e){return new r(o(t),e||{})}if(h.Blob&&(a.prototype=Blob.prototype, c.prototype=Blob.prototype), s)try{File.prototype[s]="File", Blob.prototype[s]="Blob", FileReader.prototype[s]="FileReader";}catch(t){}function u(){var t=!!h.ActiveXObject||"-ms-scroll-limit"in document.documentElement.style&&"-ms-ime-align"in document.documentElement.style,e=h.XMLHttpRequest&&h.XMLHttpRequest.prototype.send;t&&e&&(XMLHttpRequest.prototype.send=function(t){t instanceof Blob&&this.setRequestHeader("Content-Type",t.type), e.call(this,t);});try{new File([],"");}catch(t){try{var r=new Function('class File extends Blob {constructor(chunks, name, opts) {opts = opts || {};super(chunks, opts || {});this.name = name;this.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date;this.lastModified = +this.lastModifiedDate;}};return new File([], ""), File')();h.File=r;}catch(t){r=function(t,e,r){var n=new Blob(t,r),i=r&&void 0!==r.lastModified?new Date(r.lastModified):new Date;return n.name=e, n.lastModifiedDate=i, n.lastModified=+i, n.toString=function(){return"[object File]"}, s&&(n[s]="File"), n};h.File=r;}}}t?(u(), h.Blob=e?h.Blob:c):i?(u(), h.Blob=a):function(){function o(t){for(var e=[],r=0;r<t.length;r++){var n=t.charCodeAt(r);n<128?e.push(n):n<2048?e.push(192|n>>6,128|63&n):n<55296||57344<=n?e.push(224|n>>12,128|n>>6&63,128|63&n):(r++, n=65536+((1023&n)<<10|1023&t.charCodeAt(r)), e.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n));}return e}function e(t){var e,r,n,i,s,o;for(e="", n=t.length, r=0;r<n;)switch((i=t[r++])>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:e+=String.fromCharCode(i);break;case 12:case 13:s=t[r++], e+=String.fromCharCode((31&i)<<6|63&s);break;case 14:s=t[r++], o=t[r++], e+=String.fromCharCode((15&i)<<12|(63&s)<<6|(63&o)<<0);}return e}function a(t){for(var e=new Array(t.byteLength),r=new Uint8Array(t),n=e.length;n--;)e[n]=r[n];return e}function r(t){for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r=[],n=0;n<t.length;n+=3){var i=t[n],s=n+1<t.length,o=s?t[n+1]:0,a=n+2<t.length,c=a?t[n+2]:0,u=i>>2,l=(3&i)<<4|o>>4,f=(15&o)<<2|c>>6,h=63&c;a||(h=64, s||(f=64)), r.push(e[u],e[l],e[f],e[h]);}return r.join("")}var t=Object.create||function(t){function e(){}return e.prototype=t, new e};if(m)var n=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],c=ArrayBuffer.isView||function(t){return t&&-1<n.indexOf(Object.prototype.toString.call(t))};function u(t,e){for(var r=0,n=(t=t||[]).length;r<n;r++){var i=t[r];i instanceof u?t[r]=i._buffer:"string"==typeof i?t[r]=o(i):m&&(ArrayBuffer.prototype.isPrototypeOf(i)||c(i))?t[r]=a(i):m&&(s=i)&&DataView.prototype.isPrototypeOf(s)?t[r]=a(i.buffer):t[r]=o(String(i));}var s;this._buffer=[].concat.apply([],t), this.size=this._buffer.length, this.type=e&&e.type||"";}function i(t,e,r){var n=u.call(this,t,r=r||{})||this;return n.name=e, n.lastModifiedDate=r.lastModified?new Date(r.lastModified):new Date, n.lastModified=+n.lastModifiedDate, n}if(u.prototype.slice=function(t,e,r){return new u([this._buffer.slice(t||0,e||this._buffer.length)],{type:r})}, u.prototype.toString=function(){return"[object Blob]"}, (i.prototype=t(u.prototype)).constructor=i, Object.setPrototypeOf)Object.setPrototypeOf(i,u);else try{i.__proto__=u;}catch(t){}function s(){if(!(this instanceof s))throw new TypeError("Failed to construct 'FileReader': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");var r=document.createDocumentFragment();this.addEventListener=r.addEventListener, this.dispatchEvent=function(t){var e=this["on"+t.type];"function"==typeof e&&e(t), r.dispatchEvent(t);}, this.removeEventListener=r.removeEventListener;}function l(t,e,r){if(!(e instanceof u))throw new TypeError("Failed to execute '"+r+"' on 'FileReader': parameter 1 is not of type 'Blob'.");t.result="", setTimeout(function(){this.readyState=s.LOADING, t.dispatchEvent(new Event("load")), t.dispatchEvent(new Event("loadend"));});}i.prototype.toString=function(){return"[object File]"}, s.EMPTY=0, s.LOADING=1, s.DONE=2, s.prototype.error=null, s.prototype.onabort=null, s.prototype.onerror=null, s.prototype.onload=null, s.prototype.onloadend=null, s.prototype.onloadstart=null, s.prototype.onprogress=null, s.prototype.readAsDataURL=function(t){l(this,t,"readAsDataURL"), this.result="data:"+t.type+";base64,"+r(t._buffer);}, s.prototype.readAsText=function(t){l(this,t,"readAsText"), this.result=e(t._buffer);}, s.prototype.readAsArrayBuffer=function(t){l(this,t,"readAsText"), this.result=t._buffer.slice();}, s.prototype.abort=function(){}, URL.createObjectURL=function(t){return t instanceof u?"data:"+t.type+";base64,"+r(t._buffer):p.call(URL,t)}, URL.revokeObjectURL=function(t){d&&d.call(URL,t);};var f=h.XMLHttpRequest&&h.XMLHttpRequest.prototype.send;f&&(XMLHttpRequest.prototype.send=function(t){t instanceof u?(this.setRequestHeader("Content-Type",t.type), f.call(this,e(t._buffer))):f.call(this,t);}), h.FileReader=s, h.File=i, h.Blob=u;}();}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||Function('return typeof this === "object" && this.content')()||Function("return this")());var d,m,y,g,w,L,x,S,k,_,q,I,M,F,ce=ce||function(a){if(!(void 0===a||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var t=a.document,c=function(){return a.URL||a.webkitURL||a},u=t.createElementNS("http://www.w3.org/1999/xhtml","a"),l="download"in u,f=/constructor/i.test(a.HTMLElement)||a.safari,h=/CriOS\/[\d]+/.test(navigator.userAgent),p=a.setImmediate||a.setTimeout,d=function(t){p(function(){throw t},0);},m=function(t){setTimeout(function(){"string"==typeof t?c().revokeObjectURL(t):t.remove();},4e4);},y=function(t){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob([String.fromCharCode(65279),t],{type:t.type}):t},n=function(t,r,e){e||(t=y(t));var n,i=this,s="application/octet-stream"===t.type,o=function(){!function(t,e,r){for(var n=(e=[].concat(e)).length;n--;){var i=t["on"+e[n]];if("function"==typeof i)try{i.call(t,r||t);}catch(t){d(t);}}}(i,"writestart progress write writeend".split(" "));};if(i.readyState=i.INIT, l)return n=c().createObjectURL(t), void p(function(){var t,e;u.href=n, u.download=r, t=u, e=new MouseEvent("click"), t.dispatchEvent(e), o(), m(n), i.readyState=i.DONE;},0);!function(){if((h||s&&f)&&a.FileReader){var e=new FileReader;return e.onloadend=function(){var t=h?e.result:e.result.replace(/^data:[^;]*;/,"data:attachment/file;");a.open(t,"_blank")||(a.location.href=t), t=void 0, i.readyState=i.DONE, o();}, e.readAsDataURL(t), i.readyState=i.INIT}n||(n=c().createObjectURL(t)), s?a.location.href=n:a.open(n,"_blank")||(a.location.href=n);i.readyState=i.DONE, o(), m(n);}();},e=n.prototype;return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(t,e,r){return e=e||t.name||"download", r||(t=y(t)), navigator.msSaveOrOpenBlob(t,e)}:(e.abort=function(){}, e.readyState=e.INIT=0, e.WRITING=1, e.DONE=2, e.error=e.onwritestart=e.onprogress=e.onwrite=e.onabort=e.onerror=e.onwriteend=null, function(t,e,r){return new n(t,e||t.name||"download",r)})}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||void 0);
/*
   * Copyright (c) 2012 chick307 <chick307@gmail.com>
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */p.API.adler32cs=(L="function"==typeof ArrayBuffer&&"function"==typeof Uint8Array, x=null, S=function(){if(!L)return function(){return!1};try{var t={};"function"==typeof t.Buffer&&(x=t.Buffer);}catch(t){}return function(t){return t instanceof ArrayBuffer||null!==x&&t instanceof x}}(), k=null!==x?function(t){return new x(t,"utf8").toString("binary")}:function(t){return unescape(encodeURIComponent(t))}, _=65521, q=function(t,e){for(var r=65535&t,n=t>>>16,i=0,s=e.length;i<s;i++)r=(r+(255&e.charCodeAt(i)))%_, n=(n+r)%_;return(n<<16|r)>>>0}, I=function(t,e){for(var r=65535&t,n=t>>>16,i=0,s=e.length;i<s;i++)r=(r+e[i])%_, n=(n+r)%_;return(n<<16|r)>>>0}, F=(M={}).Adler32=(((w=(g=function(t){if(!(this instanceof g))throw new TypeError("Constructor cannot called be as a function.");if(!isFinite(t=null==t?1:+t))throw new Error("First arguments needs to be a finite number.");this.checksum=t>>>0;}).prototype={}).constructor=g).from=((d=function(t){if(!(this instanceof g))throw new TypeError("Constructor cannot called be as a function.");if(null==t)throw new Error("First argument needs to be a string.");this.checksum=q(1,t.toString());}).prototype=w, d), g.fromUtf8=((m=function(t){if(!(this instanceof g))throw new TypeError("Constructor cannot called be as a function.");if(null==t)throw new Error("First argument needs to be a string.");var e=k(t.toString());this.checksum=q(1,e);}).prototype=w, m), L&&(g.fromBuffer=((y=function(t){if(!(this instanceof g))throw new TypeError("Constructor cannot called be as a function.");if(!S(t))throw new Error("First argument needs to be ArrayBuffer.");var e=new Uint8Array(t);return this.checksum=I(1,e)}).prototype=w, y)), w.update=function(t){if(null==t)throw new Error("First argument needs to be a string.");return t=t.toString(), this.checksum=q(this.checksum,t)}, w.updateUtf8=function(t){if(null==t)throw new Error("First argument needs to be a string.");var e=k(t.toString());return this.checksum=q(this.checksum,e)}, L&&(w.updateBuffer=function(t){if(!S(t))throw new Error("First argument needs to be ArrayBuffer.");var e=new Uint8Array(t);return this.checksum=I(this.checksum,e)}), w.clone=function(){return new F(this.checksum)}, g), M.from=function(t){if(null==t)throw new Error("First argument needs to be a string.");return q(1,t.toString())}, M.fromUtf8=function(t){if(null==t)throw new Error("First argument needs to be a string.");var e=k(t.toString());return q(1,e)}, L&&(M.fromBuffer=function(t){if(!S(t))throw new Error("First argument need to be ArrayBuffer.");var e=new Uint8Array(t);return I(1,e)}), M), ("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||Function('return typeof this === "object" && this.content')()||Function("return this")()).RGBColor=function(t){var e;t=t||"", this.ok=!1, "#"==t.charAt(0)&&(t=t.substr(1,6)), t=(t=t.replace(/ /g,"")).toLowerCase();var r={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"};for(var n in r)t==n&&(t=r[n]);for(var i=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(t){return[parseInt(t[1]),parseInt(t[2]),parseInt(t[3])]}},{re:/^(\w{2})(\w{2})(\w{2})$/,example:["#00ff00","336699"],process:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/^(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}}],s=0;s<i.length;s++){var o=i[s].re,a=i[s].process,c=o.exec(t);c&&(e=a(c), this.r=e[0], this.g=e[1], this.b=e[2], this.ok=!0);}this.r=this.r<0||isNaN(this.r)?0:255<this.r?255:this.r, this.g=this.g<0||isNaN(this.g)?0:255<this.g?255:this.g, this.b=this.b<0||isNaN(this.b)?0:255<this.b?255:this.b, this.toRGB=function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"}, this.toHex=function(){var t=this.r.toString(16),e=this.g.toString(16),r=this.b.toString(16);return 1==t.length&&(t="0"+t), 1==e.length&&(e="0"+e), 1==r.length&&(r="0"+r), "#"+t+e+r};}, function(t){t.__bidiEngine__=t.prototype.__bidiEngine__=function(t){var d,m,f,h,i,s,o,a=e,y=[[0,3,0,1,0,0,0],[0,3,0,1,2,2,0],[0,3,0,17,2,0,1],[0,3,5,5,4,1,0],[0,3,21,21,4,0,1],[0,3,5,5,4,2,0]],g=[[2,0,1,1,0,1,0],[2,0,1,1,0,2,0],[2,0,2,1,3,2,0],[2,0,2,33,3,1,1]],w={L:0,R:1,EN:2,AN:3,N:4,B:5,S:6},c={0:0,5:1,6:2,7:3,32:4,251:5,254:6,255:7},u=["(",")","(","<",">","<","[","]","[","{","}","{","«","»","«","‹","›","‹","⁅","⁆","⁅","⁽","⁾","⁽","₍","₎","₍","≤","≥","≤","〈","〉","〈","﹙","﹚","﹙","﹛","﹜","﹛","﹝","﹞","﹝","﹤","﹥","﹤"],l=new RegExp(/^([1-4|9]|1[0-9]|2[0-9]|3[0168]|4[04589]|5[012]|7[78]|159|16[0-9]|17[0-2]|21[569]|22[03489]|250)$/),L=!1,N=0;this.__bidiEngine__={};var v=function(t){var e=t.charCodeAt(),r=e>>8,n=c[r];return void 0!==n?a[256*n+(255&e)]:252===r||253===r?"AL":l.test(r)?"L":8===r?"R":"N"},p=function(t){for(var e,r=0;r<t.length;r++){if("L"===(e=v(t.charAt(r))))return!1;if("R"===e)return!0}return!1},b=function(t,e,r,n){var i,s,o,a,c=e[n];switch(c){case"L":case"R":L=!1;break;case"N":case"AN":break;case"EN":L&&(c="AN");break;case"AL":L=!0, c="R";break;case"WS":c="N";break;case"CS":n<1||n+1>=e.length||"EN"!==(i=r[n-1])&&"AN"!==i||"EN"!==(s=e[n+1])&&"AN"!==s?c="N":L&&(s="AN"), c=s===i?s:"N";break;case"ES":c="EN"===(i=0<n?r[n-1]:"B")&&n+1<e.length&&"EN"===e[n+1]?"EN":"N";break;case"ET":if(0<n&&"EN"===r[n-1]){c="EN";break}if(L){c="N";break}for(o=n+1, a=e.length;o<a&&"ET"===e[o];)o++;c=o<a&&"EN"===e[o]?"EN":"N";break;case"NSM":if(f&&!h){for(a=e.length, o=n+1;o<a&&"NSM"===e[o];)o++;if(o<a){var u=t[n],l=1425<=u&&u<=2303||64286===u;if(i=e[o], l&&("R"===i||"AL"===i)){c="R";break}}}c=n<1||"B"===(i=e[n-1])?"N":r[n-1];break;case"B":d=!(L=!1), c=N;break;case"S":m=!0, c="N";break;case"LRE":case"RLE":case"LRO":case"RLO":case"PDF":L=!1;break;case"BN":c="N";}return c},A=function(t,e,r){var n=t.split("");return r&&x(n,r,{hiLevel:N}), n.reverse(), e&&e.reverse(), n.join("")},x=function(t,e,r){var n,i,s,o,a,c=-1,u=t.length,l=0,f=[],h=N?g:y,p=[];for(m=d=L=!1, i=0;i<u;i++)p[i]=v(t[i]);for(s=0;s<u;s++){if(a=l, f[s]=b(t,p,f,s), n=240&(l=h[a][w[f[s]]]), l&=15, e[s]=o=h[l][5], 0<n)if(16===n){for(i=c;i<s;i++)e[i]=1;c=-1;}else c=-1;if(h[l][6])-1===c&&(c=s);else if(-1<c){for(i=c;i<s;i++)e[i]=o;c=-1;}"B"===p[s]&&(e[s]=0), r.hiLevel|=o;}m&&function(t,e,r){for(var n=0;n<r;n++)if("S"===t[n]){e[n]=N;for(var i=n-1;0<=i&&"WS"===t[i];i--)e[i]=N;}}(p,e,u);},S=function(t,e,r,n,i){if(!(i.hiLevel<t)){if(1===t&&1===N&&!d)return e.reverse(), void(r&&r.reverse());for(var s,o,a,c,u=e.length,l=0;l<u;){if(n[l]>=t){for(a=l+1;a<u&&n[a]>=t;)a++;for(c=l, o=a-1;c<o;c++, o--)s=e[c], e[c]=e[o], e[o]=s, r&&(s=r[c], r[c]=r[o], r[o]=s);l=a;}l++;}}},k=function(t,e,r){var n=t.split(""),i={hiLevel:N};return r||(r=[]), x(n,r,i), function(t,e,r){if(0!==r.hiLevel&&o)for(var n,i=0;i<t.length;i++)1===e[i]&&0<=(n=u.indexOf(t[i]))&&(t[i]=u[n+1]);}(n,r,i), S(2,n,e,r,i), S(1,n,e,r,i), n.join("")};return this.__bidiEngine__.doBidiReorder=function(t,e,r){if(function(t,e){if(e)for(var r=0;r<t.length;r++)e[r]=r;void 0===h&&(h=p(t)), void 0===s&&(s=p(t));}(t,e), f||!i||s)if(f&&i&&h^s)N=h?1:0, t=A(t,e,r);else if(!f&&i&&s)N=h?1:0, t=k(t,e,r), t=A(t,e);else if(!f||h||i||s){if(f&&!i&&h^s)t=A(t,e), t=h?(N=0, k(t,e,r)):(N=1, t=k(t,e,r), A(t,e));else if(f&&h&&!i&&s)N=1, t=k(t,e,r), t=A(t,e);else if(!f&&!i&&h^s){var n=o;h?(N=1, t=k(t,e,r), N=0, o=!1, t=k(t,e,r), o=n):(N=0, t=k(t,e,r), t=A(t,e), o=!(N=1), t=k(t,e,r), o=n, t=A(t,e));}}else N=0, t=k(t,e,r);else N=h?1:0, t=k(t,e,r);return t}, this.__bidiEngine__.setOptions=function(t){t&&(f=t.isInputVisual, i=t.isOutputVisual, h=t.isInputRtl, s=t.isOutputRtl, o=t.isSymmetricSwapping);}, this.__bidiEngine__.setOptions(t), this.__bidiEngine__};var e=["BN","BN","BN","BN","BN","BN","BN","BN","BN","S","B","S","WS","B","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","B","B","B","S","WS","N","N","ET","ET","ET","N","N","N","N","N","ES","CS","ES","CS","CS","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","CS","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","BN","BN","BN","BN","BN","BN","B","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","CS","N","ET","ET","ET","ET","N","N","N","N","L","N","N","BN","N","N","ET","ET","EN","EN","N","L","N","N","N","EN","L","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","N","N","N","N","N","ET","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","R","NSM","R","NSM","NSM","R","NSM","NSM","R","NSM","N","N","N","N","N","N","N","N","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","N","N","N","N","N","R","R","R","R","R","N","N","N","N","N","N","N","N","N","N","N","AN","AN","AN","AN","AN","AN","N","N","AL","ET","ET","AL","CS","AL","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AL","AL","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AN","AN","AN","AN","AN","AN","AN","AN","AN","AN","ET","AN","AN","AL","AL","AL","NSM","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AN","N","NSM","NSM","NSM","NSM","NSM","NSM","AL","AL","NSM","NSM","N","NSM","NSM","NSM","NSM","AL","AL","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","AL","AL","NSM","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AL","N","N","N","N","N","N","N","N","N","N","N","N","N","N","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","R","R","N","N","N","N","R","N","N","N","N","N","WS","WS","WS","WS","WS","WS","WS","WS","WS","WS","WS","BN","BN","BN","L","R","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","WS","B","LRE","RLE","PDF","LRO","RLO","CS","ET","ET","ET","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","CS","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","WS","BN","BN","BN","BN","BN","N","LRI","RLI","FSI","PDI","BN","BN","BN","BN","BN","BN","EN","L","N","N","EN","EN","EN","EN","EN","EN","ES","ES","N","N","N","L","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","ES","ES","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","L","L","N","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","N","N","N","N","N","R","NSM","R","R","R","R","R","R","R","R","R","R","ES","R","R","R","R","R","R","R","R","R","R","R","R","R","N","R","R","R","R","R","N","R","N","R","R","N","R","R","N","R","R","R","R","R","R","R","R","R","R","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","CS","N","CS","N","N","CS","N","N","N","N","N","N","N","N","N","ET","N","N","ES","ES","N","N","N","N","N","ET","ET","N","N","N","N","N","AL","AL","AL","AL","AL","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","N","BN","N","N","N","ET","ET","ET","N","N","N","N","N","ES","CS","ES","CS","CS","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","CS","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","L","L","L","L","L","L","N","N","L","L","L","L","L","L","N","N","L","L","L","L","L","L","N","N","L","L","L","N","N","N","ET","ET","N","N","N","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N"],s=new t.__bidiEngine__({isInputVisual:!0});t.API.events.push(["postProcessText",function(t){var e=t.text,r=(t.x, t.y, t.options||{}),n=(t.mutex, r.lang, []);if("[object Array]"===Object.prototype.toString.call(e)){var i=0;for(n=[], i=0;i<e.length;i+=1)"[object Array]"===Object.prototype.toString.call(e[i])?n.push([s.doBidiReorder(e[i][0]),e[i][1],e[i][2]]):n.push([s.doBidiReorder(e[i])]);t.text=n;}else t.text=s.doBidiReorder(e);}]);}(p), function(t){var r="+".charCodeAt(0),n="/".charCodeAt(0),i="0".charCodeAt(0),s="a".charCodeAt(0),o="A".charCodeAt(0),a="-".charCodeAt(0),c="_".charCodeAt(0),l=function(t){var e=t.charCodeAt(0);return e===r||e===a?62:e===n||e===c?63:e<i?-1:e<i+10?e-i+26+26:e<o+26?e-o:e<s+26?e-s+26:void 0};t.API.TTFFont=function(){function i(t,e,r){var n;if(this.rawData=t, n=this.contents=new Y(t), this.contents.pos=4, "ttcf"===n.readString(4)){if(!e)throw new Error("Must specify a font name for TTC files.");throw new Error("Font "+e+" not found in TTC file.")}n.pos=0, this.parse(), this.subset=new q(this), this.registerTTF();}return i.open=function(t,e,r,n){if("string"!=typeof r)throw new Error("Invalid argument supplied in TTFFont.open");return new i(function(t){var e,r,n,i,s,o;if(0<t.length%4)throw new Error("Invalid string. Length must be a multiple of 4");var a=t.length;s="="===t.charAt(a-2)?2:"="===t.charAt(a-1)?1:0, o=new Uint8Array(3*t.length/4-s), n=0<s?t.length-4:t.length;var c=0;function u(t){o[c++]=t;}for(r=e=0;e<n;e+=4, r+=3)u((16711680&(i=l(t.charAt(e))<<18|l(t.charAt(e+1))<<12|l(t.charAt(e+2))<<6|l(t.charAt(e+3))))>>16), u((65280&i)>>8), u(255&i);return 2===s?u(255&(i=l(t.charAt(e))<<2|l(t.charAt(e+1))>>4)):1===s&&(u((i=l(t.charAt(e))<<10|l(t.charAt(e+1))<<4|l(t.charAt(e+2))>>2)>>8&255), u(255&i)), o}(r),e,n)}, i.prototype.parse=function(){return this.directory=new e(this.contents), this.head=new p(this), this.name=new N(this), this.cmap=new g(this), this.toUnicode=new Map, this.hhea=new m(this), this.maxp=new v(this), this.hmtx=new b(this), this.post=new w(this), this.os2=new y(this), this.loca=new _(this), this.glyf=new x(this), this.ascender=this.os2.exists&&this.os2.ascender||this.hhea.ascender, this.decender=this.os2.exists&&this.os2.decender||this.hhea.decender, this.lineGap=this.os2.exists&&this.os2.lineGap||this.hhea.lineGap, this.bbox=[this.head.xMin,this.head.yMin,this.head.xMax,this.head.yMax]}, i.prototype.registerTTF=function(){var i,t,e,r,n;if(this.scaleFactor=1e3/this.head.unitsPerEm, this.bbox=function(){var t,e,r,n;for(n=[], t=0, e=(r=this.bbox).length;t<e;t++)i=r[t], n.push(Math.round(i*this.scaleFactor));return n}.call(this), this.stemV=0, this.post.exists?(e=255&(r=this.post.italic_angle), !0&(t=r>>16)&&(t=-(1+(65535^t))), this.italicAngle=+(t+"."+e)):this.italicAngle=0, this.ascender=Math.round(this.ascender*this.scaleFactor), this.decender=Math.round(this.decender*this.scaleFactor), this.lineGap=Math.round(this.lineGap*this.scaleFactor), this.capHeight=this.os2.exists&&this.os2.capHeight||this.ascender, this.xHeight=this.os2.exists&&this.os2.xHeight||0, this.familyClass=(this.os2.exists&&this.os2.familyClass||0)>>8, this.isSerif=1===(n=this.familyClass)||2===n||3===n||4===n||5===n||7===n, this.isScript=10===this.familyClass, this.flags=0, this.post.isFixedPitch&&(this.flags|=1), this.isSerif&&(this.flags|=2), this.isScript&&(this.flags|=8), 0!==this.italicAngle&&(this.flags|=64), this.flags|=32, !this.cmap.unicode)throw new Error("No unicode cmap for font")}, i.prototype.characterToGlyph=function(t){var e;return(null!=(e=this.cmap.unicode)?e.codeMap[t]:void 0)||0}, i.prototype.widthOfGlyph=function(t){var e;return e=1e3/this.head.unitsPerEm, this.hmtx.forGlyph(t).advance*e}, i.prototype.widthOfString=function(t,e,r){var n,i,s,o,a;for(i=o=s=0, a=(t=""+t).length;0<=a?o<a:a<o;i=0<=a?++o:--o)n=t.charCodeAt(i), s+=this.widthOfGlyph(this.characterToGlyph(n))+r*(1e3/e)||0;return s*(e/1e3)}, i.prototype.lineHeight=function(t,e){var r;return null==e&&(e=!1), r=e?this.lineGap:0, (this.ascender+r-this.decender)/1e3*t}, i}();var u,Y=function(){function t(t){this.data=null!=t?t:[], this.pos=0, this.length=this.data.length;}return t.prototype.readByte=function(){return this.data[this.pos++]}, t.prototype.writeByte=function(t){return this.data[this.pos++]=t}, t.prototype.readUInt32=function(){return 16777216*this.readByte()+(this.readByte()<<16)+(this.readByte()<<8)+this.readByte()}, t.prototype.writeUInt32=function(t){return this.writeByte(t>>>24&255), this.writeByte(t>>16&255), this.writeByte(t>>8&255), this.writeByte(255&t)}, t.prototype.readInt32=function(){var t;return 2147483648<=(t=this.readUInt32())?t-4294967296:t}, t.prototype.writeInt32=function(t){return t<0&&(t+=4294967296), this.writeUInt32(t)}, t.prototype.readUInt16=function(){return this.readByte()<<8|this.readByte()}, t.prototype.writeUInt16=function(t){return this.writeByte(t>>8&255), this.writeByte(255&t)}, t.prototype.readInt16=function(){var t;return 32768<=(t=this.readUInt16())?t-65536:t}, t.prototype.writeInt16=function(t){return t<0&&(t+=65536), this.writeUInt16(t)}, t.prototype.readString=function(t){var e,r,n;for(r=[], e=n=0;0<=t?n<t:t<n;e=0<=t?++n:--n)r[e]=String.fromCharCode(this.readByte());return r.join("")}, t.prototype.writeString=function(t){var e,r,n,i;for(i=[], e=r=0, n=t.length;0<=n?r<n:n<r;e=0<=n?++r:--r)i.push(this.writeByte(t.charCodeAt(e)));return i}, t.prototype.readShort=function(){return this.readInt16()}, t.prototype.writeShort=function(t){return this.writeInt16(t)}, t.prototype.readLongLong=function(){var t,e,r,n,i,s,o,a;return t=this.readByte(), e=this.readByte(), r=this.readByte(), n=this.readByte(), i=this.readByte(), s=this.readByte(), o=this.readByte(), a=this.readByte(), 128&t?-1*(72057594037927940*(255^t)+281474976710656*(255^e)+1099511627776*(255^r)+4294967296*(255^n)+16777216*(255^i)+65536*(255^s)+256*(255^o)+(255^a)+1):72057594037927940*t+281474976710656*e+1099511627776*r+4294967296*n+16777216*i+65536*s+256*o+a}, t.prototype.writeLongLong=function(t){var e,r;return e=Math.floor(t/4294967296), r=4294967295&t, this.writeByte(e>>24&255), this.writeByte(e>>16&255), this.writeByte(e>>8&255), this.writeByte(255&e), this.writeByte(r>>24&255), this.writeByte(r>>16&255), this.writeByte(r>>8&255), this.writeByte(255&r)}, t.prototype.readInt=function(){return this.readInt32()}, t.prototype.writeInt=function(t){return this.writeInt32(t)}, t.prototype.read=function(t){var e,r;for(e=[], r=0;0<=t?r<t:t<r;0<=t?++r:--r)e.push(this.readByte());return e}, t.prototype.write=function(t){var e,r,n,i;for(i=[], r=0, n=t.length;r<n;r++)e=t[r], i.push(this.writeByte(e));return i}, t}(),e=function(){var d;function t(t){var e,r,n;for(this.scalarType=t.readInt(), this.tableCount=t.readShort(), this.searchRange=t.readShort(), this.entrySelector=t.readShort(), this.rangeShift=t.readShort(), this.tables={}, r=0, n=this.tableCount;0<=n?r<n:n<r;0<=n?++r:--r)e={tag:t.readString(4),checksum:t.readInt(),offset:t.readInt(),length:t.readInt()}, this.tables[e.tag]=e;}return t.prototype.encode=function(t){var e,r,n,i,s,o,a,c,u,l,f,h,p;for(p in f=Object.keys(t).length, o=Math.log(2), u=16*Math.floor(Math.log(f)/o), i=Math.floor(u/o), c=16*f-u, (r=new Y).writeInt(this.scalarType), r.writeShort(f), r.writeShort(u), r.writeShort(i), r.writeShort(c), n=16*f, a=r.pos+n, s=null, h=[], t)for(l=t[p], r.writeString(p), r.writeInt(d(l)), r.writeInt(a), r.writeInt(l.length), h=h.concat(l), "head"===p&&(s=a), a+=l.length;a%4;)h.push(0), a++;return r.write(h), e=2981146554-d(r.data), r.pos=s+8, r.writeUInt32(e), r.data}, d=function(t){var e,r,n,i;for(t=A.call(t);t.length%4;)t.push(0);for(r=new Y(t), n=e=0, i=t.length;n<i;n+=4)e+=r.readUInt32();return 4294967295&e}, t}(),f={}.hasOwnProperty,h=function(t,e){for(var r in e)f.call(e,r)&&(t[r]=e[r]);function n(){this.constructor=t;}return n.prototype=e.prototype, t.prototype=new n, t.__super__=e.prototype, t};u=function(){function t(t){var e;this.file=t, e=this.file.directory.tables[this.tag], this.exists=!!e, e&&(this.offset=e.offset, this.length=e.length, this.parse(this.file.contents));}return t.prototype.parse=function(){}, t.prototype.encode=function(){}, t.prototype.raw=function(){return this.exists?(this.file.contents.pos=this.offset, this.file.contents.read(this.length)):null}, t}();var p=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return h(e,u), e.prototype.tag="head", e.prototype.parse=function(t){return t.pos=this.offset, this.version=t.readInt(), this.revision=t.readInt(), this.checkSumAdjustment=t.readInt(), this.magicNumber=t.readInt(), this.flags=t.readShort(), this.unitsPerEm=t.readShort(), this.created=t.readLongLong(), this.modified=t.readLongLong(), this.xMin=t.readShort(), this.yMin=t.readShort(), this.xMax=t.readShort(), this.yMax=t.readShort(), this.macStyle=t.readShort(), this.lowestRecPPEM=t.readShort(), this.fontDirectionHint=t.readShort(), this.indexToLocFormat=t.readShort(), this.glyphDataFormat=t.readShort()}, e.prototype.encode=function(t){var e;return(e=new Y).writeInt(this.version), e.writeInt(this.revision), e.writeInt(this.checkSumAdjustment), e.writeInt(this.magicNumber), e.writeShort(this.flags), e.writeShort(this.unitsPerEm), e.writeLongLong(this.created), e.writeLongLong(this.modified), e.writeShort(this.xMin), e.writeShort(this.yMin), e.writeShort(this.xMax), e.writeShort(this.yMax), e.writeShort(this.macStyle), e.writeShort(this.lowestRecPPEM), e.writeShort(this.fontDirectionHint), e.writeShort(t), e.writeShort(this.glyphDataFormat), e.data}, e}(),d=function(){function t(r,t){var e,n,i,s,o,a,c,u,l,f,h,p,d,m,y,g,w,L;switch(this.platformID=r.readUInt16(), this.encodingID=r.readShort(), this.offset=t+r.readInt(), l=r.pos, r.pos=this.offset, this.format=r.readUInt16(), this.length=r.readUInt16(), this.language=r.readUInt16(), this.isUnicode=3===this.platformID&&1===this.encodingID&&4===this.format||0===this.platformID&&4===this.format, this.codeMap={}, this.format){case 0:for(a=y=0;y<256;a=++y)this.codeMap[a]=r.readByte();break;case 4:for(h=r.readUInt16(), f=h/2, r.pos+=6, i=function(){var t,e;for(e=[], a=t=0;0<=f?t<f:f<t;a=0<=f?++t:--t)e.push(r.readUInt16());return e}(), r.pos+=2, d=function(){var t,e;for(e=[], a=t=0;0<=f?t<f:f<t;a=0<=f?++t:--t)e.push(r.readUInt16());return e}(), c=function(){var t,e;for(e=[], a=t=0;0<=f?t<f:f<t;a=0<=f?++t:--t)e.push(r.readUInt16());return e}(), u=function(){var t,e;for(e=[], a=t=0;0<=f?t<f:f<t;a=0<=f?++t:--t)e.push(r.readUInt16());return e}(), n=(this.length-r.pos+this.offset)/2, o=function(){var t,e;for(e=[], a=t=0;0<=n?t<n:n<t;a=0<=n?++t:--t)e.push(r.readUInt16());return e}(), a=g=0, L=i.length;g<L;a=++g)for(m=i[a], e=w=p=d[a];p<=m?w<=m:m<=w;e=p<=m?++w:--w)0===u[a]?s=e+c[a]:0!==(s=o[u[a]/2+(e-p)-(f-a)]||0)&&(s+=c[a]), this.codeMap[e]=65535&s;}r.pos=l;}return t.encode=function(t,e){var r,n,i,s,o,a,c,u,l,f,h,p,d,m,y,g,w,L,N,v,b,A,x,S,k,_,q,I,M,F,P,C,E,B,R,j,T,O,D,z,U,W,H,G,X,J;switch(I=new Y, s=Object.keys(t).sort(function(t,e){return t-e}), e){case"macroman":for(d=0, m=function(){var t,e;for(e=[], p=t=0;t<256;p=++t)e.push(0);return e}(), g={0:0}, i={}, M=0, E=s.length;M<E;M++)null==g[H=t[n=s[M]]]&&(g[H]=++d), i[n]={old:t[n],new:g[t[n]]}, m[n]=g[t[n]];return I.writeUInt16(1), I.writeUInt16(0), I.writeUInt32(12), I.writeUInt16(0), I.writeUInt16(262), I.writeUInt16(0), I.write(m), {charMap:i,subtable:I.data,maxGlyphID:d+1};case"unicode":for(_=[], l=[], g={}, r={}, y=c=null, F=w=0, B=s.length;F<B;F++)null==g[N=t[n=s[F]]]&&(g[N]=++w), r[n]={old:N,new:g[N]}, o=g[N]-n, null!=y&&o===c||(y&&l.push(y), _.push(n), c=o), y=n;for(y&&l.push(y), l.push(65535), _.push(65535), S=2*(x=_.length), A=2*Math.pow(Math.log(x)/Math.LN2,2), f=Math.log(A/2)/Math.LN2, b=2*x-A, a=[], v=[], h=[], p=P=0, R=_.length;P<R;p=++P){if(k=_[p], u=l[p], 65535===k){a.push(0), v.push(0);break}if(32768<=k-(q=r[k].new))for(a.push(0), v.push(2*(h.length+x-p)), n=C=k;k<=u?C<=u:u<=C;n=k<=u?++C:--C)h.push(r[n].new);else a.push(q-k), v.push(0);}for(I.writeUInt16(3), I.writeUInt16(1), I.writeUInt32(12), I.writeUInt16(4), I.writeUInt16(16+8*x+2*h.length), I.writeUInt16(0), I.writeUInt16(S), I.writeUInt16(A), I.writeUInt16(f), I.writeUInt16(b), U=0, j=l.length;U<j;U++)n=l[U], I.writeUInt16(n);for(I.writeUInt16(0), W=0, T=_.length;W<T;W++)n=_[W], I.writeUInt16(n);for(G=0, O=a.length;G<O;G++)o=a[G], I.writeUInt16(o);for(X=0, D=v.length;X<D;X++)L=v[X], I.writeUInt16(L);for(J=0, z=h.length;J<z;J++)d=h[J], I.writeUInt16(d);return{charMap:r,subtable:I.data,maxGlyphID:w+1}}}, t}(),g=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return h(e,u), e.prototype.tag="cmap", e.prototype.parse=function(t){var e,r,n;for(t.pos=this.offset, this.version=t.readUInt16(), r=t.readUInt16(), this.tables=[], this.unicode=null, n=0;0<=r?n<r:r<n;0<=r?++n:--n)e=new d(t,this.offset), this.tables.push(e), e.isUnicode&&null==this.unicode&&(this.unicode=e);return!0}, e.encode=function(t,e){var r,n;return null==e&&(e="macroman"), r=d.encode(t,e), (n=new Y).writeUInt16(0), n.writeUInt16(1), r.table=n.data.concat(r.subtable), r}, e}(),m=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return h(e,u), e.prototype.tag="hhea", e.prototype.parse=function(t){return t.pos=this.offset, this.version=t.readInt(), this.ascender=t.readShort(), this.decender=t.readShort(), this.lineGap=t.readShort(), this.advanceWidthMax=t.readShort(), this.minLeftSideBearing=t.readShort(), this.minRightSideBearing=t.readShort(), this.xMaxExtent=t.readShort(), this.caretSlopeRise=t.readShort(), this.caretSlopeRun=t.readShort(), this.caretOffset=t.readShort(), t.pos+=8, this.metricDataFormat=t.readShort(), this.numberOfMetrics=t.readUInt16()}, e}(),y=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return h(e,u), e.prototype.tag="OS/2", e.prototype.parse=function(r){if(r.pos=this.offset, this.version=r.readUInt16(), this.averageCharWidth=r.readShort(), this.weightClass=r.readUInt16(), this.widthClass=r.readUInt16(), this.type=r.readShort(), this.ySubscriptXSize=r.readShort(), this.ySubscriptYSize=r.readShort(), this.ySubscriptXOffset=r.readShort(), this.ySubscriptYOffset=r.readShort(), this.ySuperscriptXSize=r.readShort(), this.ySuperscriptYSize=r.readShort(), this.ySuperscriptXOffset=r.readShort(), this.ySuperscriptYOffset=r.readShort(), this.yStrikeoutSize=r.readShort(), this.yStrikeoutPosition=r.readShort(), this.familyClass=r.readShort(), this.panose=function(){var t,e;for(e=[], t=0;t<10;++t)e.push(r.readByte());return e}(), this.charRange=function(){var t,e;for(e=[], t=0;t<4;++t)e.push(r.readInt());return e}(), this.vendorID=r.readString(4), this.selection=r.readShort(), this.firstCharIndex=r.readShort(), this.lastCharIndex=r.readShort(), 0<this.version&&(this.ascent=r.readShort(), this.descent=r.readShort(), this.lineGap=r.readShort(), this.winAscent=r.readShort(), this.winDescent=r.readShort(), this.codePageRange=function(){var t,e;for(e=[], t=0;t<2;++t)e.push(r.readInt());return e}(), 1<this.version))return this.xHeight=r.readShort(), this.capHeight=r.readShort(), this.defaultChar=r.readShort(), this.breakChar=r.readShort(), this.maxContext=r.readShort()}, e}(),w=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return h(e,u), e.prototype.tag="post", e.prototype.parse=function(n){var t,e,r,i;switch(n.pos=this.offset, this.format=n.readInt(), this.italicAngle=n.readInt(), this.underlinePosition=n.readShort(), this.underlineThickness=n.readShort(), this.isFixedPitch=n.readInt(), this.minMemType42=n.readInt(), this.maxMemType42=n.readInt(), this.minMemType1=n.readInt(), this.maxMemType1=n.readInt(), this.format){case 65536:break;case 131072:for(e=n.readUInt16(), this.glyphNameIndex=[], r=0;0<=e?r<e:e<r;0<=e?++r:--r)this.glyphNameIndex.push(n.readUInt16());for(this.names=[], i=[];n.pos<this.offset+this.length;)t=n.readByte(), i.push(this.names.push(n.readString(t)));return i;case 151552:return e=n.readUInt16(), this.offsets=n.read(e);case 196608:break;case 262144:return this.map=function(){var t,e,r;for(r=[], t=0, e=this.file.maxp.numGlyphs;0<=e?t<e:e<t;0<=e?++t:--t)r.push(n.readUInt32());return r}.call(this)}}, e}(),L=function(t,e){this.raw=t, this.length=t.length, this.platformID=e.platformID, this.encodingID=e.encodingID, this.languageID=e.languageID;},N=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return h(e,u), e.prototype.tag="name", e.prototype.parse=function(t){var e,r,n,i,s,o,a,c,u,l,f,h;for(t.pos=this.offset, t.readShort(), e=t.readShort(), o=t.readShort(), r=[], i=u=0;0<=e?u<e:e<u;i=0<=e?++u:--u)r.push({platformID:t.readShort(),encodingID:t.readShort(),languageID:t.readShort(),nameID:t.readShort(),length:t.readShort(),offset:this.offset+o+t.readShort()});for(a={}, i=l=0, f=r.length;l<f;i=++l)n=r[i], t.pos=n.offset, c=t.readString(n.length), s=new L(c,n), null==a[h=n.nameID]&&(a[h]=[]), a[n.nameID].push(s);this.strings=a, this.copyright=a[0], this.fontFamily=a[1], this.fontSubfamily=a[2], this.uniqueSubfamily=a[3], this.fontName=a[4], this.version=a[5];try{this.postscriptName=a[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g,"");}catch(t){this.postscriptName=a[4][0].raw.replace(/[\x00-\x19\x80-\xff]/g,"");}return this.trademark=a[7], this.manufacturer=a[8], this.designer=a[9], this.description=a[10], this.vendorUrl=a[11], this.designerUrl=a[12], this.license=a[13], this.licenseUrl=a[14], this.preferredFamily=a[15], this.preferredSubfamily=a[17], this.compatibleFull=a[18], this.sampleText=a[19]}, e}(),v=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return h(e,u), e.prototype.tag="maxp", e.prototype.parse=function(t){return t.pos=this.offset, this.version=t.readInt(), this.numGlyphs=t.readUInt16(), this.maxPoints=t.readUInt16(), this.maxContours=t.readUInt16(), this.maxCompositePoints=t.readUInt16(), this.maxComponentContours=t.readUInt16(), this.maxZones=t.readUInt16(), this.maxTwilightPoints=t.readUInt16(), this.maxStorage=t.readUInt16(), this.maxFunctionDefs=t.readUInt16(), this.maxInstructionDefs=t.readUInt16(), this.maxStackElements=t.readUInt16(), this.maxSizeOfInstructions=t.readUInt16(), this.maxComponentElements=t.readUInt16(), this.maxComponentDepth=t.readUInt16()}, e}(),b=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return h(e,u), e.prototype.tag="hmtx", e.prototype.parse=function(r){var t,n,i,e,s,o,a;for(r.pos=this.offset, this.metrics=[], e=0, o=this.file.hhea.numberOfMetrics;0<=o?e<o:o<e;0<=o?++e:--e)this.metrics.push({advance:r.readUInt16(),lsb:r.readInt16()});for(n=this.file.maxp.numGlyphs-this.file.hhea.numberOfMetrics, this.leftSideBearings=function(){var t,e;for(e=[], t=0;0<=n?t<n:n<t;0<=n?++t:--t)e.push(r.readInt16());return e}(), this.widths=function(){var t,e,r,n;for(n=[], t=0, e=(r=this.metrics).length;t<e;t++)i=r[t], n.push(i.advance);return n}.call(this), t=this.widths[this.widths.length-1], a=[], s=0;0<=n?s<n:n<s;0<=n?++s:--s)a.push(this.widths.push(t));return a}, e.prototype.forGlyph=function(t){return t in this.metrics?this.metrics[t]:{advance:this.metrics[this.metrics.length-1].advance,lsb:this.leftSideBearings[t-this.metrics.length]}}, e}(),A=[].slice,x=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return h(e,u), e.prototype.tag="glyf", e.prototype.parse=function(t){return this.cache={}}, e.prototype.glyphFor=function(t){var e,r,n,i,s,o,a,c,u,l;return(t=t)in this.cache?this.cache[t]:(i=this.file.loca, e=this.file.contents, r=i.indexOf(t), 0===(n=i.lengthOf(t))?this.cache[t]=null:(e.pos=this.offset+r, s=(o=new Y(e.read(n))).readShort(), c=o.readShort(), l=o.readShort(), a=o.readShort(), u=o.readShort(), this.cache[t]=-1===s?new k(o,c,l,a,u):new S(o,s,c,l,a,u), this.cache[t]))}, e.prototype.encode=function(t,e,r){var n,i,s,o,a;for(s=[], i=[], o=0, a=e.length;o<a;o++)n=t[e[o]], i.push(s.length), n&&(s=s.concat(n.encode(r)));return i.push(s.length), {table:s,offsets:i}}, e}(),S=function(){function t(t,e,r,n,i,s){this.raw=t, this.numberOfContours=e, this.xMin=r, this.yMin=n, this.xMax=i, this.yMax=s, this.compound=!1;}return t.prototype.encode=function(){return this.raw.data}, t}(),k=function(){function t(t,e,r,n,i){var s,o;for(this.raw=t, this.xMin=e, this.yMin=r, this.xMax=n, this.yMax=i, this.compound=!0, this.glyphIDs=[], this.glyphOffsets=[], s=this.raw;o=s.readShort(), this.glyphOffsets.push(s.pos), this.glyphIDs.push(s.readShort()), 32&o;)s.pos+=1&o?4:2, 128&o?s.pos+=8:64&o?s.pos+=4:8&o&&(s.pos+=2);}return t.prototype.encode=function(t){var e,r,n,i,s;for(r=new Y(A.call(this.raw.data)), e=n=0, i=(s=this.glyphIDs).length;n<i;e=++n)s[e], r.pos=this.glyphOffsets[e];return r.data}, t}(),_=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return h(e,u), e.prototype.tag="loca", e.prototype.parse=function(n){var t;return n.pos=this.offset, t=this.file.head.indexToLocFormat, this.offsets=0===t?function(){var t,e,r;for(r=[], t=0, e=this.length;t<e;t+=2)r.push(2*n.readUInt16());return r}.call(this):function(){var t,e,r;for(r=[], t=0, e=this.length;t<e;t+=4)r.push(n.readUInt32());return r}.call(this)}, e.prototype.indexOf=function(t){return this.offsets[t]}, e.prototype.lengthOf=function(t){return this.offsets[t+1]-this.offsets[t]}, e.prototype.encode=function(t,e){for(var r=new Uint32Array(this.offsets.length),n=0,i=0,s=0;s<r.length;++s)if(r[s]=n, i<e.length&&e[i]==s){++i, r[s]=n;var o=this.offsets[s],a=this.offsets[s+1]-o;0<a&&(n+=a);}for(var c=new Array(4*r.length),u=0;u<r.length;++u)c[4*u+3]=255&r[u], c[4*u+2]=(65280&r[u])>>8, c[4*u+1]=(16711680&r[u])>>16, c[4*u]=(4278190080&r[u])>>24;return c}, e}(),q=function(){function t(t){this.font=t, this.subset={}, this.unicodes={}, this.next=33;}return t.prototype.generateCmap=function(){var t,e,r,n,i;for(e in n=this.font.cmap.tables[0].codeMap, t={}, i=this.subset)r=i[e], t[e]=n[r];return t}, t.prototype.glyphsFor=function(t){var e,r,n,i,s,o,a;for(n={}, s=0, o=t.length;s<o;s++)n[i=t[s]]=this.font.glyf.glyphFor(i);for(i in e=[], n)(null!=(r=n[i])?r.compound:void 0)&&e.push.apply(e,r.glyphIDs);if(0<e.length)for(i in a=this.glyphsFor(e))r=a[i], n[i]=r;return n}, t.prototype.encode=function(t,e){var r,n,i,s,o,a,c,u,l,f,h,p,d,m,y;for(n in r=g.encode(this.generateCmap(),"unicode"), s=this.glyphsFor(t), h={0:0}, y=r.charMap)h[(a=y[n]).old]=a.new;for(p in f=r.maxGlyphID, s)p in h||(h[p]=f++);return u=function(t){var e,r;for(e in r={}, t)r[t[e]]=e;return r}(h), l=Object.keys(u).sort(function(t,e){return t-e}), d=function(){var t,e,r;for(r=[], t=0, e=l.length;t<e;t++)o=l[t], r.push(u[o]);return r}(), i=this.font.glyf.encode(s,d,h), c=this.font.loca.encode(i.offsets,d), m={cmap:this.font.cmap.raw(),glyf:i.table,loca:c,hmtx:this.font.hmtx.raw(),hhea:this.font.hhea.raw(),maxp:this.font.maxp.raw(),post:this.font.post.raw(),name:this.font.name.raw(),head:this.font.head.encode(e)}, this.font.os2.exists&&(m["OS/2"]=this.font.os2.raw()), this.font.directory.encode(m)}, t}();t.API.PDFObject=function(){var s;function o(){}return s=function(t,e){return(Array(e+1).join("0")+t).slice(-e)}, o.convert=function(n){var i,t,e,r;if(Array.isArray(n))return"["+function(){var t,e,r;for(r=[], t=0, e=n.length;t<e;t++)i=n[t], r.push(o.convert(i));return r}().join(" ")+"]";if("string"==typeof n)return"/"+n;if(null!=n?n.isString:void 0)return"("+n+")";if(n instanceof Date)return"(D:"+s(n.getUTCFullYear(),4)+s(n.getUTCMonth(),2)+s(n.getUTCDate(),2)+s(n.getUTCHours(),2)+s(n.getUTCMinutes(),2)+s(n.getUTCSeconds(),2)+"Z)";if("[object Object]"!=={}.toString.call(n))return""+n;for(t in e=["<<"], n)r=n[t], e.push("/"+t+" "+o.convert(r));return e.push(">>"), e.join("\n")}, o}();}(p);});try{module.exports=jsPDF;}catch(t){}
});

var jspdf_min_1 = jspdf_min.jsPDF;

var html2canvas_min = createCommonjsModule(function (module, exports) {
/*!
 * html2canvas 1.0.0-rc.1 <https://html2canvas.hertzen.com>
 * Copyright (c) 2019 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
!function(A,e){module.exports=e();}(window,function(){return function(A){var e={};function t(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return A[r].call(n.exports,n,n.exports,t), n.l=!0, n.exports}return t.m=A, t.c=e, t.d=function(A,e,r){t.o(A,e)||Object.defineProperty(A,e,{enumerable:!0,get:r});}, t.r=function(A){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(A,Symbol.toStringTag,{value:"Module"}), Object.defineProperty(A,"__esModule",{value:!0});}, t.t=function(A,e){if(1&e&&(A=t(A)), 8&e)return A;if(4&e&&"object"==typeof A&&A&&A.__esModule)return A;var r=Object.create(null);if(t.r(r), Object.defineProperty(r,"default",{enumerable:!0,value:A}), 2&e&&"string"!=typeof A)for(var n in A)t.d(r,n,function(e){return A[e]}.bind(null,n));return r}, t.n=function(A){var e=A&&A.__esModule?function(){return A.default}:function(){return A};return t.d(e,"a",e), e}, t.o=function(A,e){return Object.prototype.hasOwnProperty.call(A,e)}, t.p="", t(t.s=5)}([function(A,e,t){Object.defineProperty(e,"__esModule",{value:!0});var r=t(1);Object.defineProperty(e,"toCodePoints",{enumerable:!0,get:function(){return r.toCodePoints}}), Object.defineProperty(e,"fromCodePoint",{enumerable:!0,get:function(){return r.fromCodePoint}});var n=t(2);Object.defineProperty(e,"LineBreaker",{enumerable:!0,get:function(){return n.LineBreaker}});},function(A,e,t){Object.defineProperty(e,"__esModule",{value:!0}), e.toCodePoints=function(A){for(var e=[],t=0,r=A.length;t<r;){var n=A.charCodeAt(t++);if(n>=55296&&n<=56319&&t<r){var B=A.charCodeAt(t++);56320==(64512&B)?e.push(((1023&n)<<10)+(1023&B)+65536):(e.push(n), t--);}else e.push(n);}return e}, e.fromCodePoint=function(){if(String.fromCodePoint)return String.fromCodePoint.apply(String,arguments);var A=arguments.length;if(!A)return"";for(var e=[],t=-1,r="";++t<A;){var n=arguments.length<=t?void 0:arguments[t];n<=65535?e.push(n):(n-=65536, e.push(55296+(n>>10),n%1024+56320)), (t+1===A||e.length>16384)&&(r+=String.fromCharCode.apply(String,e), e.length=0);}return r};for(var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n="undefined"==typeof Uint8Array?[]:new Uint8Array(256),B=0;B<r.length;B++)n[r.charCodeAt(B)]=B;e.decode=function(A){var e=.75*A.length,t=A.length,r=void 0,B=0,s=void 0,o=void 0,a=void 0,i=void 0;"="===A[A.length-1]&&(e--, "="===A[A.length-2]&&e--);var c="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array&&void 0!==Uint8Array.prototype.slice?new ArrayBuffer(e):new Array(e),Q=Array.isArray(c)?c:new Uint8Array(c);for(r=0;r<t;r+=4)s=n[A.charCodeAt(r)], o=n[A.charCodeAt(r+1)], a=n[A.charCodeAt(r+2)], i=n[A.charCodeAt(r+3)], Q[B++]=s<<2|o>>4, Q[B++]=(15&o)<<4|a>>2, Q[B++]=(3&a)<<6|63&i;return c}, e.polyUint16Array=function(A){for(var e=A.length,t=[],r=0;r<e;r+=2)t.push(A[r+1]<<8|A[r]);return t}, e.polyUint32Array=function(A){for(var e=A.length,t=[],r=0;r<e;r+=4)t.push(A[r+3]<<24|A[r+2]<<16|A[r+1]<<8|A[r]);return t};},function(A,e,t){Object.defineProperty(e,"__esModule",{value:!0}), e.LineBreaker=e.inlineBreakOpportunities=e.lineBreakAtIndex=e.codePointsToCharacterClasses=e.UnicodeTrie=e.BREAK_ALLOWED=e.BREAK_NOT_ALLOWED=e.BREAK_MANDATORY=e.classes=e.LETTER_NUMBER_MODIFIER=void 0;var r=function(){function A(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}return function(e,t,r){return t&&A(e.prototype,t), r&&A(e,r), e}}(),n=function(A,e){if(Array.isArray(A))return A;if(Symbol.iterator in Object(A))return function(A,e){var t=[],r=!0,n=!1,B=void 0;try{for(var s,o=A[Symbol.iterator]();!(r=(s=o.next()).done)&&(t.push(s.value), !e||t.length!==e);r=!0);}catch(A){n=!0, B=A;}finally{try{!r&&o.return&&o.return();}finally{if(n)throw B}}return t}(A,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")},B=t(3),s=function(A){return A&&A.__esModule?A:{default:A}}(t(4)),o=t(1),a=e.LETTER_NUMBER_MODIFIER=50,i=10,c=13,Q=15,l=17,w=18,u=19,U=20,g=21,F=22,C=24,h=25,d=26,H=27,f=28,E=30,p=32,K=33,m=34,b=35,N=37,y=38,v=39,I=40,D=42,M=(e.classes={BK:1,CR:2,LF:3,CM:4,NL:5,SG:6,WJ:7,ZW:8,GL:9,SP:i,ZWJ:11,B2:12,BA:c,BB:14,HY:Q,CB:16,CL:l,CP:w,EX:u,IN:U,NS:g,OP:F,QU:23,IS:C,NU:h,PO:d,PR:H,SY:f,AI:29,AL:E,CJ:31,EB:p,EM:K,H2:m,H3:b,HL:36,ID:N,JL:y,JV:v,JT:I,RI:41,SA:D,XX:43}, e.BREAK_MANDATORY="!"),T=e.BREAK_NOT_ALLOWED="×",S=e.BREAK_ALLOWED="÷",X=e.UnicodeTrie=(0, B.createTrieFromBase64)(s.default),z=[E,36],L=[1,2,3,5],O=[i,8],x=[H,d],V=L.concat(O),k=[y,v,I,m,b],J=[Q,c],R=e.codePointsToCharacterClasses=function(A){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"strict",t=[],r=[],n=[];return A.forEach(function(A,B){var s=X.get(A);if(s>a?(n.push(!0), s-=a):n.push(!1), -1!==["normal","auto","loose"].indexOf(e)&&-1!==[8208,8211,12316,12448].indexOf(A))return r.push(B), t.push(16);if(4===s||11===s){if(0===B)return r.push(B), t.push(E);var o=t[B-1];return-1===V.indexOf(o)?(r.push(r[B-1]), t.push(o)):(r.push(B), t.push(E))}return r.push(B), 31===s?t.push("strict"===e?g:N):s===D?t.push(E):29===s?t.push(E):43===s?A>=131072&&A<=196605||A>=196608&&A<=262141?t.push(N):t.push(E):void t.push(s)}), [r,t,n]},_=function(A,e,t,r){var n=r[t];if(Array.isArray(A)?-1!==A.indexOf(n):A===n)for(var B=t;B<=r.length;){var s=r[++B];if(s===e)return!0;if(s!==i)break}if(n===i)for(var o=t;o>0;){var a=r[--o];if(Array.isArray(A)?-1!==A.indexOf(a):A===a)for(var c=t;c<=r.length;){var Q=r[++c];if(Q===e)return!0;if(Q!==i)break}if(a!==i)break}return!1},P=function(A,e){for(var t=A;t>=0;){var r=e[t];if(r!==i)return r;t--;}return 0},G=function(A,e,t,r,n){if(0===t[r])return T;var B=r-1;if(Array.isArray(n)&&!0===n[B])return T;var s=B-1,o=B+1,a=e[B],E=s>=0?e[s]:0,D=e[o];if(2===a&&3===D)return T;if(-1!==L.indexOf(a))return M;if(-1!==L.indexOf(D))return T;if(-1!==O.indexOf(D))return T;if(8===P(B,e))return S;if(11===X.get(A[B])&&(D===N||D===p||D===K))return T;if(7===a||7===D)return T;if(9===a)return T;if(-1===[i,c,Q].indexOf(a)&&9===D)return T;if(-1!==[l,w,u,C,f].indexOf(D))return T;if(P(B,e)===F)return T;if(_(23,F,B,e))return T;if(_([l,w],g,B,e))return T;if(_(12,12,B,e))return T;if(a===i)return S;if(23===a||23===D)return T;if(16===D||16===a)return S;if(-1!==[c,Q,g].indexOf(D)||14===a)return T;if(36===E&&-1!==J.indexOf(a))return T;if(a===f&&36===D)return T;if(D===U&&-1!==z.concat(U,u,h,N,p,K).indexOf(a))return T;if(-1!==z.indexOf(D)&&a===h||-1!==z.indexOf(a)&&D===h)return T;if(a===H&&-1!==[N,p,K].indexOf(D)||-1!==[N,p,K].indexOf(a)&&D===d)return T;if(-1!==z.indexOf(a)&&-1!==x.indexOf(D)||-1!==x.indexOf(a)&&-1!==z.indexOf(D))return T;if(-1!==[H,d].indexOf(a)&&(D===h||-1!==[F,Q].indexOf(D)&&e[o+1]===h)||-1!==[F,Q].indexOf(a)&&D===h||a===h&&-1!==[h,f,C].indexOf(D))return T;if(-1!==[h,f,C,l,w].indexOf(D))for(var V=B;V>=0;){var R=e[V];if(R===h)return T;if(-1===[f,C].indexOf(R))break;V--;}if(-1!==[H,d].indexOf(D))for(var G=-1!==[l,w].indexOf(a)?s:B;G>=0;){var W=e[G];if(W===h)return T;if(-1===[f,C].indexOf(W))break;G--;}if(y===a&&-1!==[y,v,m,b].indexOf(D)||-1!==[v,m].indexOf(a)&&-1!==[v,I].indexOf(D)||-1!==[I,b].indexOf(a)&&D===I)return T;if(-1!==k.indexOf(a)&&-1!==[U,d].indexOf(D)||-1!==k.indexOf(D)&&a===H)return T;if(-1!==z.indexOf(a)&&-1!==z.indexOf(D))return T;if(a===C&&-1!==z.indexOf(D))return T;if(-1!==z.concat(h).indexOf(a)&&D===F||-1!==z.concat(h).indexOf(D)&&a===w)return T;if(41===a&&41===D){for(var Y=t[B],q=1;Y>0&&41===e[--Y];)q++;if(q%2!=0)return T}return a===p&&D===K?T:S},W=(e.lineBreakAtIndex=function(A,e){if(0===e)return T;if(e>=A.length)return M;var t=R(A),r=n(t,2),B=r[0],s=r[1];return G(A,s,B,e)}, function(A,e){e||(e={lineBreak:"normal",wordBreak:"normal"});var t=R(A,e.lineBreak),r=n(t,3),B=r[0],s=r[1],o=r[2];return"break-all"!==e.wordBreak&&"break-word"!==e.wordBreak||(s=s.map(function(A){return-1!==[h,E,D].indexOf(A)?N:A})), [B,s,"keep-all"===e.wordBreak?o.map(function(e,t){return e&&A[t]>=19968&&A[t]<=40959}):null]}),Y=(e.inlineBreakOpportunities=function(A,e){var t=(0, o.toCodePoints)(A),r=T,B=W(t,e),s=n(B,3),a=s[0],i=s[1],c=s[2];return t.forEach(function(A,e){r+=(0, o.fromCodePoint)(A)+(e>=t.length-1?M:G(t,i,a,e+1,c));}), r}, function(){function A(e,t,r,n){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this._codePoints=e, this.required=t===M, this.start=r, this.end=n;}return r(A,[{key:"slice",value:function(){return o.fromCodePoint.apply(void 0,function(A){if(Array.isArray(A)){for(var e=0,t=Array(A.length);e<A.length;e++)t[e]=A[e];return t}return Array.from(A)}(this._codePoints.slice(this.start,this.end)))}}]), A}());e.LineBreaker=function(A,e){var t=(0, o.toCodePoints)(A),r=W(t,e),B=n(r,3),s=B[0],a=B[1],i=B[2],c=t.length,Q=0,l=0;return{next:function(){if(l>=c)return{done:!0};for(var A=T;l<c&&(A=G(t,a,s,++l,i))===T;);if(A!==T||l===c){var e=new Y(t,A,Q,l);return Q=l, {value:e,done:!1}}return{done:!0}}}};},function(A,e,t){Object.defineProperty(e,"__esModule",{value:!0}), e.Trie=e.createTrieFromBase64=e.UTRIE2_INDEX_2_MASK=e.UTRIE2_INDEX_2_BLOCK_LENGTH=e.UTRIE2_OMITTED_BMP_INDEX_1_LENGTH=e.UTRIE2_INDEX_1_OFFSET=e.UTRIE2_UTF8_2B_INDEX_2_LENGTH=e.UTRIE2_UTF8_2B_INDEX_2_OFFSET=e.UTRIE2_INDEX_2_BMP_LENGTH=e.UTRIE2_LSCP_INDEX_2_LENGTH=e.UTRIE2_DATA_MASK=e.UTRIE2_DATA_BLOCK_LENGTH=e.UTRIE2_LSCP_INDEX_2_OFFSET=e.UTRIE2_SHIFT_1_2=e.UTRIE2_INDEX_SHIFT=e.UTRIE2_SHIFT_1=e.UTRIE2_SHIFT_2=void 0;var r=function(){function A(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}return function(e,t,r){return t&&A(e.prototype,t), r&&A(e,r), e}}(),n=t(1),B=e.UTRIE2_SHIFT_2=5,s=e.UTRIE2_SHIFT_1=11,o=e.UTRIE2_INDEX_SHIFT=2,a=e.UTRIE2_SHIFT_1_2=s-B,i=e.UTRIE2_LSCP_INDEX_2_OFFSET=65536>>B,c=e.UTRIE2_DATA_BLOCK_LENGTH=1<<B,Q=e.UTRIE2_DATA_MASK=c-1,l=e.UTRIE2_LSCP_INDEX_2_LENGTH=1024>>B,w=e.UTRIE2_INDEX_2_BMP_LENGTH=i+l,u=e.UTRIE2_UTF8_2B_INDEX_2_OFFSET=w,U=e.UTRIE2_UTF8_2B_INDEX_2_LENGTH=32,g=e.UTRIE2_INDEX_1_OFFSET=u+U,F=e.UTRIE2_OMITTED_BMP_INDEX_1_LENGTH=65536>>s,C=e.UTRIE2_INDEX_2_BLOCK_LENGTH=1<<a,h=e.UTRIE2_INDEX_2_MASK=C-1,d=(e.createTrieFromBase64=function(A){var e=(0, n.decode)(A),t=Array.isArray(e)?(0, n.polyUint32Array)(e):new Uint32Array(e),r=Array.isArray(e)?(0, n.polyUint16Array)(e):new Uint16Array(e),B=r.slice(12,t[4]/2),s=2===t[5]?r.slice((24+t[4])/2):t.slice(Math.ceil((24+t[4])/4));return new d(t[0],t[1],t[2],t[3],B,s)}, e.Trie=function(){function A(e,t,r,n,B,s){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.initialValue=e, this.errorValue=t, this.highStart=r, this.highValueIndex=n, this.index=B, this.data=s;}return r(A,[{key:"get",value:function(A){var e=void 0;if(A>=0){if(A<55296||A>56319&&A<=65535)return e=((e=this.index[A>>B])<<o)+(A&Q), this.data[e];if(A<=65535)return e=((e=this.index[i+(A-55296>>B)])<<o)+(A&Q), this.data[e];if(A<this.highStart)return e=g-F+(A>>s), e=this.index[e], e+=A>>B&h, e=((e=this.index[e])<<o)+(A&Q), this.data[e];if(A<=1114111)return this.data[this.highValueIndex]}return this.errorValue}}]), A}());},function(A,e,t){A.exports="KwAAAAAAAAAACA4AIDoAAPAfAAACAAAAAAAIABAAGABAAEgAUABYAF4AZgBeAGYAYABoAHAAeABeAGYAfACEAIAAiACQAJgAoACoAK0AtQC9AMUAXgBmAF4AZgBeAGYAzQDVAF4AZgDRANkA3gDmAOwA9AD8AAQBDAEUARoBIgGAAIgAJwEvATcBPwFFAU0BTAFUAVwBZAFsAXMBewGDATAAiwGTAZsBogGkAawBtAG8AcIBygHSAdoB4AHoAfAB+AH+AQYCDgIWAv4BHgImAi4CNgI+AkUCTQJTAlsCYwJrAnECeQKBAk0CiQKRApkCoQKoArACuALAAsQCzAIwANQC3ALkAjAA7AL0AvwCAQMJAxADGAMwACADJgMuAzYDPgOAAEYDSgNSA1IDUgNaA1oDYANiA2IDgACAAGoDgAByA3YDfgOAAIQDgACKA5IDmgOAAIAAogOqA4AAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAK8DtwOAAIAAvwPHA88D1wPfAyAD5wPsA/QD/AOAAIAABAQMBBIEgAAWBB4EJgQuBDMEIAM7BEEEXgBJBCADUQRZBGEEaQQwADAAcQQ+AXkEgQSJBJEEgACYBIAAoASoBK8EtwQwAL8ExQSAAIAAgACAAIAAgACgAM0EXgBeAF4AXgBeAF4AXgBeANUEXgDZBOEEXgDpBPEE+QQBBQkFEQUZBSEFKQUxBTUFPQVFBUwFVAVcBV4AYwVeAGsFcwV7BYMFiwWSBV4AmgWgBacFXgBeAF4AXgBeAKsFXgCyBbEFugW7BcIFwgXIBcIFwgXQBdQF3AXkBesF8wX7BQMGCwYTBhsGIwYrBjMGOwZeAD8GRwZNBl4AVAZbBl4AXgBeAF4AXgBeAF4AXgBeAF4AXgBeAGMGXgBqBnEGXgBeAF4AXgBeAF4AXgBeAF4AXgB5BoAG4wSGBo4GkwaAAIADHgR5AF4AXgBeAJsGgABGA4AAowarBrMGswagALsGwwbLBjAA0wbaBtoG3QbaBtoG2gbaBtoG2gblBusG8wb7BgMHCwcTBxsHCwcjBysHMAc1BzUHOgdCB9oGSgdSB1oHYAfaBloHaAfaBlIH2gbaBtoG2gbaBtoG2gbaBjUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHbQdeAF4ANQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQd1B30HNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B4MH2gaKB68EgACAAIAAgACAAIAAgACAAI8HlwdeAJ8HpweAAIAArwe3B14AXgC/B8UHygcwANAH2AfgB4AA6AfwBz4B+AcACFwBCAgPCBcIogEYAR8IJwiAAC8INwg/CCADRwhPCFcIXwhnCEoDGgSAAIAAgABvCHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIhAiLCI4IMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAANQc1BzUHNQc1BzUHNQc1BzUHNQc1B54INQc1B6II2gaqCLIIugiAAIAAvgjGCIAAgACAAIAAgACAAIAAgACAAIAAywiHAYAA0wiAANkI3QjlCO0I9Aj8CIAAgACAAAIJCgkSCRoJIgknCTYHLwk3CZYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiAAIAAAAFAAXgBeAGAAcABeAHwAQACQAKAArQC9AJ4AXgBeAE0A3gBRAN4A7AD8AMwBGgEAAKcBNwEFAUwBXAF4QkhCmEKnArcCgAHHAsABz4LAAcABwAHAAd+C6ABoAG+C/4LAAcABwAHAAc+DF4MAAcAB54M3gweDV4Nng3eDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEeDqABVg6WDqABoQ6gAaABoAHXDvcONw/3DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DncPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB7cPPwlGCU4JMACAAIAAgABWCV4JYQmAAGkJcAl4CXwJgAkwADAAMAAwAIgJgACLCZMJgACZCZ8JowmrCYAAswkwAF4AXgB8AIAAuwkABMMJyQmAAM4JgADVCTAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAqwYWBNkIMAAwADAAMADdCeAJ6AnuCR4E9gkwAP4JBQoNCjAAMACAABUK0wiAAB0KJAosCjQKgAAwADwKQwqAAEsKvQmdCVMKWwowADAAgACAALcEMACAAGMKgABrCjAAMAAwADAAMAAwADAAMAAwADAAMAAeBDAAMAAwADAAMAAwADAAMAAwADAAMAAwAIkEPQFzCnoKiQSCCooKkAqJBJgKoAqkCokEGAGsCrQKvArBCjAAMADJCtEKFQHZCuEK/gHpCvEKMAAwADAAMACAAIwE+QowAIAAPwEBCzAAMAAwADAAMACAAAkLEQswAIAAPwEZCyELgAAOCCkLMAAxCzkLMAAwADAAMAAwADAAXgBeAEELMAAwADAAMAAwADAAMAAwAEkLTQtVC4AAXAtkC4AAiQkwADAAMAAwADAAMAAwADAAbAtxC3kLgAuFC4sLMAAwAJMLlwufCzAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAApwswADAAMACAAIAAgACvC4AAgACAAIAAgACAALcLMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAvwuAAMcLgACAAIAAgACAAIAAyguAAIAAgACAAIAA0QswADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAANkLgACAAIAA4AswADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACJCR4E6AswADAAhwHwC4AA+AsADAgMEAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMACAAIAAGAwdDCUMMAAwAC0MNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQw1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHPQwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADUHNQc1BzUHNQc1BzUHNQc2BzAAMAA5DDUHNQc1BzUHNQc1BzUHNQc1BzUHNQdFDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAATQxSDFoMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAF4AXgBeAF4AXgBeAF4AYgxeAGoMXgBxDHkMfwxeAIUMXgBeAI0MMAAwADAAMAAwAF4AXgCVDJ0MMAAwADAAMABeAF4ApQxeAKsMswy7DF4Awgy9DMoMXgBeAF4AXgBeAF4AXgBeAF4AXgDRDNkMeQBqCeAM3Ax8AOYM7Az0DPgMXgBeAF4AXgBeAF4AXgBeAF4AXgBeAF4AXgBeAF4AXgCgAAANoAAHDQ4NFg0wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAeDSYNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAC4NMABeAF4ANg0wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAD4NRg1ODVYNXg1mDTAAbQ0wADAAMAAwADAAMAAwADAA2gbaBtoG2gbaBtoG2gbaBnUNeg3CBYANwgWFDdoGjA3aBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gaUDZwNpA2oDdoG2gawDbcNvw3HDdoG2gbPDdYN3A3fDeYN2gbsDfMN2gbaBvoN/g3aBgYODg7aBl4AXgBeABYOXgBeACUG2gYeDl4AJA5eACwO2w3aBtoGMQ45DtoG2gbaBtoGQQ7aBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gZJDjUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B1EO2gY1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQdZDjUHNQc1BzUHNQc1B2EONQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHaA41BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B3AO2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gY1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B2EO2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gZJDtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBkkOeA6gAKAAoAAwADAAMAAwAKAAoACgAKAAoACgAKAAgA4wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAD//wQABAAEAAQABAAEAAQABAAEAA0AAwABAAEAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAKABMAFwAeABsAGgAeABcAFgASAB4AGwAYAA8AGAAcAEsASwBLAEsASwBLAEsASwBLAEsAGAAYAB4AHgAeABMAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAFgAbABIAHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYADQARAB4ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkAFgAaABsAGwAbAB4AHQAdAB4ATwAXAB4ADQAeAB4AGgAbAE8ATwAOAFAAHQAdAB0ATwBPABcATwBPAE8AFgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwArAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAAQABAANAA0ASwBLAEsASwBLAEsASwBLAEsASwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUAArACsABABQAAQABAAEAAQABAAEAAQAKwArAAQABAArACsABAAEAAQAUAArACsAKwArACsAKwArACsABAArACsAKwArAFAAUAArAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAGgAaAFAAUABQAFAAUABMAB4AGwBQAB4AKwArACsABAAEAAQAKwBQAFAAUABQAFAAUAArACsAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUAArAFAAUAArACsABAArAAQABAAEAAQABAArACsAKwArAAQABAArACsABAAEAAQAKwArACsABAArACsAKwArACsAKwArAFAAUABQAFAAKwBQACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwAEAAQAUABQAFAABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUAArACsABABQAAQABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQAKwArAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwAeABsAKwArACsAKwArACsAKwBQAAQABAAEAAQABAAEACsABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwArAAQABAArACsABAAEAAQAKwArACsAKwArACsAKwArAAQABAArACsAKwArAFAAUAArAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwAeAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwAEAFAAKwBQAFAAUABQAFAAUAArACsAKwBQAFAAUAArAFAAUABQAFAAKwArACsAUABQACsAUAArAFAAUAArACsAKwBQAFAAKwArACsAUABQAFAAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQAKwArACsABAAEAAQAKwAEAAQABAAEACsAKwBQACsAKwArACsAKwArAAQAKwArACsAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAB4AHgAeAB4AHgAeABsAHgArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABAArACsAKwArACsAKwArAAQABAArAFAAUABQACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAB4AUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABAArACsAKwArACsAKwArAAQABAArACsAKwArACsAKwArAFAAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwArAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAKwBcAFwAKwBcACsAKwBcACsAKwArACsAKwArAFwAXABcAFwAKwBcAFwAXABcAFwAXABcACsAXABcAFwAKwBcACsAXAArACsAXABcACsAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgArACoAKgBcACsAKwBcAFwAXABcAFwAKwBcACsAKgAqACoAKgAqACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAFwAXABcAFwAUAAOAA4ADgAOAB4ADgAOAAkADgAOAA0ACQATABMAEwATABMACQAeABMAHgAeAB4ABAAEAB4AHgAeAB4AHgAeAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUAANAAQAHgAEAB4ABAAWABEAFgARAAQABABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAAQABAAEAAQABAANAAQABABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsADQANAB4AHgAeAB4AHgAeAAQAHgAeAB4AHgAeAB4AKwAeAB4ADgAOAA0ADgAeAB4AHgAeAB4ACQAJACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgAeAB4AHgBcAFwAXABcAFwAXAAqACoAKgAqAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAKgAqACoAKgAqACoAKgBcAFwAXAAqACoAKgAqAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAXAAqAEsASwBLAEsASwBLAEsASwBLAEsAKgAqACoAKgAqACoAUABQAFAAUABQAFAAKwBQACsAKwArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQACsAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwAEAAQABAAeAA0AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAEQArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAADQANAA0AUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAA0ADQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoADQANABUAXAANAB4ADQAbAFwAKgArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAB4AHgATABMADQANAA4AHgATABMAHgAEAAQABAAJACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAUABQAFAAUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwAeACsAKwArABMAEwBLAEsASwBLAEsASwBLAEsASwBLAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwBcAFwAXABcAFwAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcACsAKwArACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwAeAB4AXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgArACsABABLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKgAqACoAKgAqACoAKgBcACoAKgAqACoAKgAqACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAUABQAFAAUABQAFAAUAArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4ADQANAA0ADQAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAHgAeAB4AHgBQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwANAA0ADQANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwBQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsABAAEAAQAHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAABABQAFAAUABQAAQABAAEAFAAUAAEAAQABAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAKwBQACsAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAKwArAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAKwAeAB4AHgAeAB4AHgAeAA4AHgArAA0ADQANAA0ADQANAA0ACQANAA0ADQAIAAQACwAEAAQADQAJAA0ADQAMAB0AHQAeABcAFwAWABcAFwAXABYAFwAdAB0AHgAeABQAFAAUAA0AAQABAAQABAAEAAQABAAJABoAGgAaABoAGgAaABoAGgAeABcAFwAdABUAFQAeAB4AHgAeAB4AHgAYABYAEQAVABUAFQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgANAB4ADQANAA0ADQAeAA0ADQANAAcAHgAeAB4AHgArAAQABAAEAAQABAAEAAQABAAEAAQAUABQACsAKwBPAFAAUABQAFAAUAAeAB4AHgAWABEATwBQAE8ATwBPAE8AUABQAFAAUABQAB4AHgAeABYAEQArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAGwAbABsAGwAbABsAGwAaABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAaABsAGwAbABsAGgAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgBQABoAHgAdAB4AUAAeABoAHgAeAB4AHgAeAB4AHgAeAB4ATwAeAFAAGwAeAB4AUABQAFAAUABQAB4AHgAeAB0AHQAeAFAAHgBQAB4AUAAeAFAATwBQAFAAHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AUABQAFAAUABPAE8AUABQAFAAUABQAE8AUABQAE8AUABPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAE8ATwBPAE8ATwBPAE8ATwBPAE8AUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAATwAeAB4AKwArACsAKwAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB0AHQAeAB4AHgAdAB0AHgAeAB0AHgAeAB4AHQAeAB0AGwAbAB4AHQAeAB4AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB0AHgAdAB4AHQAdAB0AHQAdAB0AHgAdAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAdAB0AHQAdAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAlACUAHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBQAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB0AHQAeAB4AHgAeAB0AHQAdAB4AHgAdAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB0AHQAeAB4AHQAeAB4AHgAeAB0AHQAeAB4AHgAeACUAJQAdAB0AJQAeACUAJQAlACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAHgAeAB4AHgAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHQAdAB0AHgAdACUAHQAdAB4AHQAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHQAdAB0AHQAlAB4AJQAlACUAHQAlACUAHQAdAB0AJQAlAB0AHQAlAB0AHQAlACUAJQAeAB0AHgAeAB4AHgAdAB0AJQAdAB0AHQAdAB0AHQAlACUAJQAlACUAHQAlACUAIAAlAB0AHQAlACUAJQAlACUAJQAlACUAHgAeAB4AJQAlACAAIAAgACAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeABcAFwAXABcAFwAXAB4AEwATACUAHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwArACUAJQBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAKwArACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAE8ATwBPAE8ATwBPAE8ATwAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeACsAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUAArACsAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQBQAFAAUABQACsAKwArACsAUABQAFAAUABQAFAAUABQAA0AUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQACsAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgBQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAABAAEAAQAKwAEAAQAKwArACsAKwArAAQABAAEAAQAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsABAAEAAQAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsADQANAA0ADQANAA0ADQANAB4AKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AUABQAFAAUABQAFAAUABQAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAUABQAFAAUABQAA0ADQANAA0ADQANABQAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwANAA0ADQANAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAeAAQABAAEAB4AKwArAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLACsADQArAB4AKwArAAQABAAEAAQAUABQAB4AUAArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwAEAAQABAAEAAQABAAEAAQABAAOAA0ADQATABMAHgAeAB4ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0AUABQAFAAUAAEAAQAKwArAAQADQANAB4AUAArACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXABcAA0ADQANACoASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUAArACsAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANACsADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEcARwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQACsAKwAeAAQABAANAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAEAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUAArACsAUAArACsAUABQACsAKwBQAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AKwArAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAeAB4ADQANAA0ADQAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAArAAQABAArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAEAAQABAAEAAQABAAEACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAFgAWAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAKwBQACsAKwArACsAKwArAFAAKwArACsAKwBQACsAUAArAFAAKwBQAFAAUAArAFAAUAArAFAAKwArAFAAKwBQACsAUAArAFAAKwBQACsAUABQACsAUAArACsAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAUABQAFAAUAArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUAArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAlACUAJQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeACUAJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeACUAJQAlACUAJQAeACUAJQAlACUAJQAgACAAIAAlACUAIAAlACUAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIQAhACEAIQAhACUAJQAgACAAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACAAIAAlACUAJQAlACAAJQAgACAAIAAgACAAIAAgACAAIAAlACUAJQAgACUAJQAlACUAIAAgACAAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeACUAHgAlAB4AJQAlACUAJQAlACAAJQAlACUAJQAeACUAHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAIAAgACAAJQAlACUAIAAgACAAIAAgAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFwAXABcAFQAVABUAHgAeAB4AHgAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACAAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAlACAAIAAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsA";},function(A,e,t){t.r(e);var r={VECTOR:0,BEZIER_CURVE:1,CIRCLE:2};function n(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var B=/^#([a-f0-9]{3})$/i,s=function(A){var e=A.match(B);return!!e&&[parseInt(e[1][0]+e[1][0],16),parseInt(e[1][1]+e[1][1],16),parseInt(e[1][2]+e[1][2],16),null]},o=/^#([a-f0-9]{6})$/i,a=function(A){var e=A.match(o);return!!e&&[parseInt(e[1].substring(0,2),16),parseInt(e[1].substring(2,4),16),parseInt(e[1].substring(4,6),16),null]},i=/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,c=function(A){var e=A.match(i);return!!e&&[Number(e[1]),Number(e[2]),Number(e[3]),null]},Q=/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/,l=function(A){var e=A.match(Q);return!!(e&&e.length>4)&&[Number(e[1]),Number(e[2]),Number(e[3]),Number(e[4])]},w=function(A){return[Math.min(A[0],255),Math.min(A[1],255),Math.min(A[2],255),A.length>3?A[3]:null]},u=function(A){return g[A.toLowerCase()]||!1},U=function(){function A(e){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A);var t=function(A,e){return function(A){if(Array.isArray(A))return A}(A)||function(A,e){var t=[],r=!0,n=!1,B=void 0;try{for(var s,o=A[Symbol.iterator]();!(r=(s=o.next()).done)&&(t.push(s.value), !e||t.length!==e);r=!0);}catch(A){n=!0, B=A;}finally{try{r||null==o.return||o.return();}finally{if(n)throw B}}return t}(A,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(Array.isArray(e)?w(e):s(e)||c(e)||l(e)||u(e)||a(e)||[0,0,0,null],4),r=t[0],n=t[1],B=t[2],o=t[3];this.r=r, this.g=n, this.b=B, this.a=o;}return function(A,e,t){e&&n(A.prototype,e);}(A,[{key:"isTransparent",value:function(){return 0===this.a}},{key:"toString",value:function(){return null!==this.a&&1!==this.a?"rgba(".concat(this.r,",").concat(this.g,",").concat(this.b,",").concat(this.a,")"):"rgb(".concat(this.r,",").concat(this.g,",").concat(this.b,")")}}]), A}(),g={transparent:[0,0,0,0],aliceblue:[240,248,255,null],antiquewhite:[250,235,215,null],aqua:[0,255,255,null],aquamarine:[127,255,212,null],azure:[240,255,255,null],beige:[245,245,220,null],bisque:[255,228,196,null],black:[0,0,0,null],blanchedalmond:[255,235,205,null],blue:[0,0,255,null],blueviolet:[138,43,226,null],brown:[165,42,42,null],burlywood:[222,184,135,null],cadetblue:[95,158,160,null],chartreuse:[127,255,0,null],chocolate:[210,105,30,null],coral:[255,127,80,null],cornflowerblue:[100,149,237,null],cornsilk:[255,248,220,null],crimson:[220,20,60,null],cyan:[0,255,255,null],darkblue:[0,0,139,null],darkcyan:[0,139,139,null],darkgoldenrod:[184,134,11,null],darkgray:[169,169,169,null],darkgreen:[0,100,0,null],darkgrey:[169,169,169,null],darkkhaki:[189,183,107,null],darkmagenta:[139,0,139,null],darkolivegreen:[85,107,47,null],darkorange:[255,140,0,null],darkorchid:[153,50,204,null],darkred:[139,0,0,null],darksalmon:[233,150,122,null],darkseagreen:[143,188,143,null],darkslateblue:[72,61,139,null],darkslategray:[47,79,79,null],darkslategrey:[47,79,79,null],darkturquoise:[0,206,209,null],darkviolet:[148,0,211,null],deeppink:[255,20,147,null],deepskyblue:[0,191,255,null],dimgray:[105,105,105,null],dimgrey:[105,105,105,null],dodgerblue:[30,144,255,null],firebrick:[178,34,34,null],floralwhite:[255,250,240,null],forestgreen:[34,139,34,null],fuchsia:[255,0,255,null],gainsboro:[220,220,220,null],ghostwhite:[248,248,255,null],gold:[255,215,0,null],goldenrod:[218,165,32,null],gray:[128,128,128,null],green:[0,128,0,null],greenyellow:[173,255,47,null],grey:[128,128,128,null],honeydew:[240,255,240,null],hotpink:[255,105,180,null],indianred:[205,92,92,null],indigo:[75,0,130,null],ivory:[255,255,240,null],khaki:[240,230,140,null],lavender:[230,230,250,null],lavenderblush:[255,240,245,null],lawngreen:[124,252,0,null],lemonchiffon:[255,250,205,null],lightblue:[173,216,230,null],lightcoral:[240,128,128,null],lightcyan:[224,255,255,null],lightgoldenrodyellow:[250,250,210,null],lightgray:[211,211,211,null],lightgreen:[144,238,144,null],lightgrey:[211,211,211,null],lightpink:[255,182,193,null],lightsalmon:[255,160,122,null],lightseagreen:[32,178,170,null],lightskyblue:[135,206,250,null],lightslategray:[119,136,153,null],lightslategrey:[119,136,153,null],lightsteelblue:[176,196,222,null],lightyellow:[255,255,224,null],lime:[0,255,0,null],limegreen:[50,205,50,null],linen:[250,240,230,null],magenta:[255,0,255,null],maroon:[128,0,0,null],mediumaquamarine:[102,205,170,null],mediumblue:[0,0,205,null],mediumorchid:[186,85,211,null],mediumpurple:[147,112,219,null],mediumseagreen:[60,179,113,null],mediumslateblue:[123,104,238,null],mediumspringgreen:[0,250,154,null],mediumturquoise:[72,209,204,null],mediumvioletred:[199,21,133,null],midnightblue:[25,25,112,null],mintcream:[245,255,250,null],mistyrose:[255,228,225,null],moccasin:[255,228,181,null],navajowhite:[255,222,173,null],navy:[0,0,128,null],oldlace:[253,245,230,null],olive:[128,128,0,null],olivedrab:[107,142,35,null],orange:[255,165,0,null],orangered:[255,69,0,null],orchid:[218,112,214,null],palegoldenrod:[238,232,170,null],palegreen:[152,251,152,null],paleturquoise:[175,238,238,null],palevioletred:[219,112,147,null],papayawhip:[255,239,213,null],peachpuff:[255,218,185,null],peru:[205,133,63,null],pink:[255,192,203,null],plum:[221,160,221,null],powderblue:[176,224,230,null],purple:[128,0,128,null],rebeccapurple:[102,51,153,null],red:[255,0,0,null],rosybrown:[188,143,143,null],royalblue:[65,105,225,null],saddlebrown:[139,69,19,null],salmon:[250,128,114,null],sandybrown:[244,164,96,null],seagreen:[46,139,87,null],seashell:[255,245,238,null],sienna:[160,82,45,null],silver:[192,192,192,null],skyblue:[135,206,235,null],slateblue:[106,90,205,null],slategray:[112,128,144,null],slategrey:[112,128,144,null],snow:[255,250,250,null],springgreen:[0,255,127,null],steelblue:[70,130,180,null],tan:[210,180,140,null],teal:[0,128,128,null],thistle:[216,191,216,null],tomato:[255,99,71,null],turquoise:[64,224,208,null],violet:[238,130,238,null],wheat:[245,222,179,null],white:[255,255,255,null],whitesmoke:[245,245,245,null],yellow:[255,255,0,null],yellowgreen:[154,205,50,null]},F=new U([0,0,0,0]),C=function(A){switch(A){case"underline":return 1;case"overline":return 2;case"line-through":return 3}return 4},h=function(A){var e=function(A){return"none"===A?null:A.split(" ").map(C)}(A.textDecorationLine?A.textDecorationLine:A.textDecoration);return null===e?null:{textDecorationLine:e,textDecorationColor:A.textDecorationColor?new U(A.textDecorationColor):null,textDecorationStyle:function(A){switch(A){case"double":return 1;case"dotted":return 2;case"dashed":return 3;case"wavy":return 4}return 0}(A.textDecorationStyle)}};function d(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var H=function(A,e){var t=Math.max.apply(null,A.colorStops.map(function(A){return A.stop})),r=1/Math.max(1,t);A.colorStops.forEach(function(A){e.addColorStop(Math.floor(Math.max(0,r*A.stop)),A.color.toString());});},f=function(){function A(e){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.canvas=e||document.createElement("canvas");}return function(A,e,t){e&&d(A.prototype,e);}(A,[{key:"render",value:function(A){this.ctx=this.canvas.getContext("2d"), this.options=A, this.canvas.width=Math.floor(A.width*A.scale), this.canvas.height=Math.floor(A.height*A.scale), this.canvas.style.width="".concat(A.width,"px"), this.canvas.style.height="".concat(A.height,"px"), this.ctx.scale(this.options.scale,this.options.scale), this.ctx.translate(-A.x,-A.y), this.ctx.textBaseline="bottom", A.logger.log("Canvas renderer initialized (".concat(A.width,"x").concat(A.height," at ").concat(A.x,",").concat(A.y,") with scale ").concat(this.options.scale));}},{key:"clip",value:function(A,e){var t=this;A.length&&(this.ctx.save(), A.forEach(function(A){t.path(A), t.ctx.clip();})), e(), A.length&&this.ctx.restore();}},{key:"drawImage",value:function(A,e,t){this.ctx.drawImage(A,e.left,e.top,e.width,e.height,t.left,t.top,t.width,t.height);}},{key:"drawShape",value:function(A,e){this.path(A), this.ctx.fillStyle=e.toString(), this.ctx.fill();}},{key:"fill",value:function(A){this.ctx.fillStyle=A.toString(), this.ctx.fill();}},{key:"getTarget",value:function(){return this.canvas.getContext("2d").setTransform(1,0,0,1,0,0), Promise.resolve(this.canvas)}},{key:"path",value:function(A){var e=this;this.ctx.beginPath(), Array.isArray(A)?A.forEach(function(A,t){var n=A.type===r.VECTOR?A:A.start;0===t?e.ctx.moveTo(n.x,n.y):e.ctx.lineTo(n.x,n.y), A.type===r.BEZIER_CURVE&&e.ctx.bezierCurveTo(A.startControl.x,A.startControl.y,A.endControl.x,A.endControl.y,A.end.x,A.end.y);}):this.ctx.arc(A.x+A.radius,A.y+A.radius,A.radius,0,2*Math.PI,!0), this.ctx.closePath();}},{key:"rectangle",value:function(A,e,t,r,n){this.ctx.fillStyle=n.toString(), this.ctx.fillRect(A,e,t,r);}},{key:"renderLinearGradient",value:function(A,e){var t=this.ctx.createLinearGradient(A.left+e.direction.x1,A.top+e.direction.y1,A.left+e.direction.x0,A.top+e.direction.y0);H(e,t), this.ctx.fillStyle=t, this.ctx.fillRect(A.left,A.top,A.width,A.height);}},{key:"renderRadialGradient",value:function(A,e){var t=this,r=A.left+e.center.x,n=A.top+e.center.y,B=this.ctx.createRadialGradient(r,n,0,r,n,e.radius.x);if(B)if(H(e,B), this.ctx.fillStyle=B, e.radius.x!==e.radius.y){var s=A.left+.5*A.width,o=A.top+.5*A.height,a=e.radius.y/e.radius.x,i=1/a;this.transform(s,o,[1,0,0,a,0,0],function(){return t.ctx.fillRect(A.left,i*(A.top-o)+o,A.width,A.height*i)});}else this.ctx.fillRect(A.left,A.top,A.width,A.height);}},{key:"renderRepeat",value:function(A,e,t,r,n){this.path(A), this.ctx.fillStyle=this.ctx.createPattern(this.resizeImage(e,t),"repeat"), this.ctx.translate(r,n), this.ctx.fill(), this.ctx.translate(-r,-n);}},{key:"renderTextNode",value:function(A,e,t,r,n){var B=this;this.ctx.font=[t.fontStyle,t.fontVariant,t.fontWeight,t.fontSize,t.fontFamily].join(" "), A.forEach(function(A){if(B.ctx.fillStyle=e.toString(), n&&A.text.trim().length?(n.slice(0).reverse().forEach(function(e){B.ctx.shadowColor=e.color.toString(), B.ctx.shadowOffsetX=e.offsetX*B.options.scale, B.ctx.shadowOffsetY=e.offsetY*B.options.scale, B.ctx.shadowBlur=e.blur, B.ctx.fillText(A.text,A.bounds.left,A.bounds.top+A.bounds.height);}), B.ctx.shadowColor="", B.ctx.shadowOffsetX=0, B.ctx.shadowOffsetY=0, B.ctx.shadowBlur=0):B.ctx.fillText(A.text,A.bounds.left,A.bounds.top+A.bounds.height), null!==r){var s=r.textDecorationColor||e;r.textDecorationLine.forEach(function(e){switch(e){case 1:var r=B.options.fontMetrics.getMetrics(t).baseline;B.rectangle(A.bounds.left,Math.round(A.bounds.top+r),A.bounds.width,1,s);break;case 2:B.rectangle(A.bounds.left,Math.round(A.bounds.top),A.bounds.width,1,s);break;case 3:var n=B.options.fontMetrics.getMetrics(t).middle;B.rectangle(A.bounds.left,Math.ceil(A.bounds.top+n),A.bounds.width,1,s);}});}});}},{key:"resizeImage",value:function(A,e){if(A.width===e.width&&A.height===e.height)return A;var t=this.canvas.ownerDocument.createElement("canvas");return t.width=e.width, t.height=e.height, t.getContext("2d").drawImage(A,0,0,A.width,A.height,0,0,e.width,e.height), t}},{key:"setOpacity",value:function(A){this.ctx.globalAlpha=A;}},{key:"transform",value:function(A,e,t,r){this.ctx.save(), this.ctx.translate(A,e), this.ctx.transform(t[0],t[1],t[2],t[3],t[4],t[5]), this.ctx.translate(-A,-e), r(), this.ctx.restore();}}]), A}();function E(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var p=function(){function A(e,t,r){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.enabled="undefined"!=typeof window&&e, this.start=r||Date.now(), this.id=t;}return function(A,e,t){e&&E(A.prototype,e);}(A,[{key:"child",value:function(e){return new A(this.enabled,e,this.start)}},{key:"log",value:function(){if(this.enabled&&window.console&&window.console.log){for(var A=arguments.length,e=new Array(A),t=0;t<A;t++)e[t]=arguments[t];Function.prototype.bind.call(window.console.log,window.console).apply(window.console,[Date.now()-this.start+"ms",this.id?"html2canvas (".concat(this.id,"):"):"html2canvas:"].concat([].slice.call(e,0)));}}},{key:"error",value:function(){if(this.enabled&&window.console&&window.console.error){for(var A=arguments.length,e=new Array(A),t=0;t<A;t++)e[t]=arguments[t];Function.prototype.bind.call(window.console.error,window.console).apply(window.console,[Date.now()-this.start+"ms",this.id?"html2canvas (".concat(this.id,"):"):"html2canvas:"].concat([].slice.call(e,0)));}}}]), A}(),K=function(A,e){return 0!=(A&e)},m=function(A,e){return Math.sqrt(A*A+e*e)},b=function(A,e){for(var t=A.length-1;t>=0;t--){var r=A.item(t);"content"!==r&&e.style.setProperty(r,A.getPropertyValue(r));}return e};function N(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var y={PX:0,PERCENTAGE:1},v=function(){function A(e){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.type="%"===e.substr(e.length-1)?y.PERCENTAGE:y.PX;var t=parseFloat(e);this.value=isNaN(t)?0:t;}return function(A,e,t){e&&N(A.prototype,e), t&&N(A,t);}(A,[{key:"isPercentage",value:function(){return this.type===y.PERCENTAGE}},{key:"getAbsoluteValue",value:function(A){return this.isPercentage()?A*(this.value/100):this.value}}],[{key:"create",value:function(e){return new A(e)}}]), A}(),I=function(A,e,t){switch(t){case"px":case"%":return new v(e+t);case"em":case"rem":var r=new v(e);return r.value*="em"===t?parseFloat(A.style.font.fontSize):function A(e){var t=e.parent;return t?A(t):parseFloat(e.style.font.fontSize)}(A), r;default:return new v("0")}},D=function A(e,t){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.width=e, this.height=t;},M=function A(e,t){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.type=r.VECTOR, this.x=e, this.y=t;};function T(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var S=function(A,e,t){return new M(A.x+(e.x-A.x)*t,A.y+(e.y-A.y)*t)},X=function(){function A(e,t,n,B){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.type=r.BEZIER_CURVE, this.start=e, this.startControl=t, this.endControl=n, this.end=B;}return function(A,e,t){e&&T(A.prototype,e);}(A,[{key:"subdivide",value:function(e,t){var r=S(this.start,this.startControl,e),n=S(this.startControl,this.endControl,e),B=S(this.endControl,this.end,e),s=S(r,n,e),o=S(n,B,e),a=S(s,o,e);return t?new A(this.start,r,s,a):new A(a,o,B,this.end)}},{key:"reverse",value:function(){return new A(this.end,this.endControl,this.startControl,this.start)}}]), A}();function z(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var L=function(){function A(e,t,r,n){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.left=e, this.top=t, this.width=r, this.height=n;}return function(A,e,t){t&&z(A,t);}(A,0,[{key:"fromClientRect",value:function(e,t,r){return new A(e.left+t,e.top+r,e.width,e.height)}}]), A}(),O=function(A,e,t){return L.fromClientRect(A.getBoundingClientRect(),e,t)},x=function(A){var e=A.body,t=A.documentElement;if(!e||!t)throw new Error("");var r=Math.max(Math.max(e.scrollWidth,t.scrollWidth),Math.max(e.offsetWidth,t.offsetWidth),Math.max(e.clientWidth,t.clientWidth)),n=Math.max(Math.max(e.scrollHeight,t.scrollHeight),Math.max(e.offsetHeight,t.offsetHeight),Math.max(e.clientHeight,t.clientHeight));return new L(0,0,r,n)},V=function(A,e,t,r){var n=[];return A instanceof X?n.push(A.subdivide(.5,!1)):n.push(A), t instanceof X?n.push(t.subdivide(.5,!0)):n.push(t), r instanceof X?n.push(r.subdivide(.5,!0).reverse()):n.push(r), e instanceof X?n.push(e.subdivide(.5,!1).reverse()):n.push(e), n},k=function(A){return[A.topLeftInner,A.topRightInner,A.bottomRightInner,A.bottomLeftInner]},J=function(A,e,t){var r=t[R.TOP_LEFT][0].getAbsoluteValue(A.width),n=t[R.TOP_LEFT][1].getAbsoluteValue(A.height),B=t[R.TOP_RIGHT][0].getAbsoluteValue(A.width),s=t[R.TOP_RIGHT][1].getAbsoluteValue(A.height),o=t[R.BOTTOM_RIGHT][0].getAbsoluteValue(A.width),a=t[R.BOTTOM_RIGHT][1].getAbsoluteValue(A.height),i=t[R.BOTTOM_LEFT][0].getAbsoluteValue(A.width),c=t[R.BOTTOM_LEFT][1].getAbsoluteValue(A.height),Q=[];Q.push((r+B)/A.width), Q.push((i+o)/A.width), Q.push((n+c)/A.height), Q.push((s+a)/A.height);var l=Math.max.apply(Math,Q);l>1&&(r/=l, n/=l, B/=l, s/=l, o/=l, a/=l, i/=l, c/=l);var w=A.width-B,u=A.height-a,U=A.width-o,g=A.height-c;return{topLeftOuter:r>0||n>0?_(A.left,A.top,r,n,R.TOP_LEFT):new M(A.left,A.top),topLeftInner:r>0||n>0?_(A.left+e[3].borderWidth,A.top+e[0].borderWidth,Math.max(0,r-e[3].borderWidth),Math.max(0,n-e[0].borderWidth),R.TOP_LEFT):new M(A.left+e[3].borderWidth,A.top+e[0].borderWidth),topRightOuter:B>0||s>0?_(A.left+w,A.top,B,s,R.TOP_RIGHT):new M(A.left+A.width,A.top),topRightInner:B>0||s>0?_(A.left+Math.min(w,A.width+e[3].borderWidth),A.top+e[0].borderWidth,w>A.width+e[3].borderWidth?0:B-e[3].borderWidth,s-e[0].borderWidth,R.TOP_RIGHT):new M(A.left+A.width-e[1].borderWidth,A.top+e[0].borderWidth),bottomRightOuter:o>0||a>0?_(A.left+U,A.top+u,o,a,R.BOTTOM_RIGHT):new M(A.left+A.width,A.top+A.height),bottomRightInner:o>0||a>0?_(A.left+Math.min(U,A.width-e[3].borderWidth),A.top+Math.min(u,A.height+e[0].borderWidth),Math.max(0,o-e[1].borderWidth),a-e[2].borderWidth,R.BOTTOM_RIGHT):new M(A.left+A.width-e[1].borderWidth,A.top+A.height-e[2].borderWidth),bottomLeftOuter:i>0||c>0?_(A.left,A.top+g,i,c,R.BOTTOM_LEFT):new M(A.left,A.top+A.height),bottomLeftInner:i>0||c>0?_(A.left+e[3].borderWidth,A.top+g,Math.max(0,i-e[3].borderWidth),c-e[2].borderWidth,R.BOTTOM_LEFT):new M(A.left+e[3].borderWidth,A.top+A.height-e[2].borderWidth)}},R={TOP_LEFT:0,TOP_RIGHT:1,BOTTOM_RIGHT:2,BOTTOM_LEFT:3},_=function(A,e,t,r,n){var B=(Math.sqrt(2)-1)/3*4,s=t*B,o=r*B,a=A+t,i=e+r;switch(n){case R.TOP_LEFT:return new X(new M(A,i),new M(A,i-o),new M(a-s,e),new M(a,e));case R.TOP_RIGHT:return new X(new M(A,e),new M(A+s,e),new M(a,i-o),new M(a,i));case R.BOTTOM_RIGHT:return new X(new M(a,e),new M(a,e+o),new M(A+s,i),new M(A,i));case R.BOTTOM_LEFT:default:return new X(new M(a,i),new M(a-s,i),new M(A,e+o),new M(A,e))}},P=["top","right","bottom","left"],G=function(A){return P.map(function(e){return new v(A.getPropertyValue("padding-".concat(e)))})},W={BORDER_BOX:0,PADDING_BOX:1,CONTENT_BOX:2},Y=W,q=function A(e){switch(function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), e){case"contain":this.size=1;break;case"cover":this.size=2;break;case"auto":this.size=0;break;default:this.value=new v(e);}},j=new q("auto"),Z=function(A,e,t,r){var n=function(A,e){return new L(A.left+e[3].borderWidth,A.top+e[0].borderWidth,A.width-(e[1].borderWidth+e[3].borderWidth),A.height-(e[0].borderWidth+e[2].borderWidth))}(e,r);switch(A){case Y.BORDER_BOX:return e;case Y.CONTENT_BOX:var B=t[3].getAbsoluteValue(e.width),s=t[1].getAbsoluteValue(e.width),o=t[0].getAbsoluteValue(e.width),a=t[2].getAbsoluteValue(e.width);return new L(n.left+B,n.top+o,n.width-B-s,n.height-o-a);case Y.PADDING_BOX:default:return n}},$=function(A,e,t){return new M(A[0].getAbsoluteValue(t.width-e.width),A[1].getAbsoluteValue(t.height-e.height))},AA=function(A,e){return{backgroundColor:new U(A.backgroundColor),backgroundImage:rA(A,e),backgroundClip:eA(A.backgroundClip),backgroundOrigin:tA(A.backgroundOrigin)}},eA=function(A){switch(A){case"padding-box":return W.PADDING_BOX;case"content-box":return W.CONTENT_BOX}return W.BORDER_BOX},tA=function(A){switch(A){case"padding-box":return Y.PADDING_BOX;case"content-box":return Y.CONTENT_BOX}return Y.BORDER_BOX},rA=function(A,e){var t=sA(A.backgroundImage).map(function(A){if("url"===A.method){var t=e.loadImage(A.args[0]);A.args=t?[t]:[];}return A}),r=A.backgroundPosition.split(","),n=A.backgroundRepeat.split(","),B=A.backgroundSize.split(",");return t.map(function(A,e){var t=(B[e]||"auto").trim().split(" ").map(nA),s=(r[e]||"auto").trim().split(" ").map(BA);return{source:A,repeat:function(A){switch(("string"==typeof n[e]?n[e]:n[0]).trim()){case"no-repeat":return 1;case"repeat-x":case"repeat no-repeat":return 2;case"repeat-y":case"no-repeat repeat":return 3;case"repeat":return 0}return 0}(),size:t.length<2?[t[0],j]:[t[0],t[1]],position:s.length<2?[s[0],s[0]]:[s[0],s[1]]}})},nA=function(A){return"auto"===A?j:new q(A)},BA=function(A){switch(A){case"bottom":case"right":return new v("100%");case"left":case"top":return new v("0%");case"auto":return new v("0")}return new v(A)},sA=function(A){var e=/^\s$/,t=[],r=[],n="",B=null,s="",o=0,a=0,i=function(){var A="";if(n){'"'===s.substr(0,1)&&(s=s.substr(1,s.length-2)), s&&r.push(s.trim());var e=n.indexOf("-",1)+1;"-"===n.substr(0,1)&&e>0&&(A=n.substr(0,e).toLowerCase(), n=n.substr(e)), "none"!==(n=n.toLowerCase())&&t.push({prefix:A,method:n,args:r});}r=[], n=s="";};return A.split("").forEach(function(A){if(0!==o||!e.test(A)){switch(A){case'"':B?B===A&&(B=null):B=A;break;case"(":if(B)break;if(0===o)return void(o=1);a++;break;case")":if(B)break;if(1===o){if(0===a)return o=0, void i();a--;}break;case",":if(B)break;if(0===o)return void i();if(1===o&&0===a&&!n.match(/^url$/i))return r.push(s.trim()), void(s="")}0===o?n+=A:s+=A;}}), i(), t},oA=Object.keys({TOP:0,RIGHT:1,BOTTOM:2,LEFT:3}).map(function(A){return A.toLowerCase()}),aA=function(A){return oA.map(function(e){var t=new U(A.getPropertyValue("border-".concat(e,"-color"))),r=function(A){switch(A){case"none":return 0}return 1}(A.getPropertyValue("border-".concat(e,"-style"))),n=parseFloat(A.getPropertyValue("border-".concat(e,"-width")));return{borderColor:t,borderStyle:r,borderWidth:isNaN(n)?0:n}})};var iA=["top-left","top-right","bottom-right","bottom-left"],cA=function(A){return iA.map(function(e){var t=function(A,e){return function(A){if(Array.isArray(A))return A}(A)||function(A,e){var t=[],r=!0,n=!1,B=void 0;try{for(var s,o=A[Symbol.iterator]();!(r=(s=o.next()).done)&&(t.push(s.value), !e||t.length!==e);r=!0);}catch(A){n=!0, B=A;}finally{try{r||null==o.return||o.return();}finally{if(n)throw B}}return t}(A,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(A.getPropertyValue("border-".concat(e,"-radius")).split(" ").map(v.create),2),r=t[0],n=t[1];return void 0===n?[r,r]:[r,n]})},QA={NONE:1,BLOCK:2,INLINE:4,RUN_IN:8,FLOW:16,FLOW_ROOT:32,TABLE:64,FLEX:128,GRID:256,RUBY:512,SUBGRID:1024,LIST_ITEM:2048,TABLE_ROW_GROUP:4096,TABLE_HEADER_GROUP:8192,TABLE_FOOTER_GROUP:16384,TABLE_ROW:32768,TABLE_CELL:65536,TABLE_COLUMN_GROUP:1<<17,TABLE_COLUMN:1<<18,TABLE_CAPTION:1<<19,RUBY_BASE:1<<20,RUBY_TEXT:1<<21,RUBY_BASE_CONTAINER:1<<22,RUBY_TEXT_CONTAINER:1<<23,CONTENTS:1<<24,INLINE_BLOCK:1<<25,INLINE_LIST_ITEM:1<<26,INLINE_TABLE:1<<27,INLINE_FLEX:1<<28,INLINE_GRID:1<<29},lA=function(A,e){return A|function(A){switch(e){case"block":return QA.BLOCK;case"inline":return QA.INLINE;case"run-in":return QA.RUN_IN;case"flow":return QA.FLOW;case"flow-root":return QA.FLOW_ROOT;case"table":return QA.TABLE;case"flex":return QA.FLEX;case"grid":return QA.GRID;case"ruby":return QA.RUBY;case"subgrid":return QA.SUBGRID;case"list-item":return QA.LIST_ITEM;case"table-row-group":return QA.TABLE_ROW_GROUP;case"table-header-group":return QA.TABLE_HEADER_GROUP;case"table-footer-group":return QA.TABLE_FOOTER_GROUP;case"table-row":return QA.TABLE_ROW;case"table-cell":return QA.TABLE_CELL;case"table-column-group":return QA.TABLE_COLUMN_GROUP;case"table-column":return QA.TABLE_COLUMN;case"table-caption":return QA.TABLE_CAPTION;case"ruby-base":return QA.RUBY_BASE;case"ruby-text":return QA.RUBY_TEXT;case"ruby-base-container":return QA.RUBY_BASE_CONTAINER;case"ruby-text-container":return QA.RUBY_TEXT_CONTAINER;case"contents":return QA.CONTENTS;case"inline-block":return QA.INLINE_BLOCK;case"inline-list-item":return QA.INLINE_LIST_ITEM;case"inline-table":return QA.INLINE_TABLE;case"inline-flex":return QA.INLINE_FLEX;case"inline-grid":return QA.INLINE_GRID}return QA.NONE}()},wA=function(A){return A.split(" ").reduce(lA,0)},uA=function(A){switch(A){case"left":return 1;case"right":return 2;case"inline-start":return 3;case"inline-end":return 4}return 0},UA=function(A){return{fontFamily:A.fontFamily,fontSize:A.fontSize,fontStyle:A.fontStyle,fontVariant:A.fontVariant,fontWeight:function(A){switch(A){case"normal":return 400;case"bold":return 700}var e=parseInt(A,10);return isNaN(e)?400:e}(A.fontWeight)}},gA=function(A){if("normal"===A)return 0;var e=parseFloat(A);return isNaN(e)?0:e},FA=function(A){switch(A){case"strict":return"strict";case"normal":default:return"normal"}},CA=function(A){switch(A){case"disc":return 0;case"circle":return 1;case"square":return 2;case"decimal":return 3;case"cjk-decimal":return 4;case"decimal-leading-zero":return 5;case"lower-roman":return 6;case"upper-roman":return 7;case"lower-greek":return 8;case"lower-alpha":return 9;case"upper-alpha":return 10;case"arabic-indic":return 11;case"armenian":return 12;case"bengali":return 13;case"cambodian":return 14;case"cjk-earthly-branch":return 15;case"cjk-heavenly-stem":return 16;case"cjk-ideographic":return 17;case"devanagari":return 18;case"ethiopic-numeric":return 19;case"georgian":return 20;case"gujarati":return 21;case"gurmukhi":case"hebrew":return 22;case"hiragana":return 23;case"hiragana-iroha":return 24;case"japanese-formal":return 25;case"japanese-informal":return 26;case"kannada":return 27;case"katakana":return 28;case"katakana-iroha":return 29;case"khmer":return 30;case"korean-hangul-formal":return 31;case"korean-hanja-formal":return 32;case"korean-hanja-informal":return 33;case"lao":return 34;case"lower-armenian":return 35;case"malayalam":return 36;case"mongolian":return 37;case"myanmar":return 38;case"oriya":return 39;case"persian":return 40;case"simp-chinese-formal":return 41;case"simp-chinese-informal":return 42;case"tamil":return 43;case"telugu":return 44;case"thai":return 45;case"tibetan":return 46;case"trad-chinese-formal":return 47;case"trad-chinese-informal":return 48;case"upper-armenian":return 49;case"disclosure-open":return 50;case"disclosure-closed":return 51;case"none":default:return-1}},hA=function(A){var e=sA(A.getPropertyValue("list-style-image"));return{listStyleType:CA(A.getPropertyValue("list-style-type")),listStyleImage:e.length?e[0]:null,listStylePosition:dA(A.getPropertyValue("list-style-position"))}},dA=function(A){switch(A){case"inside":return 0;case"outside":default:return 1}},HA=["top","right","bottom","left"],fA=function(A){return HA.map(function(e){return new v(A.getPropertyValue("margin-".concat(e)))})},EA={VISIBLE:0,HIDDEN:1,SCROLL:2,AUTO:3},pA=function(A){switch(A){case"hidden":return EA.HIDDEN;case"scroll":return EA.SCROLL;case"auto":return EA.AUTO;case"visible":default:return EA.VISIBLE}},KA=function(A){switch(A){case"break-word":return 1;case"normal":default:return 0}},mA={STATIC:0,RELATIVE:1,ABSOLUTE:2,FIXED:3,STICKY:4},bA=function(A){switch(A){case"relative":return mA.RELATIVE;case"absolute":return mA.ABSOLUTE;case"fixed":return mA.FIXED;case"sticky":return mA.STICKY}return mA.STATIC},NA=/^([+-]|\d|\.)$/i,yA=function(A){if("none"===A||"string"!=typeof A)return null;for(var e="",t=!1,r=[],n=[],B=0,s=null,o=function(){e.length&&(t?r.push(parseFloat(e)):s=new U(e)), t=!1, e="";},a=function(){r.length&&null!==s&&n.push({color:s,offsetX:r[0]||0,offsetY:r[1]||0,blur:r[2]||0}), r.splice(0,r.length), s=null;},i=0;i<A.length;i++){var c=A[i];switch(c){case"(":e+=c, B++;break;case")":e+=c, B--;break;case",":0===B?(o(), a()):e+=c;break;case" ":0===B?o():e+=c;break;default:0===e.length&&NA.test(c)&&(t=!0), e+=c;}}return o(), a(), 0===n.length?null:n},vA=function(A){switch(A){case"uppercase":return 2;case"lowercase":return 1;case"capitalize":return 3}return 0},IA=function(A){return parseFloat(A.trim())},DA=/(matrix|matrix3d)\((.+)\)/,MA=function(A){var e=SA(A.transform||A.webkitTransform||A.mozTransform||A.msTransform||A.oTransform);return null===e?null:{transform:e,transformOrigin:TA(A.transformOrigin||A.webkitTransformOrigin||A.mozTransformOrigin||A.msTransformOrigin||A.oTransformOrigin)}},TA=function(A){if("string"!=typeof A){var e=new v("0");return[e,e]}var t=A.split(" ").map(v.create);return[t[0],t[1]]},SA=function(A){if("none"===A||"string"!=typeof A)return null;var e=A.match(DA);if(e){if("matrix"===e[1]){var t=e[2].split(",").map(IA);return[t[0],t[1],t[2],t[3],t[4],t[5]]}var r=e[2].split(",").map(IA);return[r[0],r[1],r[4],r[5],r[12],r[13]]}return null},XA=function(A){switch(A){case"hidden":return 1;case"collapse":return 2;case"visible":default:return 0}},zA=function(A){switch(A){case"break-all":return"break-all";case"keep-all":return"keep-all";case"normal":default:return"normal"}},LA=function(A){var e="auto"===A;return{auto:e,order:e?0:parseInt(A,10)}};function OA(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var xA=function(){function A(e){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.element=e;}return function(A,e,t){e&&OA(A.prototype,e);}(A,[{key:"render",value:function(A){var e=this;this.options=A, this.canvas=document.createElement("canvas"), this.ctx=this.canvas.getContext("2d"), this.canvas.width=Math.floor(A.width)*A.scale, this.canvas.height=Math.floor(A.height)*A.scale, this.canvas.style.width="".concat(A.width,"px"), this.canvas.style.height="".concat(A.height,"px"), this.ctx.scale(A.scale,A.scale), A.logger.log("ForeignObject renderer initialized (".concat(A.width,"x").concat(A.height," at ").concat(A.x,",").concat(A.y,") with scale ").concat(A.scale));var t=VA(Math.max(A.windowWidth,A.width)*A.scale,Math.max(A.windowHeight,A.height)*A.scale,A.scrollX*A.scale,A.scrollY*A.scale,this.element);return kA(t).then(function(t){return A.backgroundColor&&(e.ctx.fillStyle=A.backgroundColor.toString(), e.ctx.fillRect(0,0,A.width*A.scale,A.height*A.scale)), e.ctx.drawImage(t,-A.x*A.scale,-A.y*A.scale), e.canvas})}}]), A}(),VA=function(A,e,t,r,n){var B="http://www.w3.org/2000/svg",s=document.createElementNS(B,"svg"),o=document.createElementNS(B,"foreignObject");return s.setAttributeNS(null,"width",A), s.setAttributeNS(null,"height",e), o.setAttributeNS(null,"width","100%"), o.setAttributeNS(null,"height","100%"), o.setAttributeNS(null,"x",t), o.setAttributeNS(null,"y",r), o.setAttributeNS(null,"externalResourcesRequired","true"), s.appendChild(o), o.appendChild(n), s},kA=function(A){return new Promise(function(e,t){var r=new Image;r.onload=function(){return e(r)}, r.onerror=t, r.src="data:image/svg+xml;charset=utf-8,".concat(encodeURIComponent((new XMLSerializer).serializeToString(A)));})},JA=function(A){return 0===A[0]&&255===A[1]&&0===A[2]&&255===A[3]},RA={get SUPPORT_RANGE_BOUNDS(){var A=function(A){if(A.createRange){var e=A.createRange();if(e.getBoundingClientRect){var t=A.createElement("boundtest");t.style.height="".concat(123,"px"), t.style.display="block", A.body.appendChild(t), e.selectNode(t);var r=e.getBoundingClientRect(),n=Math.round(r.height);if(A.body.removeChild(t), 123===n)return!0}}return!1}(document);return Object.defineProperty(RA,"SUPPORT_RANGE_BOUNDS",{value:A}), A},get SUPPORT_SVG_DRAWING(){var A=function(A){var e=new Image,t=A.createElement("canvas"),r=t.getContext("2d");e.src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";try{r.drawImage(e,0,0), t.toDataURL();}catch(A){return!1}return!0}(document);return Object.defineProperty(RA,"SUPPORT_SVG_DRAWING",{value:A}), A},get SUPPORT_FOREIGNOBJECT_DRAWING(){var A="function"==typeof Array.from&&"function"==typeof window.fetch?function(A){var e=A.createElement("canvas");e.width=100, e.height=100;var t=e.getContext("2d");t.fillStyle="rgb(0, 255, 0)", t.fillRect(0,0,100,100);var r=new Image,n=e.toDataURL();r.src=n;var B=VA(100,100,0,0,r);return t.fillStyle="red", t.fillRect(0,0,100,100), kA(B).then(function(e){t.drawImage(e,0,0);var r=t.getImageData(0,0,100,100).data;t.fillStyle="red", t.fillRect(0,0,100,100);var B=A.createElement("div");return B.style.backgroundImage="url(".concat(n,")"), B.style.height="".concat(100,"px"), JA(r)?kA(VA(100,100,0,0,B)):Promise.reject(!1)}).then(function(A){return t.drawImage(A,0,0), JA(t.getImageData(0,0,100,100).data)}).catch(function(A){return!1})}(document):Promise.resolve(!1);return Object.defineProperty(RA,"SUPPORT_FOREIGNOBJECT_DRAWING",{value:A}), A},get SUPPORT_CORS_IMAGES(){var A=void 0!==(new Image).crossOrigin;return Object.defineProperty(RA,"SUPPORT_CORS_IMAGES",{value:A}), A},get SUPPORT_RESPONSE_TYPE(){var A="string"==typeof(new XMLHttpRequest).responseType;return Object.defineProperty(RA,"SUPPORT_RESPONSE_TYPE",{value:A}), A},get SUPPORT_CORS_XHR(){var A="withCredentials"in new XMLHttpRequest;return Object.defineProperty(RA,"SUPPORT_CORS_XHR",{value:A}), A}},_A=RA,PA=t(0),GA=function A(e,t){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.text=e, this.bounds=t;},WA=function(A,e,t){var r=A.ownerDocument.createElement("html2canvaswrapper");r.appendChild(A.cloneNode(!0));var n=A.parentNode;if(n){n.replaceChild(r,A);var B=O(r,e,t);return r.firstChild&&n.replaceChild(r.firstChild,r), B}return new L(0,0,0,0)},YA=function(A,e,t,r,n){var B=A.ownerDocument.createRange();return B.setStart(A,e), B.setEnd(A,e+t), L.fromClientRect(B.getBoundingClientRect(),r,n)};function qA(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var jA=function(){function A(e,t,r){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.text=e, this.parent=t, this.bounds=r;}return function(A,e,t){t&&qA(A,t);}(A,0,[{key:"fromTextNode",value:function(e,t){var r=$A(e.data,t.style.textTransform);return new A(r,t,function(A,e,t){for(var r=0!==e.style.letterSpacing?Object(PA.toCodePoints)(A).map(function(A){return Object(PA.fromCodePoint)(A)}):function(A,e){for(var t,r=Object(PA.LineBreaker)(A,{lineBreak:e.style.lineBreak,wordBreak:1===e.style.overflowWrap?"break-word":e.style.wordBreak}),n=[];!(t=r.next()).done;)n.push(t.value.slice());return n}(A,e),n=r.length,B=t.parentNode?t.parentNode.ownerDocument.defaultView:null,s=B?B.pageXOffset:0,o=B?B.pageYOffset:0,a=[],i=0,c=0;c<n;c++){var Q=r[c];if(null!==e.style.textDecoration||Q.trim().length>0)if(_A.SUPPORT_RANGE_BOUNDS)a.push(new GA(Q,YA(t,i,Q.length,s,o)));else{var l=t.splitText(Q.length);a.push(new GA(Q,WA(t,s,o))), t=l;}else _A.SUPPORT_RANGE_BOUNDS||(t=t.splitText(Q.length));i+=Q.length;}return a}(r,t,e))}}]), A}(),ZA=/(^|\s|:|-|\(|\))([a-z])/g,$A=function(A,e){switch(e){case 1:return A.toLowerCase();case 3:return A.replace(ZA,Ae);case 2:return A.toUpperCase();default:return A}};function Ae(A,e,t){return A.length>0?e+t.toUpperCase():A}var ee=function A(e,t,n){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.type=r.CIRCLE, this.x=e, this.y=t, this.radius=n;},te=new U([42,42,42]),re=new U([165,165,165]),ne=new U([222,222,222]),Be={borderWidth:1,borderColor:re,borderStyle:1},se=[Be,Be,Be,Be],oe={backgroundColor:ne,backgroundImage:[],backgroundClip:W.PADDING_BOX,backgroundOrigin:Y.PADDING_BOX},ae=new v("50%"),ie=[ae,ae],ce=[ie,ie,ie,ie],Qe=new v("3px"),le=[Qe,Qe],we=[le,le,le,le],ue=function(A){return"radio"===A.type?ce:we},Ue=function(A,e){if("radio"===A.type||"checkbox"===A.type){if(A.checked){var t=Math.min(e.bounds.width,e.bounds.height);e.childNodes.push("checkbox"===A.type?[new M(e.bounds.left+.39363*t,e.bounds.top+.79*t),new M(e.bounds.left+.16*t,e.bounds.top+.5549*t),new M(e.bounds.left+.27347*t,e.bounds.top+.44071*t),new M(e.bounds.left+.39694*t,e.bounds.top+.5649*t),new M(e.bounds.left+.72983*t,e.bounds.top+.23*t),new M(e.bounds.left+.84*t,e.bounds.top+.34085*t),new M(e.bounds.left+.39363*t,e.bounds.top+.79*t)]:new ee(e.bounds.left+t/4,e.bounds.top+t/4,t/4));}}else he(de(A),A,e,!1);},ge=function(A,e){he(A.value,A,e,!0);},Fe=function(A,e){var t=A.options[A.selectedIndex||0];he(t&&t.text||"",A,e,!1);},Ce=function(A){return A.width>A.height?(A.left+=(A.width-A.height)/2, A.width=A.height):A.width<A.height&&(A.top+=(A.height-A.width)/2, A.height=A.width), A},he=function(A,e,t,r){var n=e.ownerDocument.body;if(A.length>0&&n){var B=e.ownerDocument.createElement("html2canvaswrapper");b(e.ownerDocument.defaultView.getComputedStyle(e,null),B), B.style.position="absolute", B.style.left="".concat(t.bounds.left,"px"), B.style.top="".concat(t.bounds.top,"px"), r||(B.style.whiteSpace="nowrap");var s=e.ownerDocument.createTextNode(A);B.appendChild(s), n.appendChild(B), t.childNodes.push(jA.fromTextNode(s,t)), n.removeChild(B);}},de=function(A){var e="password"===A.type?new Array(A.value.length+1).join("•"):A.value;return 0===e.length?A.placeholder||"":e},He=["OL","UL","MENU"],fe=function(A){var e=A.parent;if(!e)return null;do{if(-1!==He.indexOf(e.tagName))return e;e=e.parent;}while(e);return A.parent},Ee=function(A,e,t){var r=e.style.listStyle;if(r){var n,B=A.ownerDocument.defaultView.getComputedStyle(A,null),s=A.ownerDocument.createElement("html2canvaswrapper");switch(b(B,s), s.style.position="absolute", s.style.bottom="auto", s.style.display="block", s.style.letterSpacing="normal", r.listStylePosition){case 1:s.style.left="auto", s.style.right="".concat(A.ownerDocument.defaultView.innerWidth-e.bounds.left-e.style.margin[1].getAbsoluteValue(e.bounds.width)+7,"px"), s.style.textAlign="right";break;case 0:s.style.left="".concat(e.bounds.left-e.style.margin[3].getAbsoluteValue(e.bounds.width),"px"), s.style.right="auto", s.style.textAlign="left";}var o=e.style.margin[0].getAbsoluteValue(e.bounds.width),a=r.listStyleImage;if(a)if("url"===a.method){var i=A.ownerDocument.createElement("img");i.src=a.args[0], s.style.top="".concat(e.bounds.top-o,"px"), s.style.width="auto", s.style.height="auto", s.appendChild(i);}else{var c=.5*parseFloat(e.style.font.fontSize);s.style.top="".concat(e.bounds.top-o+e.bounds.height-1.5*c,"px"), s.style.width="".concat(c,"px"), s.style.height="".concat(c,"px"), s.style.backgroundImage=B.listStyleImage;}else"number"==typeof e.listIndex&&(n=A.ownerDocument.createTextNode(Me(e.listIndex,r.listStyleType,!0)), s.appendChild(n), s.style.top="".concat(e.bounds.top-o,"px"));var Q=A.ownerDocument.body;Q.appendChild(s), n?(e.childNodes.push(jA.fromTextNode(n,e)), Q.removeChild(s)):e.childNodes.push(new Xe(s,e,t,0));}},pe={integers:[1e3,900,500,400,100,90,50,40,10,9,5,4,1],values:["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]},Ke={integers:[9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["Ք","Փ","Ւ","Ց","Ր","Տ","Վ","Ս","Ռ","Ջ","Պ","Չ","Ո","Շ","Ն","Յ","Մ","Ճ","Ղ","Ձ","Հ","Կ","Ծ","Խ","Լ","Ի","Ժ","Թ","Ը","Է","Զ","Ե","Դ","Գ","Բ","Ա"]},me={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,400,300,200,100,90,80,70,60,50,40,30,20,19,18,17,16,15,10,9,8,7,6,5,4,3,2,1],values:["י׳","ט׳","ח׳","ז׳","ו׳","ה׳","ד׳","ג׳","ב׳","א׳","ת","ש","ר","ק","צ","פ","ע","ס","נ","מ","ל","כ","יט","יח","יז","טז","טו","י","ט","ח","ז","ו","ה","ד","ג","ב","א"]},be={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["ჵ","ჰ","ჯ","ჴ","ხ","ჭ","წ","ძ","ც","ჩ","შ","ყ","ღ","ქ","ფ","ჳ","ტ","ს","რ","ჟ","პ","ო","ჲ","ნ","მ","ლ","კ","ი","თ","ჱ","ზ","ვ","ე","დ","გ","ბ","ა"]},Ne=function(A,e,t,r,n,B){return A<e||A>t?Me(A,n,B.length>0):r.integers.reduce(function(e,t,n){for(;A>=t;)A-=t, e+=r.values[n];return e},"")+B},ye=function(A,e,t,r){var n="";do{t||A--, n=r(A)+n, A/=e;}while(A*e>=e);return n},ve=function(A,e,t,r,n){var B=t-e+1;return(A<0?"-":"")+(ye(Math.abs(A),B,r,function(A){return Object(PA.fromCodePoint)(Math.floor(A%B)+e)})+n)},Ie=function(A,e){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:". ",r=e.length;return ye(Math.abs(A),r,!1,function(A){return e[Math.floor(A%r)]})+t},De=function(A,e,t,r,n,B){if(A<-9999||A>9999)return Me(A,4,n.length>0);var s=Math.abs(A),o=n;if(0===s)return e[0]+o;for(var a=0;s>0&&a<=4;a++){var i=s%10;0===i&&K(B,1)&&""!==o?o=e[i]+o:i>1||1===i&&0===a||1===i&&1===a&&K(B,2)||1===i&&1===a&&K(B,4)&&A>100||1===i&&a>1&&K(B,8)?o=e[i]+(a>0?t[a-1]:"")+o:1===i&&a>0&&(o=t[a-1]+o), s=Math.floor(s/10);}return(A<0?r:"")+o},Me=function(A,e,t){var r=t?". ":"",n=t?"、":"",B=t?", ":"";switch(e){case 0:return"•";case 1:return"◦";case 2:return"◾";case 5:var s=ve(A,48,57,!0,r);return s.length<4?"0".concat(s):s;case 4:return Ie(A,"〇一二三四五六七八九",n);case 6:return Ne(A,1,3999,pe,3,r).toLowerCase();case 7:return Ne(A,1,3999,pe,3,r);case 8:return ve(A,945,969,!1,r);case 9:return ve(A,97,122,!1,r);case 10:return ve(A,65,90,!1,r);case 11:return ve(A,1632,1641,!0,r);case 12:case 49:return Ne(A,1,9999,Ke,3,r);case 35:return Ne(A,1,9999,Ke,3,r).toLowerCase();case 13:return ve(A,2534,2543,!0,r);case 14:case 30:return ve(A,6112,6121,!0,r);case 15:return Ie(A,"子丑寅卯辰巳午未申酉戌亥",n);case 16:return Ie(A,"甲乙丙丁戊己庚辛壬癸",n);case 17:case 48:return De(A,"零一二三四五六七八九","十百千萬","負",n,14);case 47:return De(A,"零壹貳參肆伍陸柒捌玖","拾佰仟萬","負",n,15);case 42:return De(A,"零一二三四五六七八九","十百千萬","负",n,14);case 41:return De(A,"零壹贰叁肆伍陆柒捌玖","拾佰仟萬","负",n,15);case 26:return De(A,"〇一二三四五六七八九","十百千万","マイナス",n,0);case 25:return De(A,"零壱弐参四伍六七八九","拾百千万","マイナス",n,7);case 31:return De(A,"영일이삼사오육칠팔구","십백천만","마이너스",B,7);case 33:return De(A,"零一二三四五六七八九","十百千萬","마이너스",B,0);case 32:return De(A,"零壹貳參四五六七八九","拾百千","마이너스",B,7);case 18:return ve(A,2406,2415,!0,r);case 20:return Ne(A,1,19999,be,3,r);case 21:return ve(A,2790,2799,!0,r);case 22:return ve(A,2662,2671,!0,r);case 22:return Ne(A,1,10999,me,3,r);case 23:return Ie(A,"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");case 24:return Ie(A,"いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");case 27:return ve(A,3302,3311,!0,r);case 28:return Ie(A,"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン",n);case 29:return Ie(A,"イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス",n);case 34:return ve(A,3792,3801,!0,r);case 37:return ve(A,6160,6169,!0,r);case 38:return ve(A,4160,4169,!0,r);case 39:return ve(A,2918,2927,!0,r);case 40:return ve(A,1776,1785,!0,r);case 43:return ve(A,3046,3055,!0,r);case 44:return ve(A,3174,3183,!0,r);case 45:return ve(A,3664,3673,!0,r);case 46:return ve(A,3872,3881,!0,r);case 3:default:return ve(A,48,57,!0,r)}};function Te(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var Se=["INPUT","TEXTAREA","SELECT"],Xe=function(){function A(e,t,r,n){var B=this;!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.parent=t, this.tagName=e.tagName, this.index=n, this.childNodes=[], this.listItems=[], "number"==typeof e.start&&(this.listStart=e.start);var s=e.ownerDocument.defaultView,o=s.pageXOffset,a=s.pageYOffset,i=s.getComputedStyle(e,null),c=wA(i.display),Q="radio"===e.type||"checkbox"===e.type,l=bA(i.position);if(this.style={background:Q?oe:AA(i,r),border:Q?se:aA(i),borderRadius:(e instanceof s.HTMLInputElement||e instanceof HTMLInputElement)&&Q?ue(e):cA(i),color:Q?te:new U(i.color),display:c,float:uA(i.float),font:UA(i),letterSpacing:gA(i.letterSpacing),listStyle:c===QA.LIST_ITEM?hA(i):null,lineBreak:FA(i.lineBreak),margin:fA(i),opacity:parseFloat(i.opacity),overflow:-1===Se.indexOf(e.tagName)?pA(i.overflow):EA.HIDDEN,overflowWrap:KA(i.overflowWrap?i.overflowWrap:i.wordWrap),padding:G(i),position:l,textDecoration:h(i),textShadow:yA(i.textShadow),textTransform:vA(i.textTransform),transform:MA(i),visibility:XA(i.visibility),wordBreak:zA(i.wordBreak),zIndex:LA(l!==mA.STATIC?i.zIndex:"auto")}, this.isTransformed()&&(e.style.transform="matrix(1,0,0,1,0,0)"), c===QA.LIST_ITEM){var w=fe(this);if(w){var u=w.listItems.length;w.listItems.push(this), this.listIndex=e.hasAttribute("value")&&"number"==typeof e.value?e.value:0===u?"number"==typeof w.listStart?w.listStart:1:w.listItems[u-1].listIndex+1;}}"IMG"===e.tagName&&e.addEventListener("load",function(){B.bounds=O(e,o,a), B.curvedBounds=J(B.bounds,B.style.border,B.style.borderRadius);}), this.image=ze(e,r), this.bounds=Q?Ce(O(e,o,a)):O(e,o,a), this.curvedBounds=J(this.bounds,this.style.border,this.style.borderRadius);}return function(A,e,t){e&&Te(A.prototype,e);}(A,[{key:"getClipPaths",value:function(){var A=this.parent?this.parent.getClipPaths():[];return this.style.overflow!==EA.VISIBLE?A.concat([k(this.curvedBounds)]):A}},{key:"isInFlow",value:function(){return this.isRootElement()&&!this.isFloating()&&!this.isAbsolutelyPositioned()}},{key:"isVisible",value:function(){return!K(this.style.display,QA.NONE)&&this.style.opacity>0&&0===this.style.visibility}},{key:"isAbsolutelyPositioned",value:function(){return this.style.position!==mA.STATIC&&this.style.position!==mA.RELATIVE}},{key:"isPositioned",value:function(){return this.style.position!==mA.STATIC}},{key:"isFloating",value:function(){return 0!==this.style.float}},{key:"isRootElement",value:function(){return null===this.parent}},{key:"isTransformed",value:function(){return null!==this.style.transform}},{key:"isPositionedWithZIndex",value:function(){return this.isPositioned()&&!this.style.zIndex.auto}},{key:"isInlineLevel",value:function(){return K(this.style.display,QA.INLINE)||K(this.style.display,QA.INLINE_BLOCK)||K(this.style.display,QA.INLINE_FLEX)||K(this.style.display,QA.INLINE_GRID)||K(this.style.display,QA.INLINE_LIST_ITEM)||K(this.style.display,QA.INLINE_TABLE)}},{key:"isInlineBlockOrInlineTable",value:function(){return K(this.style.display,QA.INLINE_BLOCK)||K(this.style.display,QA.INLINE_TABLE)}}]), A}(),ze=function(A,e){if(A instanceof A.ownerDocument.defaultView.SVGSVGElement||A instanceof SVGSVGElement){var t=new XMLSerializer;return e.loadImage("data:image/svg+xml,".concat(encodeURIComponent(t.serializeToString(A))))}switch(A.tagName){case"IMG":var r=A;return e.loadImage(r.currentSrc||r.src);case"CANVAS":var n=A;return e.loadCanvas(n);case"IFRAME":var B=A.getAttribute("data-html2canvas-internal-iframe-key");if(B)return B}return null};function Le(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var Oe=function(){function A(e,t,r){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.container=e, this.parent=t, this.contexts=[], this.children=[], this.treatAsRealStackingContext=r;}return function(A,e,t){e&&Le(A.prototype,e);}(A,[{key:"getOpacity",value:function(){return this.parent?this.container.style.opacity*this.parent.getOpacity():this.container.style.opacity}},{key:"getRealParentStackingContext",value:function(){return!this.parent||this.treatAsRealStackingContext?this:this.parent.getRealParentStackingContext()}}]), A}(),xe=["SCRIPT","HEAD","TITLE","OBJECT","BR","OPTION"],Ve=function(A,e){return A.isRootElement()||A.isPositionedWithZIndex()||A.style.opacity<1||A.isTransformed()||Je(A,e)},ke=function(A){return A.isPositioned()||A.isFloating()},Je=function(A,e){return"BODY"===e.nodeName&&A.parent instanceof Xe&&A.parent.style.background.backgroundColor.isTransparent()};function Re(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var _e=function(){function A(e){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this._data={}, this._document=e;}return function(A,e,t){e&&Re(A.prototype,e);}(A,[{key:"_parseMetrics",value:function(A){var e=this._document.createElement("div"),t=this._document.createElement("img"),r=this._document.createElement("span"),n=this._document.body;if(!n)throw new Error("");e.style.visibility="hidden", e.style.fontFamily=A.fontFamily, e.style.fontSize=A.fontSize, e.style.margin="0", e.style.padding="0", n.appendChild(e), t.src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", t.width=1, t.height=1, t.style.margin="0", t.style.padding="0", t.style.verticalAlign="baseline", r.style.fontFamily=A.fontFamily, r.style.fontSize=A.fontSize, r.style.margin="0", r.style.padding="0", r.appendChild(this._document.createTextNode("Hidden Text")), e.appendChild(r), e.appendChild(t);var B=t.offsetTop-r.offsetTop+2;e.removeChild(r), e.appendChild(this._document.createTextNode("Hidden Text")), e.style.lineHeight="normal", t.style.verticalAlign="super";var s=t.offsetTop-e.offsetTop+2;return n.removeChild(e), {baseline:B,middle:s}}},{key:"getMetrics",value:function(A){var e="".concat(A.fontFamily," ").concat(A.fontSize);return void 0===this._data[e]&&(this._data[e]=this._parseMetrics(A)), this._data[e]}}]), A}(),Pe=/([+-]?\d*\.?\d+)(deg|grad|rad|turn)/i;function Ge(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}var We=/^(to )?(left|top|right|bottom)( (left|top|right|bottom))?$/i,Ye=/^([+-]?\d*\.?\d+)% ([+-]?\d*\.?\d+)%$/i,qe=/(px)|%|( 0)$/i,je=/^(from|to|color-stop)\((?:([\d.]+)(%)?,\s*)?(.+?)\)$/i,Ze=/^\s*(circle|ellipse)?\s*((?:([\d.]+)(px|r?em|%)\s*(?:([\d.]+)(px|r?em|%))?)|closest-side|closest-corner|farthest-side|farthest-corner)?\s*(?:at\s*(?:(left|center|right)|([\d.]+)(px|r?em|%))\s+(?:(top|center|bottom)|([\d.]+)(px|r?em|%)))?(?:\s|$)/i,$e={left:new v("0%"),top:new v("0%"),center:new v("50%"),right:new v("100%"),bottom:new v("100%")},At=function(A,e,t){for(var r=[],n=e;n<A.length;n++){var B=A[n],s=qe.test(B),o=B.lastIndexOf(" "),a=new U(s?B.substring(0,o):B),i=s?new v(B.substring(o+1)):n===e?new v("0%"):n===A.length-1?new v("100%"):null;r.push({color:a,stop:i});}for(var c=r.map(function(A){var e=A.color,r=A.stop;return{color:e,stop:0===t?0:r?r.getAbsoluteValue(t)/t:null}}),Q=c[0].stop,l=0;l<c.length;l++)if(null!==Q){var w=c[l].stop;if(null===w){for(var u=l;null===c[u].stop;)u++;for(var g=u-l+1,F=(c[u].stop-Q)/g;l<u;l++)Q=c[l].stop=Q+F;}else Q=w;}return c},et=function(A,e,t){var r=function(A){var e=A.match(Pe);if(e){var t=parseFloat(e[1]);switch(e[2].toLowerCase()){case"deg":return Math.PI*t/180;case"grad":return Math.PI/200*t;case"rad":return t;case"turn":return 2*Math.PI*t}}return null}(A[0]),n=We.test(A[0]),B=n||null!==r||Ye.test(A[0]),s=B?null!==r?rt(t?r-.5*Math.PI:r,e):n?Bt(A[0],e):st(A[0],e):rt(Math.PI,e),o=B?1:0,a=Math.min(m(Math.abs(s.x0)+Math.abs(s.x1),Math.abs(s.y0)+Math.abs(s.y1)),2*e.width,2*e.height);return new function A(e,t){Ge(this,A), this.type=0, this.colorStops=e, this.direction=t;}(At(A,o,a),s)},tt=function(A,e,t){var r=e[0].match(Ze),n=r&&("circle"===r[1]||void 0!==r[3]&&void 0===r[5])?0:1,B={},s={};r&&(void 0!==r[3]&&(B.x=I(A,r[3],r[4]).getAbsoluteValue(t.width)), void 0!==r[5]&&(B.y=I(A,r[5],r[6]).getAbsoluteValue(t.height)), r[7]?s.x=$e[r[7].toLowerCase()]:void 0!==r[8]&&(s.x=I(A,r[8],r[9])), r[10]?s.y=$e[r[10].toLowerCase()]:void 0!==r[11]&&(s.y=I(A,r[11],r[12])));var o={x:void 0===s.x?t.width/2:s.x.getAbsoluteValue(t.width),y:void 0===s.y?t.height/2:s.y.getAbsoluteValue(t.height)},a=at(r&&r[2]||"farthest-corner",n,o,B,t);return new function A(e,t,r,n){Ge(this,A), this.type=1, this.colorStops=e, this.shape=t, this.center=r, this.radius=n;}(At(e,r?1:0,Math.min(a.x,a.y)),n,o,a)},rt=function(A,e){var t=e.width,r=e.height,n=.5*t,B=.5*r,s=(Math.abs(t*Math.sin(A))+Math.abs(r*Math.cos(A)))/2,o=n+Math.sin(A)*s,a=B-Math.cos(A)*s;return{x0:o,x1:t-o,y0:a,y1:r-a}},nt=function(A){return Math.acos(A.width/2/(m(A.width,A.height)/2))},Bt=function(A,e){switch(A){case"bottom":case"to top":return rt(0,e);case"left":case"to right":return rt(Math.PI/2,e);case"right":case"to left":return rt(3*Math.PI/2,e);case"top right":case"right top":case"to bottom left":case"to left bottom":return rt(Math.PI+nt(e),e);case"top left":case"left top":case"to bottom right":case"to right bottom":return rt(Math.PI-nt(e),e);case"bottom left":case"left bottom":case"to top right":case"to right top":return rt(nt(e),e);case"bottom right":case"right bottom":case"to top left":case"to left top":return rt(2*Math.PI-nt(e),e);case"top":case"to bottom":default:return rt(Math.PI,e)}},st=function(A,e){var t=function(A,e){return function(A){if(Array.isArray(A))return A}(A)||function(A,e){var t=[],r=!0,n=!1,B=void 0;try{for(var s,o=A[Symbol.iterator]();!(r=(s=o.next()).done)&&(t.push(s.value), !e||t.length!==e);r=!0);}catch(A){n=!0, B=A;}finally{try{r||null==o.return||o.return();}finally{if(n)throw B}}return t}(A,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(A.split(" ").map(parseFloat),2),r=t[0],n=t[1],B=r/100*e.width/(n/100*e.height);return rt(Math.atan(isNaN(B)?1:B)+Math.PI/2,e)},ot=function(A,e,t,r){return[{x:0,y:0},{x:0,y:A.height},{x:A.width,y:0},{x:A.width,y:A.height}].reduce(function(A,n){var B=m(e-n.x,t-n.y);return(r?B<A.optimumDistance:B>A.optimumDistance)?{optimumCorner:n,optimumDistance:B}:A},{optimumDistance:r?1/0:-1/0,optimumCorner:null}).optimumCorner},at=function(A,e,t,r,n){var B=t.x,s=t.y,o=0,a=0;switch(A){case"closest-side":0===e?o=a=Math.min(Math.abs(B),Math.abs(B-n.width),Math.abs(s),Math.abs(s-n.height)):1===e&&(o=Math.min(Math.abs(B),Math.abs(B-n.width)), a=Math.min(Math.abs(s),Math.abs(s-n.height)));break;case"closest-corner":if(0===e)o=a=Math.min(m(B,s),m(B,s-n.height),m(B-n.width,s),m(B-n.width,s-n.height));else if(1===e){var i=Math.min(Math.abs(s),Math.abs(s-n.height))/Math.min(Math.abs(B),Math.abs(B-n.width)),c=ot(n,B,s,!0);a=i*(o=m(c.x-B,(c.y-s)/i));}break;case"farthest-side":0===e?o=a=Math.max(Math.abs(B),Math.abs(B-n.width),Math.abs(s),Math.abs(s-n.height)):1===e&&(o=Math.max(Math.abs(B),Math.abs(B-n.width)), a=Math.max(Math.abs(s),Math.abs(s-n.height)));break;case"farthest-corner":if(0===e)o=a=Math.max(m(B,s),m(B,s-n.height),m(B-n.width,s),m(B-n.width,s-n.height));else if(1===e){var Q=Math.max(Math.abs(s),Math.abs(s-n.height))/Math.max(Math.abs(B),Math.abs(B-n.width)),l=ot(n,B,s,!1);a=Q*(o=m(l.x-B,(l.y-s)/Q));}break;default:o=r.x||0, a=void 0!==r.y?r.y:o;}return{x:o,y:a}},it=function(A){var e="",t="",r="",n="",B=0,s=/^(left|center|right|\d+(?:px|r?em|%)?)(?:\s+(top|center|bottom|\d+(?:px|r?em|%)?))?$/i,o=/^\d+(px|r?em|%)?(?:\s+\d+(px|r?em|%)?)?$/i,a=A[B].match(s);a&&B++;var i=A[B].match(/^(circle|ellipse)?\s*(closest-side|closest-corner|farthest-side|farthest-corner|contain|cover)?$/i);i&&(e=i[1]||"", "contain"===(r=i[2]||"")?r="closest-side":"cover"===r&&(r="farthest-corner"), B++);var c=A[B].match(o);c&&B++;var Q=A[B].match(s);Q&&B++;var l=A[B].match(o);l&&B++;var w=Q||a;w&&w[1]&&(n=w[1]+(/^\d+$/.test(w[1])?"px":""), w[2]&&(n+=" "+w[2]+(/^\d+$/.test(w[2])?"px":"")));var u=l||c;return u&&(t=u[0], u[1]||(t+="px")), !n||e||t||r||(t=n, n=""), n&&(n="at ".concat(n)), [[e,r,t,n].filter(function(A){return!!A}).join(" ")].concat(A.slice(B))},ct=function(A){return A.map(function(A){return A.match(je)}).map(function(e,t){if(!e)return A[t];switch(e[1]){case"from":return"".concat(e[4]," 0%");case"to":return"".concat(e[4]," 100%");case"color-stop":return"%"===e[3]?"".concat(e[4]," ").concat(e[2]):"".concat(e[4]," ").concat(100*parseFloat(e[2]),"%")}})};function Qt(A,e){return function(A){if(Array.isArray(A))return A}(A)||function(A,e){var t=[],r=!0,n=!1,B=void 0;try{for(var s,o=A[Symbol.iterator]();!(r=(s=o.next()).done)&&(t.push(s.value), !e||t.length!==e);r=!0);}catch(A){n=!0, B=A;}finally{try{r||null==o.return||o.return();}finally{if(n)throw B}}return t}(A,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function lt(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var wt=function(){function A(e,t){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.target=e, this.options=t, e.render(t);}return function(A,e,t){e&&lt(A.prototype,e);}(A,[{key:"renderNode",value:function(A){A.isVisible()&&(this.renderNodeBackgroundAndBorders(A), this.renderNodeContent(A));}},{key:"renderNodeContent",value:function(A){var e=this,t=function(){if(A.childNodes.length&&A.childNodes.forEach(function(t){if(t instanceof jA){var r=t.parent.style;e.target.renderTextNode(t.bounds,r.color,r.font,r.textDecoration,r.textShadow);}else e.target.drawShape(t,A.style.color);}), A.image){var t=e.options.imageStore.get(A.image);if(t){var r=function(A,e,t){var r=e[0].value,n=e[1].value,B=e[2].value,s=e[3].value;return new L(A.left+s+t[3].borderWidth,A.top+r+t[0].borderWidth,A.width-(t[1].borderWidth+t[3].borderWidth+s+n),A.height-(t[0].borderWidth+t[2].borderWidth+r+B))}(A.bounds,A.style.padding,A.style.border),n="number"==typeof t.width&&t.width>0?t.width:r.width,B="number"==typeof t.height&&t.height>0?t.height:r.height;n>0&&B>0&&e.target.clip([k(A.curvedBounds)],function(){e.target.drawImage(t,new L(0,0,n,B),r);});}}},r=A.getClipPaths();r.length?this.target.clip(r,t):t();}},{key:"renderNodeBackgroundAndBorders",value:function(A){var e=this,t=!A.style.background.backgroundColor.isTransparent()||A.style.background.backgroundImage.length,r=A.style.border.some(function(A){return 0!==A.borderStyle&&!A.borderColor.isTransparent()}),n=function(){var r=function(A,e){switch(e){case W.BORDER_BOX:return function(A){return[A.topLeftOuter,A.topRightOuter,A.bottomRightOuter,A.bottomLeftOuter]}(A);case W.PADDING_BOX:default:return k(A)}}(A.curvedBounds,A.style.background.backgroundClip);t&&e.target.clip([r],function(){A.style.background.backgroundColor.isTransparent()||e.target.fill(A.style.background.backgroundColor), e.renderBackgroundImage(A);}), A.style.border.forEach(function(t,r){0===t.borderStyle||t.borderColor.isTransparent()||e.renderBorder(t,r,A.curvedBounds);});};if(t||r){var B=A.parent?A.parent.getClipPaths():[];B.length?this.target.clip(B,n):n();}}},{key:"renderBackgroundImage",value:function(A){var e=this;A.style.background.backgroundImage.slice(0).reverse().forEach(function(t){"url"===t.source.method&&t.source.args.length?e.renderBackgroundRepeat(A,t):/gradient/i.test(t.source.method)&&e.renderBackgroundGradient(A,t);});}},{key:"renderBackgroundRepeat",value:function(A,e){var t=this.options.imageStore.get(e.source.args[0]);if(t){var r=Z(A.style.background.backgroundOrigin,A.bounds,A.style.padding,A.style.border),n=function(A,e,t){var r=0,n=0,B=A.size;if(1===B[0].size||2===B[0].size){var s=t.width/t.height,o=e.width/e.height;return s<o!=(2===B[0].size)?new D(t.width,t.width/o):new D(t.height*o,t.height)}return B[0].value&&(r=B[0].value.getAbsoluteValue(t.width)), 0===B[0].size&&0===B[1].size?n=e.height:0===B[1].size?n=r/e.width*e.height:B[1].value&&(n=B[1].value.getAbsoluteValue(t.height)), 0===B[0].size&&(r=n/e.height*e.width), new D(r,n)}(e,t,r),B=$(e.position,n,r),s=function(A,e,t,r,n){switch(A.repeat){case 2:return[new M(Math.round(n.left),Math.round(r.top+e.y)),new M(Math.round(n.left+n.width),Math.round(r.top+e.y)),new M(Math.round(n.left+n.width),Math.round(t.height+r.top+e.y)),new M(Math.round(n.left),Math.round(t.height+r.top+e.y))];case 3:return[new M(Math.round(r.left+e.x),Math.round(n.top)),new M(Math.round(r.left+e.x+t.width),Math.round(n.top)),new M(Math.round(r.left+e.x+t.width),Math.round(n.height+n.top)),new M(Math.round(r.left+e.x),Math.round(n.height+n.top))];case 1:return[new M(Math.round(r.left+e.x),Math.round(r.top+e.y)),new M(Math.round(r.left+e.x+t.width),Math.round(r.top+e.y)),new M(Math.round(r.left+e.x+t.width),Math.round(r.top+e.y+t.height)),new M(Math.round(r.left+e.x),Math.round(r.top+e.y+t.height))];default:return[new M(Math.round(n.left),Math.round(n.top)),new M(Math.round(n.left+n.width),Math.round(n.top)),new M(Math.round(n.left+n.width),Math.round(n.height+n.top)),new M(Math.round(n.left),Math.round(n.height+n.top))]}}(e,B,n,r,A.bounds),o=Math.round(r.left+B.x),a=Math.round(r.top+B.y);this.target.renderRepeat(s,t,n,o,a);}}},{key:"renderBackgroundGradient",value:function(A,e){var t=Z(A.style.background.backgroundOrigin,A.bounds,A.style.padding,A.style.border),r=function(A,e){var t=A.size,r=t[0].value?t[0].value.getAbsoluteValue(e.width):e.width,n=t[1].value?t[1].value.getAbsoluteValue(e.height):t[0].value?r:e.height;return new D(r,n)}(e,t),n=$(e.position,r,t),B=new L(Math.round(t.left+n.x),Math.round(t.top+n.y),r.width,r.height),s=function(A,e,t){var r=e.args,n=e.method,B=e.prefix;return"linear-gradient"===n?et(r,t,!!B):"gradient"===n&&"linear"===r[0]?et(["to bottom"].concat(ct(r.slice(3))),t,!!B):"radial-gradient"===n?tt(A,"-webkit-"===B?it(r):r,t):"gradient"===n&&"radial"===r[0]?tt(A,ct(it(r.slice(1))),t):void 0}(A,e.source,B);if(s)switch(s.type){case 0:this.target.renderLinearGradient(B,s);break;case 1:this.target.renderRadialGradient(B,s);}}},{key:"renderBorder",value:function(A,e,t){this.target.drawShape(function(A,e){switch(e){case 0:return V(A.topLeftOuter,A.topLeftInner,A.topRightOuter,A.topRightInner);case 1:return V(A.topRightOuter,A.topRightInner,A.bottomRightOuter,A.bottomRightInner);case 2:return V(A.bottomRightOuter,A.bottomRightInner,A.bottomLeftOuter,A.bottomLeftInner);case 3:default:return V(A.bottomLeftOuter,A.bottomLeftInner,A.topLeftOuter,A.topLeftInner)}}(t,e),A.borderColor);}},{key:"renderStack",value:function(A){var e=this;if(A.container.isVisible()){var t=A.getOpacity();t!==this._opacity&&(this.target.setOpacity(A.getOpacity()), this._opacity=t);var r=A.container.style.transform;null!==r?this.target.transform(A.container.bounds.left+r.transformOrigin[0].value,A.container.bounds.top+r.transformOrigin[1].value,r.transform,function(){return e.renderStackContent(A)}):this.renderStackContent(A);}}},{key:"renderStackContent",value:function(A){var e=Qt(Ut(A),5),t=e[0],r=e[1],n=e[2],B=e[3],s=e[4],o=Qt(ut(A),2),a=o[0],i=o[1];this.renderNodeBackgroundAndBorders(A.container), t.sort(gt).forEach(this.renderStack,this), this.renderNodeContent(A.container), i.forEach(this.renderNode,this), B.forEach(this.renderStack,this), s.forEach(this.renderStack,this), a.forEach(this.renderNode,this), r.forEach(this.renderStack,this), n.sort(gt).forEach(this.renderStack,this);}},{key:"render",value:function(A){return this.options.backgroundColor&&this.target.rectangle(this.options.x,this.options.y,this.options.width,this.options.height,this.options.backgroundColor), this.renderStack(A), this.target.getTarget()}}]), A}(),ut=function(A){for(var e=[],t=[],r=A.children.length,n=0;n<r;n++){var B=A.children[n];B.isInlineLevel()?e.push(B):t.push(B);}return[e,t]},Ut=function(A){for(var e=[],t=[],r=[],n=[],B=[],s=A.contexts.length,o=0;o<s;o++){var a=A.contexts[o];a.container.isPositioned()||a.container.style.opacity<1||a.container.isTransformed()?a.container.style.zIndex.order<0?e.push(a):a.container.style.zIndex.order>0?r.push(a):t.push(a):a.container.isFloating()?n.push(a):B.push(a);}return[e,t,r,n,B]},gt=function(A,e){return A.container.style.zIndex.order>e.container.style.zIndex.order?1:A.container.style.zIndex.order<e.container.style.zIndex.order?-1:A.container.index>e.container.index?1:-1},Ft=function(A,e){if(!e.proxy)return Promise.reject(null);var t=e.proxy;return new Promise(function(r,n){var B=_A.SUPPORT_CORS_XHR&&_A.SUPPORT_RESPONSE_TYPE?"blob":"text",s=_A.SUPPORT_CORS_XHR?new XMLHttpRequest:new XDomainRequest;if(s.onload=function(){if(s instanceof XMLHttpRequest)if(200===s.status)if("text"===B)r(s.response);else{var A=new FileReader;A.addEventListener("load",function(){return r(A.result)},!1), A.addEventListener("error",function(A){return n(A)},!1), A.readAsDataURL(s.response);}else n("");else r(s.responseText);}, s.onerror=n, s.open("GET","".concat(t,"?url=").concat(encodeURIComponent(A),"&responseType=").concat(B)), "text"!==B&&s instanceof XMLHttpRequest&&(s.responseType=B), e.imageTimeout){var o=e.imageTimeout;s.timeout=o, s.ontimeout=function(){return n("")};}s.send();})};function Ct(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}function ht(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}function dt(A,e,t){return e&&ht(A.prototype,e), t&&ht(A,t), A}var Ht=function(){function A(e,t,r){Ct(this,A), this.options=e, this._window=r, this.origin=this.getOrigin(r.location.href), this.cache={}, this.logger=t, this._index=0;}return dt(A,[{key:"loadImage",value:function(A){var e=this;if(this.hasResourceInCache(A))return A;if(Nt(A))return this.cache[A]=vt(A,this.options.imageTimeout||0), A;if(!yt(A)||_A.SUPPORT_SVG_DRAWING){if(!0===this.options.allowTaint||mt(A)||this.isSameOrigin(A))return this.addImage(A,A,!1);if(!this.isSameOrigin(A)){if("string"==typeof this.options.proxy)return this.cache[A]=Ft(A,this.options).then(function(A){return vt(A,e.options.imageTimeout||0)}), A;if(!0===this.options.useCORS&&_A.SUPPORT_CORS_IMAGES)return this.addImage(A,A,!0)}}}},{key:"inlineImage",value:function(A){var e=this;return mt(A)?vt(A,this.options.imageTimeout||0):this.hasResourceInCache(A)?this.cache[A]:this.isSameOrigin(A)||"string"!=typeof this.options.proxy?this.xhrImage(A):this.cache[A]=Ft(A,this.options).then(function(A){return vt(A,e.options.imageTimeout||0)})}},{key:"xhrImage",value:function(A){var e=this;return this.cache[A]=new Promise(function(t,r){var n=new XMLHttpRequest;if(n.onreadystatechange=function(){if(4===n.readyState)if(200!==n.status)r("Failed to fetch image ".concat(A.substring(0,256)," with status code ").concat(n.status));else{var e=new FileReader;e.addEventListener("load",function(){var A=e.result;t(A);},!1), e.addEventListener("error",function(A){return r(A)},!1), e.readAsDataURL(n.response);}}, n.responseType="blob", e.options.imageTimeout){var B=e.options.imageTimeout;n.timeout=B, n.ontimeout=function(){return r("")};}n.open("GET",A,!0), n.send();}).then(function(A){return vt(A,e.options.imageTimeout||0)}), this.cache[A]}},{key:"loadCanvas",value:function(A){var e=String(this._index++);return this.cache[e]=Promise.resolve(A), e}},{key:"hasResourceInCache",value:function(A){return void 0!==this.cache[A]}},{key:"addImage",value:function(A,e,t){var r=this;return this.cache[A]=new Promise(function(A,n){var B=new Image;if(B.onload=function(){return A(B)}, (bt(e)||t)&&(B.crossOrigin="anonymous"), B.onerror=n, B.src=e, !0===B.complete&&setTimeout(function(){A(B);},500), r.options.imageTimeout){var s=r.options.imageTimeout;setTimeout(function(){return n("")},s);}}), A}},{key:"isSameOrigin",value:function(A){return this.getOrigin(A)===this.origin}},{key:"getOrigin",value:function(A){var e=this._link||(this._link=this._window.document.createElement("a"));return e.href=A, e.href=e.href, e.protocol+e.hostname+e.port}},{key:"ready",value:function(){var A=this,e=Object.keys(this.cache),t=e.map(function(e){return A.cache[e].catch(function(A){return null})});return Promise.all(t).then(function(A){return new ft(e,A)})}}]), A}(),ft=function(){function A(e,t){Ct(this,A), this._keys=e, this._resources=t;}return dt(A,[{key:"get",value:function(A){var e=this._keys.indexOf(A);return-1===e?null:this._resources[e]}}]), A}(),Et=/^data:image\/svg\+xml/i,pt=/^data:image\/.*;base64,/i,Kt=/^data:image\/.*/i,mt=function(A){return Kt.test(A)},bt=function(A){return pt.test(A)},Nt=function(A){return"blob"===A.substr(0,4)},yt=function(A){return"svg"===A.substr(-3).toLowerCase()||Et.test(A)},vt=function(A,e){return new Promise(function(t,r){var n=new Image;n.onload=function(){return t(n)}, n.onerror=r, n.src=A, !0===n.complete&&setTimeout(function(){t(n);},500), e&&setTimeout(function(){return r("")},e);})};function It(A,e){return function(A){if(Array.isArray(A))return A}(A)||function(A,e){var t=[],r=!0,n=!1,B=void 0;try{for(var s,o=A[Symbol.iterator]();!(r=(s=o.next()).done)&&(t.push(s.value), !e||t.length!==e);r=!0);}catch(A){n=!0, B=A;}finally{try{r||null==o.return||o.return();}finally{if(n)throw B}}return t}(A,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var Dt=function(A,e,t){if(!e||!e.content||"none"===e.content||"-moz-alt-content"===e.content||"none"===e.display)return null;var r=Mt(e.content),n=r.length,B=[],s="",o=e.counterIncrement;if(o&&"none"!==o){var a=It(o.split(/\s+/),2),i=a[0],c=a[1],Q=t.counters[i];Q&&(Q[Q.length-1]+=void 0===c?1:parseInt(c,10));}for(var l=0;l<n;l++){var w=r[l];switch(w.type){case 0:s+=w.value||"";break;case 1:A instanceof HTMLElement&&w.value&&(s+=A.getAttribute(w.value)||"");break;case 3:var u=t.counters[w.name||""];u&&(s+=Xt([u[u.length-1]],"",w.format));break;case 4:var U=t.counters[w.name||""];U&&(s+=Xt(U,w.glue,w.format));break;case 5:s+=St(e,!0,t.quoteDepth), t.quoteDepth++;break;case 6:t.quoteDepth--, s+=St(e,!1,t.quoteDepth);break;case 2:s&&(B.push({type:0,value:s}), s=""), B.push({type:1,value:w.value||""});}}return s&&B.push({type:0,value:s}), B},Mt=function(A,e){if(e&&e[A])return e[A];for(var t=[],r=A.length,n=!1,B=!1,s=!1,o="",a="",i=[],c=0;c<r;c++){var Q=A.charAt(c);switch(Q){case"'":case'"':B?o+=Q:(n=!n, s||n||(t.push({type:0,value:o}), o=""));break;case"\\":B?(o+=Q, B=!1):B=!0;break;case"(":n?o+=Q:(s=!0, a=o, o="", i=[]);break;case")":if(n)o+=Q;else if(s){switch(o&&i.push(o), a){case"attr":i.length>0&&t.push({type:1,value:i[0]});break;case"counter":if(i.length>0){var l={type:3,name:i[0]};i.length>1&&(l.format=i[1]), t.push(l);}break;case"counters":if(i.length>0){var w={type:4,name:i[0]};i.length>1&&(w.glue=i[1]), i.length>2&&(w.format=i[2]), t.push(w);}break;case"url":i.length>0&&t.push({type:2,value:i[0]});}s=!1, o="";}break;case",":n?o+=Q:s&&(i.push(o), o="");break;case" ":case"\t":n?o+=Q:o&&(Tt(t,o), o="");break;default:o+=Q;}"\\"!==Q&&(B=!1);}return o&&Tt(t,o), e&&(e[A]=t), t},Tt=function(A,e){switch(e){case"open-quote":A.push({type:5});break;case"close-quote":A.push({type:6});}},St=function(A,e,t){var r=A.quotes?A.quotes.split(/\s+/):["'\"'","'\"'"],n=2*t;return n>=r.length&&(n=r.length-2), e||++n, r[n].replace(/^["']|["']$/g,"")},Xt=function(A,e,t){for(var r=A.length,n="",B=0;B<r;B++)B>0&&(n+=e||""), n+=Me(A[B],CA(t||"decimal"),!1);return n};function zt(A,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1, r.configurable=!0, "value"in r&&(r.writable=!0), Object.defineProperty(A,r.key,r);}}var Lt=function(){function A(e,t,r,n,B){!function(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}(this,A), this.referenceElement=e, this.scrolledElements=[], this.copyStyles=n, this.inlineImages=n, this.logger=r, this.options=t, this.renderer=B, this.resourceLoader=new Ht(t,r,window), this.pseudoContentData={counters:{},quoteDepth:0}, this.documentElement=this.cloneNode(e.ownerDocument.documentElement);}return function(A,e,t){e&&zt(A.prototype,e);}(A,[{key:"inlineAllImages",value:function(A){var e=this;if(this.inlineImages&&A){var t=A.style;Promise.all(sA(t.backgroundImage).map(function(A){return"url"===A.method?e.resourceLoader.inlineImage(A.args[0]).then(function(A){return A&&"string"==typeof A.src?'url("'.concat(A.src,'")'):"none"}).catch(function(A){}):Promise.resolve("".concat(A.prefix).concat(A.method,"(").concat(A.args.join(","),")"))})).then(function(A){A.length>1&&(t.backgroundColor=""), t.backgroundImage=A.join(",");}), A instanceof HTMLImageElement&&this.resourceLoader.inlineImage(A.src).then(function(e){if(e&&A instanceof HTMLImageElement&&A.parentNode){var t=A.parentNode,r=b(A.style,e.cloneNode(!1));t.replaceChild(r,A);}}).catch(function(A){});}}},{key:"inlineFonts",value:function(A){var e=this;return Promise.all(Array.from(A.styleSheets).map(function(e){return e.href?fetch(e.href).then(function(A){return A.text()}).then(function(A){return xt(A,e.href)}).catch(function(A){return[]}):Ot(e,A)})).then(function(A){return A.reduce(function(A,e){return A.concat(e)},[])}).then(function(A){return Promise.all(A.map(function(A){return fetch(A.formats[0].src).then(function(A){return A.blob()}).then(function(A){return new Promise(function(e,t){var r=new FileReader;r.onerror=t, r.onload=function(){var A=r.result;e(A);}, r.readAsDataURL(A);})}).then(function(e){return A.fontFace.setProperty("src",'url("'.concat(e,'")')), "@font-face {".concat(A.fontFace.cssText," ")})}))}).then(function(t){var r=A.createElement("style");r.textContent=t.join("\n"), e.documentElement.appendChild(r);})}},{key:"createElementClone",value:function(A){var e=this;if(this.copyStyles&&A instanceof HTMLCanvasElement){var t=A.ownerDocument.createElement("img");try{return t.src=A.toDataURL(), t}catch(A){}}if(A instanceof HTMLIFrameElement){var r=A.cloneNode(!1),n=qt();r.setAttribute("data-html2canvas-internal-iframe-key",n);var B=O(A,0,0),s=B.width,o=B.height;return this.resourceLoader.cache[n]=Zt(A,this.options).then(function(A){return e.renderer(A,{allowTaint:e.options.allowTaint,backgroundColor:"#ffffff",canvas:null,imageTimeout:e.options.imageTimeout,logging:e.options.logging,proxy:e.options.proxy,removeContainer:e.options.removeContainer,scale:e.options.scale,foreignObjectRendering:e.options.foreignObjectRendering,useCORS:e.options.useCORS,target:new f,width:s,height:o,x:0,y:0,windowWidth:A.ownerDocument.defaultView.innerWidth,windowHeight:A.ownerDocument.defaultView.innerHeight,scrollX:A.ownerDocument.defaultView.pageXOffset,scrollY:A.ownerDocument.defaultView.pageYOffset},e.logger.child(n))}).then(function(e){return new Promise(function(t,n){var B=document.createElement("img");B.onload=function(){return t(e)}, B.onerror=function(A){"data:,"==B.src?t(e):n(A);}, B.src=e.toDataURL(), r.parentNode&&r.parentNode.replaceChild(b(A.ownerDocument.defaultView.getComputedStyle(A),B),r);})}), r}try{if(A instanceof HTMLStyleElement&&A.sheet&&A.sheet.cssRules){var a=[].slice.call(A.sheet.cssRules,0).reduce(function(A,e){return e&&e.cssText?A+e.cssText:A},""),i=A.cloneNode(!1);return i.textContent=a, i}}catch(A){if(this.logger.log("Unable to access cssRules property"), "SecurityError"!==A.name)throw this.logger.log(A), A}return A.cloneNode(!1)}},{key:"cloneNode",value:function(A){var e=A.nodeType===Node.TEXT_NODE?document.createTextNode(A.nodeValue):this.createElementClone(A),t=A.ownerDocument.defaultView,r=A instanceof t.HTMLElement?t.getComputedStyle(A):null,n=A instanceof t.HTMLElement?t.getComputedStyle(A,":before"):null,B=A instanceof t.HTMLElement?t.getComputedStyle(A,":after"):null;this.referenceElement===A&&e instanceof t.HTMLElement&&(this.clonedReferenceElement=e), e instanceof t.HTMLBodyElement&&Gt(e);for(var s=function(A,e){if(!A||!A.counterReset||"none"===A.counterReset)return[];for(var t=[],r=A.counterReset.split(/\s*,\s*/),n=r.length,B=0;B<n;B++){var s=It(r[B].split(/\s+/),2),o=s[0],a=s[1];t.push(o);var i=e.counters[o];i||(i=e.counters[o]=[]), i.push(parseInt(a||0,10));}return t}(r,this.pseudoContentData),o=Dt(A,n,this.pseudoContentData),a=A.firstChild;a;a=a.nextSibling)a.nodeType===Node.ELEMENT_NODE&&("SCRIPT"===a.nodeName||a.hasAttribute("data-html2canvas-ignore")||"function"==typeof this.options.ignoreElements&&this.options.ignoreElements(a))||this.copyStyles&&"STYLE"===a.nodeName||e.appendChild(this.cloneNode(a));var i=Dt(A,B,this.pseudoContentData);if(function(A,e){for(var t=A.length,r=0;r<t;r++)e.counters[A[r]].pop();}(s,this.pseudoContentData), A instanceof t.HTMLElement&&e instanceof t.HTMLElement)switch(n&&this.inlineAllImages(kt(A,e,n,o,Jt)), B&&this.inlineAllImages(kt(A,e,B,i,Rt)), !r||!this.copyStyles||A instanceof HTMLIFrameElement||b(r,e), this.inlineAllImages(e), 0===A.scrollTop&&0===A.scrollLeft||this.scrolledElements.push([e,A.scrollLeft,A.scrollTop]), A.nodeName){case"CANVAS":this.copyStyles||Vt(A,e);break;case"TEXTAREA":case"SELECT":e.value=A.value;}return e}}]), A}(),Ot=function(A,e){return(A.cssRules?Array.from(A.cssRules):[]).filter(function(A){return A.type===CSSRule.FONT_FACE_RULE}).map(function(A){for(var t=sA(A.style.getPropertyValue("src")),r=[],n=0;n<t.length;n++)if("url"===t[n].method&&t[n+1]&&"format"===t[n+1].method){var B=e.createElement("a");B.href=t[n].args[0], e.body&&e.body.appendChild(B);var s={src:B.href,format:t[n+1].args[0]};r.push(s);}return{formats:r.filter(function(A){return/^woff/i.test(A.format)}),fontFace:A.style}}).filter(function(A){return A.formats.length})},xt=function(A,e){var t=document.implementation.createHTMLDocument(""),r=document.createElement("base");r.href=e;var n=document.createElement("style");return n.textContent=A, t.head&&t.head.appendChild(r), t.body&&t.body.appendChild(n), n.sheet?Ot(n.sheet,t):[]},Vt=function(A,e){try{if(e){e.width=A.width, e.height=A.height;var t=A.getContext("2d"),r=e.getContext("2d");t?r.putImageData(t.getImageData(0,0,A.width,A.height),0,0):r.drawImage(A,0,0);}}catch(A){}},kt=function(A,e,t,r,n){if(t&&t.content&&"none"!==t.content&&"-moz-alt-content"!==t.content&&"none"!==t.display){var B=e.ownerDocument.createElement("html2canvaspseudoelement");if(b(t,B), r)for(var s=r.length,o=0;o<s;o++){var a=r[o];switch(a.type){case 1:var i=e.ownerDocument.createElement("img");i.src=sA("url(".concat(a.value,")"))[0].args[0], i.style.opacity="1", B.appendChild(i);break;case 0:B.appendChild(e.ownerDocument.createTextNode(a.value));}}return B.className="".concat(_t," ").concat(Pt), e.className+=" ".concat(n===Jt?_t:Pt), n===Jt?e.insertBefore(B,e.firstChild):e.appendChild(B), B}},Jt=":before",Rt=":after",_t="___html2canvas___pseudoelement_before",Pt="___html2canvas___pseudoelement_after",Gt=function(A){Wt(A,".".concat(_t).concat(Jt).concat('{\n    content: "" !important;\n    display: none !important;\n}',"\n         .").concat(Pt).concat(Rt).concat('{\n    content: "" !important;\n    display: none !important;\n}'));},Wt=function(A,e){var t=A.ownerDocument.createElement("style");t.innerHTML=e, A.appendChild(t);},Yt=function(A){var e=function(A,e){return function(A){if(Array.isArray(A))return A}(A)||function(A,e){var t=[],r=!0,n=!1,B=void 0;try{for(var s,o=A[Symbol.iterator]();!(r=(s=o.next()).done)&&(t.push(s.value), !e||t.length!==e);r=!0);}catch(A){n=!0, B=A;}finally{try{r||null==o.return||o.return();}finally{if(n)throw B}}return t}(A,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(A,3),t=e[0],r=e[1],n=e[2];t.scrollLeft=r, t.scrollTop=n;},qt=function(){return Math.ceil(Date.now()+1e7*Math.random()).toString(16)},jt=/^data:text\/(.+);(base64)?,(.*)$/i,Zt=function(A,e){try{return Promise.resolve(A.contentWindow.document.documentElement)}catch(t){return e.proxy?Ft(A.src,e).then(function(A){var e=A.match(jt);return e?"base64"===e[2]?window.atob(decodeURIComponent(e[3])):decodeURIComponent(e[3]):Promise.reject()}).then(function(e){return $t(A.ownerDocument,O(A,0,0)).then(function(A){var t=A.contentWindow.document;t.open(), t.write(e);var r=Ar(A).then(function(){return t.documentElement});return t.close(), r})}):Promise.reject()}},$t=function(A,e){var t=A.createElement("iframe");return t.className="html2canvas-container", t.style.visibility="hidden", t.style.position="fixed", t.style.left="-10000px", t.style.top="0px", t.style.border="0", t.width=e.width.toString(), t.height=e.height.toString(), t.scrolling="no", t.setAttribute("data-html2canvas-ignore","true"), A.body?(A.body.appendChild(t), Promise.resolve(t)):Promise.reject("")},Ar=function(A){var e=A.contentWindow,t=e.document;return new Promise(function(r,n){e.onload=A.onload=t.onreadystatechange=function(){var e=setInterval(function(){t.body.childNodes.length>0&&"complete"===t.readyState&&(clearInterval(e), r(A));},50);};})};var er=function A(e,t,r){var n=e.ownerDocument,B=new L(t.scrollX,t.scrollY,t.windowWidth,t.windowHeight),s=n.documentElement?new U(getComputedStyle(n.documentElement).backgroundColor):F,o=n.body?new U(getComputedStyle(n.body).backgroundColor):F,a=e===n.documentElement?s.isTransparent()?o.isTransparent()?t.backgroundColor?new U(t.backgroundColor):null:o:s:t.backgroundColor?new U(t.backgroundColor):null;return(t.foreignObjectRendering?_A.SUPPORT_FOREIGNOBJECT_DRAWING:Promise.resolve(!1)).then(function(s){return s?function(A){return A.inlineFonts(n).then(function(){return A.resourceLoader.ready()}).then(function(){var B=new xA(A.documentElement),s=n.defaultView,o=s.pageXOffset,i=s.pageYOffset,c="HTML"===e.tagName||"BODY"===e.tagName?x(n):O(e,o,i),Q=c.width,l=c.height,w=c.left,u=c.top;return B.render({backgroundColor:a,logger:r,scale:t.scale,x:"number"==typeof t.x?t.x:w,y:"number"==typeof t.y?t.y:u,width:"number"==typeof t.width?t.width:Math.ceil(Q),height:"number"==typeof t.height?t.height:Math.ceil(l),windowWidth:t.windowWidth,windowHeight:t.windowHeight,scrollX:t.scrollX,scrollY:t.scrollY})})}(new Lt(e,t,r,!0,A)):function(A,e,t,r,n,B){var s=new Lt(t,r,n,!1,B),o=A.defaultView.pageXOffset,a=A.defaultView.pageYOffset;return $t(A,e).then(function(n){var B=n.contentWindow,i=B.document,c=Ar(n).then(function(){s.scrolledElements.forEach(Yt), B.scrollTo(e.left,e.top), !/(iPad|iPhone|iPod)/g.test(navigator.userAgent)||B.scrollY===e.top&&B.scrollX===e.left||(i.documentElement.style.top=-e.top+"px", i.documentElement.style.left=-e.left+"px", i.documentElement.style.position="absolute");var t=Promise.resolve([n,s.clonedReferenceElement,s.resourceLoader]),o=r.onclone;return s.clonedReferenceElement instanceof B.HTMLElement||s.clonedReferenceElement instanceof A.defaultView.HTMLElement||s.clonedReferenceElement instanceof HTMLElement?"function"==typeof o?Promise.resolve().then(function(){return o(i)}).then(function(){return t}):t:Promise.reject("")});return i.open(), i.write("".concat(function(A){var e="";return A&&(e+="<!DOCTYPE ", A.name&&(e+=A.name), A.internalSubset&&(e+=A.internalSubset), A.publicId&&(e+='"'.concat(A.publicId,'"')), A.systemId&&(e+='"'.concat(A.systemId,'"')), e+=">"), e}(document.doctype),"<html></html>")), function(A,e,t){!A.defaultView||e===A.defaultView.pageXOffset&&t===A.defaultView.pageYOffset||A.defaultView.scrollTo(e,t);}(t.ownerDocument,o,a), i.replaceChild(i.adoptNode(s.documentElement),i.documentElement), i.close(), c})}(n,B,e,t,r,A).then(function(A){var e=function(A,e){return function(A){if(Array.isArray(A))return A}(A)||function(A,e){var t=[],r=!0,n=!1,B=void 0;try{for(var s,o=A[Symbol.iterator]();!(r=(s=o.next()).done)&&(t.push(s.value), !e||t.length!==e);r=!0);}catch(A){n=!0, B=A;}finally{try{r||null==o.return||o.return();}finally{if(n)throw B}}return t}(A,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(A,3),B=e[0],s=e[1],o=e[2],i=function(A,e,t){var r=0,n=new Xe(A,null,e,r++),B=new Oe(n,null,!0);return function A(e,t,r,n,B){for(var s,o=e.firstChild;o;o=s){s=o.nextSibling;var a=o.ownerDocument.defaultView;if(o instanceof a.Text||o instanceof Text||a.parent&&o instanceof a.parent.Text)o.data.trim().length>0&&t.childNodes.push(jA.fromTextNode(o,t));else if(o instanceof a.HTMLElement||o instanceof HTMLElement||a.parent&&o instanceof a.parent.HTMLElement){if(-1===xe.indexOf(o.nodeName)){var i=new Xe(o,t,n,B++);if(i.isVisible()){"INPUT"===o.tagName?Ue(o,i):"TEXTAREA"===o.tagName?ge(o,i):"SELECT"===o.tagName?Fe(o,i):i.style.listStyle&&-1!==i.style.listStyle.listStyleType&&Ee(o,i,n);var c="TEXTAREA"!==o.tagName,Q=Ve(i,o);if(Q||ke(i)){var l=Q||i.isPositioned()?r.getRealParentStackingContext():r,w=new Oe(i,l,Q);l.contexts.push(w), c&&A(o,i,w,n,B);}else r.children.push(i), c&&A(o,i,r,n,B);}}}else if(o instanceof a.SVGSVGElement||o instanceof SVGSVGElement||a.parent&&o instanceof a.parent.SVGSVGElement){var u=new Xe(o,t,n,B++),U=Ve(u,o);if(U||ke(u)){var g=U||u.isPositioned()?r.getRealParentStackingContext():r,F=new Oe(u,g,U);g.contexts.push(F);}else r.children.push(u);}}}(A,n,B,e,1), B}(s,o),c=s.ownerDocument;return a===i.container.style.background.backgroundColor&&(i.container.style.background.backgroundColor=F), o.ready().then(function(A){var e=new _e(c),o=c.defaultView,Q=o.pageXOffset,l=o.pageYOffset,w="HTML"===s.tagName||"BODY"===s.tagName?x(n):O(s,Q,l),u=w.width,U=w.height,g=w.left,F=w.top,C={backgroundColor:a,fontMetrics:e,imageStore:A,logger:r,scale:t.scale,x:"number"==typeof t.x?t.x:g,y:"number"==typeof t.y?t.y:F,width:"number"==typeof t.width?t.width:Math.ceil(u),height:"number"==typeof t.height?t.height:Math.ceil(U)};if(Array.isArray(t.target))return Promise.all(t.target.map(function(A){return new wt(A,C).render(i)}));var h=new wt(t.target,C).render(i);return!0===t.removeContainer&&B.parentNode&&B.parentNode.removeChild(B), h})})})};function tr(A,e,t){return e in A?Object.defineProperty(A,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):A[e]=t, A}var rr=function(A,e){var t=e||{},r=new p("boolean"!=typeof t.logging||t.logging);r.log("html2canvas ".concat("1.0.0-rc.1"));var n=A.ownerDocument;if(!n)return Promise.reject("Provided element is not within a Document");var B=n.defaultView,s={allowTaint:!1,backgroundColor:"#ffffff",imageTimeout:15e3,logging:!0,proxy:null,removeContainer:!0,foreignObjectRendering:!1,scale:B.devicePixelRatio||1,target:new f(t.canvas),useCORS:!1,windowWidth:B.innerWidth,windowHeight:B.innerHeight,scrollX:B.pageXOffset,scrollY:B.pageYOffset};return er(A,function(A){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{},r=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(A){return Object.getOwnPropertyDescriptor(t,A).enumerable}))), r.forEach(function(e){tr(A,e,t[e]);});}return A}({},s,t),r)};rr.CanvasRenderer=f, e.default=rr;}]).default});
});

var html2canvas = unwrapExports(html2canvas_min);
var html2canvas_min_1 = html2canvas_min.html2canvas;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

// Determine the type of a variable/object.
var objType = function objType(obj) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  if (type === 'undefined') return 'undefined';else if (type === 'string' || obj instanceof String) return 'string';else if (type === 'number' || obj instanceof Number) return 'number';else if (type === 'function' || obj instanceof Function) return 'function';else if (!!obj && obj.constructor === Array) return 'array';else if (obj && obj.nodeType === 1) return 'element';else if (type === 'object') return 'object';else return 'unknown';
};

// Create an HTML element with optional className, innerHTML, and style.
var createElement = function createElement(tagName, opt) {
  var el = document.createElement(tagName);
  if (opt.className) el.className = opt.className;
  if (opt.innerHTML) {
    el.innerHTML = opt.innerHTML;
    var scripts = el.getElementsByTagName('script');
    for (var i = scripts.length; i-- > 0; null) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
  }
  for (var key in opt.style) {
    el.style[key] = opt.style[key];
  }
  return el;
};

// Deep-clone a node and preserve contents/properties.


// Convert units from px using the conversion value 'k' from jsPDF.
var unitConvert = function unitConvert(obj, k) {
  if (objType(obj) === 'number') {
    return obj * 72 / 96 / k;
  } else {
    var newObj = {};
    for (var key in obj) {
      newObj[key] = obj[key] * 72 / 96 / k;
    }
    return newObj;
  }
};

// Convert units to px using the conversion value 'k' from jsPDF.
var toPx = function toPx(val, k) {
  return Math.floor(val * k / 72 * 96);
};

/* ----- CONSTRUCTOR ----- */

var Worker = function Worker(opt) {
  // Create the root parent for the proto chain, and the starting Worker.
  var root = _extends(Worker.convert(Promise.resolve()), JSON.parse(JSON.stringify(Worker.template)));
  var self = Worker.convert(Promise.resolve(), root);

  // Set progress, optional settings, and return.
  self = self.setProgress(1, Worker, 1, [Worker]);
  self = self.set(opt);
  return self;
};

// Boilerplate for subclassing Promise.
Worker.prototype = Object.create(Promise.prototype);
Worker.prototype.constructor = Worker;

// Converts/casts promises into Workers.
Worker.convert = function convert(promise, inherit) {
  // Uses prototypal inheritance to receive changes made to ancestors' properties.
  promise.__proto__ = inherit || Worker.prototype;
  return promise;
};

Worker.template = {
  prop: {
    src: null,
    canvas: null,
    img: null,
    pdf: null,
    pageSize: null
  },
  progress: {
    val: 0,
    state: null,
    n: 0,
    stack: []
  },
  opt: {
    filename: 'file.pdf',
    margin: [0, 0, 0, 0],
    image: { type: 'jpeg', quality: 0.95 },
    enableLinks: true,
    html2canvas: {},
    jsPDF: {}
  }
};

/* ----- FROM / TO ----- */

Worker.prototype.from = function from(src, type) {
  function getType(src) {
    switch (objType(src)) {
      case 'string':
        return 'string';
      case 'element':
        return src.nodeName.toLowerCase === 'canvas' ? 'canvas' : 'element';
      default:
        return 'unknown';
    }
  }

  return this.then(function from_main() {
    type = type || getType(src);
    switch (type) {
      case 'string':
        return this.set({ src: createElement('div', { innerHTML: src }) });
      case 'element':
        return this.set({ src: src });
      case 'canvas':
        return this.set({ canvas: src });
      case 'img':
        return this.set({ img: src });
      default:
        return this.error('Unknown source type.');
    }
  });
};

Worker.prototype.to = function to(target) {
  // Route the 'to' request to the appropriate method.
  switch (target) {
    case 'canvas':
      return this.toCanvas();
    case 'img':
      return this.toImg();
    case 'pdf':
      return this.toPdf();
    default:
      return this.error('Invalid target.');
  }
};

Worker.prototype.toCanvas = function toCanvas() {
  // Set up function prerequisites.
  var prereqs = [function checkSrc() {
    return this.prop.src || this.error('Cannot duplicate - no source HTML.');
  }, function checkPageSize() {
    return this.prop.pageSize || this.setPageSize();
  }];

  // Fulfill prereqs then create the canvas.
  return this.thenList(prereqs).then(function toCanvas_main() {
    // Handle old-fashioned 'onrendered' argument.
    var options = _extends({}, this.opt.html2canvas);
    delete options.onrendered;

    // Alter html2canvas options for reflow behaviour.
    var src = this.prop.src;
    var ignoreElements_orig = options.ignoreElements || function () {};
    options.ignoreElements = function (el) {
      // List of metadata tags:   https://www.w3schools.com/html/html_head.asp
      var metaTags = ['HEAD', 'TITLE', 'BASE', 'LINK', 'META', 'SCRIPT', 'STYLE'];
      var toClone = metaTags.indexOf(el.tagName) !== -1 || el.contains(src) || src.contains(el);
      return !toClone || ignoreElements_orig(el);
    };
    options.windowWidth = this.prop.pageSize.inner.px.width;
    options.width = options.windowWidth;

    return html2canvas(src, options);
  }).then(function toCanvas_post(canvas) {
    // Handle old-fashioned 'onrendered' argument.
    var onRendered = this.opt.html2canvas.onrendered || function () {};
    onRendered(canvas);

    this.prop.canvas = canvas;
  });
};

Worker.prototype.toImg = function toImg() {
  // Set up function prerequisites.
  var prereqs = [function checkCanvas() {
    return this.prop.canvas || this.toCanvas();
  }];

  // Fulfill prereqs then create the image.
  return this.thenList(prereqs).then(function toImg_main() {
    var imgData = this.prop.canvas.toDataURL('image/' + this.opt.image.type, this.opt.image.quality);
    this.prop.img = document.createElement('img');
    this.prop.img.src = imgData;
  });
};

Worker.prototype.toPdf = function toPdf() {
  // Set up function prerequisites.
  var prereqs = [function checkCanvas() {
    return this.prop.canvas || this.toCanvas();
  }];

  // Fulfill prereqs then create the image.
  return this.thenList(prereqs).then(function toPdf_main() {
    // Create local copies of frequently used properties.
    var canvas = this.prop.canvas;
    var opt = this.opt;

    // Calculate the number of pages.
    var ctx = canvas.getContext('2d');
    var pxFullHeight = canvas.height;
    var pxPageHeight = Math.floor(canvas.width * this.prop.pageSize.inner.ratio);
    var nPages = Math.ceil(pxFullHeight / pxPageHeight);

    // Define pageHeight separately so it can be trimmed on the final page.
    var pageHeight = this.prop.pageSize.inner.height;

    // Create a one-page canvas to split up the full image.
    var pageCanvas = document.createElement('canvas');
    var pageCtx = pageCanvas.getContext('2d');
    pageCanvas.width = canvas.width;
    pageCanvas.height = pxPageHeight;

    // Initialize the PDF.
    this.prop.pdf = this.prop.pdf || new jspdf_min(opt.jsPDF);

    for (var page = 0; page < nPages; page++) {
      // Trim the final page to reduce file size.
      if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
        pageCanvas.height = pxFullHeight % pxPageHeight;
        pageHeight = pageCanvas.height * this.prop.pageSize.inner.width / pageCanvas.width;
      }

      // Display the page.
      var w = pageCanvas.width;
      var h = pageCanvas.height;
      pageCtx.fillStyle = 'white';
      pageCtx.fillRect(0, 0, w, h);
      pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

      // Add the page to the PDF.
      if (page) this.prop.pdf.addPage();
      var imgData = pageCanvas.toDataURL('image/' + opt.image.type, opt.image.quality);
      this.prop.pdf.addImage(imgData, opt.image.type, opt.margin[1], opt.margin[0], this.prop.pageSize.inner.width, pageHeight);
    }
  });
};

/* ----- OUTPUT / SAVE ----- */

Worker.prototype.output = function output(type, options, src) {
  // Redirect requests to the correct function (outputPdf / outputImg).
  src = src || 'pdf';
  if (src.toLowerCase() === 'img' || src.toLowerCase() === 'image') {
    return this.outputImg(type, options);
  } else {
    return this.outputPdf(type, options);
  }
};

Worker.prototype.outputPdf = function outputPdf(type, options) {
  // Set up function prerequisites.
  var prereqs = [function checkPdf() {
    return this.prop.pdf || this.toPdf();
  }];

  // Fulfill prereqs then perform the appropriate output.
  return this.thenList(prereqs).then(function outputPdf_main() {
    /* Currently implemented output types:
     *    https://rawgit.com/MrRio/jsPDF/master/docs/jspdf.js.html#line992
     *  save(options), arraybuffer, blob, bloburi/bloburl,
     *  datauristring/dataurlstring, dataurlnewwindow, datauri/dataurl
     */
    return this.prop.pdf.output(type, options);
  });
};

Worker.prototype.outputImg = function outputImg(type, options) {
  // Set up function prerequisites.
  var prereqs = [function checkImg() {
    return this.prop.img || this.toImg();
  }];

  // Fulfill prereqs then perform the appropriate output.
  return this.thenList(prereqs).then(function outputImg_main() {
    switch (type) {
      case undefined:
      case 'img':
        return this.prop.img;
      case 'datauristring':
      case 'dataurlstring':
        return this.prop.img.src;
      case 'datauri':
      case 'dataurl':
        return document.location.href = this.prop.img.src;
      default:
        throw 'Image output type "' + type + '" is not supported.';
    }
  });
};

Worker.prototype.save = function save(filename) {
  // Set up function prerequisites.
  var prereqs = [function checkPdf() {
    return this.prop.pdf || this.toPdf();
  }];

  // Fulfill prereqs, update the filename (if provided), and save the PDF.
  return this.thenList(prereqs).set(filename ? { filename: filename } : null).then(function save_main() {
    this.prop.pdf.save(this.opt.filename);
  });
};

/* ----- SET / GET ----- */

Worker.prototype.set = function set$$1(opt) {
  // TODO: Implement ordered pairs?

  // Silently ignore invalid or empty input.
  if (objType(opt) !== 'object') {
    return this;
  }

  // Build an array of setter functions to queue.
  var fns = Object.keys(opt || {}).map(function (key) {
    if (key in Worker.template.prop) {
      // Set pre-defined properties.
      return function set_prop() {
        this.prop[key] = opt[key];
      };
    } else {
      switch (key) {
        case 'margin':
          return this.setMargin.bind(this, opt.margin);
        case 'jsPDF':
          return function set_jsPDF() {
            this.opt.jsPDF = opt.jsPDF;return this.setPageSize();
          };
        case 'pageSize':
          return this.setPageSize.bind(this, opt.pageSize);
        default:
          // Set any other properties in opt.
          return function set_opt() {
            this.opt[key] = opt[key];
          };
      }
    }
  }, this);

  // Set properties within the promise chain.
  return this.then(function set_main() {
    return this.thenList(fns);
  });
};

Worker.prototype.get = function get$$1(key, cbk) {
  return this.then(function get_main() {
    // Fetch the requested property, either as a predefined prop or in opt.
    var val = key in Worker.template.prop ? this.prop[key] : this.opt[key];
    return cbk ? cbk(val) : val;
  });
};

Worker.prototype.setMargin = function setMargin(margin) {
  return this.then(function setMargin_main() {
    // Parse the margin property: [top, left, bottom, right].
    switch (objType(margin)) {
      case 'number':
        margin = [margin, margin, margin, margin];
      case 'array':
        if (margin.length === 2) {
          margin = [margin[0], margin[1], margin[0], margin[1]];
        }
        if (margin.length === 4) {
          break;
        }
      default:
        return this.error('Invalid margin array.');
    }

    // Set the margin property, then update pageSize.
    this.opt.margin = margin;
  }).then(this.setPageSize);
};

Worker.prototype.setPageSize = function setPageSize(pageSize) {
  return this.then(function setPageSize_main() {
    // Retrieve page-size based on jsPDF settings, if not explicitly provided.
    pageSize = pageSize || jspdf_min.getPageSize(this.opt.jsPDF);

    // Add 'inner' field if not present.
    if (!pageSize.hasOwnProperty('inner')) {
      pageSize.inner = {
        width: pageSize.width - this.opt.margin[1] - this.opt.margin[3],
        height: pageSize.height - this.opt.margin[0] - this.opt.margin[2]
      };
      pageSize.inner.px = {
        width: toPx(pageSize.inner.width, pageSize.k),
        height: toPx(pageSize.inner.height, pageSize.k)
      };
      pageSize.inner.ratio = pageSize.inner.height / pageSize.inner.width;
    }

    // Attach pageSize to this.
    this.prop.pageSize = pageSize;
  });
};

Worker.prototype.setProgress = function setProgress(val, state, n, stack) {
  // Immediately update all progress values.
  if (val != null) this.progress.val = val;
  if (state != null) this.progress.state = state;
  if (n != null) this.progress.n = n;
  if (stack != null) this.progress.stack = stack;
  this.progress.ratio = this.progress.val / this.progress.state;

  // Return this for command chaining.
  return this;
};

Worker.prototype.updateProgress = function updateProgress(val, state, n, stack) {
  // Immediately update all progress values, using setProgress.
  return this.setProgress(val ? this.progress.val + val : null, state ? state : null, n ? this.progress.n + n : null, stack ? this.progress.stack.concat(stack) : null);
};

/* ----- PROMISE MAPPING ----- */

Worker.prototype.then = function then(onFulfilled, onRejected) {
  // Wrap `this` for encapsulation.
  var self = this;

  return this.thenCore(onFulfilled, onRejected, function then_main(onFulfilled, onRejected) {
    // Update progress while queuing, calling, and resolving `then`.
    self.updateProgress(null, null, 1, [onFulfilled]);
    return Promise.prototype.then.call(this, function then_pre(val) {
      self.updateProgress(null, onFulfilled);
      return val;
    }).then(onFulfilled, onRejected).then(function then_post(val) {
      self.updateProgress(1);
      return val;
    });
  });
};

Worker.prototype.thenCore = function thenCore(onFulfilled, onRejected, thenBase) {
  // Handle optional thenBase parameter.
  thenBase = thenBase || Promise.prototype.then;

  // Wrap `this` for encapsulation and bind it to the promise handlers.
  var self = this;
  if (onFulfilled) {
    onFulfilled = onFulfilled.bind(self);
  }
  if (onRejected) {
    onRejected = onRejected.bind(self);
  }

  // Cast self into a Promise to avoid polyfills recursively defining `then`.
  var isNative = Promise.toString().indexOf('[native code]') !== -1 && Promise.name === 'Promise';
  var selfPromise = isNative ? self : Worker.convert(_extends({}, self), Promise.prototype);

  // Return the promise, after casting it into a Worker and preserving props.
  var returnVal = thenBase.call(selfPromise, onFulfilled, onRejected);
  return Worker.convert(returnVal, self.__proto__);
};

Worker.prototype.thenExternal = function thenExternal(onFulfilled, onRejected) {
  // Call `then` and return a standard promise (exits the Worker chain).
  return Promise.prototype.then.call(this, onFulfilled, onRejected);
};

Worker.prototype.thenList = function thenList(fns) {
  // Queue a series of promise 'factories' into the promise chain.
  var self = this;
  fns.forEach(function thenList_forEach(fn) {
    self = self.thenCore(fn);
  });
  return self;
};

Worker.prototype['catch'] = function (onRejected) {
  // Bind `this` to the promise handler, call `catch`, and return a Worker.
  if (onRejected) {
    onRejected = onRejected.bind(this);
  }
  var returnVal = Promise.prototype['catch'].call(this, onRejected);
  return Worker.convert(returnVal, this);
};

Worker.prototype.catchExternal = function catchExternal(onRejected) {
  // Call `catch` and return a standard promise (exits the Worker chain).
  return Promise.prototype['catch'].call(this, onRejected);
};

Worker.prototype.error = function error(msg) {
  // Throw the error in the Promise chain.
  return this.then(function error_main() {
    throw new Error(msg);
  });
};

/* ----- ALIASES ----- */

Worker.prototype.using = Worker.prototype.set;
Worker.prototype.saveAs = Worker.prototype.save;
Worker.prototype.export = Worker.prototype.output;
Worker.prototype.run = Worker.prototype.then;

// Import dependencies.
// Get dimensions of a PDF page, as determined by jsPDF.
jspdf_min.getPageSize = function (orientation, unit, format) {
  // Decode options object
  if ((typeof orientation === 'undefined' ? 'undefined' : _typeof(orientation)) === 'object') {
    var options = orientation;
    orientation = options.orientation;
    unit = options.unit || unit;
    format = options.format || format;
  }

  // Default options
  unit = unit || 'mm';
  format = format || 'a4';
  orientation = ('' + (orientation || 'P')).toLowerCase();
  var format_as_string = ('' + format).toLowerCase();

  // Size in pt of various paper formats
  var pageFormats = {
    'a0': [2383.94, 3370.39], 'a1': [1683.78, 2383.94],
    'a2': [1190.55, 1683.78], 'a3': [841.89, 1190.55],
    'a4': [595.28, 841.89], 'a5': [419.53, 595.28],
    'a6': [297.64, 419.53], 'a7': [209.76, 297.64],
    'a8': [147.40, 209.76], 'a9': [104.88, 147.40],
    'a10': [73.70, 104.88], 'b0': [2834.65, 4008.19],
    'b1': [2004.09, 2834.65], 'b2': [1417.32, 2004.09],
    'b3': [1000.63, 1417.32], 'b4': [708.66, 1000.63],
    'b5': [498.90, 708.66], 'b6': [354.33, 498.90],
    'b7': [249.45, 354.33], 'b8': [175.75, 249.45],
    'b9': [124.72, 175.75], 'b10': [87.87, 124.72],
    'c0': [2599.37, 3676.54], 'c1': [1836.85, 2599.37],
    'c2': [1298.27, 1836.85], 'c3': [918.43, 1298.27],
    'c4': [649.13, 918.43], 'c5': [459.21, 649.13],
    'c6': [323.15, 459.21], 'c7': [229.61, 323.15],
    'c8': [161.57, 229.61], 'c9': [113.39, 161.57],
    'c10': [79.37, 113.39], 'dl': [311.81, 623.62],
    'letter': [612, 792],
    'government-letter': [576, 756],
    'legal': [612, 1008],
    'junior-legal': [576, 360],
    'ledger': [1224, 792],
    'tabloid': [792, 1224],
    'credit-card': [153, 243]
  };

  // Unit conversion
  switch (unit) {
    case 'pt':
      var k = 1;break;
    case 'mm':
      var k = 72 / 25.4;break;
    case 'cm':
      var k = 72 / 2.54;break;
    case 'in':
      var k = 72;break;
    case 'px':
      var k = 72 / 96;break;
    case 'pc':
      var k = 12;break;
    case 'em':
      var k = 12;break;
    case 'ex':
      var k = 6;break;
    default:
      throw 'Invalid unit: ' + unit;
  }

  // Dimensions are stored as user units and converted to points on output
  if (pageFormats.hasOwnProperty(format_as_string)) {
    var pageHeight = pageFormats[format_as_string][1] / k;
    var pageWidth = pageFormats[format_as_string][0] / k;
  } else {
    try {
      var pageHeight = format[1];
      var pageWidth = format[0];
    } catch (err) {
      throw new Error('Invalid format: ' + format);
    }
  }

  // Handle page orientation
  if (orientation === 'p' || orientation === 'portrait') {
    orientation = 'p';
    if (pageWidth > pageHeight) {
      var tmp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = tmp;
    }
  } else if (orientation === 'l' || orientation === 'landscape') {
    orientation = 'l';
    if (pageHeight > pageWidth) {
      var tmp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = tmp;
    }
  } else {
    throw 'Invalid orientation: ' + orientation;
  }

  // Return information (k is the unit conversion ratio from pts)
  var info = { 'width': pageWidth, 'height': pageHeight, 'unit': unit, 'k': k };
  return info;
};

/* Pagebreak plugin:

    Adds page-break functionality to the html2pdf library. Page-breaks can be
    enabled by CSS styles, set on individual elements using selectors, or
    avoided from breaking inside all elements.

    Options on the `opt.pagebreak` object:

    mode:   String or array of strings: 'avoid-all', 'css', and/or 'legacy'
            Default: ['css', 'legacy']

    before: String or array of CSS selectors for which to add page-breaks
            before each element. Can be a specific element with an ID
            ('#myID'), all elements of a type (e.g. 'img'), all of a class
            ('.myClass'), or even '*' to match every element.

    after:  Like 'before', but adds a page-break immediately after the element.

    avoid:  Like 'before', but avoids page-breaks on these elements. You can
            enable this feature on every element using the 'avoid-all' mode.
*/

// Refs to original functions.
var orig = {
  toCanvas: Worker.prototype.toCanvas
};

// Add pagebreak default options to the Worker template.
Worker.template.opt.pagebreak = {
  mode: ['css', 'legacy'],
  before: [],
  after: [],
  avoid: []
};

Worker.prototype.toCanvas = function toCanvas() {
  return this.then(function toCanvas_pagebreak() {
    // Attach extra behaviour to the html2canvas onclone property.
    var oncloneOrig = this.opt.html2canvas.onclone || function () {};
    this.opt.html2canvas.onclone = onclone_pagebreak.bind(this, oncloneOrig);
  }).then(orig.toCanvas.bind(this));
};

function onclone_pagebreak(oncloneOrig, doc) {
  // Setup root element and inner page height.
  var root = doc.body;
  var pxPageHeight = this.prop.pageSize.inner.px.height;

  // Check all requested modes.
  var modeSrc = [].concat(this.opt.pagebreak.mode);
  var mode = {
    avoidAll: modeSrc.indexOf('avoid-all') !== -1,
    css: modeSrc.indexOf('css') !== -1,
    legacy: modeSrc.indexOf('legacy') !== -1
  };

  // Get arrays of all explicitly requested elements.
  var select = {};
  var self = this;
  ['before', 'after', 'avoid'].forEach(function (key) {
    var all = mode.avoidAll && key === 'avoid';
    select[key] = all ? [] : [].concat(self.opt.pagebreak[key] || []);
    if (select[key].length > 0) {
      select[key] = Array.prototype.slice.call(root.querySelectorAll(select[key].join(', ')));
    }
  });

  // Get all legacy page-break elements.
  var legacyEls = root.querySelectorAll('.html2pdf__page-break');
  legacyEls = Array.prototype.slice.call(legacyEls);

  // Loop through all elements.
  var els = root.querySelectorAll('*');
  Array.prototype.forEach.call(els, function pagebreak_loop(el) {
    // Setup pagebreak rules based on legacy and avoidAll modes.
    var rules = {
      before: false,
      after: mode.legacy && legacyEls.indexOf(el) !== -1,
      avoid: mode.avoidAll
    };

    // Add rules for css mode.
    if (mode.css) {
      // TODO: Check if this is valid with iFrames.
      var style = window.getComputedStyle(el);
      // TODO: Handle 'left' and 'right' correctly.
      // TODO: Add support for 'avoid' on breakBefore/After.
      var breakOpt = ['always', 'page', 'left', 'right'];
      var avoidOpt = ['avoid', 'avoid-page'];
      rules = {
        before: rules.before || breakOpt.indexOf(style.breakBefore || style.pageBreakBefore) !== -1,
        after: rules.after || breakOpt.indexOf(style.breakAfter || style.pageBreakAfter) !== -1,
        avoid: rules.avoid || avoidOpt.indexOf(style.breakInside || style.pageBreakInside) !== -1
      };
    }

    // Add rules for explicit requests.
    Object.keys(rules).forEach(function (key) {
      rules[key] = rules[key] || select[key].indexOf(el) !== -1;
    });

    // Get element position on the screen.
    // TODO: Subtract the top of the container from clientRect.top/bottom?
    var clientRect = el.getBoundingClientRect();

    // Avoid: Check if a break happens mid-element.
    if (rules.avoid && !rules.before) {
      var startPage = Math.floor(clientRect.top / pxPageHeight);
      var endPage = Math.floor(clientRect.bottom / pxPageHeight);
      var nPages = Math.abs(clientRect.bottom - clientRect.top) / pxPageHeight;

      // Turn on rules.before if the el is broken and is at most one page long.
      if (endPage !== startPage && nPages <= 1) {
        rules.before = true;
      }
    }

    // Before: Create a padding div to push the element to the next page.
    if (rules.before) {
      var pad = createElement('div', { style: {
          display: 'block',
          height: pxPageHeight - clientRect.top % pxPageHeight + 'px'
        } });
      el.parentNode.insertBefore(pad, el);
    }

    // After: Create a padding div to fill the remaining page.
    if (rules.after) {
      var pad = createElement('div', { style: {
          display: 'block',
          height: pxPageHeight - clientRect.bottom % pxPageHeight + 'px'
        } });
      el.parentNode.insertBefore(pad, el.nextSibling);
    }
  });

  // Call the original onclone callback.
  oncloneOrig(doc);
}

// Add hyperlink functionality to the PDF creation.

// Main link array, and refs to original functions.
var linkInfo = [];
var orig$1 = {
  toCanvas: Worker.prototype.toCanvas,
  toPdf: Worker.prototype.toPdf
};

Worker.prototype.toCanvas = function toCanvas() {
  return this.then(function toCanvas_hyperlink() {
    // Attach extra behaviour to the html2canvas onclone property.
    var oncloneOrig = this.opt.html2canvas.onclone || function () {};
    this.opt.html2canvas.onclone = onclone_hyperlink.bind(this, oncloneOrig);
  }).then(orig$1.toCanvas.bind(this));
};

function onclone_hyperlink(oncloneOrig, doc) {
  // Retrieve hyperlink info if the option is enabled.
  if (this.opt.enableLinks) {
    // Find all anchor tags and get the container's bounds for reference.
    var container = doc.body;
    var links = container.querySelectorAll('a');
    var containerRect = unitConvert(container.getBoundingClientRect(), this.prop.pageSize.k);
    linkInfo = [];

    // Loop through each anchor tag.
    Array.prototype.forEach.call(links, function (link) {
      // Treat each client rect as a separate link (for text-wrapping).
      var clientRects = link.getClientRects();
      for (var i = 0; i < clientRects.length; i++) {
        var clientRect = unitConvert(clientRects[i], this.prop.pageSize.k);
        clientRect.left -= containerRect.left;
        clientRect.top -= containerRect.top;

        var page = Math.floor(clientRect.top / this.prop.pageSize.inner.height) + 1;
        var top = this.opt.margin[0] + clientRect.top % this.prop.pageSize.inner.height;
        var left = this.opt.margin[1] + clientRect.left;

        linkInfo.push({ page: page, top: top, left: left, clientRect: clientRect, link: link });
      }
    }, this);
  }

  // Call the original onclone callback.
  oncloneOrig(doc);
}

Worker.prototype.toPdf = function toPdf() {
  return orig$1.toPdf.call(this).then(function toPdf_hyperlink() {
    // Add hyperlinks if the option is enabled.
    if (this.opt.enableLinks) {
      // Attach each anchor tag based on info from the cloned document.
      linkInfo.forEach(function (l) {
        this.prop.pdf.setPage(l.page);
        this.prop.pdf.link(l.left, l.top, l.clientRect.width, l.clientRect.height, { url: l.link.href });
      }, this);

      // Reset the active page of the PDF to the final page.
      var nPages = this.prop.pdf.internal.getNumberOfPages();
      this.prop.pdf.setPage(nPages);
    }
  });
};

/**
 * Generate a PDF from an HTML element or string using html2canvas and jsPDF.
 *
 * @param {Element|string} source The source element or HTML string.
 * @param {Object=} opt An object of optional settings: 'margin', 'filename',
 *    'image' ('type' and 'quality'), and 'html2canvas' / 'jspdf', which are
 *    sent as settings to their corresponding functions.
 */
var html2pdf = function html2pdf(src, opt) {
  // Create a new worker with the given options.
  var worker = new html2pdf.Worker(opt);

  if (src) {
    // If src is specified, perform the traditional 'simple' operation.
    return worker.from(src).save();
  } else {
    // Otherwise, return the worker for new Promise-based operation.
    return worker;
  }
};
html2pdf.Worker = Worker;

return html2pdf;

})));
