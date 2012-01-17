$(function () {

	module("toggleLoad Test");

	test("can overide default settings", function() {
		// arrange
		var dataObject1 = {one:   1, two:   2},
			dataObject2 = {two:   2, three: 3},
			dataObject3 = {three: 3, four:  4};

		expect(4);

		// act
		stop();
		$.fn.toggleLoad(function () {
			// assert
			equal(
				$.fn.toggleLoad.settings.data,
				null,
				'start with data: null'
			);
			start();
		});

		// act
		$.fn.toggleLoad.settings = {data: dataObject1};
		stop();
		$.fn.toggleLoad(function () {
			// assert
			equal(
				$.fn.toggleLoad.settings.data,
				dataObject1,
				'overwrite defaults with toggleLoad.settings'
			);
			start();
		});

		// act
		stop();
		$.fn.toggleLoad({data: dataObject2}, function () {
			// assert
			equal(
				$.fn.toggleLoad.settings.data,
				dataObject2,
				'overwrite defaults in-line - argument one'
			);
			start();
		});
		// act
		stop();
		$.fn.toggleLoad('toggleLoad', {data: dataObject3}, function () {
			// assert
			equal(
				$.fn.toggleLoad.settings.data,
				dataObject3,
				'overwrite defaults in-line - argument two'
			);
			start();
		});
	});
	test("can trigger methods", function() {
		expect(5);
		stop();
		$.fn.toggleLoad(function () {
			// assert
			ok(1, 'default method called');
			start();
		});
		stop();
		$.fn.toggleLoad('toggleLoad', function () {
			// assert
			ok(1, 'toggleLoad method called');
			start();
		});
		stop();
		$.fn.toggleLoad('init', function () {
			// assert
			ok(1, 'init method called');
			start();
		});
		stop();
		$.fn.toggleLoad('added', function () {
			// assert
			ok(1, 'added method called');
			start();
		});
		stop();
		$.fn.toggleLoad('removed', function () {
			// assert
			ok(1, 'removed method called');
			start();
		});
	});
	test("can toggle element class/text", function() {
		var $div    = $('<div />'),
			$add    = $('<a href="/" class="add">+</a>'),
			$remove = $('<a href="/" class="remove">-</a>');
		expect(8);
		$div.html($add);
		stop(2);
		$div.children().toggleLoad('toggle', function () {
			ok(this.hasClass('remove'), 'element has class remove');
			equal(this.html(), '-', 'element html is "-"');
			start();
		}).toggleLoad('toggle', function () {
			ok(this.hasClass('add'), 'element has class add');
			equal(this.html(), '+', 'element html is "+"');
			start();
		});
		$div.html($remove);
		stop(2);
		$div.children().toggleLoad('toggle', function () {
			ok(this.hasClass('add'), 'element has class add');
			equal(this.html(), '+', 'element html is "+"');
			start();
		}).toggleLoad('toggle', function () {
			ok(this.hasClass('remove'), 'element has class remove');
			equal(this.html(), '-', 'element html is "-"');
			start();
		});
	});
	test("can add/remove addElement from parent", function() {
		var div         = '<div />',
			$add        = $('<a href="/" class="add">+</a>'),
			$remove     = $('<a href="/" class="remove">-</a>'),
			$toggleLoad = $('<div class="toggleLoad" />'),
			$div1       = $(div).html($add),
			$div2       = $(div).html($remove).append($toggleLoad);

		expect(2);

		stop();
		$div1.find('.add').toggleLoad('add', function () {
			ok(
				(this.parent().find('.toggleLoad').length),
				'parent has child div'
			);
			start();
		});
		stop();
		$div2.find('.remove').toggleLoad('remove', function () {
			ok(
				!(this.parent().find('.toggleLoad').length),
				'parent has no child div'
			);
			start();
		});
	});
	test("can load html to element", function() {
		var div         = '<div />',
			$add        = $('<a href="/mock.html" class="add">+</a>'),
			$toggleLoad = $('<div class="toggleLoad" />'),
			$elem       = $(div).html($add).append($toggleLoad),
			actual      = '',
			expected    = '<h3>Sub Menu 1</h3>' + '\n'
						+ '<ol class="menu">' + '\n'
						+ '	<li><a href="subSubMenu1.tpl" class="add">+</a>&nbsp;Sub Sub Menu 1</li>' + '\n'
						+ '	<li><a href="subSubMenu2.tpl" class="add">+</a>&nbsp;Sub Sub Menu 2</li>' + '\n'
						+ '	<li><a href="subSubMenu3.tpl" class="add">+</a>&nbsp;Sub Sub Menu 3</li>' + '\n'
						+ '</ol>';

		expect(1);
		stop(2);
		$.mockjax({
			url: '/mock.html',
			status: 200,
			contentType: 'text/html',
			dataType: 'html',
			responseText: expected
		});
		start();
		var counter = 1;
		$elem.find('.add').toggleLoad('load', function () {
			actual = this.parent().find('.toggleLoad').html();
			equal(actual, expected, 'html loaded in div.toggleLoad');
			start();
			$.mockjaxClear();
		});
	});
});