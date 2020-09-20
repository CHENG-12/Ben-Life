
//一二级分类的动态渲染
(function() {
	var categoryList = JSON.parse(sessionStorage.getItem("data")).categoryList;
	categoryList.filter(function(item) { return item.fid === 0; }).forEach(function(item,i) {
		var liEl = document.createElement("li");
		liEl.className = "v-middle"; 
		liEl.innerHTML = `
			<span class="menu-icon" style="background-position: 0  -${i* 33}px;"></span> 
			<span>${ item.name}</span>
		`;
			
		// 动态的插入二级菜单
		var subUlEl = document.createElement("ul");
		subUlEl.className = "category-sub";
		var subCategoryList= categoryList.filter(function(item2) {
			return item2.fid === item.id;
		});
		if(subCategoryList.length === 0) {
			subUlEl.innerHTML = "<li class='v-middle'>暂无相关商品</li>";
		}else {
			subCategoryList.forEach(function(item2) {
				subUlEl.innerHTML += `<li class='v-middle'><a href="../list/list.html?cid=${ item2.id}">${item2.name}</a></li>`;
			});
		}
		liEl.appendChild(subUlEl);
		document.querySelector("ul.category-main").appendChild(liEl);
	});
	
})();
// 右下角固定区域的动态渲染
(function() {
	var fixUlEl = document.querySelector("ul.fix-right");
	fixUlEl.innerHTML = `
						<li class="top"></li>
						<a href="../cart/cart.html"><li class="quality">0</li></a>
						<li></li>	
						<li></li>
						`;
})();
// 回到顶部
(function(){
	var buttonTop = document.querySelector(".fix-right>ul.fix-right>li.top");
	var scrollToTop = null;
    buttonTop.onclick = function(){
		var scrollToTop =setInterval(function () {
			// 滚动条在Y轴上的位置，距离顶部的数值
			var pos = pageYOffset;
			// 若这个值大于0，说明滚动条被向下拉动
			if (pos > 0) {
				// 滚动到当前位置-20
			   scrollTo(0, pos-pos*0.05);
			} else {
				// 否则清理计时器
			   clearInterval(scrollToTop);
			}
		}, 10);
	}
	
})();

// 购物车的数量页面更新加动态渲染部分
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
			document.querySelector(".cartList ul.cartList").innerHTML= `
			
			<p>亲亲,暂无购物车信息展示!<br/>您当前没有登录或者已经登录但是购物车为空哦!</p>
			
			`;
		}
		return;
	} else {
		
		var money = 0;
		buyQualiEl.innerText = total;
		qualityEl.innerText = total;
		var ulEl = document.querySelector("div.cartList ul.cartList");
		var cartListBottom = document.querySelector(".cartList-bottom");
		var data = JSON.parse(sessionStorage.getItem("data"));
		var cartList = data.cartList;
		var productList = data.productList;
		console.log(productList);
		qualityEl.style.background = "url(../images/fix/fixrjie.gif) no-repeat -15px 0px";
		qualityEl.style.borderColor = "#90B42F";
		userCartList = cartList.filter(function(item) {return item.name === userName});
		userCartList.forEach(function(item) {
			
			var product = productList.find(function(item2) {return item2.id === item.pid});
			money += item.count * product.price;
			ulEl.innerHTML += `
				<li class="clearfix">
					<div>
						<img src="${product.avatar}" alt="">
					</div>
					<div class="name">${product.name}</div>
					<div class="price">${product.price}</div>
					<div class="total">
						× 
						<span>${item.count}</span>
					</div>
				</li>
			
			
			
			`;
			
			
		});
		
		ulEl.innerHTML +=`
			<div class="cartList-bottom">
				共<span>${total}</span>件商品 总计￥<span>${money}</span>
				<a href="../cart/cart.html">去结算</a>
				
			</div>
		
		
		`;
		
	};
	
})();
//随机获取验证码
(function() {
	var codes = ["A","B","C","D","E","F","G","0","1","2","3","4","5","6","7","8","9","H","I","J","K","L","M","N"];
	var codeEl = document.querySelector(".tab-content span.code");
	 codeEl.onclick = function() {
		 var codeStr = "";
		 for(i = 1; i < 5; i++){
			 codeStr +=  codes[Math.floor(Math.random() * codes.length)];
		 };
		this.innerText = codeStr;
	 };
	
})();

//登录页面区域 切换
(function() {
	var loginEls = document.querySelectorAll(".tab-title>span");
	var contentEls = document.querySelectorAll(".tab-content>div");
	loginEls.forEach ( function(item,i) {
		item.onclick = function(){
		if(this.classList.contains("active")) return;
		this.parentNode.querySelector(".active").classList.remove("active");
		this.classList.add("active");
		document.querySelector(".tab-content>div.active").classList.remove("active");
		document.querySelectorAll(".tab-content>div")[i].classList.add("active");
		};
	});
	
})();
//验证用户名和密码是否正确
(function() {
	document.querySelector("input.btn-login-pwd").onclick = function(){
		var name = document.querySelector(".tab-content input.name").value.trim();
		var pwd = document.querySelector(".tab-content input.pwd").value.trim();
		var userList = JSON.parse(sessionStorage.getItem("data")).userList;
		var cartList = JSON.parse(sessionStorage.getItem("data")).cartList;
		var total = 0;
		if(userList.some(function(item) {return item.name === name && item.pwd === pwd})){
			Cookies.set("user", name);
			var backUrl = Cookies.get("backUrl");
			Cookies.remove("backUrl");
			window.location.replace( backUrl || "../index/index.html");
			//登录的同时计算该用户的所购买的商品总数量, 然后存放在Cookie里面
			cartList.filter(function(item) { return item.name === name}).forEach(function(item) {
				total += item.count;
			});
			Cookies.set("total",total);
			
			
			
		} else{
			Message.notice("用户名或者密码错误!")
		}
		
		
		
		
		
		
	
	};
	
	
	
	
})();
//手机验证码登录
(function() {
	document.querySelector("input.btn-login-phone").onclick = function() {
		var phone = document.querySelector("input.phone").value.trim();
		var code = document.querySelector("input.code2").value.trim();
		var userList = JSON.parse(sessionStorage.getItem("data")).userList;
		
		if(code !== document.querySelector("span.code").innerText || code.toUpperCase() === "请输入验证码"){
			Message.notice("验证码输入错误");
			return;
		}
		console.log(userList.some(function(item) { 
			return item.phone === phone;}));
		
		//接着判断手机号是否正确
		if(userList.some(function(item) { return item.phone !== phone;})){
			Cookies.set("user", userList.find(function(item){ return item.phone === phone}).name);
			var backUrl = Cookies.get("backUrl");
			Cookies.remove("backUrl");
			window.location.replace( backUrl || "../index/index.html");
		}else{
			Message.notice("手机号输入错误!");
		}
	}
	
	
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
