//一二级分类的动态渲染
//保持Cookie清洁
Cookies.remove("account");
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
	if( !userName || total === 0)   {
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
//订单内容的动态渲染
(function() {
	var userName = Cookies.get("user");
	if(!userName) {
		document.querySelector(".orderList-empty").classList.add("show");
		return;
	}
	document.querySelector(".order-list").classList.add("show");
	var data = JSON.parse(sessionStorage.getItem("data"));
	var orderList =data.orderList;
	
	var userOrderLists = orderList.filter(function(item) { return item.name === userName});
	
	//转化时间的函数
	function formatTime(time) {
		var date = new Date(time);
		
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? "0"+m: m;
		
		var d = date.getDate();
		d = d < 10 ? "0"+ d: d;
		var h = date.getHours();
		h = d < 10 ? "0" + h:h;
		var min = date.getMinutes();
		min = min < 10? "0" + min: min;
		var sec = date.getSeconds();
		sec = sec < 10? "0" + sec: sec;
		return  y + "-" + m + "-" + d + " " + h + ":" + min + ":" + sec;
	};
	//动态渲染
	userOrderLists.forEach( function(userOrderList,i) {
		
		var orderTime = formatTime(userOrderList.date);
		var detailPids = userOrderList.detail;
		
		var address = data.addressList.find(function(address) { return address.id === userOrderList.addressId});
		var receiveName = address.receiveName;
		var length = userOrderList.detail.length;
		document.querySelector(".order-list table").innerHTML += `
			<tbody >
			
			</tbody>
		
		`;	
		userOrderList.detail.forEach(function(item,j) {
			var product = data.productList.find(function(item2) {return item2.id === item.pid});
			var bodys = document.querySelectorAll(".order-list table tbody");
			//让第一行的往下合并
			if(j === 0){
				bodys[i].innerHTML += `
					<tr >
						<td rowspan="${length}" class="first">${userOrderList.id}</td>
						<td>
							<img src="${product.avatar}" alt="">
						</td>
						<td>${receiveName}</td>
						<td>华北</td>
						<td>${orderTime}</td>
						<td>${product.price}</td>
						<td>${userOrderList.isPay === true ? "已经支付" : "未支付" }</td>
						<td rowspan="${length}" class="toPay">${userOrderList.isPay === true ? "已支付,请等待发货!" : "去支付" }</td>
						
					</tr>
					
					
				`;
			}else{
				//其他行的要被合并的那一格要不存在才可,不然内容会被挤到下一格
				bodys[i].innerHTML += `
					<tr class="">
						<td>
							<img src="${product.avatar}" alt="">
						</td>
						<td>${receiveName}</td>
						<td>华北</td>
						<td>${orderTime}</td>
						<td>${product.price}</td>
						<td>${userOrderList.isPay === true ? "已经支付" : "未支付" }</td>
					</tr>
				
				
			`;
			}
			
	
		});
			
	});
		

})();
// 点击去支付的弹出层的点击事件
(function() {
	var payMarkEl = document.querySelector(".pay-mark");
	var icnEl =	document.querySelector(".contain-wra .icn");
	var btnOkEl = document.querySelector(".contain-wra input.btn-ok");
	var cancelEl = document.querySelector(".contain-wra input.btn-cancel");
	var  spanEl = document.querySelector(".contain-wra span.amount");
	var payEls = document.querySelectorAll("table tbody td.toPay");
	var data = JSON.parse(sessionStorage.getItem("data"));
	var  orderList = data.orderList;
	payEls.forEach(function(payEl,i) {
		var id = payEl.parentNode.querySelector("td.first").innerText;
		var orderListItem = orderList.find(function(item) {return item.id === parseInt(id)});
		if(payEl.innerText !== "去支付" ) return;
		payEl.onclick = function() {
			//在蒙层里的支付操作点击事件
			payMarkEl.classList.add("show");
			// 取出总金额渲染到蒙层
			spanEl.innerText = parseInt(orderListItem.account);
			icnEl.onclick = function(){
				payMarkEl.classList.remove("show");
			};
			cancelEl.onclick = function() {
				payMarkEl.classList.remove("show");
			};
			btnOkEl.onclick = function(){
				//改变数据中的是否支付状态
				orderListItem.isPay = true;
				sessionStorage.setItem("data",JSON.stringify(data));
				Message.confirm("支付成功!",function(){
					payMarkEl.classList.remove("show");
					payEl.innerText = "已支付,请等待发货!";
				});
				
;
			};	
			
		};
	});
	
	
	
})();