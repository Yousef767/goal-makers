/*
	delete all cookies - make stories unread
	
	Object.keys(Cookies.get()).forEach(function(cookieName) {
	  Cookies.remove(cookieName);
	});
*/

const isMobile    = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/*drag scrolling. - js https://codepen.io/toddwebdev/pen/yExKoj */

if(!isMobile){
	const slider = document.querySelector('.story-bubbles');
	let isDown = false;
	let startX;
	let scrollLeft;

	slider.addEventListener('mousedown', (e) => {
	  isDown = true;
	  slider.classList.add('active');
	  startX = e.pageX - slider.offsetLeft;
	  scrollLeft = slider.scrollLeft;
	});

	slider.addEventListener('mouseleave', () => {
	  isDown = false;
	  slider.classList.remove('active');
	});

	slider.addEventListener('mouseup', () => {
	  isDown = false;
	  slider.classList.remove('active');
	});

	slider.addEventListener('mousemove', (e) => {
	  if(!isDown) return;
	  e.preventDefault();
	  const x = e.pageX - slider.offsetLeft;
	  const walk = (x - startX) * 1; //scroll-fast
	  slider.scrollLeft = scrollLeft - walk;
	});
}

function is_alphaDash(str){
	regexp = /^[a-z\-]+$/i;
	
	if (regexp.test(str)){
		return true;
	}else{
		return false;
	}
}

/*Click Bubble*/

let bubbles = document.querySelectorAll('.story-bubbles .bubbles .bubble');
let storiesContainer = document.querySelector('.stories');
let storiesClose = document.querySelector('.stories .st-header .close-icon a');

let swiper;
let delay = 10000;
let slidePauseB = false;
let newDelay = 0;
let countdownFnc;
let percentage = 0;
let newPercentage = 0;
let bullet;
let navigationEl = document.querySelectorAll('.next, .prev');
let allPagiProgress;

let throttleAmount = 4;

let getCookies = Cookies.get();

bubbles.forEach(function($bubble){
	let postTitle = $bubble.dataset.postTitle;
	let postId = $bubble.dataset.postId;
	
	if(Object.keys(getCookies).length !== 0 && getCookies.constructor === Object){
		for (const [key, value] of Object.entries(Cookies.get())) {
			
			if(!is_alphaDash(key)){
				
			}else{
				let obj = JSON.parse(value);
			
				if(postTitle == key && obj.id == postId && obj.reed == 1){
					$bubble.classList.add('read');
					$bubble.style.order = obj.order;
					$bubble.closest('.story-bubbles').querySelector('.bubbles.readon').appendChild($bubble);

					$bubble.dataset.postReed = 1;
					$bubble.dataset.postOrder = obj.order;

					document.querySelectorAll('.swiper-slide').forEach(function($swipe){
						let swipePostTitle = $swipe.dataset.postTitle;
						let swipePostId = $swipe.dataset.postId;

						if(swipePostTitle == postTitle && swipePostId == postId){
							$swipe.dataset.postReed = 1;
						}
					});
				}
			}
		}
	}
	
	$bubble.addEventListener('click', bubbleClick);
	
});

