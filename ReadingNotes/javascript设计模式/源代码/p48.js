Function.prototype.before = function (fn) {
    var _this = this;
    return function () {
        fn.apply(this, arguments)
        return _this.apply(this, arguments)
    }
}

Function.prototype.after = function (fn) {
    var _this = this;
    return function () {
        var ret = _this.apply(this, arguments)
        fn.apply(this, arguments)
        return ret
    }
}
var func = function () {
    console.log(2)
}

func = func.before(() => { console.log(1) }).after(() => { console.log(3) })

func()