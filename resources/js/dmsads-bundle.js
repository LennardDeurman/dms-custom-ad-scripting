
var DMSAds = DMSAds || {};


var DMSAds = (function(){
	
	return {
		isWindowLoaded: DMSAds.isWindowLoaded || false,
		cmd: DMSAds.cmd || [],
		call: function (command) {
			if (DMSAds.isWindowLoaded) {
				command();
			} else {				
				DMSAds.cmd.push(command);
			}
		},
		
		helpers: (function() {
			
			var DMSADS_VJS_CSS = 'https://vjs.zencdn.net/7.0.3/video-js.css'
			var DMSADS_CSS = 'http://cdn.deurman.com/resources/css/dmsads-style.css'
			var DMSADS_VJS_JS = 'https://unpkg.com/video.js@6.2.1/dist/video.min.js'
			var DMSADS_VJS_FLASH_JS = 'https://unpkg.com/videojs-flash@2.0.0/dist/videojs-flash.min.js'
			var DMSADS_VJS_FLASH = 'https://unpkg.com/videojs-swf@5.4.0/dist/video-js.swf';
			var DMSADS_VJS_IMA_SDK = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
			var DMSADS_VJS_CONTRIB_ADS = 'https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/6.6.0/videojs-contrib-ads.min.js';
			var DMSADS_VJS_IMA_PLUGIN = 'https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/1.5.1/videojs.ima.min.js';
			var DMSADS_VJS_CONTRIB_ADS_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/6.6.0/videojs-contrib-ads.min.css';
			var DMSADS_VJS_IMA_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/1.5.1/videojs.ima.min.css';
			var DMSADS_VJS_IMA_JS_BUNDLE = 'http://cdn.deurman.com/resources/js/videojs-ima-bundle.js'
		
			var insertedCSS = [];
			var insertedJS = [];
			
			return {
				requireStyleSheet: function(href) {
					
					if (insertedCSS.indexOf(href) > -1) {
						return;
					}
					
					var fileref= document.createElement("link")
				    fileref.setAttribute("rel", "stylesheet")
				    fileref.setAttribute("type", "text/css")
				    fileref.setAttribute("href", href)
					document.getElementsByTagName("head")[0].appendChild(fileref)
					
					insertedCSS.push(href);
					
				},
				requireJS: function (src, callback) {
					
					if (insertedJS.indexOf(src) > -1) {
						return;
					}
					
					var fileref=document.createElement('script')
					fileref.setAttribute("type","text/javascript")
					fileref.setAttribute("src", src);
					document.body.appendChild(fileref);
					
					if (fileref.readyState){  
						fileref.onreadystatechange = function(){
							if (fileref.readyState == "loaded" ||
									fileref.readyState == "complete"){
								fileref.onreadystatechange = null;
								if (callback) {
									callback();
								}
							}
						};
					} else {  
						fileref.onload = function(){
							if (callback) {
								callback();
							}
						};
					}
					
					insertedJS.push(src);
					
				},
				requireIMACSS: function(){
					DMSAds.helpers.requireStyleSheet(DMSADS_VJS_CONTRIB_ADS_CSS);
					DMSAds.helpers.requireStyleSheet(DMSADS_VJS_IMA_CSS);
				},
				requireGlobalCSS: function() {
					DMSAds.helpers.requireStyleSheet(DMSADS_CSS);
				},
				requireVJSCSS: function() {
					DMSAds.helpers.requireStyleSheet(DMSADS_VJS_CSS);
				},
				requireVJSIMAPlugin: function(callback) {
					DMSAds.helpers.requireJS(DMSADS_VJS_IMA_PLUGIN, callback);
				},
				requireVJSContribAds: function(callback){
				
					DMSAds.helpers.requireJS(DMSADS_VJS_CONTRIB_ADS, callback);
				},
				requireVJSIMASDK: function(callback){
				
					DMSAds.helpers.requireJS(DMSADS_VJS_IMA_SDK, callback);
				},
				
				requireVJSScripts: function(callback) {
					
					var todo = function() {
						videojs.options.flash.swf = DMSADS_VJS_FLASH;
					}
					
					var loadVJS = false;
					var loadFlash = false;
					
					DMSAds.helpers.requireJS(DMSADS_VJS_JS, function(){
						
						if (callback) {
							callback();
						}
						
						DMSAds.helpers.requireJS(DMSADS_VJS_FLASH_JS, function(){
							videojs.options.flash.swf = DMSADS_VJS_FLASH;
						});
					});
					
					
					
					
					
					
					
				},
				requireVJSScriptsWithIMA: function(callback) {
					DMSAds.helpers.requireJS(DMSADS_VJS_IMA_JS_BUNDLE, function(){
						
						if (callback) {
							callback();
						}
						
						DMSAds.helpers.requireJS(DMSADS_VJS_FLASH_JS, function(){
							videojs.options.flash.swf = DMSADS_VJS_FLASH;
						});
					});
				},
				
				isAdFilled: function (container) {
					for (var i = 0; i < container.children.length; i++) {
						var child = container.children[i];
						if (child.clientHeight > 10) {
							return true;
						}
					}
					return false;
				},
				
				isElementInView: function (container, offset) {
					var isHidden = document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
					if (isHidden) {
						return false;
					}
					var rect = container.getBoundingClientRect();
					var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
					var checkPoint = rect.top - offset;
					var windowScrollTop =  document.documentElement.scrollTop || document.body.scrollTop;
					return (windowScrollTop + windowHeight > checkPoint) 
					
				},
				
				
				
			}
		})(),
		videoAds: (function() {
			
			
			var DMSADS_PLAYER_ID = 'dmsads-player'
			var DMSADS_PLAYER_VJS_ID = 'dmsads-player-vjs';
			var DMSADS_PLAYER_STARTED = 'dmsads-player-started';
			var DMSADS_PLAYER_STOPPED = 'dmsads-player-stopped';
			var DMSADS_PLAYER_ENDED = 'dmsads-player-ended';
			var DMSADS_PLAYER_HOVER = 'dmsads-player-hovered';
			var DMSADS_PLAYER_PLAY_BUTTON_QUERY = '.vjs-big-play-button';
			var DMSADS_PLAYER_CONTROL_BAR_QUERY = '.vjs-control-bar';
			var DMSADS_PLAYER_SMALL_PLAY_CONTROL_QUERY = '.vjs-play-control.vjs-control.vjs-button';
			var DMSADS_PLAYER_STICKY_CLASS = 'dmsads-player-sticky';
			var DMSADS_PLAYER_VJS_CLASSES = 'video-js video-js vjs-default-skin vjs-big-play-centered vjs-16-9';
			var DMSADS_PLAYER_SUB_ID = 'dmsads-player-sub-container';
			var DMSADS_IMG_BTN_STICKY = 'dmsads-img-btn-sticky';
			var DMSADS_STICKY_FADE_OUT = 'dmsads-player-sticky-close';
			var DMSADS_PLAYER_ROLL_BACKUP = 'dmsads-player-roll-backup';
			var DMSADS_PLAYER_ROLL_BACKUP_CONTENT = 'dmsads-player-roll-backup-content';
			
			var player, container, playButton, videoRect, isSeen, isCompleted, isManualPause, hideStickyAd, stickyOptions, stickyVisible, stickyWidth;
			
		
			
			
			var checkVideoViewability = function(id) {
				
				if (DMSAds.videoAds.isCompleted) {
					return;
				}
				
				var rect = document.getElementById(id).getBoundingClientRect();
				var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
				var isVisible = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
				
				
				if (isVisible) {
					if (!DMSAds.videoAds.isManualPause) {
						
						console.log('DMSAds: continue play video');
						DMSAds.videoAds.play();
						DMSAds.videoAds.isSeen = true;
					}
					
					removeSticky();
				} else {
					if (DMSAds.videoAds.isSeen && !DMSAds.videoAds.isCompleted && !DMSAds.videoAds.isManualPause && !DMSAds.videoAds.hideStickyAd && DMSAds.videoAds.stickyVisible) {
						makeSticky();
					} else {
					
						console.log('DMSAds: pause video');
						DMSAds.videoAds.pause();
						removeSticky();
					}
				
				}
			}
			
			var makeSticky = function () {
				DMSAds.videoAds.container.classList.add(DMSADS_PLAYER_STICKY_CLASS);
				if (DMSAds.videoAds.stickyWidth){
					DMSAds.videoAds.container.style.width = DMSAds.videoAds.stickyWidth + "px";
				}
			}
			
			var removeSticky = function() {
				DMSAds.videoAds.container.classList.remove(DMSADS_PLAYER_STICKY_CLASS);
				DMSAds.videoAds.container.style.width = "inherit";
			}
			
			var setHoverMode = function (player, isHover) {
				if (isHover) {	
					player.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).classList.add(DMSADS_PLAYER_HOVER);
					player.querySelector(DMSADS_PLAYER_CONTROL_BAR_QUERY).classList.add(DMSADS_PLAYER_HOVER);
				} else {
					player.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).classList.remove(DMSADS_PLAYER_HOVER);
					player.querySelector(DMSADS_PLAYER_CONTROL_BAR_QUERY).classList.remove(DMSADS_PLAYER_HOVER);
				}
			}
			
			var pause = function (player, playButton) {
				player.pause();
			}
			
			var play = function (player, playButton) {
				player.play();
			}
			
			var restart = function (player, playButton) {
				player.currentTime(0);
				player.play();
			}
			
			var bindViewabilityEvent = function(id) {
				
  
				window.addEventListener("scroll", function() {
				  checkVideoViewability(id);
				});
				  
				window.addEventListener("resize", function() {
					DMSAds.videoAds.lockSizes();
				  checkVideoViewability(id);
				});
				
				checkVideoViewability(id);
			}
			
			
			
			var bindEvents = function(id, player, options, container, onVideoEnd) {
				player.ready(function() {
				  this.on('play', function() {
					  
					DMSAds.videoAds.isManualPause = false;
					container.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).classList.add(DMSADS_PLAYER_STARTED);
					container.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).classList.remove(DMSADS_PLAYER_ENDED);
					container.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).classList.remove(DMSADS_PLAYER_STOPPED);
				  });
				  
				   this.on('pause', function() {
					  
					  container.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).classList.remove(DMSADS_PLAYER_STARTED);
					container.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).classList.remove(DMSADS_PLAYER_ENDED);
					container.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).classList.add(DMSADS_PLAYER_STOPPED);
					  
				  });
				
				  
				  this.on('ended', function() {	
					endVideo(container, options, onVideoEnd);
				  });
				  DMSAds.videoAds.lockSizes();
				  bindViewabilityEvent(id);
				});
				
				if (!options.clickUrl) {
					container.addEventListener('mouseover', function() {
			
						setHoverMode(container, true);
					});
				
					container.addEventListener('mouseout', function() {
						setHoverMode(container, false);
					
					});
				
				} else {
					container.style.cursor = "pointer";
				}
				
				
				
				
				container.querySelector(DMSADS_PLAYER_SMALL_PLAY_CONTROL_QUERY).addEventListener('click', function() {
				
					var playButton = DMSAds.videoAds.playButton;
					var isPlaying = this.classList.contains("vjs-playing");
					if (isPlaying) {
						DMSAds.videoAds.isManualPause = true;
					}
				
				});
				
				container.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).addEventListener('click', function() {
					var shouldPause = this.classList.contains(DMSADS_PLAYER_STARTED);
					var shouldStart = this.classList.contains(DMSADS_PLAYER_STOPPED);
					var shouldReplay = this.classList.contains(DMSADS_PLAYER_ENDED);
					
					if (shouldPause) {						
						DMSAds.videoAds.isManualPause = true;
						pause(player, this);
						return;
					}
					
					if (shouldStart) {
						play(player, this);
						return;
					}
					
					if (shouldReplay) {
						restart(player, this);
						return;
					}
					  
				});
				
				
							
			}
			
			var endVideo = function(container, options, onVideoEnd){
				if (DMSAds.videoAds.isCompleted) {
					return;
				}
			
				DMSAds.videoAds.isCompleted = true;
				container.classList.add(DMSADS_PLAYER_ENDED);
				removeSticky();
				container.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).classList.add(DMSADS_PLAYER_ENDED);
				container.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY).classList.remove(DMSADS_PLAYER_STARTED);
				
				DMSAds.videoAds.lockSizes();
				
				if (onVideoEnd) {
					console.log('DMSAds: onVideoEnd called');
					document.getElementById(DMSADS_PLAYER_VJS_ID).style.display = "none";
					onVideoEnd(container);
				} else {
					console.log('DMSAds: onVideoEnd function not provided');
				}
				
				createRoll(options, container);
			}
			
			var makeElement = function(tag, id, className) {
				var element = document.createElement(tag);
				element.id = id;
				element.className = className;
				return element;
			}
			
			var getSetupConfig = function(posterSrc) {
				var obj = {"fluid": true, "poster": posterSrc};
				return obj;
			}
			
			var hideSticky = function(container) {
				DMSAds.videoAds.hideStickyAd = true;
				DMSAds.videoAds.pause();
				container.style.right = "-" + ((DMSAds.videoAds.stickyWidth != undefined ? DMSAds.videoAds.stickyWidth : 260) + 40) + "px";
			}
			
			var createCloseButton = function(container){
				var img = makeElement("IMG", DMSADS_IMG_BTN_STICKY);
				img.src = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ3Ljk3MSA0Ny45NzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ3Ljk3MSA0Ny45NzE7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNjRweCIgaGVpZ2h0PSI2NHB4Ij4KPGc+Cgk8cGF0aCBkPSJNMjguMjI4LDIzLjk4Nkw0Ny4wOTIsNS4xMjJjMS4xNzItMS4xNzEsMS4xNzItMy4wNzEsMC00LjI0MmMtMS4xNzItMS4xNzItMy4wNy0xLjE3Mi00LjI0MiwwTDIzLjk4NiwxOS43NDRMNS4xMjEsMC44OCAgIGMtMS4xNzItMS4xNzItMy4wNy0xLjE3Mi00LjI0MiwwYy0xLjE3MiwxLjE3MS0xLjE3MiwzLjA3MSwwLDQuMjQybDE4Ljg2NSwxOC44NjRMMC44NzksNDIuODVjLTEuMTcyLDEuMTcxLTEuMTcyLDMuMDcxLDAsNC4yNDIgICBDMS40NjUsNDcuNjc3LDIuMjMzLDQ3Ljk3LDMsNDcuOTdzMS41MzUtMC4yOTMsMi4xMjEtMC44NzlsMTguODY1LTE4Ljg2NEw0Mi44NSw0Ny4wOTFjMC41ODYsMC41ODYsMS4zNTQsMC44NzksMi4xMjEsMC44NzkgICBzMS41MzUtMC4yOTMsMi4xMjEtMC44NzljMS4xNzItMS4xNzEsMS4xNzItMy4wNzEsMC00LjI0MkwyOC4yMjgsMjMuOTg2eiIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";
				img.onclick = function () {
					hideSticky(container);
				}
				return img;
			}
			
			var createPlayer = function(posterSrc, videoSrc) {
				var container = makeElement("DIV", DMSADS_PLAYER_ID);
				
				var sub = makeElement("DIV", DMSADS_PLAYER_SUB_ID);
				container.appendChild(sub);
				
				sub.appendChild(createCloseButton(container));
				
				var vjsContainer = makeElement("VIDEO", DMSADS_PLAYER_VJS_ID, DMSADS_PLAYER_VJS_CLASSES);
				//vjsContainer.setAttribute('muted', undefined);
				vjsContainer.setAttribute("webkit-playsinline", "true");
				vjsContainer.setAttribute("playsinline", "true");
				
				
				vjsContainer.setAttribute('controls', 'true');
				vjsContainer.setAttribute('preload', 'auto');
				var setupString = JSON.stringify(getSetupConfig(posterSrc));
				vjsContainer.setAttribute('data-setup', setupString);
				var source = makeElement("SOURCE");
				source.src = videoSrc;
				source.setAttribute("type", "video/mp4");
				sub.appendChild(vjsContainer);
				vjsContainer.appendChild(source);
				return container;
			}
			
			var createRoll = function (options, parent) {
				
				
				if (!options.roll){
					return;
				}
				
				var dockContainer = makeElement("DIV", DMSADS_PLAYER_ROLL_BACKUP);
				dockContainer.style.overflow = "hidden";
				dockContainer.style.height = "0";
				dockContainer.style.paddingTop = "56.25%";
				dockContainer.style.position = "relative";
			
			
				if (options.roll.type == 'embed') {
					var embedSrc = options.roll.src;
					var iframe = makeElement("IFRAME", DMSADS_PLAYER_ROLL_BACKUP_CONTENT);
					iframe.src = embedSrc;
					iframe.style.border = "none";
					iframe.style.width = "100%";
					iframe.style.height = "100%";
					iframe.style.position = "absolute";
					iframe.style.top = "0";
					iframe.style.left = "0";
					iframe.setAttribute("allow", "autoplay;fullscreen");
					dockContainer.appendChild(iframe);
					parent.appendChild(dockContainer);
				}
				
				
				
				
			
			}
			
		
			
			
			
			return {
				
				lockSizes: function(){
					if (this.stickyOptions) {
						var currentMediaQuery;
						var medias = this.stickyOptions.mediaQueries;
						var width = window.innerWidth;
						for (var i = 0; i < medias.length; i++) {
							var media = medias[i];
							var min = media.min;
							var max = media.max;
							if (min && max) {								
								if (width > min && width < max) {
									currentMediaQuery = media;
									break;
								}
							} else {
								if (min) {
									if (width > min) {
										currentMediaQuery = media;
										break;
									}
								}
							}
						}
						var stickyVisible = this.stickyOptions.showSticky;
						var stickyWidth = 260;
						if (currentMediaQuery) {
							stickyVisible = currentMediaQuery.showSticky == undefined ? true : currentMediaQuery.showSticky;
							stickyWidth = currentMediaQuery.width;
						}
						
						
						this.stickyVisible = stickyVisible;
						this.stickyWidth = stickyWidth;
					
					}
					 
					
					
				
					if (this.isCompleted) {
						this.parentContainer.style.minHeight = "0px";
					} else {
						this.parentContainer.style.minHeight = this.container.clientHeight + "px";
					}
				},
				
				upgrade: function(id, options, onVideoEnd){
				
					if (document.getElementById(DMSADS_PLAYER_ID)) {
						console.log('Only one DMSAds player can be initiated on the page');
						return;
					}
				
					var inarticle = false;
					if (!options.videoSrc) {
						inarticle = true;
						options.videoSrc = "data:video/mp4;base64, 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"
					}
				
					this.stickyOptions = options.stickyOptions;
					this.parentContainer = document.getElementById(id);
					var playerElement = createPlayer(options.imgSrc, options.videoSrc);
					this.parentContainer.appendChild(playerElement);
					
					
					this.player = videojs(DMSADS_PLAYER_VJS_ID);
					
					if (options.adTagUrl || options.adTag) {
						var adOptions = {
							id: DMSADS_PLAYER_VJS_ID, 
							adTagUrl: options.adTagUrl,
							adsResponse: options.adTag,
							 adsRenderingSettings: {
								enablePreloading: true  
							 }
						}
						console.log("DMSAds: added IMA options");
						this.player.ima(adOptions);
						this.player.on("adsready", function(){
						  DMSAds.videoAds.player.ima.addEventListener(google.ima.AdEvent.Type.COMPLETE, function(){
							 checkVideoViewability();
						  });
						  
						  DMSAds.videoAds.player.ima.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, function(){
							 if (inarticle) {
								endVideo(DMSAds.videoAds.container, options, onVideoEnd);  
							}
						  });
						  
						  DMSAds.videoAds.player.ima.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function(){
							 if (inarticle) {
								endVideo(DMSAds.videoAds.container, options, onVideoEnd);  
							}
						  });
						}); 
						
						
						
					}
					
					//this.player.volume(0);
					this.player.muted(true);
					this.container = document.getElementById(DMSADS_PLAYER_ID);
					var clickUrl = options.clickUrl;
					if (clickUrl) {
						this.container.onclick = function(e) {
							if (!e.target.classList.contains("vjs-tech")) {
								return;
							}
							var a = document.createElement("a");
							a.target = "_blank";
							a.href = clickUrl;
							a.click();
						}
					}
					DMSAds.videoAds.lockSizes();
					this.playButton = document.querySelector(DMSADS_PLAYER_PLAY_BUTTON_QUERY);
					this.videoRect = this.container.getBoundingClientRect();
					this.isSeen = false;
					this.isCompleted = false;
					//createRoll(options, this.container);
					
					bindEvents(id, this.player, options, this.container, onVideoEnd);
				},
				init: function(id, options, onVideoEnd) {
					
				
					
					
					DMSAds.helpers.requireVJSCSS();
					
					if (options.adTagUrl || options.adTag) {
						DMSAds.helpers.requireIMACSS();
						DMSAds.helpers.requireVJSScriptsWithIMA(function(){
							DMSAds.videoAds.upgrade(id, options, onVideoEnd);
							
						});
					} else {							
						DMSAds.helpers.requireVJSScripts(function(){
							DMSAds.videoAds.upgrade(id, options, onVideoEnd);
							
						});
					}
					
					
					
					
					
				},
				
				pause: function () {
					pause(this.player, this.playButton);
				},
				play: function () {
					play(this.player, this.playButton);
				},
				restart: function () {
					restart(this.player, this.playButton);
				}
			}
			
		})(),
		scrollerAds: (function() {
			
			var INTERSCROLLER = 1;
			var MIDSCROLLER = 2;
			
			var DMSADS_INTERSCROLLER_BACKUP = 'https://antteam.com.sg/wp-content/uploads/2018/03/Facebook-Ad-Secrets-Banner.png';
			
			var DMSADS_IS_LOADED_KEY = 'data-dmsads-is-loaded';
			var DMSADS_MAX_HEIGHT_KEY = 'data-max-height';
			
			var makeElement = function(tag, id, css) {
				var element = document.createElement(tag);
				element.id = id;
				for(key in css){
				   element.style[key] = css[key];
				}
				return element;
			}
			
			var createCaption = function (title, className) {
				var div = document.createElement('DIV');
				div.className = className;
				var p = document.createElement('P');
				p.innerText = title;
				div.appendChild(p);
				return div;
			}
			
			var containerAdvertisementId = function (containerContentId) {
				return containerContentId + '-advertisement'
			}
			
			var createContentscroller = function (options) {
								
				var scrollerElement = createScrollerLayout(options);
				
				
				var scrollerContent = makeElement("DIV", options.containerContentId, {
					width: '100%', height: '100%', left: '0', top: '0'
				});
				
				var divElement = makeElement("DIV", containerAdvertisementId(options.containerContentId), {
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				});
				scrollerContent.appendChild(divElement);
				
				scrollerElement.appendChild(scrollerContent);
				bindContentScrollerEvents(options, containerAdvertisementId(options.containerContentId));
				return scrollerElement;
				
				
				
			}
			
			var createScrollerLayout = function(options) {
				var scrollerElement = makeElement("DIV", options.containerId,  {width: document.body.scrollWidth + "px", overflow: 'hidden',
					position: 'relative',
					backgroundColor: options.backgroundColor || 'rgb(180, 180, 180)',
					//left: (document.getElementById(options.targetId).getBoundingClientRect().x * -1) + "px",
					zIndex: '30000000',
					height: 0
				});
				
				scrollerElement.setAttribute(DMSADS_MAX_HEIGHT_KEY, options.height || '100vh');
			
				scrollerElement.appendChild(createCaption(options.topText, 'dmsads-text-caption dmsads-text-caption-top'));
				scrollerElement.appendChild(createCaption(options.bottomText, 'dmsads-text-caption dmsads-text-caption-bottom'));
				return scrollerElement;
			}
			
			
			var createInterscroller = function (options) {
				
				//interscrollerheight
				
				var scrollerElement = createScrollerLayout(options);
				var scrollerContent = makeElement("DIV", options.containerContentId, {
					position: 'absolute', width: '100%', height: '100vh', left: '0', top: '0'
				});
				var divElement = makeElement("DIV", containerAdvertisementId(options.containerContentId), {
					width: '100%',
					height: '100%',
					background: 'url(' + DMSADS_INTERSCROLLER_BACKUP + ') no-repeat center center fixed',
					webkitBackgroundSize: 'cover',  
					mozBackgroundSize: 'cover',
					oBackgroundSize: 'cover',
					backgroundSize: 'cover'
				});
				scrollerContent.appendChild(divElement);
				scrollerElement.appendChild(scrollerContent);
				bindInterScrollerEvents(options.containerId, options.containerContentId);
				bindScrollerObserver(scrollerElement, divElement);
				
				
				return scrollerElement;
			}
			
			var checkScrollerVisibility = function (containerId, containerAdvertisementId, offset, writeAd) {
					
				var scroller = document.getElementById(containerId);
				var isLoaded = scroller.getAttribute(DMSADS_IS_LOADED_KEY);
			
				if (!isLoaded) {					
					var rect = scroller.getBoundingClientRect();
					var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
					var checkPoint = rect.top - offset;
					var windowScrollTop =  document.documentElement.scrollTop || document.body.scrollTop;
					if (windowScrollTop + windowHeight > checkPoint) {
						
						scroller.setAttribute(DMSADS_IS_LOADED_KEY, "true");

						if (writeAd) {
							writeAd(containerAdvertisementId);
						} else {
							console.log('DMSAds: no write ad function present');
						}
					}
				}
			}
			
			var bindScrollerAdsEvent = function (containerId, containerContentId, offset, writeAd) {
				checkScrollerVisibility(containerId, containerContentId, offset, writeAd);
				window.top.addEventListener('scroll', function() {
					checkScrollerVisibility(containerId, containerContentId, offset, writeAd);
				});
				
			}
			
			
			
			var bindScrollerObserver = function (container, advertisementContainer) {
				var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
				if (MutationObserver) {
					var observer = new MutationObserver(function(mutations) {
						if (DMSAds.helpers.isAdFilled(advertisementContainer)) {
							container.style.height = container.getAttribute(DMSADS_MAX_HEIGHT_KEY);
						}
					});
					 
					observer.observe(advertisementContainer, {
						 attributes: true,
						 childList: true,
						 characterData: true
					});
					
				} else {
					advertisementContainer.addEventListener("DOMNodeInserted", function() {
						if (DMSAds.helpers.isAdFilled(advertisementContainer)) {
							container.style.height = container.getAttribute(DMSADS_MAX_HEIGHT_KEY);
						}
					});
				}
				
				
				
			}
			
			
			var bindContentScrollerEvents = function(options, advertisementContainerId) {
				
				
				
				window.top.addEventListener('scroll', function() {
					
					
					
					
					var scrollY = window.top.scrollY;
					var scroller = document.getElementById(options.containerId);
					var rect = scroller.getBoundingClientRect();
					
					var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
					var pos = (scrollY + rect.top) - windowHeight;
					
				
					var clientHeight = document.getElementById(advertisementContainerId).clientHeight;
					var maxHeight = clientHeight + DMSAds.scrollerAds.defaultLastVisibleHeight + ((options.adMargin || DMSAds.scrollerAds.defaultMargin) * 2);
					if (clientHeight < 10) {
						maxHeight = 0;
					}  
					var minHeight = options.minHeight || 0;
					var mayShrink = options.mayShrink;
					var lastVisibleHeight  =  DMSAds.scrollerAds.defaultLastVisibleHeight;
					var marginBottom = options.marginBottom || DMSAds.scrollerAds.defaultMarginBottom;
					if (scrollY + marginBottom > pos) {
						var height = scrollY - pos - marginBottom;
						if (height > maxHeight) {
							height = maxHeight;
						}
						if (height < lastVisibleHeight) {
							height = minHeight;
						}
						
						if (!mayShrink) {
							if (scroller.clientHeight < height) {
								scroller.style.height = height + "px";
							}
						} else {
							scroller.style.height = height + "px";
						}
						
					} 
				});
			}
			
			var bindInterScrollerEvents = function(containerId, containerContentId) {
				
				
				
				
				
				window.top.addEventListener('scroll', function() {
					var containerContent = window.top.document.getElementById(containerContentId);
					var rect = window.top.document.getElementById(containerId).getBoundingClientRect();
					containerContent.style.top = (rect.top * -1) + "px";
				});
				
				
				
				
			}
			

			
			return {
				defaultOffset: 500,
				defaultLastVisibleHeight: 40,
				defaultMarginBottom: 200,
				defaultMargin: 5,
				init: function(options) {
					DMSAds.helpers.requireGlobalCSS();
					options.containerContentId = options.containerContentId || options.containerId + "-contents";
					var scroller;
					switch (options.type) {
						case INTERSCROLLER:
						
							scroller = createInterscroller(options);
							break;
						case MIDSCROLLER:
							scroller = createContentscroller(options);
							break;
						 
					}
					window.top.document.getElementById(options.targetId).appendChild(scroller);
					window.top.document.getElementById(options.targetId).style.maxWidth = "100%";
					scroller.style.left =  (document.getElementById(options.targetId).getBoundingClientRect().x * -1) + "px";
					scroller.style.width = document.body.clientWidth + "px";
					
					window.top.addEventListener('resize', function() {
						scroller.style.left = (document.getElementById(options.targetId).getBoundingClientRect().x * -1) + "px";
						scroller.style.width = document.body.clientWidth + "px";					
					});
				
					bindScrollerAdsEvent(options.containerId, containerAdvertisementId(options.containerContentId), options.offset || DMSAds.scrollerAds.defaultOffset, options.writeAd);
				}
				
			}
			
		})(),
		sidebars: (function(){
			
			var DMSADS_SIDEBAR_LEFT = 1;
			var DMSADS_SIDEBAR_RIGHT = 2;
			
			
			return {
				init: function (options) {
					//options.position;
					//options.targetId
					var element = document.getElementById(options.targetId);
					element.parentElement.style.position = 'relative';
					element.style.position = 'absolute';
					options.position = options.position || DMSADS_SIDEBAR_LEFT;
					if (options.position == DMSADS_SIDEBAR_LEFT) {
						element.style.transform = 'translate(-100%,0)';
					}
					
					if (options.position == DMSADS_SIDEBAR_RIGHT) {
						element.style.transform = 'translate(100%,0)';
						element.style.right = '0';
					}
					
					element.style.padding = options.padding;
					 
					if (options.writeAd) {
						options.writeAd(element);
					}
					
					
					DMSAds.refresh.extendUnitWithRefresh(element, options);
					
					window.top.addEventListener('scroll', function() {
						var element = document.getElementById(options.targetId);
						var rect = element.parentElement.getBoundingClientRect();
						
						var top = rect.top;
						if (rect.top < 0) {		
							top = rect.top * -1; 
						}
						
						element.style.top = top + "px";
					});
				}
			}
			
		})(),
		pushupBillboard: (function() {
			
			var DMSADS_PUSHUP_BILLBOARD = 'dmsads-pushup-billboard';
			var DMSADS_FADE_IN_TIME = 800;
			
			var timer;
			var isClosed = false;
			
			var makeElement = function(tag, css) {
				var element = document.createElement(tag);
				for(key in css){
				   element.style[key] = css[key];
				}
				return element;
			}
			
			return {
				close: function() {
					isClosed = true;
					var elm = document.getElementById(DMSADS_PUSHUP_BILLBOARD);
					elm.style.bottom = "-" + elm.clientHeight + "px";
				},
				semiOpen: function() {
					if (isClosed) {
						return;
					}
					var elm = document.getElementById(DMSADS_PUSHUP_BILLBOARD);
					elm.style.bottom = "-" + (elm.clientHeight * 0.5) + "px";
				},
				open: function() {
					
					if (isClosed) {
						return;
					}
					
					var elm = document.getElementById(DMSADS_PUSHUP_BILLBOARD);
					elm.style.bottom = "0px";
					
					if (!timer) {							
						timer = setTimeout(function() {
							DMSAds.pushupBillboard.semiOpen();
						}, DMSADS_FADE_IN_TIME);
					} 
					
				},
				init: function (options) {
					
					if (document.getElementById(DMSADS_PUSHUP_BILLBOARD)) {
						console.log('Pushup billboard already registered');
						return;
					}
					
					var parentElement = makeElement("DIV", {
						position: 'fixed',
						bottom: '0',
						left: '50%',
						zIndex: '2147483647',
						transform: 'translate(-50%, 0%)',
						transition: 'all 1s'
					});
					parentElement.id = DMSADS_PUSHUP_BILLBOARD;
					
					var relativeElement = makeElement("DIV", {
						position: 'relative'
					});
					
					var closeContainerElement = makeElement("DIV", {
						width: '16px',
						height: '16px',
						boxSizing: 'unset',
						backgroundColor: '#fff', 
						position: 'absolute',
						right: '8px',
						top: '8px',
						zIndex: '2147483647',
						padding: '8px',
						borderRadius: '50%', 
						cursor: 'pointer'
					});
					
					closeContainerElement.onclick = function() {
						DMSAds.pushupBillboard.close();
					}
					
					var closeImg = makeElement("IMG", {
						width: '100%',
						cursor: 'pointer'
						});
						
					closeImg.src = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ3Ljk3MSA0Ny45NzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ3Ljk3MSA0Ny45NzE7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNjRweCIgaGVpZ2h0PSI2NHB4Ij4KPGc+Cgk8cGF0aCBkPSJNMjguMjI4LDIzLjk4Nkw0Ny4wOTIsNS4xMjJjMS4xNzItMS4xNzEsMS4xNzItMy4wNzEsMC00LjI0MmMtMS4xNzItMS4xNzItMy4wNy0xLjE3Mi00LjI0MiwwTDIzLjk4NiwxOS43NDRMNS4xMjEsMC44OCAgIGMtMS4xNzItMS4xNzItMy4wNy0xLjE3Mi00LjI0MiwwYy0xLjE3MiwxLjE3MS0xLjE3MiwzLjA3MSwwLDQuMjQybDE4Ljg2NSwxOC44NjRMMC44NzksNDIuODVjLTEuMTcyLDEuMTcxLTEuMTcyLDMuMDcxLDAsNC4yNDIgICBDMS40NjUsNDcuNjc3LDIuMjMzLDQ3Ljk3LDMsNDcuOTdzMS41MzUtMC4yOTMsMi4xMjEtMC44NzlsMTguODY1LTE4Ljg2NEw0Mi44NSw0Ny4wOTFjMC41ODYsMC41ODYsMS4zNTQsMC44NzksMi4xMjEsMC44NzkgICBzMS41MzUtMC4yOTMsMi4xMjEtMC44NzljMS4xNzItMS4xNzEsMS4xNzItMy4wNzEsMC00LjI0MkwyOC4yMjgsMjMuOTg2eiIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo='
					
					closeContainerElement.appendChild(closeImg);
					relativeElement.appendChild(closeContainerElement);
					parentElement.appendChild(relativeElement);
					
					parentElement.addEventListener('mouseover', function() {
						DMSAds.pushupBillboard.open();
						if (timer) {
							clearTimeout(timer);
						}
					});
					
					parentElement.addEventListener('mouseout', function() {
						if (timer) {
							clearTimeout(timer);
						}
						timer = setTimeout(function() {
							DMSAds.pushupBillboard.semiOpen();
						}, DMSADS_FADE_IN_TIME);
					});
					
				
					if (options.writeAd) {
						options.writeAd(relativeElement);
					}
					
					DMSAds.refresh.extendUnitWithRefresh(relativeElement, options);
					
					
					document.body.appendChild(parentElement);
					
					DMSAds.pushupBillboard.open();
				}
			}
		})(),
		banners: (function(){
			
			var DMSADS_DEFAULT_BANNER_OFFSET = 200;
			var DMSADS_IS_LOADED_KEY = 'data-dmsads-is-loaded';
			var DMSADS_IS_SEEN_KEY = 'data-dmsads-is-seen';
			var DMSADS_FLOATING_TOP = 1;
			var DMSADS_FLOATING_BOTTOM = 2;
			var DMSADS_FLOATING_LEFT = 3;
			var DMSADS_FLOATING_RIGHT = 4;
			var DMSADS_BANNER = 'dmsads-banner';
			var DMSADS_BANNER_FLOATING = 'dmsads-banner-floating';
			var DMSADS_BANNER_HIDDEN = 'dmsads-banner-hidden';
			var DMSADS_BANNER_CONTAINER = 'dmsads-banner-ctr';
			var DMSADS_BANNER_BAR_ENABLED = 'dmsads-banner--bar-enabled';
			
			var DMSADS_FLOATING_TOP_CLASS = 'dmsads-banner-floating--top';
			var DMSADS_FLOATING_BOTTOM_CLASS = 'dmsads-banner-floating--bottom';
			
			var DMSADS_BAR_TOP_CLASS = 'dmsads-banner--bar-top';
			var DMSADS_BAR_BOTTOM_CLASS = 'dmsads-banner--bar-bottom';
			
			var DMSADS_DEFAULT_COUNT_DOWN_FORMAT = 'Ad disappears in %SECONDS% seconds';
			var DMSADS_SECONDS_PLACEHOLDER = '%SECONDS%';
			
			var DMSADS_BANNER_MOUSEOVER = 'dmsads-banner-mouseover';
			var DMSADS_BTN_CLOSE = 'dmsads-banner-btn-close';
			
			var DMSADS_CLOSE_VISIBLE = 'dmsads-banner-close-visible';
			
			var tryLoadAd = function(container, child, relativeElement, offset, writeAd) {
				if (DMSAds.helpers.isElementInView(container, offset)) {
					if (!container.getAttribute(DMSADS_IS_LOADED_KEY)) {
						console.log("DMSAds: Container with " + container.id + " did become visible");
						if (writeAd) {
							writeAd(relativeElement);
						}
						container.setAttribute(DMSADS_IS_LOADED_KEY, "true");
					}
				}
				
				if (DMSAds.helpers.isElementInView(container, 0)) {
					container.setAttribute(DMSADS_IS_SEEN_KEY, "true");
				}
			}
			
			var observeVisibility = function (container, child, className) {
				var rect = container.getBoundingClientRect();
				var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
				var isVisible = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
				if (isVisible) {
					child.classList.remove(className); 
				} else {
					if (!child.classList.contains(className) && container.getAttribute(DMSADS_IS_SEEN_KEY)) {
						child.classList.add(className);
					}
				}
			}
			
			var appendCountDownCaption = function (relativeElement, className) {
				var div = document.createElement("DIV");
				div.className = 'dmsads-text-caption';
				div.classList.add(className);
				var p = document.createElement("P");
				div.appendChild(p);
				p.innerText = "Advertisement";
				relativeElement.appendChild(div);
				return p;
			}
			
		
			


			
			return {
				init: function (options) {
					var container = document.getElementById(options.targetId);
					options.offset = options.offset || DMSADS_DEFAULT_BANNER_OFFSET;
					container.style.overflow = 'hidden';
					
					
					
					
					var child = document.createElement("DIV");
					container.appendChild(child);
					child.className = DMSADS_BANNER;
					
				
					
					var relativeElement = document.createElement("DIV");
					relativeElement.className = DMSADS_BANNER_CONTAINER;
					relativeElement.style.width = '100%';
					
					//relativeElement.style.textAlign = 'center';
					relativeElement.style.textAlign = '-webkit-center';
					//relativeElement.style.height = '100%';
					relativeElement.style.position = 'relative';
					child.appendChild(relativeElement);
					
					if (options.floatingOptions) {
						if (!options.floatingOptions.enableBar) {
							if (options.floatingOptions.showCountDown) {
								options.floatingOptions.enableBar = true;
							}
						}
						if (options.floatingOptions.enableBar) {
							child.classList.add(DMSADS_BANNER_BAR_ENABLED);
						}
						
						if (options.floatingOptions.allowClose) {
							var closeContainerElement = document.createElement("DIV");
							closeContainerElement.className = DMSADS_BTN_CLOSE;
							closeContainerElement.style.width = '32px';
							closeContainerElement.style.height = '32px';
							closeContainerElement.style.backgroundImage = 'url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDQ0IDQ0IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0NCA0NCIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4Ij4KICA8cGF0aCBkPSJtMjIsMGMtMTIuMiwwLTIyLDkuOC0yMiwyMnM5LjgsMjIgMjIsMjIgMjItOS44IDIyLTIyLTkuOC0yMi0yMi0yMnptMy4yLDIyLjRsNy41LDcuNWMwLjIsMC4yIDAuMywwLjUgMC4zLDAuN3MtMC4xLDAuNS0wLjMsMC43bC0xLjQsMS40Yy0wLjIsMC4yLTAuNSwwLjMtMC43LDAuMy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTcuNS03LjVjLTAuMi0wLjItMC41LTAuMi0wLjcsMGwtNy41LDcuNWMtMC4yLDAuMi0wLjUsMC4zLTAuNywwLjMtMC4zLDAtMC41LTAuMS0wLjctMC4zbC0xLjQtMS40Yy0wLjItMC4yLTAuMy0wLjUtMC4zLTAuN3MwLjEtMC41IDAuMy0wLjdsNy41LTcuNWMwLjItMC4yIDAuMi0wLjUgMC0wLjdsLTcuNS03LjVjLTAuMi0wLjItMC4zLTAuNS0wLjMtMC43czAuMS0wLjUgMC4zLTAuN2wxLjQtMS40YzAuMi0wLjIgMC41LTAuMyAwLjctMC4zczAuNSwwLjEgMC43LDAuM2w3LjUsNy41YzAuMiwwLjIgMC41LDAuMiAwLjcsMGw3LjUtNy41YzAuMi0wLjIgMC41LTAuMyAwLjctMC4zIDAuMywwIDAuNSwwLjEgMC43LDAuM2wxLjQsMS40YzAuMiwwLjIgMC4zLDAuNSAwLjMsMC43cy0wLjEsMC41LTAuMywwLjdsLTcuNSw3LjVjLTAuMiwwLjEtMC4yLDAuNSAzLjU1MjcxZS0xNSwwLjd6IiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=)';
							closeContainerElement.style.position = 'absolute';
							closeContainerElement.style.backgroundSize = 'contain';
							
							closeContainerElement.style.right = '8px';
							closeContainerElement.style.top = '32px';
							closeContainerElement.style.zIndex = '2147483647';
							closeContainerElement.style.padding = '8px';
							closeContainerElement.style.borderRadius = '50%';
							closeContainerElement.style.cursor = 'pointer';
							closeContainerElement.onclick = function() {
								child.classList.add(DMSADS_BANNER_HIDDEN);
							}
							
							/*var closeImg = document.createElement("IMG");
							closeImg.src = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ3Ljk3MSA0Ny45NzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ3Ljk3MSA0Ny45NzE7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNjRweCIgaGVpZ2h0PSI2NHB4Ij4KPGc+Cgk8cGF0aCBkPSJNMjguMjI4LDIzLjk4Nkw0Ny4wOTIsNS4xMjJjMS4xNzItMS4xNzEsMS4xNzItMy4wNzEsMC00LjI0MmMtMS4xNzItMS4xNzItMy4wNy0xLjE3Mi00LjI0MiwwTDIzLjk4NiwxOS43NDRMNS4xMjEsMC44OCAgIGMtMS4xNzItMS4xNzItMy4wNy0xLjE3Mi00LjI0MiwwYy0xLjE3MiwxLjE3MS0xLjE3MiwzLjA3MSwwLDQuMjQybDE4Ljg2NSwxOC44NjRMMC44NzksNDIuODVjLTEuMTcyLDEuMTcxLTEuMTcyLDMuMDcxLDAsNC4yNDIgICBDMS40NjUsNDcuNjc3LDIuMjMzLDQ3Ljk3LDMsNDcuOTdzMS41MzUtMC4yOTMsMi4xMjEtMC44NzlsMTguODY1LTE4Ljg2NEw0Mi44NSw0Ny4wOTFjMC41ODYsMC41ODYsMS4zNTQsMC44NzksMi4xMjEsMC44NzkgICBzMS41MzUtMC4yOTMsMi4xMjEtMC44NzljMS4xNzItMS4xNzEsMS4xNzItMy4wNzEsMC00LjI0MkwyOC4yMjgsMjMuOTg2eiIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo='
							closeImg.style.width = '100%';
							closeImg.style.cursor = 'pointer';
							closeContainerElement.appendChild(closeImg); */
							child.appendChild(closeContainerElement);
							
						}
						
						options.floatingOptions.barPosition = options.floatingOptions.barPosition || 1;
						child.classList.add(options.floatingOptions.barPosition == 1 ? DMSADS_BAR_TOP_CLASS : DMSADS_BAR_BOTTOM_CLASS);
						var countDownLabel = appendCountDownCaption(relativeElement, options.floatingOptions.barPosition == 1 ? 'dmsads-text-caption-top' : 'dmsads-text-caption-bottom');
						if (options.floatingOptions.defaultBarText) {
							countDownLabel.innerText = options.floatingOptions.defaultBarText;
						}
						
						var position = options.floatingOptions.position;
						switch (position) {
							case DMSADS_FLOATING_TOP:
								child.classList.add(DMSADS_FLOATING_TOP_CLASS);
								break;
							case DMSADS_FLOATING_BOTTOM:
								child.classList.add(DMSADS_FLOATING_BOTTOM_CLASS);
								break;
							default:
								break;
						}
						
						
						container.floatingInterval = 0;
						
						options.floatingOptions.countDownTextFormat = options.floatingOptions.countDownTextFormat || DMSADS_DEFAULT_COUNT_DOWN_FORMAT;
						
						
						if (options.floatingOptions.minimizeIn) {
							child.addEventListener('mouseover', function() {
								child.classList.add(DMSADS_BANNER_MOUSEOVER);
								
								container.isExpanded = true;
								
								if (position == DMSADS_FLOATING_BOTTOM) {
									child.style.bottom = "0";
								}
								if (position == DMSADS_FLOATING_TOP) {
									child.style.top = "0";
								}
								
								
							});
							
							child.addEventListener('mouseout', function() {
								child.classList.remove(DMSADS_BANNER_MOUSEOVER);
								
								container.isExpanded = false;
							});
						}
						
						var interval = setInterval(function() {
							
							if (child.classList.contains(DMSADS_BANNER_FLOATING) && !child.classList.contains(DMSADS_BANNER_MOUSEOVER)) {
								container.floatingInterval += 10;
							}
							
							if (options.floatingOptions.hideIn) {									
								var msLeft = options.floatingOptions.hideIn - container.floatingInterval;
								countDownLabel.innerText = options.floatingOptions.countDownTextFormat.replace(DMSADS_SECONDS_PLACEHOLDER, Math.round(msLeft / 1000));
								if (container.floatingInterval >= options.floatingOptions.hideIn) {
									
									child.classList.add(DMSADS_BANNER_HIDDEN);
									//child.style.bottom = 'inherit';
									//child.style.top = 'inherit';
								}
							}
							
							if (options.floatingOptions.minimizeIn) {
								if (container.floatingInterval >= options.floatingOptions.minimizeIn) {
									var allowed = false;
									if (options.floatingOptions.hideIn) {
										if (container.floatingInterval < options.floatingOptions.hideIn) {
											allowed = true;
										}
									} else {
										allowed = true;
									}
									
									if (container.isExpanded) {
										allowed = false;
									}
									
									if (allowed) {
										if (position == DMSADS_FLOATING_BOTTOM) {
											child.style.bottom = (-1 * (child.clientHeight * 0.5)) + "px";
										}
										if (position == DMSADS_FLOATING_TOP) {
											child.style.top = (-1 * (child.clientHeight * 0.5)) + "px";
										}
									}
								}
							}
							
							if (options.floatingOptions.allowCloseOnlyAfter) {
								if (container.floatingInterval >= options.floatingOptions.allowCloseOnlyAfter) {
									child.classList.add(DMSADS_CLOSE_VISIBLE);
								}
							}
							
						}, 10);
						
		
					}
					
					  
					
					document.addEventListener('scroll', function() {
						if (options.floatingOptions) {
							observeVisibility(container, child, DMSADS_BANNER_FLOATING);
						}
						tryLoadAd(container, child, relativeElement, options.offset, options.writeAd);
					});
					tryLoadAd(container, child, relativeElement, options.offset, options.writeAd);
					DMSAds.refresh.extendUnitWithRefresh(child, options);
					observeVisibility(container, child, DMSADS_BANNER_FLOATING);
					
					
				}
			}
			
			
		})(),
		refresh: (function() {
			
			var DMSADS_DEFAULT_REFRESH_RATE = 1000;
			
			var completlyInView = function(element) {
				var rect = element.getBoundingClientRect();
				return (
					rect.top >= 0 &&
					rect.left >= 0 &&
					rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
					rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
				);
			}
			
			var checkRefresh = function (container, interval, writeAd) {
				if (completlyInView(container)) {
					if (writeAd) {
						writeAd(container);
					}
				}
				scheduleRefresh(container, interval, writeAd);
			}
			
			var scheduleRefresh = function(container, interval, writeAd) {
				setTimeout(function() {
					checkRefresh(container, interval, writeAd);
				}, interval);
			}
			
			return {
				init: function (options) {
					var container = options.container || document.getElementById(options.targetId);
					var interval = options.interval || DMSADS_DEFAULT_REFRESH_RATE;
					scheduleRefresh(container, interval, options.writeAd);
					
				},
				extendUnitWithRefresh: function (container, options){
					if (options.refreshInterval > 100) {
						var refreshAd = options.refreshAd || options.writeAd;
						DMSAds.refresh.init({
							container: container, 
							interval: options.refreshInterval,
							writeAd: refreshAd
						});
					} else {
						console.log('DMSAds: not enabling refreshing cause rate is too low, min: 100');
					}
				}
			}
			
		})()
	
	}
	
	
	
})();


if( document.readyState === "complete" 
     || document.readyState === "loaded" 
     || document.readyState === "interactive") {
    DMSAds.isWindowLoaded = true;
	for (var i = 0; i < DMSAds.cmd.length; i++) {
		var command = DMSAds.cmd[i];
		command();
	}
} else {
    document.addEventListener('DOMContentLoaded', function () {
		DMSAds.isWindowLoaded = true;
		for (var i = 0; i < DMSAds.cmd.length; i++) {
			var command = DMSAds.cmd[i];
			command();
		}
    });
}





