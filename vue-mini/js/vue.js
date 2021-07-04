class Vue{
    constructor(options){
        // 通过属性，保存选项options的数据
        this.$options = options;
        this.$data = options.data;
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) :options.el 

        // 把data中的数转化成getter和setter，注入vue实例中
        this._proxyData(this.$data);

        // 调用observer对象，监听数据变化
        new Observer(this.$data);

        // 调用compiler对象，解析指令和差值表达式
        new Compiler(this)
    }
    // 让Vue实例代理data的属性,经过该操作，vue实例对就可以直接访问data中的属性
    _proxyData(data){
        // 遍历data中所有属性
        Object.keys(data).forEach((key)=>{
            // 要代理的对象是this即vue实例，把data中的属性都代理到vue实例上
            Object.defineProperty(this, key, {
                enumerable:true,
                configurable: true,
                get(){
                    // console.log("proxy");
                    return data[key];
                },
                set(newVal){
                    if(newVal === data[key]) return;
                    data[key] = newVal;
                 }
            })
        })
    }
}
