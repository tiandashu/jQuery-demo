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

/*
* 解决问题：访问jquery原型上的属性和方法
* 将init的原型和jquery的原型指向同一个原型
*
* */


var jquery = function (selector,context) {
    console.log(this);//window  jqery的this
    return new jquery.prototype.init();
    //return  jquery.prototype.init();
}

/*赋值fn纯粹是为了书写方便*/
jquery.fn = jquery.prototype = {
    init:function () {
        this.age = 18;
        console.log(this);//return new的时候this指向 init；直接return的时候this指向{init: ƒ}
    },
    age:36
}
/*注意：一定是将jq的原型赋值给init的原型。换句话说jQuery的原型对象覆盖了init构造器的原型对象。
* 因为是引用传递所以不需要担心这个循环引用的性能问题
*
* 特别注意的一点是：如果init构造函数中和原型中存在相同的属性或者方法一定是先访问init构造函数上的
*
* */
jquery.fn.init.prototype = jquery.fn;

/*通过以上分析：得出jq的本质其实将jq的构造函数和jq的原型同时放在一起，就实现了wunew构建*/