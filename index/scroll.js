var AreasTop = [];
var parts = document.querySelectorAll("div.part");
var partNavs = document.querySelectorAll(".part-nav>li");
var scrollTimer = null;


function scroll(top){
	var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
	var diffTop = top - nowTop;
	if(Math.abs(diffTop) <= 30){
		window.scrollTo(0,top);
		clearInterval(scrollTimer);
		scrollTimer = null ;
	}
	else{
		window.scrollTo(0, diffTop > 0 ? nowTop + 30 : nowTop - 30  );
	};
};








// 左边选择器的行为
imagesLoaded(document.body,function() {
	parts.forEach(function(item,i){
		var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
		AreasTop.push(Math.floor(nowTop + item.getBoundingClientRect().top));
	});	
	
	
});

// setTimeout(function(){
	
// },500);

partNavs.forEach(function(item,i){
	item.i = i;
	
	item.onclick = function(){
	
	if(this.classList.contains("active")) return;
	
	if(scrollTimer) {
		clearInterval(scrollTimer);
		scrollTimer = null;
	}
	
	partNavs.forEach(function(item2) {
		item2.classList.remove("active");
	});
	this.classList.add("active") ;
	
	var top = AreasTop[this.i];

	scrollTimer	= setInterval(function(){
		scroll(top);
	},10);
		
	};
		
	
		
});

// 右边滚轮的行为
window.onmousewheel = function() {
	if(scrollTimer){
		clearInterval(scrollTimer);
		scrollTimer = null;
	};
	var partoneEl = document.querySelector(".partshow");
	console.log(partoneEl);
	var topOne = partoneEl.getBoundingClientRect().top;
	console.log(topOne);
	var showUlEl = document.querySelector("div.fix-left");
	if(topOne <= 0) {
		showUlEl.style.display = "block"
	}else{
		showUlEl.style.display = "none"
	};
	
}

window.onscroll = function() {
	if(scrollTimer) return;
	var nowTop = document.documentElement.scrollTop || document.body.scrollTop;
	for(var i = AreasTop.length - 1; i >= 0; i--){
		if(nowTop >= AreasTop[i]) break;
		// console.log(i);
		
	}
	
	partNavs.forEach(function(item) {
			item.classList.remove("active");
		});
		// console.log(i);
		if(i >= 0) partNavs[i].classList.add("active");
	
}




