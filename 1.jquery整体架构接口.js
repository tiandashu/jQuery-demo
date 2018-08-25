
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
*/

/*
* 解决了wunew构建还有一个就是链式调用：
* 为什么采用链式调用的方式？1.节约js代码 2.所返回的都是同一个对象，可以提高代码的效率
* 缺点：最糟糕的是所有对象的方法返回的都是对象本身，也就是说没有返回值，这不一定在任何环境下都适合。
* */
/*
* 根据一般设计者的习惯，如果要为jQuery或者jQuery prototype添加属性方法，同样如果要提供给开发者对方法的扩展，从封装的角度讲是不是应该
* 提供一个接口才对，字面就能看懂是对函数扩展，而不是看上去直接修改prototype.友好的用户接口，jQuery支持自己扩展属性，这个对外提供了一
* 个接口，jQuery.fn.extend()来对对象增加方法从jQuery的源码中可以看到，jQuery.extend和jQuery.fn.extend其实是同指向同一方法的不同引用
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
* 特别注意的一点是：如果init构造函数中和原型中存在相同的属性或者方法一定是先访问init构造函数上的
* */
jquery.fn.init.prototype = jquery.fn;
/*通过以上分析：得出jq的本质其实将jq的构造函数和jq的原型同时放在一起，就实现了wunew构建*/
jquery.extend = jquery.fn.extend = function(){
   //jquery.extend 对jquery本身的属性和方法进行了扩展  静态方法（工具方法）
   //jquery.fn.extend 对jquery.fn的属性和方法进行了扩展
   var src,copyIsArray,copy,name,options,clone,
   target = arguments[0] || {}, // 常见用法jquery.extend( obj1, obj2 )，此时，target为arguments[0]
   i = 1,
   length = arguments.length,
   deep = false;

    //handle a deep situation
    if(typeof target === "boolean"){ // 如果第一个参数为true，即 jquery.extend( true, obj1, obj2 ); 的情况
        deep = target; //处理的是深拷贝，此时target是true
        target = arguments[i] || {}; // target改为 obj1
        //skip the boolean and target
        i++;//2
    }

    //handle case when target is a string or something(possible in deep copy)
    if(typeof target !== "object" && !jquery.isFunction(target)){
        target = {};
    }

    //extend jquery itself if only one argument is passed
    if(length === i){
        target = this;// jquery.extend时，this指的是jQuery；jquery.fn.extend时，this指的是jQuery.fn
        --i; //0
    }

    for(;i<length;i++){
        if( (options = arguments[i])!= null ){// 比如 jquery.extend( obj1, obj2, obj3, ojb4 )，options则为 obj2、obj3...
            for(name in options){
                src = target[name];//?????
                copy = options[name];
                if( target === copy){//防止自循环引用 直接跳过继续
                    continue;
                }
                //如果是深拷贝  分为对象和数组的区别
                if( deep && copy && (jquery.isPlainObject(copy) || (copyIsArray = jquery.isArray(copy)) ) ){
                    if(copyIsArray){
                        copyIsArray = false;
                        clone = src && jquery.isArray(src) ? src : [];
                    }else{
                        clone = src && jquery.isPlainObject(src) ? src : {};
                    }
                    //使用递归循环实现拷贝
                    target[name] = jquery.extend(deep,clone,copy);
                }else if(copy != undefined){//浅拷贝且拷贝的不为undefined
                    target[name] = copy;
                }
            }
        }
    }

    return target;
}

