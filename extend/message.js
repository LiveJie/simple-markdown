/**
 * @description 提示组件
 * @author jie
 * @export
 * @param {*} msg 提示信息 duration 持续时间
 * @returns Map
 */

 
function Message() {
    this.success = function(msg = "", duration = 3) {
        let className = "message active success"
        this.showThis(msg, duration, className)
    }
    this.wraning = function(msg = "", duration = 3) {
        let className = "message active wraning"
        this.showThis(msg, duration, className)
    }
    this.error = function(msg = "", duration = 3) {
        let className = "message active error"
        this.showThis(msg, duration, className)
    }
    this.showThis = function(msg, duration, className) {
        if(!msg) {
            return Error("msg is null")
        }
        let divDom = document.createElement("div")
        divDom.innerText = msg
        divDom.className = "message";
        document.body.appendChild(divDom)
        setTimeout(function(){
            divDom.className = className || "message"
        },0)
        setTimeout(function(){
            document.body.removeChild(divDom)
        }, duration * 1000)
    }
}
