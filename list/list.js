//取数据
var cid = parseInt(window.location.search.slice(window.location.search.indexOf("=") +1));
var productList = JSON.parse(sessionStorage.getItem("data")).productList.filter(function(item) { return item.cid === cid;});
// 分类菜单的动态渲染

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


// 将数据列表内容进行动态渲染
var ulEl = document.querySelector("ul.list-wra");
for(var i=1; i<4;i++){
	productList.forEach( function(item,i) {
	ulEl.innerHTML += `
					<li>
						<div class="li-box">
							<p class="pic">
								<a  href="../detail/detail.html?cid=${ item.id}">
									<img src="${ productList[i].avatar }" alt="">
								</a>
							</p>
							<p class="name">
								<a>
									<span>${productList[i].name}</span>
									<span>${productList[i].brief}</span>
								</a>
						   </p>
							<p class="price">${productList[i].price}</p>
							<p class="cold">${productList[i].cold}</p>
							<p class="btn"></p>
							<p class="sale-argument"><span>销量 : ${item.sale} <br/> 评论: ${item.argument}</span></p>
							
						</div>		
					</li>
	
					`;
	});
}

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
			console.log(document.querySelector(".cartList"));
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

//排序功能的实现
(function() {
	var orderDir = "asc";
	var orderKey = "price";
	var list = [];
	//循环录入数据
	for(var i= 1; i < 4; i++){
		productList.forEach(function(item) {
			list.push(item);
		});
	}
	// 绑定点击事件
	(function() {
		var liEls = document.querySelectorAll(".order li.order");
		liEls.forEach(function(liEl) {
			liEl.onclick = function() {
				if(this.classList.contains("active")){
					orderDir =( orderDir === "asc" ? "desc" : "asc");
					console.log(orderDir);
				} else {
					orderKey = liEl.dataset.key;
					liEls.forEach(function(item) {item.classList.remove("active")});
					this.classList.add("active");
					console.log(orderDir);
					
					
				}
				if(orderDir === "asc"){
					this.querySelector("i.icon-xiajiang1").classList.remove("show");
					this.querySelector("i.icon-tubiao03").classList.add("show");
					
				} else {
					this.querySelector("i.icon-tubiao03").classList.remove("show");
					this.querySelector("i.icon-xiajiang1").classList.add("show");
					
					
				}
				
				sortList();
			};
		});
	})();
	//排序函数--- 将所有数据进行排序,然后将排序后的数据进行依次渲染
	function sortList() {
		list.sort(function(a,b) {
			return orderDir === "asc"? a[orderKey]- b[orderKey] : b[orderKey] - a[orderKey];
		});
		document.querySelector("ul.list-wra ").innerHTML = "";
		list.forEach(function(item,i) {
				document.querySelector("ul.list-wra ").innerHTML += `
					<li>
						<div class="li-box">
							<p class="pic">
								<a  href="../detail/detail.html?cid=${ item.id}">
									<img src="${ item.avatar }" alt="">
								</a>
							</p>
							<p class="name">
								<a>
									<span>${item.name}</span>
									<span>${item.brief}</span>
								</a>
						   </p>
							<p class="price">${item.price}</p>
							<p class="cold">${item.cold}</p>
							<p class="btn"></p>
							<p class="sale-argument">
								<span class="sale">销量 : ${item.sale} </span>
								<br/>
								<span class="rate">评论: ${item.argument}</span>
							</p>
						</div>		
					</li>
				`;
			});
		}
})();