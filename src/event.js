/**
 * Event
 */
let callbacks = {},
	_id = 0, //函数编号
	_fns = {},
	getFnId = function(fn) {
		let fnStr = toString(fn);
		for (let i in _fns) {
			if (fnStr === _fns[i]) {
				return i;
			}
		}
		return undefined;
	}; //

/**
 * 绑定事件
 * @params
 * 	 {string} events 事件名称 支持多个使用空格分割
 * 	 {function} fn   回调函数 不建议使用匿名函数，否则
 * 	 	off删除指定方法无效，在off使用是，做简单toString转换
 * 	 	匹配回调函数库
 */
ymtApi.on = function(events, fn) {
	if (isFunction(events)) {
		if (isUndefined(fn._id)) {
			fn._id = _id++;
			//保存一份所有方法的回调的备份，已实现匿名方法解绑
			_fns[_id] = toString(fn);
		}
	}
	events.replace(/\S+/g, function(name, pos) {
		(callbacks[name] || (callbacks[name] = [])).push(fn);
		fn.typed = pos > 0;
	});

	return ymtApi;
};

ymtApi.off = function(events, fn) {
	if (events === '*') {
		callbacks = {};
	} else {
		events.replace(/\S+/g, function(name) {
			if (fn) {
				let arr = callbacks[name];
				for (let i = 0, cb;
					(cb = arr && arr[i]); ++i) {
					//如果解绑为匿名函数（即无fnId的函数）从绑定库中匹配
					//是否能找到绑定相关函数
					if (isUndefined(fn._id)) {
						fn._id = getFnId(fn);
					}
					if (cb._id === fn._id) {
						arr.splice(i--, 1);
					}
				}
			} else {
				callbacks[name] = [];
			}
		});
	}
	return ymtApi;
};

ymtApi.one = function(eventName, fn) {
	function _on() {
		ymtApi.off(eventName, _on);
		fn.apply(ymtApi, arguments);
	}
	return ymtApi.on(eventName, _on);
};

/**
 * 触发事件
 */
ymtApi.sendEvent = function(eventName, data) {
	let args = [].slice.call(arguments, 1),
		fns = callbacks[eventName] || [];

	if (isString(data)) {
		data = JSON.parse(data);
	}

	for (let i = 0, fn;
		(fn = fns[i]); ++i) {
		if (!fn.busy) {
			fn.busy = 1;
			//fn.apply(ymtApi, fn.typed ? [eventName].concat(args) : args)
			fn.apply(ymtApi, [data]);
			if (fns[i] !== fn) {
				i--;
			}
			fn.busy = 0;
		}
	}

	if (callbacks.all && eventName !== 'all') {
		ymtApi.sendEvent.apply(ymtApi, ['all', eventName].concat(args));
	}

	return ymtApi;
};
