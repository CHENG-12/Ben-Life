// 右下角固定区域的动态渲染
(function() {
	var fixUlEl = document.querySelector("ul.fix-right");
	fixUlEl.innerHTML = `
						<li class="top"></li>
						<a href="#"><li class="quality"></li></a>
						<li></li>	
						<li></li>
						`;
})();
// 购物车的数量页面更新
(function() {
	var userName = Cookies.get("user");
	var buyQualiEl = document.querySelector(".buy-car>.buyquality");
	var qualityEl = document.querySelector(".fix-right li.quality");
	var total = 0;
	total = parseInt(Cookies.get("total"));
	//首先判断用户是否已经登录
	if( !userName || total === 0) {
		//未登录时就显示为灰色和0
		qualityEl.innerText === "0";
		qualityEl.style.backgroundImage ="url(../images/fix/fixrjie1.gif)" ;
		qualityEl.style.borderColor = "#ccc";
		if(document.querySelector(".cartList")){
			console.log(document.querySelector(".cartList"));
			document.querySelector(".cartList ul.cartList").innerHTML= `
			
			<p>亲亲,暂无购物车信息展示!<br/>您当前没有登录或者已经登录但是购物车为空哦!</p>
			
			`;
		}
		return;
	} else {
		qualityEl.innerText = total;
		qualityEl.style.background = "url(../images/fix/fixrjie.gif) no-repeat -15px 0px";
		qualityEl.style.borderColor = "#90B42F";
	};
	
})();
//获取总金额并进行渲染
(function() {

	
	document.querySelector(".container p span.account").innerText +=  parseInt(Cookies.get("account"));
	// Cookies.remove("account");
	
	
	
})();
//将秒数转化为时分秒的函数
function formatDate(value){
	var secondTime = parseInt(value);
	var minuteTime = 0;
	var hourTime = 0;
	if(secondTime > 60){
		minuteTime = parseInt(secondTime / 60);
		secondTime =parseInt(secondTime % 60);
		if(minuteTime > 60){
			hourTime = parseInt( minuteTime / 60);
			minuteTime = parseInt(minuteTime % 60);
		}
	}
	var result = "" + parseInt(secondTime) + "秒";
	if(minuteTime > 0){
	var result = "" + parseInt(minuteTime) + "分" + result;
	}
	if(hourTime >0 ){
		var result = ""+ parseInt(hourTime) + "小时" + result;
	}
	return result;
}

//点击确定然后弹出支付成功+更新该订单的支付状态+倒计时功能
(function() {
	var timer = null;
	var data = JSON.parse(sessionStorage.getItem("data"));
	var orderLists = data.orderList;
	var id = parseInt(window.location.search.slice(window.location.search.indexOf("=") + 1));
	var userOrderList = orderLists.find(function(orderList) {return orderList.id === id});
	//制作支付倒计时
	var min = 1;
	var minsec = min * 60 * 1000;
	timer = setInterval(function() {
		
		var timeBlank = (userOrderList.date + minsec - new Date().getTime())/1000;
		// console.log(timeBlank);
		//倒计时已经停止或者订单已经支付,都需要关掉正在进行中的倒计时
		if(timeBlank <= 0 || userOrderList.isPay === true){
			clearInterval(timer);
			timer = null;
			if(timeBlank <= 0){
				document.querySelector(".container p.time").innerText = `
				您的订单已过期,请重新下单!
				`;
				return;
			}
			return;
		}
		else{
			var time = formatDate(timeBlank);
			document.querySelector(".container p span.countdown").innerText = time;
			
		} 
	},1000);

//不同的支付状态不同的显示内容
	
	// 点击立即付款的过程
	var payMarkEl = document.querySelector(".pay-mark");
	var icnEl =	document.querySelector(".contain-wra .icn");
	var btnOkEl = document.querySelector(".contain-wra input.btn-ok");
	var cancelEl = document.querySelector(".contain-wra input.btn-cancel");
	var  spanEl = document.querySelector(".contain-wra span.amount");
	document.querySelector(".success-box a.pay-success").onclick = function(){
		console.log(document.querySelector(".container p.time").innerText);
		if(timer === null){
			Message.alert("亲亲您目前没有可支付的订单,请重新下单哦!");
			return;
		}
		 
		// 在蒙层里的支付操作点击事件
		payMarkEl.classList.add("show");
		// 取出总金额渲染到蒙层
		spanEl.innerText = parseInt(Cookies.get("account"));
		
		icnEl.onclick = function(){
			payMarkEl.classList.remove("show");
		};
		cancelEl.onclick = function() {
			payMarkEl.classList.remove("show");
		};
		btnOkEl.onclick = function(){
			//改变数据中的是否支付状态
			payMarkEl.classList.add("show");
			
			userOrderList.isPay = true;
			sessionStorage.setItem("data",JSON.stringify(data));
			Message.confirm("支付成功!",function(){
				payMarkEl.classList.remove("show");
				document.querySelector(".container p.time").innerText = `
							 订单已支付成功,待发货中~~ 您可以在右上角的 "我的订单"中查看所有订单信息!
				`;
			});
			
		};	
			
	};
	
})();
// 点击支付方式变化边框颜色
(function() {
	document.querySelectorAll(".types span").forEach(function(item){
		item.onclick = function() {
			document.querySelectorAll(".types span").forEach(function(item2){
				item2.classList.remove("click");
			})
			this.classList.add("click");
		}
	});
})();
//头部登录状态的改变
(function() {
	var loginEl = document.querySelector(".head-welcom a.login");
	var registerEl = document.querySelector(".head-welcom a.register");
	var loginBack = document.querySelector(".head-welcom .login-back");
	if(Cookies.get("user")){
		loginEl.innerText = Cookies.get("user");
		loginEl.classList.add("logined");
		loginEl.href ="";
		registerEl.classList.add("none");
		loginEl.onmouseover=function(){
			loginBack.classList.add("show")
		};
		loginBack.onmouseout=function(){
			loginBack.classList.remove("show")
		};
		loginBack.onclick = function() {
			Cookies.remove("user");
			Cookies.remove("total");
		};
		
	}else{
		loginEl.innerText = "[登录]";
		
	}
	
})();
