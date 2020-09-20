//获取数据部分
if(window.location.search.length === 0) var pid = 2;
else var pid = parseInt(window.location.search.slice(window.location.search.indexOf("=") + 1));
var product = JSON.parse(sessionStorage.getItem("data")).productList.find(function(item) {return item.id === pid});

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

//详情页面
//放大镜部分
(function() {
	var i = 0;
	var spanpreEl = document.querySelector("span.prev");
	var spannexEl = document.querySelector("span.next");
	var ulEl = document.querySelector("ul.image-list");
	var ulElBig = document.querySelector("ul.big-image-list")
	var liEl = document.createElement("li");
	// 将数据拆分为类数组
	var imgPaths = (product.banner).split(",");
	var imgPathBigs = (product.bannerBig).split(",");
	// 动态渲染图片
	//小图片渲染
	imgPaths.forEach( function(imgPath) {
		ulEl.innerHTML += `
						<li>
							<div class="img-wrapper">
								<img src="${imgPath}" alt="">
							</div>
						</li>
						`;
		
						
	});
	//大图片渲染
	imgPathBigs.forEach( function(imgPathBig) {
		ulElBig.innerHTML += `
						<li>
							<div class="img-wrapper">
								<img src="${imgPathBig}" alt="">
							</div>
						</li>
						`;		
	});
	var liEls = ulEl.querySelectorAll("li");
	var liElBigs = ulElBig.querySelectorAll("li");
	// 将第一张图片默认为 show
	liEls[0].classList.add("show");
	liElBigs[0].classList.add("show");
	
	spanpreEl.onclick = function() {
		// console.log(1);
		if(i === 0) return;
		i--;
		ulEl.style.transform =`translateY(-${ i * 20}%)`;
	};
	spannexEl.onclick = function() {
		if(i + 5 >= liEls.length) return;
		i++;
		ulEl.style.transform =`translateY(-${ i * 20}%)`;
	};
	
	liEls.forEach(function(item ,i) {
		item.i = i;
		// 测试区域
		item.onmouseover = function(){
			document.querySelector("ul.big-image-list>li.show").className = " ";
			document.querySelectorAll("ul.big-image-list>li")[this.i].className ="show";
		}
	});
	document.querySelector(".big-image-list-wrapper").onmouseover = function() {
		var imgPath = this.querySelector("li.show img").src;
		var zoomEl = this.querySelector(".zoom");
		var zoomBigEl = this.parentNode.querySelector(".zoom-big");
		//小图片联动大图片
		zoomEl.style.backgroundImage = `url(${ imgPath })`;
		zoomBigEl.style.backgroundImage = `url(${ imgPath })`;
		
		var width = this.getBoundingClientRect().width;
		var height = this.getBoundingClientRect().height;
		zoomEl.style.backgroundSize = `${ width - 2 }px ${ height - 2}px`;
		// 声明变量计算比例
		var radio = width / zoomEl.getBoundingClientRect().width;
		zoomBigEl.style.backgroundSize = `${ radio *  width - 2 }px ${radio * height - 2}px`;
	};
	//放大镜效果
	document.querySelector(".big-image-list-wrapper").onmousemove = function(e) {
		var zoomEl = this.querySelector(".zoom"),
		    zoomBigEl = this.parentNode.querySelector(".zoom-big"),
			x,
			y,
			mouseX = e.clientX - this.getBoundingClientRect().left,
			mouseY = e.clientY - this.getBoundingClientRect().top,
			minX = zoomEl.getBoundingClientRect().width / 2,
			minY = zoomEl.getBoundingClientRect().height /2,
			maxX = this.getBoundingClientRect().width - minX,
			maxY = this.getBoundingClientRect().height - minY;
		
		if(mouseX <= minX) x = 0;
		else if(mouseX >= maxX) x = maxX -minX;
		else x = mouseX -minX;
		
		if(mouseY <= minY) y = 0;
		else if(mouseY >= maxY) y = maxY -minY;
		else y = mouseY -minY;
		
		zoomEl.style.left = `${ x }px` ;
		zoomEl.style.top = `${ y }px `;
		zoomEl.style.backgroundPosition = ` ${ -x }px  ${ -y }px `;
		var radio = this.getBoundingClientRect().width / zoomEl.getBoundingClientRect().width;
		zoomBigEl.style.backgroundPosition = ` ${ -x * radio }px  ${ -y * radio}px `;
	};

})();
// 右侧详情信息部分的渲染
(function() {
	var detaEl = document.querySelector(".box>.detail-info");
	detaEl.innerHTML += `
					<div class="intro-name">
						<h1>${product.name}</h1>
						<p>${product.brief}</p>
					</div>
					<div class="intro-sale">
						<div class="drop">
							<span>促销价</span>
							<span class="price">${product.price}
								<span>${product.prePrice}</span>
							</span>
						</div>
						<p class="intro-app"></p>
						<p class="intro-gift">
							<font>满减</font>
							${product.ads}
						</p>
						
					</div>
					<div class="good-buy">
						<span>
							<i class="iconfont icon-jianhao"></i>
							<input type="button" class="btn-decrease" value=" " disabled>
						</span>
						
						<input type="text" class="count" value="1">
						<span>
							<i class="iconfont icon-mui-icon-add"></i>
							<input type="button" class="btn-increase" value=" ">
						</span>
						
						<input type="button" value="加入购物车" class = "btn-buy">
					</div>
					<div class="good-cold">
						<img src="../images/detail/雪花.gif" alt="">
						${product.cold}
					</div>
	
	
	
						`;
	
	
	
	
})();
//下方不同的商品详情大图片的渲染
(function() {
 var detailEl = document.querySelector('.good15_all>#sublist01>#good15_holong');
 var detailImages = product.detailImage.split(',');
 detailImages.forEach(function(item,i) {
	 detailEl.innerHTML += `
	 <img src="${item}" alt="">
	 `
 });
	
})();


