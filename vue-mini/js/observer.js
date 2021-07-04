// 响应式对象，可以随时观察data属性数据的变化
class Observer{
    constructor(data){
        // 将data转为响应式
        this.walk(data);
    }
    walk(data){
        // 判断data是否存在，判断data的类型为对象
        if(!data || typeof data !== 'object') return;
        Object.keys(data).forEach(key=>{
            this.defineReactive(data, key);
        })
    }
    defineReactive(obj, key){
        let _self = this;
        // 创建Dep实例对象，建立依赖对象（发布者）
        let dep = new Dep()

        // 创建临时中间变量value，可以在getter的return中使用
        let value = obj[key];

        // ⭐️如果data下属性的数据仍是对象，需要把对象下的属性继续执行响应式
        this.walk(value)

        // 和_proxy方法很大的区别是第一个参数，_proxy第一个参数是vue实例，该处的第一个参数是data对象
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true, 
            get(){
                // console.log("observer");
                // 收集依赖，Dep.target是watcher的实例对象
                Dep.target && dep.addSub(Dep.target)
                // 此处return的结果不能是obj[key]，因为第一个参数对象是obj
                return value;
            },
            set(newValue){
                if(newValue === value) return;
                value = newValue;
                // ⭐️给data的属性赋值为一个对象，需要将该对象转为响应式，如果赋值的是基本类型，则不是响应式
                _self.walk(newValue)
                // 监听数据的变化,发送通知
                dep.notify()
            }
        })
    }
}