// 监测数据变化，并更新视图，在compiler中调用
class Watcher{
    constructor(vm, key, cb){
        this.vm = vm;
        // data中属性名
        this.key = key;
        // 由于更新视图的形式不同，可以传递cb回调函数处理不同的方法，cb负责更新视图：
        // 如：差值表达式更新的是textContent，v-model指令需要更新input元素的value
        this.cb = cb;

        /* ⭐️⭐️⭐️
        watcher和dep建立关系
        把watcher对象记录到Dep类的静态属性target上
         */
        Dep.target = this;

        // 通过访问vm中的属性，就会触发get方法，在get方法中调用addSub，下面的vm[key]正好执行
        this.oldValue = vm[key];
        
        // 调用过addSub，把watcher添加到dep的sub之后，需要将watcher置空，以便下次使用
        Dep.target = null;
    }

    // 当数据发生变化时，更新视图
    update(){
        let newVal = this.vm[this.key]
        if(newVal === this.oldValue) return;
        this.cb(newVal)
    }
}