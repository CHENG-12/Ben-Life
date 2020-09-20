//希望用户怎么调用
//想好自己的插件用怎么用才舒服
//根据功能来分析具体的参数设计
var Message = {
	alert: function(msg) {
		if(document.querySelector("message-alert"));
		var div = document.createElement("div");
		div.className = "message-alert";
		div.style.position = "fixed";
		div.style.left = '0';
		div.style.top = "0";
		div.style.width = "100%";
		div.style.height = "100%";
		div.style.backgroundColor = "rgba(0,0,0,.5)";
		div.innerHTML += `
			<div style="
				min-width: 200px;min-height:150px;
				position: absolute;left: 50%;top: 50%;
				transform: translate(-50%,-50%);
				background-color: #fff;
				padding: 0 20px 50px 20px;
				box-shadow: 0 0 10px 0 #fff;
			">
				<h2>提示</h2>
				<p style="text-indent: 2em; color: #999;">${ msg }</p>
				<input type="button" value="确定" style="" class="btn-ok" />
			</div>
		`;
		document.body.appendChild(div);
		div.querySelector('input.btn-ok').onclick = function() {
			document.body.removeChild(div);
		};
	},
	confirm: function(msg, callback) {
		if(document.querySelector("message-confirm"));
		var div = document.createElement("div");
		div.className = "message-confirm";
		div.style.position = "fixed";
		div.style.left = '0';
		div.style.top = "0";
		div.style.width = "100%";
		div.style.height = "100%";
		div.style.backgroundColor = "rgba(0,0,0,.5)";
		div.innerHTML += `
			<div style="
				min-width: 200px;min-height:150px;
				position: absolute;left: 50%;top: 50%;
				transform: translate(-50%,-50%);
				background-color: #fff;
				padding: 0 20px 50px 20px;
				box-shadow: 0 0 10px 0 #fff;
			">
				<h2>提示</h2>
				<p style="text-indent: 2em; color: #999;">${ msg }</p>
				<input type="button" value="确定" style="" class="btn-ok" />
				<input type="button" value="取消" style="" class="btn-cancel" />
			</div>
		`;
		document.body.appendChild(div);
		div.querySelector('input.btn-ok').onclick = function() {
			document.body.removeChild(div);
			if(typeof callback === "function") callback();
		};
		div.querySelector('input.btn-cancel').onclick = function() {
			document.body.removeChild(div);
		};
	},
	notice: function(msg) {
		var div = document.createElement("div");
		div.className = "message-notice";
		div.innerText = msg;
		div.style.position = "fixed";
		div.style.left = "50%";
		div.style.top = "50%";
		div.style.transform = "translate(-50%, -50%)";
		div.style.padding = "10px 20px";
		div.style.backgroundColor = "#000";
		div.style.color = "#fff";
		document.body.appendChild(div);
		setTimeout(function () {
			document.body.removeChild(document.querySelector(".message-notice"));
			
		},2000);
		
	}
};
//Message.alert();
//Message.confirm();