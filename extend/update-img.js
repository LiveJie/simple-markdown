/**
 * @description 图片上传插件
 * @author jie
 * @export
 * @param {*} 
 * @returns 
 */

;
(function () {
    var factory = function () {
        let _this = this
        this.Message = null;
        this.fileList = [];
        let imgWrapperDom = document.getElementById("extend-img-dialog-wrapper")
        // 插件初始化
        this.init = function () {
            this.Message = new Message()
            let updateDom = document.createElement("div")
            updateDom.setAttribute("id", "update-wrapper")
            updateDom.className = "update-wrapper"
            updateDom.innerHTML = `
            <div class="input-box-wrapper">      
                <div class="input-box" onclick="selectFile()">
                    <div class="svg-box">
                        <svg viewBox="0 0 1024 1024" focusable="false" class="" data-icon="inbox" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path></svg>
                    </div>
                    <div class="title">Click or drag file to this area to upload</div>
                    <div class="desc">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</div>
                </div>
                <div class="file-list-wrapper">
                </div>
                <input id="input-file" type="file" style="display: none;" accept="image/*" multiple></input>
                <div class="button-wrapper">
                    <div class="ensure btn">确认</div>
                    <div class="cencel btn" onclick="hide()">取消</div>
                </div>
            </div>
            `;
            imgWrapperDom.appendChild(updateDom);

            //监听input上传图片
            let fileDom = document.getElementById('input-file');
            fileDom.onchange = function(e) {
                e.preventDefault();
                let fileList = e.target.files
                if(fileList.length > 5) {
                    _this.Message.error("图片最多只能选择5张!")
                }else {
                    for(let item of fileList) {
                        if(!item.type.match("image")) {
                            _this.Message.error("请上传正确格式的图片！")
                            return false
                        }
                        _this.fileList.push(item)
                        var read = new FileReader();
                        read.readAsDataURL(item);
                        read.onload = function (e) {
                            addFileList(this.result, item.name)
                        }
                    }
                }
            }

            //图片拖拽上传
            let box = document.getElementById('update-wrapper');
            box.ondragover = function (e){
                e.preventDefault();
            }
            // 拖拽图片
            box.ondrop = function (e){
                e.preventDefault();
                var files = e.dataTransfer.files;//获取到第一个上传的文件对象
                for(let file of files) {
                    if(!file.type.match("image")) {
                        _this.Message.error("请上传正确格式的图片！")
                        return false
                    }
                    _this.fileList.push(file)
                    var fr=new FileReader();//实例FileReader对象
                    fr.readAsDataURL(file);//把上传的文件对象转换成url
                    fr.onload=function (e){
                        addFileList(this.result, file.name)
                        // var Url=e.target.result;//上传文件的URL
                        var Url=this.result;//上传文件的URL
                        // box.innerHTML+='<img src="'+Url+'" alt="">';
                    }
                }
            }
        }()

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
                imgWrapperDom.appendChild(divDom)
                setTimeout(function(){
                    divDom.className = className || "message"
                },50)
                setTimeout(function(){
                    imgWrapperDom.removeChild(divDom)
                }, duration * 1000)
            }
        }

        this.getFileList = function () {
            return this.fileList
        }

        this.hide = function () {
            this.fileList = [];
            imgWrapperDom.style.display = 'none';
        }
        this.show = function () {
            this.fileList = [];
            imgWrapperDom.style.display = 'block';
        }

        //加载进度条
        this.speedProgress = function (e) {
            const lastLinearDom = e.children[e.children.length - 1]
            let w = ~~lastLinearDom.style.width.replace("%", "")
            if(w >= 100) {
                lastLinearDom.style.width = '';
            }else {
                let randomNum = Math.floor(Math.random()*10)
                if((w + randomNum) >= 100) {
                    lastLinearDom.style.width = '';
                }else {
                    lastLinearDom.style.width = w + randomNum + '%';
                    setTimeout(function(){
                        speedProgress(e)
                    },100)
                }
            }
        }

        //添加图片文件
        this.addFileList = function(url, name) {
            let fileListDom = document.getElementsByClassName("file-list-wrapper")[0]
            if(fileListDom.children.length >= 5) {
                this.Message.error("图片最多只能选择5张!")
                return
            }
            let html = `
                <div class="left">
                    <img src="${url}" alt="">
                    <div class="name">${name}</div>
                </div>
                <div class="right" onclick="deleteDom(this)">
                    <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>
                </div>
                <div class="file-list-linear"></div>
            `
            let divDom = document.createElement("div")
            divDom.className = "list"
            divDom.innerHTML = html;
            fileListDom.appendChild(divDom)
            _this.speedProgress(divDom)
        }

        //点击删除元素
        this.deleteDom = function(e) {
            e.parentNode.remove(e)
        }

        // 模拟点击上上传图片
        this.selectFile = function() {
            var fileDom = document.getElementById('input-file');
            fileDom.click()
        }
    };
    // CommonJS/Node.js
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        module.exports = factory;
    } else if ((typeof define === "function") && define.amd) { // AMD/CMD/Sea.js
        define([], factory);
    } else {
        // for Sea.js
        factory();
    }

})();