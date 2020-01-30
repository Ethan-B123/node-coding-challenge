document.addEventListener('DOMContentLoaded', () => {
	document
		.querySelector('#sign-in')
		.addEventListener('submit', auth('/sign-in'));
	document
		.querySelector('#sign-up')
		.addEventListener('submit', auth('/sign-up'));
	document.querySelector('#logout-btn').addEventListener('click', logout);
	document.querySelector('#me-btn').addEventListener('click', fetchMe);

	updateMeText();
});

function auth(route) {
	return async e => {
		e.preventDefault();
		const form = e.currentTarget;
		let data = {};
		const inputs = form.querySelectorAll('input');
		inputs.forEach(input => {
			data[input.name] = input.value;
		});
		const res = await fetch(route, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		data = await res.json();
		if (data.err) {
			form.querySelector('.warning').innerText = data.err;
			localStorage.removeItem('jwtString');
		} else {
			document.querySelectorAll('.warning').forEach(el => {
				el.innerText = '';
			});
			const jwtString = res.headers.get('Authorization');
			localStorage.setItem('jwtString', jwtString);
		}
		updateMeText();
	};
}

async function fetchMe() {
	const res = await fetch('/me', {
		method: 'GET',
		headers: {
			Authorization: localStorage.jwtString
		}
	});
	data = await res.json();
	if (data.err) {
		localStorage.removeItem('jwtString');
	} else {
		const jwtString = res.headers.get('Authorization');
		localStorage.setItem('jwtString', jwtString);
	}
	updateMeText();
}

function logout() {
	localStorage.removeItem('jwtString');
	updateMeText();
}

function updateMeText() {
	const meTextEl = document.querySelector('#me');
	let jwt = localStorage.jwtString ? jwt_decode(localStorage.jwtString) : false;
	if (jwt) {
		meTextEl.innerText = JSON.stringify(jwt, undefined, 5);
		meTextEl.style.color = 'green';
	} else {
		meTextEl.innerText = 'not logged in';
		meTextEl.style.color = 'red';
	}
}
