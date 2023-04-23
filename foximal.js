class Foximal {
    m = 0
    e = -Infinity
    sign = 1
    constructor (input) {
        if (input instanceof Foximal) {
            this.fromFoximal(input)
        } else if (typeof input == "number") {
            this.fromNumber(input)
        } else if (typeof input == "string") {
            this.fromString(input)
        }
    }

    fromFoximal = function(value) {
        this.m = value.m
        this.e = value.e
        this.sign = value.sign
        return this
    }

    fromNumber = function(value) {
        if (!value) return
        this.sign = value < 0? -1 : 1
        value *= this.sign
        this.e = Math.floor(Math.log10(value))
        this.m = value/(10**this.e)
        return this
    }

    fromString = function(value) {
        if (value.includes("e")) {
            let values = value.split("e")
            if(/[^0-9.]/.test(values[0]) || /[^0-9.]/.test(values[1])) {
                this.fromNumber(0)
                return this
            }
            if (values[0]) {
                this.m = parseFloat(values[0])
                if (this.m < 0) {
                    this.sign *= -1
                    this.m *= -1
                } 
            } else
                this.m = 1
            if (values.length <= 3) {
                if (values[1]) 
                    this.e = parseFloat(values[1])
                else if (values.length == 2) {
                    this.fromNumber(0)
                    return this
                } else 
                    this.e = 1
                if (values.length == 3) {
                    if(/[^0-9.]/.test(values[1]) || !values[2]) {
                        this.fromNumber(0)
                        return this
                    }
                    if (parseFloat(values[2])>=10)
                        this.e = Foximal10.pow(parseFloat(values[2])).mul(this.e)
                    else
                        this.e *= (10**parseFloat(values[2]))*this.e
                }
            } else {
                this.e = new Foximal(value.slice(values[0].length+1))
            }
        } else {
            if (/[^0-9^.]/.test(value)) {
                this.fromNumber(0)
                return this
            }
            let valuenumber = parseFloat(value)
            if (!valuenumber) {
                this.fromNumber(0)
                return this
            }
            this.sign = valuenumber < 0? -1 : 1
            valuenumber *= this.sign
            this.e = Math.floor(Math.log10(valuenumber))
            this.m = valuenumber/(10**this.e)
            return this
        }
        return this
    }

    add = function(other) {
        let r = new Foximal(other)
        if (r.m == 0) 
            return new Foximal(this)
        if (this.m == 0)
            return r
        let te = 0
        if (this.m)
            te = this.e
        let re = 0
        if (r.m)
            re = r.e
        if (re instanceof Foximal) te = new Foximal(this.e)
        else if (te instanceof Foximal) re = new Foximal(re)
        if (te instanceof Foximal) {
            if (te.gt(re)) {
                if (te.sub(re).powbase(10).lt(FoximalDoubleMax)) {
                    r.m /= te.sub(re).powbase(10).toNumber()
                    r.m += this.sign*r.sign*this.m
                    r.e = te
                } else {
                    r.fromFoximal(this)
                }
            } else if (re.gt(te)) {
                if (re.sub(te).powbase(10).lt(FoximalDoubleMax)) {
                    r.m += this.sign*r.sign*this.m/re.sub(te).powbase(10).toNumber()
                }
            } else {
                r.m += this.sign*r.sign*this.m
            } 
        } else {
            if (te > re) {
                r.m /= 10**(te-re)
                re = te
            }
            r.m += this.sign*r.sign*this.m*10**(te-re)
            r.e = re
        }
        return r._fix()
    }

    sub = function(other) {
        if (!(other instanceof Foximal)) other = new Foximal(other)
        return this.add(other.neg())
    }

    mul = function(other) {
        let r = new Foximal(other)
        if (this.m == 0 || r.m == 0)
            return new Foximal()
        r.m *= this.m
        r.e = new Foximal(r.e)
        r.e = r.e.add(this.e)
        return r._fix()
    }

    div = function(other) {
        let r = new Foximal(other)
        r.m = this.m / r.m
        r.e = new Foximal(r.e)
        r.e = r.e.neg().add(this.e)
        return r._fix()
    }

    lt = function(other) {
        if (!(other instanceof Foximal)) other = new Foximal(other)
        if (this.sign > other.sign) return 0
        if (this.sign < other.sign) return 1
        let te = this.e
        if (te instanceof Foximal) other.e = new Foximal(other.e)
        else if (other.e instanceof Foximal) te = new Foximal(this.e)
        if (te instanceof Foximal) {
            if (this.sign == 1) {
                if (te.gt(other.e)) return 0
                if (te.lt(other.e)) return 1
                if (this.m < other.m) return 1
                return 0
            } else {
                if (te.gt(other.e)) return 1
                if (te.lt(other.e)) return 0
                if (this.m > other.m) return 1
                return 0
            }
        } else {
            if (this.sign == 1) {
                if (this.e > other.e) return 0
                if (this.e < other.e) return 1
                if (this.m < other.m) return 1
                return 0
            } else {
                if (this.e > other.e) return 1
                if (this.e < other.e) return 0
                if (this.m > other.m) return 1
                return 0
            }
        }
        
    }

    lte = function(other) {
        if (!(other instanceof Foximal)) other = new Foximal(other)
        if (this.sign > other.sign) return 0
        if (this.sign < other.sign) return 1
        let te = this.e
        if (te instanceof Foximal) other.e = new Foximal(other.e)
        else if (other.e instanceof Foximal) te = new Foximal(this.e)
        if (te instanceof Foximal) {
            if (this.sign == 1) {
                if (te.gt(other.e)) return 0
                if (te.lt(other.e)) return 1
                if (this.m > other.m) return 0
                return 1
            } else {
                if (te.gt(other.e)) return 1
                if (te.lt(other.e)) return 0
                if (this.m < other.m) return 0
                return 1
            }
        } else {
            if (this.sign == 1) {
                if (this.e > other.e) return 0
                if (this.e < other.e) return 1
                if (this.m > other.m) return 0
                return 1
            } else {
                if (this.e > other.e) return 1
                if (this.e < other.e) return 0
                if (this.m < other.m) return 0
                return 1
            }
        }
    }

    gt = function(other) {
        if (!(other instanceof Foximal)) other = new Foximal(other)
        if (this.sign > other.sign) return 1
        if (this.sign < other.sign) return 0
        let te = this.e
        if (te instanceof Foximal) other.e = new Foximal(other.e)
        else if (other.e instanceof Foximal) te = new Foximal(this.e)
        if (te instanceof Foximal) {
            if (this.sign == 1) {
                if (te.gt(other.e)) return 1
                if (te.lt(other.e)) return 0
                if (this.m > other.m) return 1
                return 0
            } else {
                if (te.gt(other.e)) return 0
                if (te.lt(other.e)) return 1
                if (this.m < other.m) return 1
                return 0
            }
        } else {
            if (this.sign == 1) {
                if (this.e > other.e) return 1
                if (this.e < other.e) return 0
                if (this.m > other.m) return 1
                return 0
            } else {
                if (this.e > other.e) return 0
                if (this.e < other.e) return 1
                if (this.m < other.m) return 1
                return 0
            }
        }
    }

    gte = function(other) {
        if (!(other instanceof Foximal)) other = new Foximal(other)
        if (this.sign > other.sign) return 1
        if (this.sign < other.sign) return 0
        let te = this.e
        if (te instanceof Foximal) other.e = new Foximal(other.e)
        else if (other.e instanceof Foximal) te = new Foximal(this.e)
        if (te instanceof Foximal) {
            if (this.sign == 1) {
                if (te.gt(other.e)) return 1
                if (te.lt(other.e)) return 0
                if (this.m > other.m) return 0
                return 1
            } else {
                if (te.gt(other.e)) return 0
                if (te.lt(other.e)) return 1
                if (this.m < other.m) return 0
                return 1
            }
        } else {
            if (this.sign == 1) {
                if (this.e > other.e) return 1
                if (this.e < other.e) return 0
                if (this.m < other.m) return 0
                return 1
            } else {
                if (this.e > other.e) return 0
                if (this.e < other.e) return 1
                if (this.m > other.m) return 0
                return 1
            }
        }
    }

    eq = function(other) {
        if (!(other instanceof Foximal)) other = new Foximal(other)
        let te = this.e
        if (te instanceof Foximal) other.e = new Foximal(other.e)
        else if (other.e instanceof Foximal) te = new Foximal(te)
        if (te instanceof Foximal) {
            if (this.m == other.m && te.eq(other.e) && this.sign == other.sign)
                return 1
        } else
            if (this.m == other.m && this.e == other.e && this.sign == other.sign)
                return 1
        return 0
    }

    neq = function(other) {
        return 1*!this.eq(other)
    }

    cmp = function(other) {
        if (!(other instanceof Foximal)) other = new Foximal(other)
        if (this.gt(other)) return 1
        if (this.lt(other)) return -1
        return 0
    }  

    log10 = function() {
        if (this.sign == 1)
            if (this.e instanceof Foximal)
                return new Foximal(this.e.add(Math.log10(this.m)))
            else
                return new Foximal(this.e + Math.log10(this.m))
        console.error("log of negative is not possible")
        return new Foximal(0)
    }

    ln = function() {
        if (this.sign == 1)
        if (this.e instanceof Foximal)
            return new Foximal(this.e.mul(Math.LN10).add(Math.log(this.M)))
        else
            return new Foximal(this.e*Math.LN10 + Math.log(this.m))
        console.error("log of negative is not possible")
        return new Foximal(0)
    }

    logbase = function(base) {
        if (!(base instanceof Foximal)) base = new Foximal(base)
        if (this.sign == 1) {
            let te = this.e
            if (base.e instanceof Foximal) te = new Foximal(te)
            if (te instanceof Foximal)
                return new Foximal(te.div(base.log10()).add(new Foximal(Math.log(this.m)).div(base.ln())))
            else
                return new Foximal(this.e/base.log10().toNumber() + Math.log(this.m)/base.ln().toNumber())
        }
        console.error("log of negative is not possible")
        return new Foximal(0)
    }

    pow = function(value) {
        if (!(value instanceof Foximal)) value = new Foximal(value)
        let te = new Foximal(this.e)
        let r = new Foximal(1)
        r.e = new Foximal(te.add(Math.log10(this.m)).mul(value))
        return r._fix()
    }

    powbase = function(base) {
        return new Foximal(base).pow(this)
    }

    exp = function() {
        return FoximalE.pow(this)
    }

    root = function(value) {
        if (!(value instanceof Foximal)) value = new Foximal(value)
        return this.pow(Foximal.div(1, value))
    }

    sqrt = function() {
        return this.root(2)
    }

    cbrt = function() {
        return this.root(3)
    }

    // very unprecise
    ssrt = function() {
        return this.ln().div(this.ln().lambertw())
    }

    // Only positiv values
    fact = function() {
        if (this.gt(0))
        return this.div(FoximalE).pow(this).mul(this.mul(2).add(1/3).mul(FoximalPI).sqrt())
        return new Foximal()
    }

    // Only positiv values above 1.5 are nearly accurate
    gamma = function() {
        if (this.gte(1.5))
        return this.mul(2).sub(1).fact().mul(FoximalPI.sqrt()).div(this.sub(0.5).fact().mul(Foximal.pow(4, this.sub(0.5))))
        if (this.gte(1))
        return new Foximal(1)
        return new Foximal()
    }

    // very unprecise
    lambertw = function() {
        return this.ln().sub(this.ln().ln()).add(this.ln().ln().div(this.ln()))._fix()
    }

    abs = function() {
        let r = new Foximal(this)
        r.sign = 1
        return r
    }

    neg = function() {
        let r = new Foximal(this)
        if (r.m != 0)
            r.sign *= -1
        return r
    }

    isFinite = function() {
        if (this.isInfinite() || this.isNaN()) return 0
        return 1
    }

    isNaN = function() {
        if (Number.isNaN(this.m) || (this.sign != 1 && this.sign != -1)) 
            return 1
        if (this.e instanceof Foximal)
            return this.e.isNaN()
        if (Number.isNaN(this.e))
            return 1
        return 0
    }

    isInfinite = function() {
        if ((Number.isInfinite(this.m)) && !this.isNaN()) return 1
        if (this.e instanceof Foximal)
            return this.e.isInfinite()
        if (Number.isInfinite(this.e))
            return 1
        return 0
    }

    isint = function() {
        if (this.floor().eq(this)) return 1
        return 0
    }

    isneg = function() {
        if (this.sign == -1) return 1
        return 0
    }

    ispos = function() {
        if (this.sign == 1) return 1
        return 0
    }

    min = function(other) {
        if (!(other instanceof Foximal)) other = new Foximal(other)
        if (this.lte(other)) return this
        return other
    }

    max = function(other) {
        if (!(other instanceof Foximal)) other = new Foximal(other)
        if (this.gte(other)) return this
        return other
    }

    // Only for max 10 OOMs difference because of precision
    mod = function(value) {
        if (!(value instanceof Foximal)) value = new Foximal(value)
        if (this.div(value).abs().gt(1e10) || this.div(value).abs().lt(1e-10))
            return new Foximal()
        let r = this.sub(this.div(value).floor().mul(value))
        return (r.gte(value) || r.lt(0))? new Foximal() : r
    }

    // Only for max e10 because of precision
    ceil = function() {
        if (this.gt(1e10))
        return this
        if (this.sign == 1)
        return new Foximal(Math.ceil(this.m * (10**this.e)))
        return new Foximal(-Math.floor(this.m * (10**this.e)))
    }

    // Only for max e10 because of precision
    floor = function() {
        if (this.gt(1e10))
        return this
        if (this.sign == 1)
        return new Foximal(Math.floor(this.m * (10**this.e)))
        return new Foximal(-Math.ceil(this.m * (10**this.e)))
    }

    // Only for max e14
    round = function() {
        if(this.mod(1).gte(0.5)) return this.ceil()
        return this.floor()
    }

    // Only for max 1.79e308
    toNumber = function() {
        if (this.lt(FoximalDoubleMax))
        return this.sign*this.m*10**(this.e)
        console.error("Foximal.toNumber() only for max 1.79e308")
        return 0
    }

    toString = function(decimals=5, mantissa=1) {
        if (decimals)
            decimals += 1

        if (mantissa) {
            if (this.e instanceof Foximal)
                return (this.sign*this.m+"").slice(0,decimals+1)+"e"+this.e.toString(0, 0)
            if (this.e == 0)
                return (this.sign*this.m+"").slice(0,decimals+1)
            return (this.sign*this.m+"").slice(0,decimals+1)+"e"+this.e
        } else {
            if (this.e instanceof Foximal)
                return "e"+this.e.toString(0, 0)
            return "e"+this.e
        } 
    }

    toF = function() {
        let strings = this.toString().split("e")
        return strings[strings.length-1]+"F"+(strings.length-1)
    }

    _fix = function() {
        if (this.m == 0) return new Foximal()
        if (this.m < 0) {
            this.sign *= -1
            this.m *= -1
        }
        if (this.e instanceof Foximal) {
            this.e._fix()
            if (this.e.m == 0) {
                this.e = 0
            } else if (this.e.abs().lt(1e10) && this.e.abs().gt(1e-10)) {
                this.e = this.e.toNumber()
            } else {
                if (this.e.neq(this.e.floor())) {
                    this.m *= this.e.sub(this.e.floor()).powbase(10)
                    this.e = this.e.floor()
                }
                if (this.m > 10 || this.m < 1) {
                    this.e = this.e.add(Math.floor(Math.log10(this.m)))
                    this.m /= 10**(Math.floor(Math.log10(this.m)))
                }
            }
        } 
        if (!(this.e instanceof Foximal)) {
            if (this.e != Math.floor(this.e)) {
                this.m *= 10**(this.e - Math.floor(this.e))
                this.e = Math.floor(this.e)
            }
            if (this.m > 10 || this.m < 1) {
                this.e += Math.floor(Math.log10(this.m))
                this.m /= 10**(Math.floor(Math.log10(this.m)))
            }
            if ((Foximal.abs(this.e).gt(1e10) || Foximal.abs(this.e).lt(1e-10)) && Foximal.abs(this.e).neq(0)) {
                this.e = new Foximal(this.e)
            }
        }
        return this
    }
}
var FoximalE = new Foximal(Math.E)
var FoximalPI = new Foximal(Math.PI)
var Foximal10 = new Foximal(10)
var DoubleMaxM = DoubleMaxM
var DoubleMaxE = 308
var FoximalDoubleMax = new Foximal(Number.MAX_VALUE)
Foximal.add = function(n1, n2) {
    return new Foximal(n1).add(n2)
}
Foximal.sub = function(n1, n2) {
    return new Foximal(n1).sub(n2)
}
Foximal.toNumber = function(n1) {
    return new Foximal(n1).toNumber()
}
Foximal.mul = function(n1, n2) {
    return new Foximal(n1).mul(n2)
}
Foximal.div = function(n1, div) {
    return new Foximal(n1).div(div)
}
Foximal.lt = function(n1, n2) {
    return new Foximal(n1).lt(n2)
}
Foximal.lte = function(n1, n2) {
    return new Foximal(n1).lte(n2)
}
Foximal.gt = function(n1, n2) {
    return new Foximal(n1).gt(n2)
}
Foximal.gte = function(n1, n2) {
    return new Foximal(n1).gte(n2)
}
Foximal.abs = function(n1) {
    return new Foximal(n1).abs()
}
Foximal.neg = function(n1) {
    return new Foximal(n1).neg()
}
Foximal.log10 = function(n1) {
    return new Foximal(n1).log10()
}
Foximal.ln = function(n1) {
    return new Foximal(n1).ln()
}
Foximal.logbase = function(n1, n2) {
    return new Foximal(n1).logbase(n2)
}
Foximal.fromFoximal = function(value) {
    return new Foximal().fromFoximal(value)
}
Foximal.fromNumber = function(value) {
    return new Foximal().fromNumber(value)
}
Foximal.fromString = function(value) {
    return new Foximal().fromString(value)
}
Foximal.ceil = function(value) {
    return new Foximal(value).ceil()
}
Foximal.floor = function(value) {
    return new Foximal(value).floor()
}
Foximal.cmp = function(n1, n2) {
    return new Foximal(n1).cmp(n2)
}
Foximal.pow = function(n1, n2) {
return new Foximal(n1).pow(n2)
}
Foximal.root = function(n1, n2) {
    return new Foximal(n1).root(n2)
}
Foximal.sqrt = function(n1) {
    return new Foximal(n1).sqrt()
}
Foximal.cbrt = function(n1) {
    return new Foximal(n1).cbrt()
}
Foximal.eq = function(n1, n2) {
    return new Foximal(n1).eq(n2)
}
Foximal.exp = function(n1) {
    return new Foximal(n1).exp()
}
Foximal.fact = function(n1) {
    return new Foximal(n1).fact()
}
Foximal.gamma = function(n1) {
    return new Foximal(n1).gamma()
}
Foximal.isFinite = function(n1) {
    return new Foximal(n1).isFinite()
}
Foximal.isInfinite = function(n1) {
    return new Foximal(n1).isInfinite()
}
Foximal.isint = function(n1) {
    return new Foximal(n1).isint()
}
Foximal.isNaN = function(n1) {
    return new Foximal(n1).isint()
}
Foximal.isneg = function(n1) {
    return new Foximal(n1).isneg()
}
Foximal.ispos = function(n1) {
    return new Foximal(n1).ispos()
}
Foximal.lambertw = function(n1) {
    return new Foximal(n1).lambertw()
}
Foximal.mod = function(n1, n2) {
    return new Foximal(n1).mod(n2)
}
Foximal.neq = function(n1, n2) {
    return new Foximal(n1).neq(n2)
}
Foximal.min = function(n1, n2) {
    return new Foximal(n1).min(n2)
}
Foximal.max = function(n1, n2) {
    return new Foximal(n1).max(n2)
}
Foximal.round = function(n1) {
    return new Foximal(n1).round()
}
Foximal.ssrt = function(n1) {
    return new Foximal(n1).ssrt()
}
Foximal.toString = function(n1, decimals=5) {
    return new Foximal(n1).toString(decimals)
}
Foximal.toF = function(n1) {
    return new Foximal(n1).toF()
}