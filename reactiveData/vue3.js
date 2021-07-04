// 数据响应式，在vue3中使用proxy对象，代理整个data对象，不需要递归
let data = {
    msg: "hello",
    count:0
}
let vm = new Proxy(data, {
    get(target, key) {
        return target[key];
    },
    set(target, key, value) {
        if(value === target[key]) return;
        target[key] = value;
        document.querySelector("#app").textContent = value;
    }
})

vm.msg = "update";
console.log(vm.msg);