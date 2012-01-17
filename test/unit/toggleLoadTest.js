module("jQuery.toggleLoad() tests");

test("can overide default settings", function() {
	expect(4);
	stop();

	var dataObject1 = {one:   1, two:   2},
		dataObject2 = {two:   2, three: 3},
		dataObject3 = {three: 3, four:  4};

	var counter = 4;
	function done() { --counter || start() }

	jQuery.fn.toggleLoad(function () {
		equal(
			jQuery.fn.toggleLoad.settings.data,
			null,
			'start with data: null'
		);
		done();
	});

	jQuery.fn.toggleLoad.settings = {data: dataObject1};
	jQuery.fn.toggleLoad(function () {
		equal(
			jQuery.fn.toggleLoad.settings.data,
			dataObject1,
			'overwrite defaults with toggleLoad.settings'
		);
		done();
	});

	jQuery.fn.toggleLoad({data: dataObject2}, function () {
		equal(
			jQuery.fn.toggleLoad.settings.data,
			dataObject2,
			'overwrite defaults in-line - argument one'
		);
		done();
	});

	jQuery.fn.toggleLoad('toggleLoad', {data: dataObject3}, function () {
		equal(
			jQuery.fn.toggleLoad.settings.data,
			dataObject3,
			'overwrite defaults in-line - argument two'
		);
		done();
	});
});

test("can trigger methods", function() {
	expect(5);
	stop();

	var counter = 5;
	function done() { --counter || start() }

	jQuery.fn.toggleLoad(function () {
		ok(1, 'default method called');
		done();
	});

	jQuery.fn.toggleLoad('toggleLoad', function () {
		ok(1, 'toggleLoad method called');
		done();
	});

	jQuery.fn.toggleLoad('init', function () {
		ok(1, 'init method called');
		done();
	});

	jQuery.fn.toggleLoad('added', function () {
		ok(1, 'added method called');
		done();
	});

	jQuery.fn.toggleLoad('removed', function () {
		ok(1, 'removed method called');
		done();
	});
});

test("can toggle element class/text", function() {
	expect(8);
	stop();

	var counter = 4;
	function done() { --counter || start() }

	var $div    = jQuery('<div />'),
		$add    = jQuery('<a href="/" class="add">+</a>'),
		$remove = jQuery('<a href="/" class="remove">-</a>');

	$div.html($add);

	$div.children().toggleLoad('toggle', function () {
		ok(this.hasClass('remove'), 'element has class remove');
		equal(this.html(), '-', 'element html is "-"');
		done();
	}).toggleLoad('toggle', function () {
		ok(this.hasClass('add'), 'element has class add');
		equal(this.html(), '+', 'element html is "+"');
		done();
	});

	$div.html($remove);

	$div.children().toggleLoad('toggle', function () {
		ok(this.hasClass('add'), 'element has class add');
		equal(this.html(), '+', 'element html is "+"');
		done();
	}).toggleLoad('toggle', function () {
		ok(this.hasClass('remove'), 'element has class remove');
		equal(this.html(), '-', 'element html is "-"');
		done();
	});
});

test("can add/remove addElement from parent", function() {
	expect(2);
	stop()

	var counter = 2;
	function done() { --counter || start() }

	var div         = '<div />',
		$add        = jQuery('<a href="/" class="add">+</a>'),
		$remove     = jQuery('<a href="/" class="remove">-</a>'),
		$toggleLoad = jQuery('<div class="toggleLoad" />'),
		$div1       = jQuery(div).html($add),
		$div2       = jQuery(div).html($remove).append($toggleLoad);

	$div1.find('.add').toggleLoad('add', function () {
		ok(
			(this.parent().find('.toggleLoad').length),
			'parent has child div'
		);
		done();
	});

	$div2.find('.remove').toggleLoad('remove', function () {
		ok(
			!(this.parent().find('.toggleLoad').length),
			'parent has no child div'
		);
		done();
	});
});

test("can load html to element", function() {
	expect(1);
	stop();

	var div         = '<div id="toggleLoadDiv" />',
		$add        = jQuery('<a href="data/subMenu1.tpl" class="add">+</a>'),
		$toggleLoad = jQuery('<div class="toggleLoad" />'),
		$elem       = jQuery(div).html($add).append($toggleLoad),
		actual      = '',
		expected    = '<h3>Sub Menu 1</h3>' + '\n'
					+ '<ol class="menu">' + '\n'
					+ '	<li><a href="subSubMenu1.tpl" class="add">+</a>&nbsp;Sub Sub Menu 1</li>' + '\n'
					+ '	<li><a href="subSubMenu2.tpl" class="add">+</a>&nbsp;Sub Sub Menu 2</li>' + '\n'
					+ '	<li><a href="subSubMenu3.tpl" class="add">+</a>&nbsp;Sub Sub Menu 3</li>' + '\n'
					+ '</ol>';

	jQuery('#qunit-fixture').append($elem);
	$toggleLoadDiv = jQuery('#qunit-fixture #toggleLoadDiv');

	$toggleLoadDiv.find('.add').toggleLoad('load', function () {
		equal($toggleLoadDiv.find('.toggleLoad').html(), expected, 'html loaded in div.toggleLoad');
		start();
	});
});