# Foximal
A Javascript library for big Numbers.

This Javascript library is inspired from bignum librarys like:
* [break_eternity.js](https://github.com/Patashu/break_eternity.js) by Patashu - 10^^1.8e308
* [ExpantaNum.js](https://github.com/Naruyoko/ExpantaNum.js) by Naruyoko - {10,9e15,1,2}

But it is made differently by using recursion on the exponent. 
thus the max value is theoretically only limited by the max Callstack size of your Browser, 
but will drastically lose performance on higher numbers (F60^F60 = 100ms for me)
I was able to create a Foximal with the value F2510 on Chrome

Functions are as follows: `abs, neg, cmp, gt, gte, lt, lte, eq, neq, min, max, ispos, isneg, isNaN, isFinite, isInfinite, isint, floor, ceil, round, add, sub, mul, div, mod, gamma, fact, pow, exp, sqrt, cbrt, root, log10, logbase, ln, lambertw, ssrt, toNumber, toString`

some other better big number librarys with max value:
* [break_infinity.js](https://github.com/Patashu/break_infinity.js) by Patashu - e9e15
* [break_eternity.js](https://github.com/Patashu/break_eternity.js) by Patashu - 10^^1.8e308
* [OmegaNum.js](https://github.com/Naruyoko/OmegaNum.js) by Naruyoko - 10{9e15}10
* [ExpantaNum.js](https://github.com/Naruyoko/ExpantaNum.js) by Naruyoko - {10,9e15,1,2}
