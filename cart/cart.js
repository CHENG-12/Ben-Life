//确保用户当前是登录的
var userName = Cookies.get("user");
if(typeof userName === "undefined") {
	Cookies.set("backUrl", window.location.href);
	window.location.href = "../login/login.html";
}
//
var data = JSON.parse(sessionStorage.getItem("data"));
var productList = data.productList;
var cartList = data.cartList;

//公共的函数更心总当前购物车的总金额和总数量
function updateTotalAndAccount() {
	var trs = document.querySelectorAll("table.cart-list>tbody>tr");
	var total = 0, account = 0;
	trs.forEach(function(tr) {
		if( tr.dataset.checked === "1") {
			total += parseInt(tr.dataset.count);
			account += parseInt(tr.dataset.count) * parseInt(tr.dataset.price);
			
		};
	
	});
	
	document.querySelector("span.account").innerText = account;
	document.querySelector("span.total").innerText = total;
	
	var userList = data.userList;
	
	userList.forEach(function(item) {
		if(item.name === userName) item.totalCount = total;
		else return;
	});
	sessionStorage.setItem("data",JSON.stringify(data));
	Cookies.set("total",total);
	
}

//公共的函数,更新全选复选框
function updataCheckboxAll() {
	//找出所有未选中的购物记录行
	var uncheckedTrs = document.querySelectorAll('tbody>tr[data-checked ="0"]');
	var all = document.querySelector("i.checkbox.all");
	//大于0 有一个或多个没选中,<0 就是全选中
	all.classList.toggle("checked", uncheckedTrs.length === 0);
	// if(uncheckedTrs.length > 0) {
	// 	all.className = all.className.replace(" checked", "");
	// } else {
	// 	all.className += " checked";
	// }
};


