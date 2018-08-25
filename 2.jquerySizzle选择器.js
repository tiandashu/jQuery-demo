

var jquery = function (selector,context) {
    return new jquery.prototype.init();
}
/*
* 本质上讲jquery.fn.init构建的出来的对象，就是jquery对象
* */
jquery.fn = jquery.prototype = {
    init:function (selector,context,rootJquery) {
        var match,elem;

        //handle:$(""), $(null), $(undefined), $(false) 确保代码的健壮性
        if(!selector){
            return this;
        }

        //handle HTML string
        if( typeof selector === "string" ){
            // HANDLE: $(DOMElement)
        }
    }
}


jquery.fn.init.prototype = jquery.fn;

