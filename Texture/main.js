var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);
	
	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(0),
		new THREE.MeshPhongMaterial({color:0xff4444, wireframe:USE_WIREFRAME})
	);
	mesh.position.y += 1;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add(mesh);
	
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(20,20, 10,10),
		new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME})
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	scene.add(meshFloor);
	
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);
	
	
	// Texture Loading
	var textureLoader = new THREE.TextureLoader();
	crateTexture = textureLoader.load("tekstur/kayu1.png");
	crateBumpMap = textureLoader.load("tekstur/alas.png");
	crateNormalMap = textureLoader.load("tekstur/garis.png");
	
	// Create mesh with these textures
	crate = new THREE.Mesh(
		new THREE.BoxGeometry(3,3,3),
		new THREE.MeshPhongMaterial({
			color:0xffffff,
			
			map:crateTexture,
			bumpMap:crateBumpMap,
			normalMap:crateNormalMap
		})
	);
	scene.add(crate);
	crate.position.set(-0.1,3/2, 2.5);
	crate.receiveShadow = true;
	crate.castShadow = true;
	
	
	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild(renderer.domElement);
	
	animate();
}

function animate(){
	requestAnimationFrame(animate);
	
	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
	}
	if(keyboard[38]){ // up arrow key
		camera.rotation.x -= player.turnSpeed;
	}
	if(keyboard[40]){ // down arrow key
		camera.rotation.x += player.turnSpeed;
	}
	
	renderer.render(scene, camera);
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;

// Logic to move camera right and left using mouse
var isDragging = false;
var previousMousePosition = {
	x: 0,
	y: 0
};

document.addEventListener('mousedown', function(event) {
	isDragging = true;
	previousMousePosition = {
		x: event.clientX,
		y: event.clientY
	};
});

document.addEventListener('mouseup', function(event) {
	isDragging = false;
});

document.addEventListener('mousemove', function(event) {
	if (isDragging) {
		var movementX = event.clientX - previousMousePosition.x;

		if (movementX > 0) {
			// Move camera right
			camera.position.x += Math.cos(camera.rotation.y) * player.speed;
			camera.position.z += Math.sin(camera.rotation.y) * player.speed;
		} else if (movementX < 0) {
			// Move camera left
			camera.position.x -= Math.cos(camera.rotation.y) * player.speed;
			camera.position.z -= Math.sin(camera.rotation.y) * player.speed;
		}

		previousMousePosition = {
			x: event.clientX,
			y: event.clientY
		};
	}
});

// Logic to rotate camera right and left using mouse
document.addEventListener('mousemove', function(event) {
	if (isDragging) {
		var movementX = event.clientX - previousMousePosition.x;

		if (movementX > 0) {
			// Rotate camera right
			camera.rotation.y -= player.turnSpeed;
		} else if (movementX < 0) {
			// Rotate camera left
			camera.rotation.y += player.turnSpeed;
		}

		previousMousePosition = {
			x: event.clientX,
			y: event.clientY
		};
	}
});

// Logic to move camera up and down using mouse
document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        var movementY = event.clientY - previousMousePosition.y;

        if (movementY > 0) {
            // Move camera up
            camera.rotation.x -= player.turnSpeed;
        } else if (movementY < 0) {
            // Move camera down
            camera.rotation.x += player.turnSpeed;
        }

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});