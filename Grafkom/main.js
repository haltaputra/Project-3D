var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;
// loading screen 
var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
	box: new THREE.Mesh(
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({ color:0x4444ff })
	)
};
var loadingManager = null;
var RESOURCES_LOADED = false;

// Models index
var models = {
	log: {
		obj:"models/log.obj",
		mtl:"models/log.mtl",
		mesh: null
	},
	pit: {
		obj:"models/pit.obj",
		mtl:"models/pit.mtl",
		mesh: null
	},
	tenda: {
		obj:"models/tenda.obj",
		mtl:"models/tenda.mtl",
		mesh: null
	},
	apiunggun: {
		obj:"models/unggun.obj",
		mtl:"models/unggun.mtl",
		mesh: null
	}
};

// Index Alas
var meshes = {};

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);

	loadingScreen.box.position.set(0,0,5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);
	
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};

	mesh = new THREE.Mesh(
		new THREE.Geometry(),
		new THREE.MeshPhongMaterial({wireframe:USE_WIREFRAME})
	);
	mesh.position.y += 1;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add(mesh);
	
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(30,20, 10,30),
		new THREE.MeshPhongMaterial({wireframe:USE_WIREFRAME})
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	scene.add(meshFloor);
	
	// tekstur lantai
	var textureLoader = new THREE.TextureLoader(loadingManager);
	var floorTexture = textureLoader.load("tekstur/floor.jpeg");
	meshFloor.material.map = floorTexture;
	
	// cahaya
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 200);
	light.position.set(0,9,0);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);
	
	
	// Texture kotak 
	var textureLoader = new THREE.TextureLoader(loadingManager);
	crateTexture = textureLoader.load("tekstur/kayu1.png");
	crateBumpMap = textureLoader.load("tekstur/alas.png");
	crateNormalMap = textureLoader.load("tekstur/garis.png");
	
	// buat kotak dengan texture
	crate = new THREE.Mesh(
		new THREE.BoxGeometry(1.8,1.8,1.8),
		new THREE.MeshPhongMaterial({
			color:0xffffff,

			map:crateTexture,
			bumpMap:crateBumpMap,
			normalMap:crateNormalMap
		})
	);
	scene.add(crate);
	crate.position.set(-0.5,0.9,7);
	crate.receiveShadow = true;
	crate.castShadow = true;

	// membuat pohon
	function createTree(positionX, positionZ) {
		const treeGroup = new THREE.Group();

		const trunkGeometry = new THREE.CylinderGeometry(0.6, 0.6, 1, 32);
		const trunkMaterial = new THREE.MeshStandardMaterial({ map: batangTexture });
		const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
		trunk.position.y = 0.5; // Setengah dari tinggi batang
		trunk.castShadow = true;
		trunk.scale.set(0.5, 3.5, 0.5); // Skala batang
		treeGroup.add(trunk);

		const leafGeometry = new THREE.ConeGeometry(0.9, 1, 32);
		const leafMaterial = new THREE.MeshStandardMaterial({ map: daunTexture });

		let initialLeafY = 3; // Tinggi total batang

		for (let i = 0; i < 3; i++) {
			const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
			leaf.position.y = initialLeafY + i * 0.9; // Menumpuk daun di atas batang
			leaf.scale.set(2 - i * 0.8, 2 - i * 0.6, 2 - i * 0.4); // Skala mengecil ke atas
			leaf.castShadow = true;
			treeGroup.add(leaf);
		}

		treeGroup.position.set(positionX, 0, positionZ);
		scene.add(treeGroup);
	}

	// Muat tekstur untuk batang dan daun
	var textureLoader = new THREE.TextureLoader(loadingManager);
	var batangTexture = textureLoader.load("tekstur/47074.jpg");
	var daunTexture = textureLoader.load("tekstur/daun.jpeg");
	console.log(batangTexture);
	console.log(daunTexture);

	// Menambahkan pohon di posisi x=0, y=0
	createTree(6, 0);
	createTree(3, 6);
	createTree(-7,2);

