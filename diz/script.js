const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.menu-body');
const aside = document.querySelector('.asied');
const buttonAdd = document.querySelector('.button.add');
const buttonManage = document.querySelector('.button.manage');
if (iconMenu) {
	iconMenu.addEventListener('click', function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
		aside.classList.toggle('_active');
	});
}


if (buttonAdd || buttonManage) {
	function closeMenu() {
		document.body.classList.remove('_lock');
		iconMenu.classList.remove('_active');
		menuBody.classList.remove('_active');
		aside.classList.remove('_active');
	}
	buttonAdd.addEventListener('click', closeMenu);
	buttonManage.addEventListener('click', closeMenu);
}


let hideAddModal = true
let hideManageModal = true

function truncate(input) {
	if (input.length > 5) {
		return input.substring(0, 5) + '...';
	}
	return input;
};

async function toggleAddModal() {
	const modal = $('.modal.new')
	if (hideAddModal) {
		hideUI()
		hideModals()
		modal.css('opacity', '1').css('z-index', '0')
		hideAddModal = false
	}
	else {
		showUI()
		modal.css('opacity', '0').css('z-index', '-10')
		hideAddModal = true
	}
}

function toggleManageModal() {
	const modal = $('.modal.manage')
	if (hideManageModal) {
		hideUI()
		hideModals()
		modal.css('opacity', '1').css('z-index', '0')
		hideManageModal = false
	}
	else {
		showUI()
		modal.css('opacity', '0').css('z-index', '-10')
		hideManageModal = true
	}
}

function openFormAdd(gamename) {
	$('.modal > .form').css('display', 'flex')
}

function closeFormAdd() {
	$('.modal > .form').css('display', 'none')
}

function closeModal(name) {
	const modal = $(`.modal.${name}`)
	showUI()
	modal.css('opacity', '0').css('z-index', '-10')
	if (name == 'new') {
		hideAddModal = true
		closeFormAdd()
	}
	if (name == 'new') showUI()
	if (name == 'manage') {
		hideManageModal = true
		showUI()
	}
	if (name == 'delete-prompt') $('main > *').css('filter', 'none')
}

function hideUI() {
	$('.Dashboard > .title').css('margin-top', '-200px')
	$('.Dashboard > #clock').css('margin-top', '-200px')
}

function showUI() {
	$('.Dashboard > .title').css('margin-top', '0')
	$('.Dashboard > #clock').css('margin-top', '0')
}

function hideModals() {
	hideAddModal = true
	hideManageModal = true
	$('.modal.new').css('opacity', '0').css('z-index', '-10')
	$('.modal.manage').css('opacity', '0').css('z-index', '-10')
}

function deleteRow(id) {
	ajax_req(null, { 'url': '/admin/?action=delete&id=' + id });


}

function showPrompt(id) {
	text = `Удалить запись #${id}?`
	$('.delete-prompt').attr('idx', id).animate({
		'opacity': 1,
		'z-index': 0,
	}, 0)
	$('.delete-prompt-text').html(text)
	$('main > *').css('filter', 'blur(5px)')
	$('.delete-prompt').css('filter', 'none')
	$('.delete-prompt-button').attr('idx', id)
}

let updateClock = () => $('#clock').html(new Date().toLocaleTimeString("ru-RU", { timeStyle: 'short' }))
$(document).ready(() => {
	setInterval(updateClock, 1000)

	$('.Table-group > div').each(function (column) {
		$(this).on('click', () => {
			let type = $(this)[0].className
			let records = $('.Table').find('tbody > tr')
			records.sort((a, b) => {
				let first = $(a).children('td').eq(column).text()
				let second = $(b).children('td').eq(column).text()
				if (type == 'date') return (first > second) ? -1 : (first < second ? 1 : 0)
				return (first < second) ? -1 : (first > second ? 1 : 0)
			})
			$.each(records, (index, row) => $('tbody').append(row))
		})
	})

	$(document).on('click', '.select.tour', () => {
		const target = $('.tour-list')
		if (target.hasClass('open'))
			return target.fadeOut(300).toggleClass('open')
		else return target.fadeIn(300).toggleClass('open')
	});
	$(document).on('click', '.select.amount', () => {
		const target = $('.amount-list')
		if (target.hasClass('open'))
			return target.fadeOut(300).toggleClass('open')
		else return target.fadeIn(300).toggleClass('open')
	});

	$(document).on('click', '.amount-option', function () {
		$(this).parents('.select').children('.text').text($(this).text());
		$(this).parents('.select').attr('value', $(this).attr('value'));
		$("#form_create_count").val($(this).attr('value'));
	});

	$(document).on('click', '.tour-option', function () {
		$(this).parents('.select').children('.text').text($(this).text());
		$(this).parents('.select').attr('value', $(this).attr('value'));
		$("#form_create_type").val($(this).attr('value'));
	});

	$(document).on('click', '.table-button.delete', function () { showPrompt($(this).parents('tr').attr('idx')); });
	$(document).on('click', '.table-button.copy', function () { copyToClipboard($(this).parents('tr').attr('idx')); });
	$(document).on('click', '.table-button.edit', function () {
		window.parent.location.href = './templates/1/1_8/editor/index.html?id=' + $(this).parents('tr').attr('idx');
	});
});

$('.logout-button.entry').on('click', () => $('.logout > .container').css('margin-left', '0'));
$('.logout-button.return').on('click', () => $('.logout > .container').css('margin-left', '-280px'));

$('.button.add').on('click', () => toggleAddModal());
$('.button.manage').on('click', () => toggleManageModal());

function copyToClipboard(id) {
	let text = document.getElementById("url_" + id);

	text.select();

	//console.log(text);

	document.execCommand("copy");

	alert('Copied to clipboard (' + text.value + ')');

	window.parent.location.href = './templates/1/1_8/view/index.html?id=1';
}