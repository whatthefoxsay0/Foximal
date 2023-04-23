# Foximal
A Javascript library for big Numbers.

This Javascript library is inspired from ExpantaNum by Naruyoko: https://github.com/Naruyoko/ExpantaNum.js

But it is made differently by using recursion on the exponent. 
thus the max value is theoretically only limited by the max Callstack size of your Browser, 
but will drastically lose performance on higher numbers (F60^F60 = 100ms for me)

Functions are as follows: `abs, neg, cmp, gt, gte, lt, lte, eq, neq, min, max, ispos, isneg, isNaN, isFinite, isInfinite, isint, floor, ceil, round, add, sub, mul, div, mod, gamma, fact, pow, exp, sqrt, cbrt, root, log10, logbase, ln, lambertw, ssrt, toNumber, toString`

