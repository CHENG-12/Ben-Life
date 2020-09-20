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
// 购物车的数量页面更新
(function() {
	var userName = Cookies.get("user"),
		buyQualiEl = document.querySelector(".buy-car>.buyquality"),
		qualityEl = document.querySelector(".fix-right li.quality"),
		ulEl = document.querySelector("div.cartList ul.cartList"),
		data = JSON.parse(sessionStorage.getItem("data")),
		cartList = data.cartList,
		productList = data.productList,
		total = 0,
		money = 0;
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
		qualityEl.innerText = total;
		buyQualiEl.innerText = total;
		qualityEl.style.background = "url(../images/fix/fixrjie.gif) no-repeat -15px 0px";
		qualityEl.style.borderColor = "#90B42F";
		// 内容渲染
		userCartList = cartList.filter(function(item) {return item.name === userName});
		userCartList.forEach(function(item) {
			var product = productList.find(function(item2) {return item2.id === item.pid});
			money += parseInt(item.count * product.price);
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
//下方选项卡功能的实现
(function() {
	var liEls = document.querySelectorAll(".indicator>ul>li");
	var contentEls = document.querySelectorAll(".containts>div");
	liEls.forEach( function(item,i) {
		item.onmouseover = function() {
			var oned = this.classList.contains("on");
			var actived = contentEls[i].classList.contains("active");
			if(oned) return; 
			liEls.forEach(function(item2) {
				item2.classList.remove("on")
			});
			this.classList.add("on");
			if(actived) return;
			contentEls.forEach(function(item3) {
				item3.classList.remove("active")
			});
			contentEls[i].classList.add("active");
			
		};
		
		
	});
	
	
	
})();