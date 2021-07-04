// 数据响应式，vue2中使用defineProperty定义，把data的属性，转为getter和setter属性
let data = {
    msg: "hello world",
    count: 0,
};
let vm = {}

// 数据劫持，给vm的msg设置成get/set方法，在设置属性或获取属性时可以加入一些操作
Object.defineProperty(vm, "msg",{
    enumerable: true,
    configurable: true,
    get(){
        return data.msg
    },
    set(newVal){
        data.msg = newVal
    }
})

console.log(vm.msg)
vm.msg = "change"

function proxyData(data) {
    Object.keys(data).forEach(item=>{
        // 定义响应式对象，必须有一个中介对象vm，否则会进入死循环
        Object.defineProperty(vm, item, {
            enumerable: true,
            configurable: true,
            get(){
                return data[item];
            },
            set(newVal){
                if(newVal === data[item] ) return;
                data[item] = newVal;
                // 数据值变化，更新dom的值
                document.querySelector("#app").textContent = data[item];
            }
        })
    })
}

proxyData(data);
vm.msg = "change msg"
// vm.count = 111