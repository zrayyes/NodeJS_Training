function add(x,y) {
    return x + y;
}

function sub(x,y) {
    return x - y;
}

function mul(x,y){
    return x * y;
}

const log = console.log;


// Write a function identityf that takes an argument and returns
// a function that returns that argument.

function identityf(n){
    return function(){
        return n;
    };
}

let three = identityf(3);
log(three());   // 3


log('');
// Write a function addf that adds from two invocations
// addf(3)(4) //7

function addf(x) {
    return function (y) {
        return add(x,y);
    }
}

log(addf(3)(4)); // 7


log('');
// Write a function liftf that takes a binary function,
// and makes it callable with two invocations
// liftf(mul)(5)(6)  = 30

function liftf(fn) {
    return function(x){
        return function(y){
            return fn(x,y);
        };
    };
}

log(liftf(mul)(5)(6));  // 30


log('');
// Write a function curry that takes a binary function and an argument,
// and returns a function that can take a second argument
// var add3 = curry(add,3);
// add3(4) = 7

function curry(fn, x) {
    return function(y){
        return fn(x,y);
    };
}

let add3 = curry(add,3);
log(add3(4));


log('');
// Without writing any new functions, show three ways to create the inc function
// inc(5)  = 6
// inc(inc(5)) = 7

// Way 1
let inc1 = addf(1);

// Way 2
let inc2 = liftf(add)(1);

// Way 3
let inc3 = curry(add,1);

log(inc1(5));   // 6
log(inc2(5));   // 6
log(inc3(5));   // 6


log('');
// Write a function 'twice', that takes a binary function and returns
// a unary function that passes its argument to the binary function 'twice'.
// var double = twice(add);
// double(11) = 22;

function twice(fn) {
    return function (x) {
        return fn(x,x);
    }
}

let doubl = twice(add);
let square = twice(mul);

log(doubl(5));     // 10
log(square(5));     // 25


log('');
// Write reverse, a function that reverses the arguments of a binary function.
// var bus = reverse(sub)
// bus(3,2) = -1

function reverse(fn){
    return function(x,y){
        return fn(y,x);
    }
}

log(reverse(sub)(3,2));     // -1


log('');
// Write a function 'composeu' that takes two unary functions and returns a unary function that calls them both.
// composeu(doubl, square)(5) = 100

function composeu(fn1, fn2){
    return function(x){
        return fn2(fn1(x));
    };
}

log(composeu(doubl, square)(5));    // 100


log('');
// Write a function 'composeb' that takes two binary functions and returns a function that calls them both.
// composeb(add, mul)(2,3,7) = 35

function composeb(fn1,fn2) {
    return function (x,y,z){
        return fn2(fn1(x,y),z);
    };
}

log(composeb(add, mul)(2,3,7));     // 35


log('');
// Write a limit function that allows a binary function to be called a limited number of times.
// var add_ltd = limit(add,1);

function limit(fn1,n){
    let counter = 0;
    return function (x,y) {
        if (counter >= n){
            return undefined;
        } else {
            counter += 1;
            return fn1(x,y);
        }
    };
}

let add_ltd = limit(add,1);
let sub_ltd = limit(sub,2);

log(add_ltd(3,4));  // 7
log(add_ltd(3,4));  // undefined
log(sub_ltd(5,4));  // 1
log(sub_ltd(5,4));  // 1
log(sub_ltd(5,4));  // undefined


log('');
// Write a from function that produces a generator that will produce a series of values.

function from(n){
    return function () {
        let count = n;
        n += 1;
        return count;
    };
}

let index = from(0);
log(index());   // 0
log(index());   // 1
log(index());   // 2


log('');
// Write a to function that takes a generator and an end value,
// and returns a generator that will produce numbers up to that limit.
// var index = to(from(1), 3);

function to(start, end){
    return function () {
        let count = start();
        if (count < end){
            return count;
        }
        return undefined;
    }
}

let index2 = to(from(1), 3);

log(index2());  // 1
log(index2());  // 2
log(index2());  // undefined


log('');
// Write a 'fromTo' function that produces a generator that produces value in a range.
// var index = fromTo(0,3);

function fromTo(start, stop){
    return to(from(start),stop);
}

