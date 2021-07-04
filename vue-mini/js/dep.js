
class Dep{
    constructor(){
        this.subs=[]
    }
    //添加观察者
    addSub(sub){
        if(sub&&sub.update){
            this.subs.push(sub)
        }
    }
    // 给每个观察者发送通知
    notify(){
        this.subs.forEach(sub=>sub.update())
    }
}