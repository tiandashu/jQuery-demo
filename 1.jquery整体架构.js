/*
* 通过使用jq可以发现显著的两个特点
* 1.无new构建
* 2.链式调用
*
*/

/*
* this总结：“this所指的就是直至包含this指针的上层对象”
* 普通函数 this指向 全局对象window
* 对象的方法 this指向 该对象
* 构造函数 this指向 新构造的对象（new创建的）
* */

var jquery = function (selector,context) {
    console.log(this);//window  jqery的this
    return new jquery.prototype.init();
    //return  jquery.prototype.init();
}

jquery.prototype = {
    init:function () {
        // this.age = 18;
        console.log(this);//return new的时候this指向 init；直接return的时候this指向{init: ƒ}
    },
    age:36
}

/*
* 思考：把jquery当作一个工厂函数，用来生产实例 this指向window
*  原型上的init当作构造函数，this指向构造的实例
*  那么通过jquery().age  返回的是18  显然和 真正的jquery 不一样
*  问题：怎么访问jquery原型上的属性和方法呢？？？即访问到age=36
* */