
var api = "http://localhost:3000/course/";

function loadData() {
	fetch(api)
	.then(resonpse =>resonpse.json())
	.then(courses => {
		var coursesBlock = document.querySelector(".courses");
		var html = courses.map(e =>{
			return `<li class = "list-group-item">
				<div class = "item">
					<h5>${e.name}</h5>
					<p>${e.description}</p>
				</div>
				<div">
					<button data-id = "${e.id}" class = "btn btn-primary edit-btn">Edit</button>
					<button data-id = "${e.id}" class ="btn btn-danger delete-btn">Delete</button>
				</div>
			</li>`
		})
		coursesBlock.innerHTML = html.join("")
	})
	.then(() => {
		initListener()
	})
	var cancelBtn = document.querySelector("#cancel-btn");
	

	cancelBtn.classList.add('invisible');
	document.getElementById('add-btn').innerText = "Add";
}

loadData();

function initListener() {
	var addBtn = document.querySelector("#add-btn");
	addBtn.onclick = function() {
		var nameInput = document.querySelector("#name-input");
		var desInput = document.querySelector("#des-input");
		addCourse(nameInput.value, desInput.value, loadData);
	}

	var deleteBtns = document.querySelectorAll(".delete-btn")
	deleteBtns.forEach(e => {
		e.onclick = function() {
			var id = e.getAttribute('data-id');
			removeCourse(id, loadData);
		}
	})

	var editBtns = document.querySelectorAll(".edit-btn");
	editBtns.forEach(e => {
		e.onclick = function() {
			var id = e.getAttribute('data-id');
			editCourse(id, loadData)
		}
	})

	var cancelBtn = document.getElementById("cancel-btn");
	cancelBtn.onclick = function() {
		cancelBtn.classList.add('invisible');
		document.getElementById('add-btn').innerText = 'Add';
		document.getElementById('name-input').value = '';
		document.getElementById('des-input').value = '';
	}
}


function addCourse(name, des, callback) {
	var data = {
		name : name,
		description : des
	};
	fetch(api, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then(() => {
		callback();
	})
}

function removeCourse(id, callback) {
	console.log("remove id: " + id)
	fetch(api + id, {
		method: 'DELETE'
	}). then ( () => {
		callback();
	})
}

function editCourse(id, callback) {
	fetch(api + id)
		.then(res => res.json())
		.then(e =>{
			var nameInput = document.querySelector("#name-input");
			var desInput = document.querySelector("#des-input");
			console.log("des: " + e.description);
			nameInput.setAttribute('value', e.name)
			desInput.setAttribute('value', e.description)
			document.getElementById('add-btn').innerText = "Update";
			document.getElementById('cancel-btn').classList.remove('invisible');
			var addBtn = document.getElementById('add-btn');
			addBtn.onclick = function() {
				handleUpdateCourse(id,loadData);
			}
		})
}

function handleUpdateCourse(id, callback) {
	var data  = {
		id : id,
		name : document.getElementById('name-input').value,
		description : document.getElementById('des-input').value
	}
	fetch(api + id , {
		method: 'PUT',
		headers: {
			'Content-Type' : 'application/json',
		},
		body: JSON.stringify(data)
	})
	.then(() => {
		callback();
	})
}