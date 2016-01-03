import './event';

let YmtApi = (function(){
	let undefined,
		toString = function (obj) {
			return ({}).toString.call(obj);
		};

	function isType(type) {
			return function (obj) {
				return toString(obj) === '[object ' + type + ']';
			};
		}

	let isObject = isType('Object'),
		isString = isType('String'),
		isArray = Array.isArray || isType('Array'),
		isFunction = isType('Function'),
		isUndefined = isType('Undefined');

	let ua = window.navigator.userAgent;
	ymtApi.isWechat = /MicroMessenger/i.test(ua);
	ymtApi.isSaohuoApp = /saohuoApp/i.test(ua);
	ymtApi.isYmtApp = /ymtapp/i.test(ua);
	ymtApi.isIphone = /iPhone/ig.test(ua);
	ymtApi.isAndroid = /Android|Linux/.test(ua);
	ymtApi.isIos = /\(i[^;]+;( U;)? CPU.+Mac OS X/ig.test(ua);


})();

window.YmtApi = YmtApi;