// membuat batu
function createRock(positionX, positionZ, scale) {
	const rockGeometry = new THREE.DodecahedronGeometry(0.25 * scale, 0); // Mengurangi skala sebesar 50%
	const rockMaterial = new THREE.MeshStandardMaterial({ map: batuTexture });
	const rock = new THREE.Mesh(rockGeometry, rockMaterial);
	rock.position.set(positionX, 0.125 * scale, positionZ); // Posisi disesuaikan agar sesuai dengan skala baru
	rock.scale.set(scale, scale, scale);
	rock.castShadow = true;
	scene.add(rock);
}

// Muat tekstur untuk batang dan daun
var textureLoader = new THREE.TextureLoader(loadingManager);
var batuTexture = textureLoader.load("tekstur/batu2.jpeg");
console.log(batangTexture);
console.log(daunTexture);

// Menambahkan batu di posisi x=0, y=0
createRock(-6.7, 0, 1.5); 

	for( var _key in models ){
		(function(key){
			
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){
				materials.preload();
				
				var objLoader = new THREE.OBJLoader(loadingManager);
				
				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function(mesh){
					
					mesh.traverse(function(node){
						if( node instanceof THREE.Mesh ){
							node.castShadow = true;
							node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;
					
				});
			});
			
		})(_key);
	}
	
	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild(renderer.domElement);
	
	animate();
}

// Berjalan ketika semua sumber daya dimuat
function onResourcesLoaded(){
	
	// Mengkloning model menjadi mesh
	meshes["log1"] = models.log.mesh.clone();
	meshes["log2"] = models.log.mesh.clone();
	meshes["pit1"] = models.pit.mesh.clone();
	meshes["tenda1"] = models.tenda.mesh.clone();
	meshes["tenda2"] = models.tenda.mesh.clone();
	meshes["api1"] = models.apiunggun.mesh.clone();
	meshes["api2"] = models.apiunggun.mesh.clone();
	
	//log
	meshes["log1"].position.set(-4, 0, -1);
	meshes["log1"].scale.set(4, 4, 5);
	meshes["log1"].rotation.y = Math.PI/-4;
	meshes["log2"].position.set(3, 0, 3);
	meshes["log2"].scale.set(4, 4, 4);
	scene.add(meshes["log1"]);
	scene.add(meshes["log2"]);

	//pit
	meshes["pit1"].position.set(-1, 0, 2);
	meshes["pit1"].scale.set(7, 5, 7);
	scene.add(meshes["pit1"]);

	//tenda
	meshes["tenda1"].position.set(2, 0, -2);
	meshes["tenda1"].scale.set(1, 1, 1);
	meshes["tenda1"].rotation.y = Math.PI/1.2;
	meshes["tenda2"].position.set(-4, 0, 6);
	meshes["tenda2"].scale.set(1, 1, 1);
	meshes["tenda2"].rotation.y = Math.PI/-4;
	scene.add(meshes["tenda1"]);
	scene.add(meshes["tenda2"]);

	//api unggun
	meshes["api1"].position.set(-1, 0, 2);
	meshes["api1"].scale.set(4, 4, 4);
	meshes["api1"].rotation.y = Math.PI/1.2;
	scene.add(meshes["api1"]);
}

function animate(){

	// Mainkan loading screen hingga sumber daya dimuat.
	if( RESOURCES_LOADED == false ){
		requestAnimationFrame(animate);
		
		loadingScreen.box.position.x -= 0.05;
		if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
		
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;
	}

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

// Kontrol keyboard dan mouse
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Logika menggerakkan kamera menggunakan mouse
var isDragging = false;
var previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', function(event) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
});

document.addEventListener('mouseup', function(event) {
    isDragging = false;
});

// Kontrol kamera untuk melihat ke segala arah menggunakan mouse
document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        var movementX = event.clientX - previousMousePosition.x;
        var movementY = event.clientY - previousMousePosition.y;

        camera.rotation.y += movementX * 0.01;
        camera.rotation.x += movementY * 0.01;

        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
});

window.onload = init;

