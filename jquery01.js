(function(window,undefined){

    var 
        //在dom中使用的延迟
        readyList,
        //对根jQuery（文档）的中心引用
        rootjQuery,

        //兼容ie<10
        //用 typeof xmlNote.method 替代 xmlNote.method !== undefined
        core_strundefined = typeof undefined,

        location = window.location,
        document = window.document,
        docElem = document.documentElement,

        _jQuery = window.jQuery,
        _$ = window.$,

        //保存数据类型例如："[object Function]" "[object Object]"
        class2type = {},
        //删除的数据缓存id列表，因此我们可以重用它们
        core_deletedIds = [],
        //保存对某些核心方法的引用
        core_version = "1.10.2",
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty,
        core_concat = core_deletedIds.concat,
        core_push = core_deletedIds.push,
        core_slice = core_deletedIds.slice,
        core_indexOf = core_deletedIds.indexOf,
        core_trim = core_version.trim,

        //jQuery可以看做是一个生成jq实例的工厂函数
        jQuery = function(selector,context){
            //init作为构造函数
            return new jQuery.fn.init(selector,context,rootjQuery);
        },

        //match number
        core_pnum = /[-+]?(?:\d*\.|)\d+(?:[eE][+-]?\d+)/.source,
        //used for splitting on whitespace
        core_rnotwhite = /\S+/g,
        // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        // A simple way to check for HTML strings
        // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
        // Strict HTML recognition (#11290: must start with <)
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        // Match a standalone tag
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        
        //JSON RegExp
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

        // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,
        
        // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function( all, letter ) {
            return letter.toUpperCase();
        },

        //the ready event handler
        completed = function(event){
            if(document.addEventListener || event.type === "load" || document.readyState === "complete") {
                detach();
                jQuery.ready();
            }
        },
        //Clean-up method for dom ready events
        detach = function() {
            if( document.addEventListener ) {
                document.removeEventListener( "DOMContentLoaded", completed, false );
                window.removeEventListener( "load", completed, false );
            } else {
                document.detachEvent( "onreadystatechange", completed );
                window.detachEvent( "onload", completed);
            }
        };

    jQuery.fn = jQuery.prototype = {
        jquery: core_version,
        constructor: jQuery,
        init: function(selector,context,rootjQuery){
            //this 指向实例本身 init是实际的构造函数
            var match, elem;
            // handle: $("") $(null) $(undefined) $(false)
            if( !selector ) {
                return this;
            }
            //handle html strings
            if( typeof selector === "string" ) {
                if( selector.charAt(0) === "<" && selector.charAt(selector.length -1) === ">" && selector.length >= 3 ){
                    //假设以<>开头和结尾的字符串是HTML并跳过正则表达式
                    match = [ null, selector,null ];
                } else {
                    //匹配的结果
                    // rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/ 简单的检测 HTML 字符串的表达式
                    match = rquickExpr.exec( selector );
                }
                 //匹配html或确保没有为id指定上下文
                if( match && (match[1] || !context) ) {
                    // HANDLE: $(html) -> $(array)
                    if( match[1] ) {
                        context = context instanceof jQuery ? context[0] : context;
                        jQuery.merge( this, jQuery.parseHTML(
                            match[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        ));

                        //handle:$(html, props)
                        // $("<div>", {
                        //     "class": "test",
                        //     text: "Click me!",
                        //     click: function(){
                        //       $(this).toggleClass("test");
                        //     }
                        // })
                        if( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
                            for ( match in context ) {
                                if(jQuery.isFunction( this[match] ) ) {
                                    this[ match ]( context[match] );
                                } else {
                                    this.attr( match, context[match] );
                                }
                            }
                        }
                        return this;
                        //handle: $(#id)
                    } else {
                        elem = document.getElementById( match[2] );
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if( elem && elem.parentNode ) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if( elem.id !== match[2] ){
                                return rootjQuery.find( selector );
                            }
                            this.length = 1;
                            this[0] = elem;
                        }
                        this.context = document;
                        this.selector = selector;
                        return this;
                    }
                //handle: $(expr, $(...))
                } else if( !context || context.jquery ) {
                    return ( context || rootjQuery ).find( selector );

                // HANDLE: $(expr, context)
                // (which is just equivalent to: $(context).find(expr)
                } else {
                    return this.constructor( context ).find( selector );
                }
            // HANDLE: $(DOMElement)
            } else if( selector.nodeType ) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            } else if(jQuery.isFunction( selector ) ){
                return rootjQuery.ready( selector );
            }
            //如果传入了jQuery对象，那么也是把参数jQuery的selector和context直接封装到新创建的jQuery对象上面!调用方式如$($(''))这种方式!
            if( selector.selector !== undefined ) {
                this.selector = selector.selector;
                this.context = selector.context;
            }
            return jQuery.makeArray( selector, this );
            
        },


        selector: "",
        //jQuery 对象的默认长度
        //jQuery 对象里选取dom节点数目，有了这个属性就是个伪数组了
        length: 0,
        //jq对象转化成数组
        toArray: function(){
            return core_slice.call(this);
        },

        push: core_push,
        sort: [].sort,
        splice: [].splice
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
    // 使用 jQuery.extend({},{a:'a'})
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

        //extend jQuery itself if only one arguments is passed
        if( length = i ){
            target = this;
            --i;
        }

        //可以传入多个复制源
        //i是从1或2开始的
        for ( ; i<length; i++ ) {
            // only deal with non-null/undefined values
            // options 对应传入的一个或者多个合并对象
            if( (options = arguments[i]) != null ){
                for (name in options) {
                    src = target[name]; 
                    copy = options[name]; //获取options对应的val
                    //防止死循环 已经复制完成了
                    if( target === copy ){
                        continue;
                    }

                    //这里是递归调用，最终都会到下面的 else if 分支
                    //jQuery.isPlainObject 用于测试是否为纯粹的对象,纯粹的对象指的是 通过 "{}" 或者 "new Object" 创建的
                    if( deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                        if( copyIsArray ){
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src)? src:[];
                        }else{
                            clone = src && jQuery.isPlainObject(src)? src :{};
                        }
                        //递归深拷贝
                        target[name] = jQuery.extend(deep,clone,copy)
                    }else if(copy !== undefined ){
                        target[name] = copy;
                    }
                }
            }
        }
    };
    // 添加静态方法
    jQuery.extend({

        expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, ""),
        noConflict: function( deep ) {
            if( window.$ === jQuery ) {
                window.$ = _$;
            }
            if( deep && window.jQuery === jQuery
            )
        },
        // 通过全局定义的core_toString将类型转化成字符串结果比较
        type: function( obj ) {
            if( obj==null ){
                return String( obj );
            }
            return typeof obj === "object" || typeof obj === "function" ? 
                class2type[ core_toString.call(obj)] || "object" : 
                typeof obj;
        },
        isFunction: function( obj ) {
            return jQuery.type(obj) === 'function';
        },
        isArray: function( obj ) {
            return jQuery.type(obj) === 'array';
        },
        //isNaN是否是NaN类型 isFinite是否是有限数字【数字 & 非无穷】
        isNumeric: function(obj) {
            return !isNaN(parseFloat(obj)) && isFinite( obj );
        },
        // 测试对象是否是纯粹的对象
        // 通过 "{}" 或者 "new Object" 创建的
        isPlainObject: function( obj ) {
            var key;
            if( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ){
                return false;
            }

            try {
                if( obj.constructor && 
                    ! core_hasOwn.call(obj,"constructor") &&
                    ! core_hasOwn.call(obj.constructor.prototype,"isPrototypeOf") ) {
                        return false
                }
            } catch(e) {
                return false;
            }
            //兼容ie<9
            if(jQuery.support.ownLast) {
                for (key in obj){
                    return core_hasOwn.call(obj,key)
                }
            }
            // Own properties are enumerated firstly, so to speed up,
		    // if last one is own, then all properties are own.
            for ( key in obj ) {}

            return key === undefined || core_hasOwn.call(obj,key)
        },

        isWindow: function( obj ) {
            return obj != null && obj == obj.window;
        },
        error: function(msg){
            throw new Error(msg);
        },
        noop: function() {},

        

        

    });

    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(i, name) {
        class2type[ "[object"+ name +"]" ] = name.toLowerCase();
    });

    window.$ = window.jQuery = jQuery;
})(window)