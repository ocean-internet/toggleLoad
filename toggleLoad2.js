(function($) {

	var $parent,
		$this;

	var settings = {};

	var defaults = {
		attr:            'href',
		data:            null,
		addLinkClass:    'add',
		addLinkHtml:     '+',
		removeLinkClass: 'remove',
		removeLinkHtml:  '-',
		addElementClass: 'toggleLoad',
		addElementHtml:  '<div />'
	};

	var methods = {
		toggleLoad : function (callback) {
			callback.call(this);
			return this;
		},
		init : function (callback) {
			callback.call(this);
			return this;
		},
		load : function (callback) {
			return this.load(
				$this.attr(settings.attr),
				settings.data,
				function (response, status, xhr) {
					var html = response;
					if (status == "error") {
						html = 'Error: ' + xhr.status + ' ' + xhr.statusText;
					}
					$this.parent().find('.' + settings.addElementClass).html(html);
					callback.call($this);
				}
			);
		},
		toggle : function (callback) {
			if(!this.hasClass('remove')) {
				this
					.addClass('remove')
					.removeClass('add')
					.html(settings.removeLinkHtml);
			} else {
				this
					.addClass('add')
					.removeClass('remove')
					.html(settings.addLinkHtml);
			}
			callback.call(this);
			return this;
		},
		add : function (callback) {
			var $element = $(settings.addElementHtml);
			$element.addClass(settings.addElementClass);
			this.parent().append($element);
			callback.call(this);
			return this;
		},
		added : function (callback) {
			callback.call(this);
			return this;
		},
		remove : function (callback) {
			this.parent().find('.' + settings.addElementClass).remove();
			callback.call(this);
			return this;
		},
		removed : function (callback) {
			callback.call(this);
			return this;
		}
	};
/**
 * accepts up to three (optional) parameters
 *
 * method, options, callback
 *
 * returns a method
 *
 */
	$.fn.toggleLoad = function (one, two, three) {

		var method   = 'toggleLoad',
			options  = {},
			callback = null;

		if(methods[one]) {
			method = one;
		} else if(typeof one === 'object') {
			options = one;
		} else if(typeof one == 'function') {
			callback = one;
		}
		if(typeof one !== 'object' && typeof two === 'object') {
			options = two;
		} else if(!callback && typeof two == 'function') {
			callback = two;
		}
		if(!callback && typeof three == 'function') {
			callback = three;
		} else if(!callback) {
			callback = function () {};
		}

		extendOptions(options);

		$this   = $(this);
		$parent = $this.parent();

		if (methods[method]) {
			return methods[method].call(this, callback);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.toggleLoad');
		}
	};

	// getter/setter for toggleLoad defaults
	$.fn.toggleLoad.settings = {};

	// private function to extend options
	function extendOptions(options) {
		$.fn.toggleLoad.settings = $.extend(settings, defaults, $.fn.toggleLoad.settings, options);
	}
})(jQuery);