//购物车和数量的加减部分
(function() {
	var count = 1;
	var maxCount = 5;
	var userName = Cookies.get("user");
	// 数量控制:
	(function() {
		var btnDecrease = document.querySelector("input.btn-decrease");
		var btnIncrease = document.querySelector("input.btn-increase");
		var inputCount = document.querySelector("input.count");
		
		btnDecrease.onclick = function() {
			btnIncrease.disabled = false;
			inputCount.value = --count;
			this.disabled = count === 1;
		}
		btnIncrease.onclick = function() {
			btnDecrease.disabled = false;
			inputCount.value = ++count;
			this.disabled = count === maxCount;
			
		};
		inputCount.onfocus = function() {
		this.oldValue = this.value;
		
		}	
		inputCount.onkeyup = function(e) {
			if((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8) { this.value = this.oldValue;} 
			else this.oldValue = this.value;
			
		};
		 inputCount.onblur = function() {
			 if(this.value.length === 0 ) this.value = 1;
			 if(parseInt(this.value) < 1) this.value = 1;
			 if(parseInt(this.value) > maxCount) this.value = maxCount;
			 count = parseInt(this.value);
			 btnDecrease.disabled = count === 1;
			 btnIncrease.disabled = count === maxCount;
		 }	
	})();
	//加入购物车 cookie 最多4k 而storage可以存5m 甚至更大
	(function() {
		console.log(document.querySelector("input.btn-buy"));
		document.querySelector("input.btn-buy").onclick = function() {
			//判断用户有没有登录 没登录就登录从上
			console.log(typeof Cookies.get("user"));
			if(typeof Cookies.get("user") === "undefined"){
			
				Cookies.set("backUrl", window.location.href);//将当前页面路径放入,好跳转
				window.location.href = "../login/login.html"; //跳转到的登录页
				return;
			}
			//如果登录了
			
			var data = JSON.parse(sessionStorage.getItem("data"));
			var userList = data.userList;
			var userListItem = userList.find(function(item) { return item.name === userName});
			var total = parseInt(Cookies.get("total"));
			var popCartEl = document.querySelector(".pop-cart ul.item-add");
			
			console.log(popCartEl);
			var index = data.cartList.findIndex(function(item) {
			return item.name === userName && item.pid === pid;});
			if(index === -1) {
				var obj = {
					id: data.cartList[data.cartList.length -1].id + 1,
					name: userName,
					pid: pid,
					count: count
				}
				data.cartList.push(obj);
				
			}else{
				
				if(data.cartList[index].count + count > 5) {
					Message.notice("您所选的商品已经达到上限");
					return;
				}
				data.cartList[index].count += count;
				
			}
			//跟新该页面的购物车数量以及将更新后的数据放在cookie里面
			var inputCount = parseInt(document.querySelector(".good-buy input.count").value.trim());
			total += inputCount ;
			Cookies.set("total",total);
			sessionStorage.setItem("data", JSON.stringify(data));
			// 改变数量
			var buyQualiEl = document.querySelector(".buy-car>.buyquality");
			var qualityEl = document.querySelector(".fix-right li.quality");
			// 若原来是0,就要有一个由灰变红的一个改变
			console.log(qualityEl.innerText === "0");
			if(qualityEl.innerText === "0"){
				qualityEl.style.background = "url(../images/fix/fixrjie.gif) no-repeat -15px 0px";
				qualityEl.style.borderColor = "#90B42F";
				
			}
			
			buyQualiEl.innerText = total;
			qualityEl.innerText = total;
			// 动态渲染下方
			popCartEl.innerHTML = `
				<li class="clearfix">
					<div class="img-wra">
						
						<img src="${product.avatar}" alt="">
						
					</div>
					<div class="name">${product.name}</div>
					<div class="price">${product.price}</div>
					<div class="total">×<span>${inputCount}</span></div>
				</li>
			
			
			`;
			// 点击加入购物车按钮的时候实时的进行动态的渲染上方列表
			UpdateCartListShow();	
			//显示消失动画的实现
			popCartEl.parentNode.parentNode.classList.add("show");
			setTimeout(function() {
				popCartEl.parentNode.parentNode.classList.remove("show");
			},2000)
			
			Message.notice("加入购物车成功");
			// alert("加入购物车成功");
		};
		//原地刷新
		
	})();
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


// 导航的控制
(function() {
	var navEl = document.querySelector(".good15_detail");
	var navfix = document.querySelector(".good15_detail_fix");
	var parts = document.querySelectorAll(".part");
	var liElas = document.querySelectorAll(".good15_detail li a");
	var liElFixas = document.querySelectorAll(".good15_detail_fix li a");
	window.onscroll = function(){
		// 控制上方导航的出现与隐藏
		var top = navEl.getBoundingClientRect().top;
		if(top <= 0){
			navfix.style.display = "block";
		}else{
			navfix.style.display = "none";
		};
		// 选项卡的联动效果 通过对每一个li 去判断对应的部分距离浏览器上方的距离,
		// 进行加类名,和去类名的操作
		liElFixas.forEach( function(item, i) {
			var top = parts[i].getBoundingClientRect().top;
			if(top <= 0){
				var oned = item.classList.contains("on");
				if(oned) return;
				liElFixas.forEach(function(item2) {
					item2.classList.remove("on")
				});
				item.classList.add("on");
			};
		});
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
			console.log(document.querySelector(".cartList"));
			document.querySelector(".cartList ul.cartList").innerHTML= `
			
			<p>亲亲,暂无购物车信息展示!<br/>您当前没有登录或者已经登录但是购物车为空哦!</p>
			
			`;
		}
		return;
	} else {
		buyQualiEl.innerText = total;
		qualityEl.innerText = total;
		var cartListBottom = document.querySelector(".cartList-bottom");
		qualityEl.style.background = "url(../images/fix/fixrjie.gif) no-repeat -15px 0px";
		qualityEl.style.borderColor = "#90B42F";
		//第一次进入购物页面的上部的动态渲染
		UpdateCartListShow();	
		// var money = 0;
		// var ulEl = document.querySelector("div.cartList ul.cartList");
		
		// var data = JSON.parse(sessionStorage.getItem("data"));
		// var cartList = data.cartList;
		// var productList = data.productList;
		
		// userCartList = cartList.filter(function(item) {return item.name === userName});
		// userCartList.forEach(function(item) {
			
			// var product = productList.find(function(item2) {return item2.id === item.pid});
			// money += parseInt(item.count * product.price);
			// ulEl.innerHTML += `
			// 	<li class="clearfix">
			// 		<div>
			// 			<img src="${product.avatar}" alt="">
			// 		</div>
			// 		<div class="name">${product.name}</div>
			// 		<div class="price">${product.price}</div>
			// 		<div class="total">
			// 			× 
			// 			<span>${item.count}</span>
			// 		</div>
			// 	</li>
			
			
			
		// 	`;
			
			
		// });
		
		// ulEl.innerHTML +=`
		// 	<div class="cartList-bottom">
		// 		共<span>${total}</span>件商品 总计￥<span>${money}</span>
		// 		<a href="../cart/cart.html">去结算</a>
				
		// 	</div>
		
		
		// `;
		
	};
	
})();

// 封装函数实现上部购物列表内容的动态渲染
function UpdateCartListShow(){
	var userName = Cookies.get("user");
	var data = JSON.parse(sessionStorage.getItem("data"));
	var cartList = data.cartList;
	var money = 0;
	var total = 0;
	total = parseInt(Cookies.get("total"));
	var productList = data.productList;
	var userCartList = cartList.filter(function(item) { return item.name === userName});
	var ulEl = document.querySelector("div.cartList ul.cartList");
	ulEl.innerHTML = "";
	userCartList.forEach(function(item) {
		console.log(item);
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
	
}

