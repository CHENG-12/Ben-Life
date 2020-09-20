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
		total = parseInt(Cookies.get("total"));
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
//地址管理部分
(function() {
	var userName = Cookies.get("user");
	if(typeof userName === "undefined") {
		Cookies.set("backUrl", window.location.href);
		window.location.href = "../login/login.html";
	}
	//
	var data = JSON.parse(sessionStorage.getItem("data"));
	var addressList = data.addressList;
	
	//第一个工作动态渲染当前登录用户的地址信息
	(function() {
		//筛选多个使用 filter
		var userAddressList = addressList.filter(function(item) { return item.name === userName});
		document.querySelector('.address-empty').classList.toggle("show", userAddressList.length === 0);
		document.querySelector('.address-list').classList.toggle("show", userAddressList.length !== 0);
		if(userAddressList.length > 0){
			userAddressList.forEach(function(item) {
				//该部分知识点注意 
				//知识点一:如何通过 只操纵css 使 一个标签在不同的情况之下显示不同的内容
				//知识点二: 在标签里面进行创造属性来进行藏值
				//可以在渲染之前加条件判断,设定class值
				
				// style = "border-color: ${item.isDefault ? "red" : "#ccc"}"
				document.querySelector("ul.address-list").innerHTML += `
					<li >
						<a href = "javascript:void(0)" data-id = "${ item.id}" class="btn-default${ item.isDefault ? " default" : ""}"></a>
						<h3>${ item.receiveName}</h3>
						<h4>${ item.receiveRegion} ${ item.receiveAddress}</h4>
						<p>${ item.receivePhone}</p>
						<input type="button" data-id = "${ item.id}"  value="修改" class="btn-update" />
						<input type="button" data-id = "${ item.id}" value="删除" class="btn-remove" />
					</li>
				
				
				
				`;
				//判断语句要写在渲染之后,不然无法找到要设置样式的元素
				if(item.isDefault){
					document.querySelector("ul.address-list>li").classList.add("default");
				}	
			});
		
		}
	})();
	
	//2.绑定各种点击事件
	(function() {
		//开始新增,是单独的一个按钮
		document.querySelector('input.btn-add').onclick = function(){
			var form = document.forms["address"];
			console.log(form);
			// 点击新增出现弹出层
			var formMark = document.querySelector(".mark");
			var noneEl = formMark.querySelector(".info .icn");
			console.log(noneEl);
			noneEl.onclick = function() {
				formMark.classList.toggle("show");
			};
			var cancelEl = document.querySelector(".form-item-wrapper input.btn-cancelMark ");
			cancelEl.onclick = function() { formMark.classList.toggle("show")};
			formMark.classList.toggle("show");
			form.editMode.value = "1";
			regionPicker.reset();
			form.id.value = "0";
			form.reset(); //表单重置
		};
		
		
		
		
		
		document.querySelector("ul.address-list").onclick = function(e) {
			
			//如果点的是设为默认地址的按钮,
			//选定被点击的对象的本身
			if(e.target.classList.contains('btn-default')){
				//更新数据
				if(e.target.classList.contains('default')) return;
				// console.log("123");
				addressList.forEach(function(item) {
					if(item.name === userName) {
						item.isDefault = item.id === parseInt(e.target.dataset.id);
					}
					
				});
				//只有数据库中的数据可以再更新到数据库,临时的变量就是无法全部放到数据库里去的
				//userAddressList  操作的是临时变量,根本就不是数据库内容本身,修改完内容后的数据是无法更新到库里面去的
				sessionStorage.setItem("data", JSON.stringify(data));
				//更新页面
				this.querySelectorAll(".btn-default").forEach(function(item) {
					item.classList.remove("default");
					
					item.parentNode.classList.remove("default");
					item.parentNode.style.borderColor = "#ccc";
				});
				e.target.classList.add("default");
				e.target.parentNode.classList.add("default");
				// 测试改变边框颜色
				e.target.parentNode.style.borderColor = "red";
				
				Message.notice("默认地址设置成功");
			};
			
			//如果点的是删除按钮
			if(e.target.classList.contains("btn-remove")){
				var that = this;
				//更新数据
				Message.confirm("确定要删?",function() {
					var id = parseInt(e.target.dataset.id);
					var i = addressList.findIndex(function(item) {
						return item.id === id;
					});
					addressList.splice(i,1);
					sessionStorage.setItem("data", JSON.stringify(data));
					//注意这里that 的使用
					//更新页面,充分利用被点击事件的本身是谁,要利用好this的指向
					that.removeChild(e.target.parentNode);
					// e.target.parentNode.parentNode.removeChild(e.target.parentNode);
					if(that.querySelectorAll('li').length === 0) {
						that.classList.remove("show");
						document.querySelector('.address-empty').classList.add('show');
					};
					Message.notice("删除成功!");
				} );
				
				
			};
			//如果点的是修改按钮
			
			
			if(e.target.classList.contains("btn-update")){
			 // 点击修改按钮的时候弹出蒙层使修改蒙层出现
			    var formMark = document.querySelector(".mark");
			    var noneEl = formMark.querySelector(".info .icn");
			    console.log(noneEl);
			    noneEl.onclick = function() {
			    	formMark.classList.toggle("show");
			    };
			    var cancelEl = document.querySelector(".form-item-wrapper input.btn-cancelMark ");
			    cancelEl.onclick = function() { formMark.classList.toggle("show")};
			    formMark.classList.toggle("show");
				//开始修改
				var id = parseInt(e.target.dataset.id);
				var form = document.forms["address"];
				
				//不是新增所以记录为"0",放在hidden里面,方便保存的时候使用
				form.editMode.value = "0";
				//将修改的id值得到,放在hidden里面,存起来,方便保存的时候使用
				form.id.value = id;
				var target = addressList.find(function(item) {return item.id === id;});
				form.receiveName.value = target.receiveName;
				form.receivePhone.value = target.receivePhone;
				// form.receiveRegion.value = target.receiveRegion;
				regionPicker.set(target.receiveRegion);
				form.receiveAddress.value = target.receiveAddress;
			};
			
			
		};
		
		
	})();
	//3.保存按钮点击事件,真正的新增和真正的修改
	(function() {
		document.querySelector('input.btn-save').onclick = function() {
			// 现获取当前是新增还是修改
			var form = document.forms['address'];
			var address = {
				name: userName,
				receiveName: form.receiveName.value,
				receivePhone: form.receivePhone.value,
				receiveRegion: regionPicker.get(),
				receiveAddress: form.receiveAddress.value,
			}
			if(form.editMode.value === "1"){
				var id = addressList.length >0 ? addressList[addressList.length - 1].id + 1 : 1;
				address.id = id;
				//地址默认为不是默认地址
				address.isDefault = false;
				addressList.push(address);
				sessionStorage.setItem('data',JSON.stringify(data));
				Message.alert("新增成功");
				//原地刷新
				
			}else{
				var id = parseInt(form.id.value);
				var i = addressList.findIndex(function(item) {return item.id === id});
				address.id = id;
				address.isDefault = addressList[i].isDefault;
				addressList.splice(i,1,address);
				sessionStorage.setItem("data", JSON.stringify(data));
				Message.alert("修改成功");
			}
			
				window.location.href = window.location.href;
			
			
			//如果是从订单确认页面过来的,就要保存后返回到订单确认页面,不然就要保存之后就要返回到主页
			if(Cookies.get("isFromOrderConfirm")){
				Cookies.remove("isFromOrderConfirm");
				Cookies.set("addressId", address.id);
				window.location.replace("../order-confirm/order-confirm.html");
			} 
			// else window.location.href = window.location.href;
		};
		
		
	})();
	
	
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
