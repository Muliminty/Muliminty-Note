Function.prototype.uncurrying = function () {
    var self = this;     // self此时是Array.prototype.push
    return function () {
        console.log('arguments: ', arguments);// arguments:  [Arguments] { '0': { '0': 1, length: 1 }, '1': 2 }

        var obj = Array.prototype.shift.call(arguments);
        console.log('arguments: ', arguments);

        console.log('obj: ', obj);
        // obj是{
        //    "length": 1,
        //    "0": 1
        // }
        // arguments对象的第一个元素被截去，剩下[2]
        return self.apply(obj, arguments);
        // 相当于Array.prototype.push.apply( obj, 2 )
    };
};

var push = Array.prototype.push.uncurrying();
var obj = {
    "length": 1,
    "0": 1
};

push(obj, 2);
console.log(obj);     // 输出：{0: 1, 1: 2, length: 2}