// 动态拼接展示
//1.展示userCartlist
(function() {
	var userCartList = cartList.filter(function(item) {return item.name === userName;});
	if(userCartList.length > 0)
		document.querySelector(".cart-list-wrapper").className +=  " show";
	else
		document.querySelector(".cart-empty").className += " show";
	userCartList.forEach(function(item) {
		var product = productList.find(function(item2) {return item2.id === item.pid});
		document.querySelector('table.cart-list>tbody').innerHTML += `
			<tr data-id="${ item.id}" data-checked="1" data-price="${product.price}" data-count="${ item.count}">
				<td><i class="checked checkbox"></i></td>
				<td><img src="${ product.avatar}"></td>
				<td>${ product.name}</td>
				<td><span class="price">$${product.price}元</span></td>
				<td>
					<input type="button" value="-" class="btn-decrease" ${ item.count ===1 ? "disabled" : "" } />
					<span class="count">${item.count }</span>
					<input type="button" value="+" class="btn-increase"  ${ item.count ===5 ? "disabled" : "" }/>
				</td>
				<td>
					<input type="button" value="删除" class="btn-remove">
				</td>
			</tr>
		
		`;
	});
	updateTotalAndAccount();
})();
//2.删除购物记录
(function() {
	var btns = document.querySelectorAll("input.btn-remove");
	btns.forEach(function(btn) {
		btn.onclick= function() {
			var that = this;
			Message.confirm("真删?", function() {
				var tr = that.parentNode.parentNode;
				var id = parseInt(tr.dataset.id);
				//删除tr
				tr.parentNode.removeChild(tr);
				
				//从数据中删除对应的购物记录,更新到sessionStorage中
				var i = cartList.findIndex(function(item) { return item.id === id});
				// 总数量总金额也要更新
				cartList.splice(i,1);
				sessionStorage.setItem('data',JSON.stringify(data));
				//列表的显示内容的更新,若是每一行都已删除,整个列表必须都不存在
				var userCartList = cartList.filter(function(item) {return item.name === userName;});
				var listWraEl = document.querySelector(".cart-list-wrapper");
				if(userCartList.length > 0) listWraEl.className +=  " show";
				else{
					if(listWraEl.classList.contains("show")) listWraEl.classList.remove("show");
					document.querySelector(".cart-empty").className += " show";
				}
	
				//如果当前删除的是选中的购物记录,才更新总数量和总金额			
				if(tr.dataset.checked === "1") updateTotalAndAccount();
				updataCheckboxAll();
				Message.notice("删除成功!!");
			});
			// if(!confirm("真删?")) return;
			
		};
	});
	
	
})();
//3,.数量加减功能实现
(function() {
	//减
	var decreaseBtns = document.querySelectorAll("input.btn-decrease");
	decreaseBtns.forEach(function(item) {
		item.onclick = function() {
			//准备
			var tr = this.parentNode.parentNode;
			var count = parseInt(tr.dataset.count);
			var id = parseInt(tr.dataset.id);
			count--;
			//开始联动 dom标签的更新
			this.parentNode.querySelector("input.btn-increase").disabled = false;
			if(count === 1) this.disabled = true;
			tr.dataset.count = count;
			this.parentNode.querySelector("span.count").innerText = count;
			if(tr.dataset.checked === "1") updateTotalAndAccount();
			//数据的更新
			var cart = cartList.find(function(item2) {return item2.id === id;});
			cart.count = count;
			sessionStorage.setItem("data",JSON.stringify(data));
			Message.notice("数量更新成功")
			
		};
		
		
	});
	
	//加
	var increaseBtns = document.querySelectorAll("input.btn-increase");
	increaseBtns.forEach(function(item) {
		item.onclick = function() {
			//准备
			var tr = this.parentNode.parentNode;
			var count = parseInt(tr.dataset.count);
			var id = parseInt(tr.dataset.id);
			count++;
			//开始联动 dom标签的更新
			this.parentNode.querySelector("input.btn-decrease").disabled = false;
			if(count === 5) this.disabled = true;
			tr.dataset.count = count;
			this.parentNode.querySelector("span.count").innerText = count;
			if(tr.dataset.checked === "1") updateTotalAndAccount();
			//数据的更新
			var cart = cartList.find(function(item2) {return item2.id === id;});
			cart.count = count;
			sessionStorage.setItem("data",JSON.stringify(data));
			Message.notice("数量更新成功!");
			
		};
		
		
	});
	
	//联动
	
	
	
	
})();
//勾选联动
(function() {
	var checks = document.querySelectorAll("tbody i.checkbox");
	checks.forEach(function(item) {
		item.onclick = function() {
			if(this.className.indexOf("checked") === -1) {
				this.className += " checked";
				this.parentNode.parentNode.dataset.checked = "1";
			} else{
				this.className = this.className.replace("checked", "" );
				this.parentNode.parentNode.dataset.checked = "0";
			}
			updateTotalAndAccount();
			updataCheckboxAll();
		};
		
	});
	//全选联动表格
	document.querySelector("i.checkbox.all").onclick = function() {
		var checked = this.className.indexOf("checked") !== -1;
		if(checked){//从选中到未选中
			this.className = this.className.replace("checked", "");
			document.querySelectorAll('tbody>tr').forEach( function(item) {
				item.dataset.checked = "0"; 
				var i = item.querySelector("i.checkbox");
				i.className = i.className.replace("checked", "");
				
			});
			
		} else {//从未选中到选中
			this.className += " checked";
			document.querySelectorAll('tbody>tr').forEach( function(item) {
				item.dataset.checked = "1";
				var i = item.querySelector("i.checkbox");
				//没有选中就把它选中,已经选中的话就不用再追加选中的类名了
				if(i.className.indexOf('checked') === -1) i.className += " checked";	
			});
		}
		updateTotalAndAccount();
	};
})();
//结 算   跳到结算页面
(function() {
	document.querySelector('button.settle').onclick = function() {
		var checkedTrs = document.querySelectorAll('tbody>tr[data-checked = "1"]');
		if(checkedTrs.length === 0 ) {Message.notice("没有内容");return;}
		Message.confirm("确定结算", function() {
			var settleIds = "";
			checkedTrs.forEach(function(tr) {
				settleIds += tr.dataset.id + ",";
			});
			settleIds = settleIds.slice(0,-1);
			Cookies.set("settle", settleIds);
			window.location.href = "../order-confirm/order-confirm.html";
		});	
	};	
})();

// 购物车下方选项卡的实现
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
