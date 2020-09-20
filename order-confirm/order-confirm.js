//数据预备
//判断是否是从购物车过来的
var data = JSON.parse(sessionStorage.getItem("data"));
var cartList = data.cartList;
var cartId = Cookies.get("settle");
if(!cartId) window.location.replace("../index/index.html");
cartIds = cartId.split(",").map(function(item) { return parseInt(item)});
var userName = Cookies.get("user");
//最关键的是要有默认地址的变量
var addressId = 0;
//如果从地址管理页面有新增的addressId 传过来, 就以此为默认地址,否则就取0
if(Cookies.get("addressId")){
	addressId = parseInt(Cookies.get("addressId"));
	//要及时删掉无用的Cookie 数值
	Cookies.remove("addressId");
}
//收货地址部分
//获取默认地址的id
( function() {
	var userAddressList = data.addressList.filter(function(item) {return item.name === userName});
	if( userAddressList.length === 0)
	document.querySelector(".new_cart_adr .address-empty").classList.add("show");
	else document.querySelector(".new_cart_adr .address-list").classList.add("show");
	userAddressList.forEach(function(item) {
		var addressListEl = document.querySelector("ul.address-list");
		addressListEl.classList.add("show");
		//测试--去除默认地址的那一行
		// ${(addressId === 0 && item.isDefault) || (addressId !== 0 && item.id === addressId) ? "<span>默认地址</span>": ""}
		addressListEl.innerHTML += `
			<li data-id= ${item.id}
			class = " ${(addressId === 0 && item.isDefault) ||  (addressId !== 0 && item.id === addressId) ? "select" : " "}">
				
				<h3>${ item.receiveName}</h3>
				<p>${ item.receivePhone}</p>
				<h4>${ item.receiveRegion} ${ item.receiveAddress}</h4>
			</li>
		`;
		if(addressId === 0 && item.isDefault) addressId = item.id;
	});
	//点击时切换默认地址
	document.querySelectorAll("ul.address-list li").forEach(function(item) {
		item.onclick = function() {
			//这是一个激活状态的转化,要按照套路一步步的执行
			if(item.classList.contains("select")) return;
			document.querySelectorAll("ul.address-list li").forEach(function(item) {
				item.classList.remove("select");
			});
			this.classList.add("select");
			//藏的id在这里使用
			addressId = parseInt(this.dataset.id);
			console.log(addressId);
		};

		
	});
	//跳转页面进行新增地址
	document.querySelector("input.btn-add").onclick = function() {
		Cookies.set("isFromOrderConfirm"," ");
		
		window.location.href = "../address/address.html";
	};
	
})();



//商品展示部分
var account = 0;
var accountItem = 0;
var detail = [];
(function() {
	cartIds.forEach( function(cartId) {
		
		var cart = cartList.find(function(item) { return item.id === cartId});
		
		var product = data.productList.find(function(item) { return item.id === cart.pid});
		
		detail.push( {pid: cart.id, count: cart.count, price: product.price});
		account += cart.count * product.price;
		accountItem = cart.count * product.price;
		document.querySelector(".new_cart_adr table tbody").innerHTML += `
			<tr>
				<td><img src="${product.avatar}" alt=""></td>
				<td> ${product.name}</td>
				<td> ¥ ${+ product.price}</td>
				<td> × ${cart.count}</td>
				<td>${parseInt(accountItem)}</td>
			    
			</tr>
		
		
		`;
	});
	document.querySelector(".new_cart_adr p span").innerText += parseInt(account);
	
})();
//生成一个新的订单push到orderList中去
(function() {
 document.querySelector("input.btn-confirm").onclick = function() {
	//判断是不是该用户就没有添加任何地址
	console.log(addressId);
	if(addressId === 0){
		Message.confirm("亲亲你还没有添加默认送货地址哦!");
		return;
	}
	//从购物车中删除对应的购物记录
	cartIds.forEach(function(cartId) {
		 var i = cartList.findIndex(function(item) { return item.id === cartId });
		 cartList.splice(i,1);
		 //删除购物车记录的同时,更新total的数值,并将该数值存放到Cookie中去,方便在支付页面显示该用户的购物记录数
		 var userCartLists = cartList.filter(function(item) { return item.name === userName});
		 var total = 0;
		 if(userCartLists.length === 0){
			total = 0;
		 }
		 else {
			userCartLists.forEach( function(userCartList) {
				total += userCartList.count;
			});
		 }
		 Cookies.set("total",total);
	});
	//生成一个新的订单 push到 orderList中去
	
	var id = data.orderList.length > 0 ? data.orderList[data.orderList.length - 1].id + 1 : 0;
	//测试内容将id放到Cookie里面
	
	data.orderList.push(
		{
			id: id,
			name: userName,
			addressId: addressId,
			detail: detail,
			account: account,
			date: new Date().getTime(),
			isPay: false,
		});
		sessionStorage.setItem("data",JSON.stringify(data));
		Cookies.remove("settle");
		Cookies.set("account",account);
		window.location.replace(`../pay/pay.html?id=${id}`);
	 
	 
 };


})();



//收货地址
//商品展示
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
