(function(window,undefined){

    var 
        class2type = {},
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty,


        //jQuery可以看做是一个生成jq实例的工厂函数
        jQuery = function(selector,context,rootjQuery){
            //init作为构造函数
            return new jQuery.fn.init(selector,context,rootjQuery);
        };

    jQuery.fn = jQuery.prototype = {
        init: function(selector,context,rootjQuery){
            //this 指向实例本身 init是实际的构造函数
        },
    };

    //init的原型指向jQuery原型形成共享，只是修改了原型的指向
    jQuery.fn.init.prototype = jQuery.fn;

    // 添加可以扩展jQuery的静态方法和实例方法的合并函数extend
    // 合并两个或更多对象的属性到第一个对象中，jQuery 后续的大部分功能都通过该函数扩展
    // 虽然实现方式一样，但是要注意区分用法的不一样，那么为什么两个方法指向同一个函数实现，但是却实现不同的功能呢,主要是this的指向不同
    // 如果传入两个或多个对象，所有对象的属性会被添加到第一个对象 target
    // 如果只传入一个对象，则将对象的属性添加到 jQuery 对象中，也就是添加静态方法
    // 用这种方式，我们可以为 jQuery 命名空间增加新的方法，可以用于编写 jQuery 插件
    // 如果不想改变传入的对象，可以传入一个空对象：$.extend({}, object1, object2);
    // 默认合并操作是不迭代的，即便 target 的某个属性是对象或属性，也会被完全覆盖而不是合并
    // 如果第一个参数是 true，则是深拷贝
    // 从 object 原型继承的属性会被拷贝，值为 undefined 的属性不会被拷贝
    // 因为性能原因，JavaScript 自带类型的属性不会合并
    jQuery.extend = jQuery.fn.extend = function(){
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        
        //handle a deep copy situation
        if( typeof target === "boolean" ){
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        //handle case when target is string or something(possible in deep copy)
        if( typeof target !== "object" && !jQuery.isFunction(target) ){
            target = {};
        }

    };
    // 添加静态方法
    jQuery.extend({
        isFunction: function( obj ) {
            return jQuery.type(obj) === 'function';
        },
        type: function( obj ) {
            if( obj==null ){
                return String( obj );
            }
            return typeof obj === "object" || typeof obj === "function" ? 
                class2type[ core_toString.call(obj)] || "object" : 
                typeof obj;
        }

    });

    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(i, name) {
        class2type[ "[object"+ name +"]" ] = name.toLowerCase();
    });

    window.$ = window.jQuery = jQuery;
})(window)