let index3 = fromTo(0, 3);

log(index3());  // 0
log(index3());  // 1
log(index3());  // 2
log(index3());  // undefined


log('');
// Write an element function that takes an array and a generator and
// returns a generator that will produce elements from the array.

function element(array, index){
    return function(){
        return array[index()];
    }
}

let ele = element(["a","b","c","d"],fromTo(1,3));

log(ele());     // b
log(ele());     // c
log(ele());     // undefined


log('');
// Write a collect function that take a generator and an array
// and produces a function that will collect results in the array.

function collect(index, array){
    return function(){
        let value = index();
        if (value !== undefined){
            array.push(value);
        }
        return value;
    };
}

let array = [];
let col = collect(fromTo(0,2), array);

log(col());     // 0
log(col());     // 1
log(col());     // undefined
log(array);     // [0, 1]


log('');
// Write a filter function that takes a generator and a predicate,
// a predicate is a function that returns a boolean, true or false,
// and produces a generator that produces only the values approved by the predicate.

function filter(index, fn){
    return function(){
        let value;
        do {
            value = index();
        } while (value !== undefined && !fn(value));
        return value;
    };
}

let fil = filter(fromTo(0,5),
    function third(value){
        return (value % 3) === 0;
    });

log(fil());     // 0
log(fil());     // 3
log(fil());     // undefined


log('');
// Write a concat function that takes two generators and produces
// a generator that combines their sequences.

function concat(fn1,fn2) {
    return function(){
        let value = fn1();
        if (value !== undefined){
            return value;
        } else {
            return fn2();
        }
    };
}

let con = concat(fromTo(0,3),fromTo(0,2));

log(con());     // 0
log(con());     // 1
log(con());     // 2
log(con());     // 0
log(con());     // 1
log(con());     // undefined
log(con());     // undefined


log('');
// Make a function gensymf that makes a function that generates symbols.

function gensymf(letter){
    let counter = 0;
    return function(){
        counter += 1;
        return (letter+counter);
    };
}

let geng = gensymf('G'),
    genh = gensymf('H');

log(geng());    // G1
log(genh());    // H1
log(geng());    // G2
log(genh());    // H2


log('');
// Make a function gensymff that takes a unary function and a seed
// and returns a gensymf

function gensymff(fn, seed){
    return function(letter){
        let counter = seed;
        return function () {
            counter = fn(counter);
            return (letter+counter);
        }
    }
}

let gensymf2 = gensymff(inc1, 0),
    geng2    = gensymf2("G"),
    genh2    = gensymf2("H");

log(geng2());    // G1
log(genh2());    // H1
log(geng2());    // G2
log(genh2());    // H2


log('');
// Write a function fibonaccif

function fibonaccif(start, end) {
    let i = 0;
    return function () {
        let next;
        switch (i){
        case 0:
            i = 1;
            return start;
        case 1:
            i = 2;
            return end;
        default:
            next = start + end;
            start = end;
            end = next;
            return next;
        }
    }
}

let fib = fibonaccif(0,1);

log(fib());     // 0
log(fib());     // 1
log(fib());     // 1
log(fib());     // 2
log(fib());     // 3
log(fib());     // 5


log('\n*** PART 2 ***\n');
////////////////////
// OO Programming
////////////////////

// Write a counter function that returns an object
// containing two functions that implemented an up/down counter hiding the counter.

function counter(n) {
    return {
        up : function () {
            n += 1;
            return n;
        },
        down : function () {
            n -= 1;
            return n;
        }
    };
}

let object10 = counter(10),
    up   = object10.up,
    down = object10.down;


log(up());      // 11
log(down());    // 10
log(down());    // 9
log(up());      // 10

log('');
// make a revocable function that takes a binary function
// and returns an object containing an invoke function that
// can invoke the binary function and revoke function that
// disables the invoke function.

function revocable(fn) {
    return {
        invoke: function (x,y) {
            if (fn !== undefined){
                return fn(x,y);
            }
        },
        revoke: function () {
            fn = undefined;
        }
    };
}

let rev = revocable(add),
    add_rev = rev.invoke;

log(add_rev(3,4));      // 7
rev.revoke();
log(add_rev(3,4));      // undefined