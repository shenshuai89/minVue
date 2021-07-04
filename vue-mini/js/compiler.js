
// 编译特殊语法
class Compiler{
    constructor(vm){
        this.vm = vm;
        this.el = vm.$el;
        // 创建实例对象后，立即编译模板
        this.compile(this.el)
    }
    // 编译模版,处理文本节点和元素节点
    compile(el){
        let childNode = el.childNodes;
        Array.from(childNode).forEach(item =>{
            // 处理文本节点
            if(this.isTextNode(item)){
                this.compileText(item);
            }
            // 处理元素节点
            else if(this.isElementNode(item)){
                this.compileElement(item);
            }

            // 判断item是否有子节点，如果有子节点，递归调用compile
            if(item.childNodes && item.childNodes.length>0){
                this.compile(item)
            }
        })
    }
    // 编译元素节点，处理指令
    compileElement(node){
        // 获取属性节点
        // console.log(node.attributes);
        // 遍历所有的属性节点
        Array.from(node.attributes).forEach((item)=>{
            /* 
                解析v-text="msg" 
                attrName : v-text
                key : msg
            */
            // 判断属性是否是指令
            let attrName = item.name;
            let keyVal = item.value;
            if(this.isDirective(attrName)){
                // 将指令v-去掉，v-text转为text，v-model转为model   
                attrName = attrName.substr(2)

                this.update(node, keyVal, attrName)
            }
        })
    }

/* 适配器设计模式 */
    update(node, key, attrName){
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }

    // 处理v-text指令
    textUpdater(node, value, key){
        node.textContent = value
        /* ⭐️指令v-text创建watcher对象，当数据改变更新视图 */
        new Watcher(this.vm, key, (newValue)=>{
            node.textContent = newValue
        })
    }
    // 处理v-model指令
    modelUpdater(node, value, key){
        node.value = value
        /* ⭐️指令v-model创建watcher对象，当数据改变更新视图 */
        new Watcher(this.vm, key, (newValue)=>{
            node.value = newValue
        })

        // 改变输入框的值，视图发生变化，双向绑定
        node.addEventListener("input", ()=>{
            this.vm[key] = node.value
        })
    }


    // 编译文本节点，处理差值表达式{{ msg }}
    compileText(node){
        // console.dir(node,"compileText");
        // ⭐️使用正则表达式处理差值表达式，差值表达式可能有多个括号，并且要把中间的值提取出来
        let reg = /\{\{(.+?)\}\}/
        // 获取文本节点内容
        let value = node.textContent;
        if(reg.test(value)){
            // 获取差值表达式中的值
            let key = RegExp.$1.trim();
            // 替换差值表达式的值
            node.textContent = value.replace(reg, this.vm[key]);

            /* ⭐️差值表达式，创建watcher对象，当数据改变更新视图 */
            new Watcher(this.vm, key, (newValue)=>{
                node.textContent = newValue;
            })
        }
    }

    // 判断是否是指令
    isDirective(attrName){
        // 属性以v-开头则为指令
        return attrName.startsWith("v-")
    }
    // 判断节点是否是文本
    isTextNode(node){
        return node.nodeType === 3;
    }
    // 判断节点是否是元素节点
    isElementNode(node){
        return node.nodeType === 1;
    }
}