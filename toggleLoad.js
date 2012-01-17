// closure
(function ($) {
	// plugin definition
	$.fn.toggleLoad = function (options) {
		// build main options before element iteration
		var opts = $.extend({}, $.fn.toggleLoad.defaults, options);
		// Our plugin implementation code goes here.
		return this.each(function () {
			$(this).on('click', doToggleLoad);
		});

		function doToggleLoad() {
			if(!$(this).hasClass('remove')) {
				$.fn.toggleLoad.add.call(this, opts);
			} else {
				$.fn.toggleLoad.remove.call(this, opts);
			}
			return false;
		};
	};
	// Private function for debugging
	//
	function debug(stuff) {
		if (window.console && window.console.log) {
			window.console.log(stuff);
		};
	};
	// public function - add a div
	$.fn.toggleLoad.add     = function (options) {
		var $this    = $(this),
			$parent  = $this.parent(),
			$element = $(options.addElement);
		$element
		.addClass(options.addElementClass)
		.load(
			$this.attr(options.attr),
			options.data,
			function (response, status, xhr) {
				if (status == 'error') {
					var msg = 'Error: ' + xhr.status + ' ' + xhr.statusText;
					$element.html(msg);
				}
				$parent.append($element);
				$.fn.toggleLoad.added.call($this, options);
				return $this;
			}
		);
	};
	// public function - add div callback
	$.fn.toggleLoad.added   = function (options) {
		var element = $(this).parent().find('.' + options.addElementClass);
		$(this)
		.removeClass(options.addLinkClass)
		.addClass(options.removeLinkClass)
		.html(options.removeLinkHtml);
		options.elementAdded(element);
		return this;
	};
	// public function - remove a div
	$.fn.toggleLoad.remove  = function (options) {
		$(this).parent().find('.' + options.addElementClass).remove();
		$.fn.toggleLoad.removed.call(this, options);
		return this;
	};
	// public function - remove div callback
	$.fn.toggleLoad.removed = function (options) {
		var parent = $(this).parent();
		$(this)
		.removeClass(options.removeLinkClass)
		.addClass(options.addLinkClass)
		.html(options.addLinkHtml);
		options.elementRemoved(parent);
		return this;
	};
	// plugin defaults - added as a property on our plugin function
	$.fn.toggleLoad.defaults = {
		attr:            'href',
		data:            null,
		addLinkClass:    'add',
		addLinkHtml:     '+',
		removeLinkClass: 'remove',
		removeLinkHtml:  '-',
		addElement:      '<div class="clearfix" />',
		addElementClass: 'toggleLoad',
		elementAdded:    function (element) { $(element).effect('highlight'); },
		elementRemoved:  function (parent)  { $(parent) .effect('highlight'); }
	};
})(jQuery);