function bubbleClick(e){
	let orderArr = [];
	let maxOrder = 0;
	
	let bubble = e.target.closest('.bubble');
	let postId = bubble.dataset.postId;
	let postTitle = bubble.dataset.postTitle;
	let postReed = bubble.dataset.postReed;
	let postOrder = bubble.dataset.postOrder;
		
	if(Object.keys(Cookies.get()).length !== 0 && Cookies.get().constructor === Object){
		for (const [key, value] of Object.entries(Cookies.get())) {
			if(!is_alphaDash(key)){
				
			}else{
				let getCookOrder = JSON.parse(value);

				orderArr.push(getCookOrder.order);
			}
		}

		maxOrder = Math.min.apply(Math, orderArr);
	}
	
	Cookies.set(postTitle, JSON.stringify({
		id: postId,
		reed: 1,
		order: parseInt(maxOrder) - 1
	}));
	
	getCookies = Cookies.get(postTitle);
	getCookies = JSON.parse(getCookies);

	storiesContainer.classList.add('show');
	
	if(storiesContainer.classList.contains('show')){
		/*stories slider swiper.js*/
		
		function countdown(secs, np = 0, isSlideEnd = false) {	
			let milli = secs * (1000);
			let st = new Date().getTime();
			let isSE = false;
			percentage = 0;

			var counter = setInterval(function() {
				if((percentage + np) == 100) {
					clearInterval(counter);
					
					if(isSlideEnd){
						isSE = true;
						storiesContainer.classList.remove('show');
						swiper.destroy();
					}
				}
				milli -= throttleAmount;

				newDelay = milli;

				var diff = Math.round(new Date().getTime() - st);

				percentage = Math.round(diff / delay * 100);

				newPercentage = (percentage + np);
				
				if(!isSE){
					document.querySelector('.st-slider .swiper-pagination .swiper-pagination-bullet-active em').style.width = (percentage + np) + '%';
				}

			}, throttleAmount);

			return counter;
		}

		swiper = new Swiper('.stories .st-slider .swiper-container', {
			effect: 'cube',
			init: false,
			speed: 600,
			initialSlide: parseInt(postId) - 1,
			autoplay: {
				delay: delay,
				stopOnLastSlide: true,
				disableOnInteraction: false
			},
			simulateTouch: true,
			pagination: {
				el: '.stories .st-slider .swiper-pagination',
				renderBullet: function (index, className) {
					return '<span class="' + className + '"><em class="progress"></em></span>';
				}
			},
			navigation: {
			  nextEl: '.stories .st-slider .next',
			  prevEl: '.stories .st-slider .prev',
			},
			on: {
				slideChange: function(){
					clearInterval(countdownFnc);

					swiper.autoplay.stop();
					swiper.params.autoplay = {delay: delay};
					swiper.autoplay.start();

					swiper.update();

					document.querySelectorAll('.st-slider .swiper-pagination .swiper-pagination-bullet:not(.swiper-pagination-bullet-active) em').forEach(function($el){
						$el.style.width = 100 + '%';
					});

					document.querySelectorAll('.st-slider .swiper-pagination .swiper-pagination-bullet-active ~ .swiper-pagination-bullet em').forEach(function($el){
						$el.style.width = 0;
					});

					countdownFnc = countdown(delay / 1000, 0, swiper.isEnd);
					
					/*Cookie Add*/
					let slideActive = document.querySelector('.swiper-slide-active');
					
					let slideOrderArr = [];
					let slideMaxOrder = 0;
					let isCook = false;

					let slidePostId = slideActive.dataset.postId;
					let slidePostTitle = slideActive.dataset.postTitle;
					let slidePostReed = slideActive.dataset.postReed;

					if(Object.keys(Cookies.get()).length !== 0 && Cookies.get().constructor === Object){
						for (const [key, value] of Object.entries(Cookies.get())) {
							
							if(!is_alphaDash(key)){
				
							}else{
								let obj = JSON.parse(value);
								let getCookOrder = obj.order;

								slideOrderArr.push(getCookOrder);

								if(slidePostTitle == key && obj.id == slidePostId && obj.reed == 1){
									isCook = true;
								}
							}
						}

						slideMaxOrder = Math.min.apply(Math, slideOrderArr);
					}

					if(!isCook){
						Cookies.set(slidePostTitle, JSON.stringify({
							id: slidePostId,
							reed: 1,
							order: parseInt(slideMaxOrder) - 1
						}));

						getCookies = Cookies.get(slidePostTitle);
						getCookies = JSON.parse(getCookies);

						if(getCookies && getCookies.reed == 1 && slideActive.dataset.postReed == 0){
							slideActive.dataset.postReed = 1;
							
							bubbles.forEach(function($bubble){
								let bubblePostTitle = $bubble.dataset.postTitle;
								let bubblePostId = $bubble.dataset.postId;

								if(slidePostTitle == bubblePostTitle && slidePostId == bubblePostId){
									$bubble.classList.add('read');
									$bubble.style.order = getCookies.order;
									$bubble.closest('.story-bubbles').querySelector('.bubbles.readon').appendChild($bubble);

									$bubble.dataset.postReed = 1;
									$bubble.dataset.postOrder = getCookies.order;
								}
							});
						}
					}
					
				},
				touchStart: function(){
					timeStop = setTimeout(slidePause, 600);

					function slidePause(){				
						navigationEl.forEach(function($el){
							$el.style.display = 'none'
						});

						swiper.autoplay.stop();

						clearInterval(countdownFnc);

						slidePauseB = true;
					}
				},
				touchEnd: function(){
					clearTimeout(timeStop);

					if(slidePauseB){
						navigationEl.forEach(function($el){
							$el.style.display = 'block'
						});

						if (!this.autoplay.running) {		
							swiper.params.autoplay = {delay: newDelay};

							swiper.autoplay.start();
							swiper.update();
						}

						slidePauseB = false;

						countdownFnc = countdown(Math.round(newDelay / 1000), newPercentage, swiper.isEnd);
					}
				}
			}
		});
		
		swiper.on('init', function(){
			document.querySelectorAll('.st-slider .swiper-pagination .swiper-pagination-bullet:not(.swiper-pagination-bullet-active) em').forEach(function($el){
				$el.style.width = 100 + '%';
			});

			document.querySelectorAll('.st-slider .swiper-pagination .swiper-pagination-bullet-active ~ .swiper-pagination-bullet em').forEach(function($el){
				$el.style.width = 0;
			});
			
			countdownFnc = countdown(delay / 1000, 0, swiper.isEnd);
		});
		
		swiper.init();
	}
	
	if(getCookies && getCookies.reed == 1 && bubble.dataset.postReed == 0){
		bubble.classList.add('read');
		bubble.style.order = getCookies.order;
		bubble.closest('.story-bubbles').querySelector('.bubbles.readon').appendChild(bubble);
		
		bubble.dataset.postReed = 1;
		bubble.dataset.postOrder = getCookies.order;
		
		document.querySelector('.swiper-slide-active').dataset.postReed = 1;
	}
	
	e.preventDefault();
}

storiesClose.addEventListener('click', function(e){
	storiesContainer.classList.remove('show');
	
	swiper.destroy();
	
	clearInterval(countdownFnc);
	
	e.preventDefault();
});