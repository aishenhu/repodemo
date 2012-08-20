;
Jx().$package("demo.crossdomain", function(J) {
	var $D = J.dom,
		$E = J.event,
		$H = J.http,
		$C = J.cookie,
		$S = J.string;

	var ajax = function(url, opt) {
			opt.method = opt.method || 'POST';
			opt.onSuccess = opt.onSuccess ||
			function(ret) {
				console.log(ret);
			};
			opt.isAsync = opt.isAsync || true;
			opt.timeout = opt.timeout || 30000;
			opt.contentType = opt.contentType || "utf-8";
			opt.type = opt.type || 'xml';

			$H.ajax(url, {
				data: $S.toQueryString(opt.data),
				method: opt.method,
				isAsync: opt.isAsync,
				timeout: opt.timeout,
				contentType: opt.contentType,
				onSuccess: opt.onSuccess,
				type: opt.type
			});
		}

	var View = {
		init: function() {
			this.setClickProxy(['wrapper']);
		},

		//设置页面区域代理
		setClickProxy: function(idArr) {
			for (var k in idArr) {
				var id = idArr[k];
				var dom = $D.id(idArr[k]);
				if (dom) {
					$E.on(dom, 'click', this.onViewClick);
				}
			}
		},
		//页面代理响应
		onViewClick: function(e) {
			var target = View.getEventTarget(e);
			if (!target) {
				return false;
			}
			var href = target.getAttribute('href');
			if (href && /#$/g.test(href)) {
				e.preventDefault();
			}
			var cmd = target.getAttribute('cmd') || '';
			var _this = View,
				func = 'on' + cmd;

			if (_this[func]) {
				_this[func](target);
			} else {
				return false;
			}
		},
		getEventTarget: function(e, property) {
			var t = e.target,
				l = 3,
				p = property || 'cmd';
			while (t && l-- > 0) {
				if (t == document) return null;
				if (t.getAttribute(p)) {
					return t;
				} else {
					t = t.parentNode;
				}
			}
			return null;
		},
		onAjax1: function(dom) {
			var url = dom.getAttribute("des");
			var opt = {};
			opt.data = {
				from: dom.getAttribute("class"),
				type: "ajax1"
			}
			ajax(url, opt);
		},
		onAjax2: function(dom) {
			var url = dom.getAttribute("des");
			var opt = {};
			ajax(url, opt);
		},
		onAjax3: function(dom) {
			var url = dom.getAttribute("des");
			var opt = {};
			ajax(url, opt);
		}
	}

	window.onload = function() {
		View.init();
	}
});