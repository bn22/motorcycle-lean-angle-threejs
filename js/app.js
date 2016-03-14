'use strict';
	//THREE JS Implementation
	Physijs.scripts.worker = '/js/physijs_worker.js';
	Physijs.scripts.ammo = '/js/ammo.js';

	var renderer, scene, camera, light, ground_material, ground_geometry, ground, render, loader, id;
	var created = false;
	var angle = 0;
	var speed = 0;
	var lean = 0;
	var radian = 0;
	var objectLoader;
	var xResult = 0;
	var zResult = 0;
	var prevAngle = 0;
	var direction = 0;
	var generated = false;

	function initScene() {
		//Renderer
		renderer = new THREE.WebGLRenderer( { alpha: true } );
		renderer.setClearColor( 0x000000, 0 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		document.getElementById( 'viewport' ).appendChild( renderer.domElement );

		//Scene
		scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
		scene.setGravity(new THREE.Vector3( 0, -30, 0 ));

		//Camera
		camera = new THREE.PerspectiveCamera(
			90,
			window.innerWidth / window.innerHeight,
			1,
			750
		);
		camera.position.set( 30, 18, 30 );
		camera.lookAt( scene.position );
		scene.add( camera );
		
		//Light
		light = new THREE.DirectionalLight( 0xFFFFFF );
		light.position.set( 20, 40, -15 );
		light.target.position.copy( scene.position );
		light.castShadow = true;
		light.shadowCameraLeft = -60;
		light.shadowCameraTop = -60;
		light.shadowCameraRight = 60;
		light.shadowCameraBottom = 60;
		light.shadowCameraNear = 20;
		light.shadowCameraFar = 200;
		light.shadowBias = -.0001
		light.shadowMapWidth = light.shadowMapHeight = 2048;
		light.shadowDarkness = .7;
		scene.add( light );

		//Generate
		createGround();
		render();
	};

	initScene();

	function render() {
		id = requestAnimationFrame( render );
		if (created) {
			for (var i = scene.children.length - 1; i >= 0 ; i -- ) {
				if (scene.children[i].isMotorcycle) {
					if ((scene.children[i].rotation.x > xResult - 0.05  && scene.children[i].rotation.x < xResult + 0.05) || (scene.children[i].rotation.z > zResult - 0.05  && scene.children[i].rotation.z < zResult + 0.05)) {
						created = false;
					} 
					if (direction == 0) {	
						scene.children[i].rotation.x = scene.children[i].rotation.x + (xResult / 120); 
						scene.children[i].rotation.z = scene.children[i].rotation.z + (xResult / 120); 	
					} else if (direction == 1) {
						scene.children[i].rotation.x = scene.children[i].rotation.x - (xResult / 120); 
						scene.children[i].rotation.z = scene.children[i].rotation.z - (zResult / 120); 
					}	
				}
			}
		}
		renderer.render( scene, camera );
		scene.simulate();
	};

	$("#search").click(function() {
		createMotorCycle();
		created = true;
	});	

	function createMotorCycle() {
		speed = document.getElementById("speed").value;
		radian = document.getElementById("radian").value;
		if (speed != 0 && radian != 0) {
			lean = calculateLeanAngle(speed, radian);
			if (convertToDegrees(lean) != 0) {
				prevAngle = angle;
				angle = convertToDegrees(lean);
				objectLoader = new THREE.ObjectLoader();
				xResult = lean / 2;
				zResult = lean / 2;
				document.getElementById("lean").innerHTML = Math.round(angle) + "\xB0";

				if (angle < prevAngle) {
					direction = 1;
				} else {
					direction = 0;
				}

				if (!generated) {
					generated = true;
					objectLoader.load("assets/motortest5.json",function ( front ) {
						front.name = "Motorcycle";
						front.scale.x = 0.03;
				        front.scale.y = 0.03;
				        front.scale.z = 0.03;
			            //front.rotation.x = ((-1 * angle * Math.PI) / 180) / 3;
				        //front.rotation.z = ((-1 * angle * Math.PI) / 180);
				        //front.rotation.x = lean / 2;
				        //front.rotation.z = lean / 2;
				        front.position.set(-5, 22, 10);
				        front.isMotorcycle = true;
			            scene.add( front );
					});
				}
			}
		}
	}

	function createGround() {
		loader = new THREE.TextureLoader();
				ground_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({map: loader.load('assets/road.jpg')}),
			.8, // high friction
			.4 // low restitution
		);
		ground_geometry = new THREE.PlaneGeometry( 50, 25, 50, 50 );
		ground = new Physijs.HeightfieldMesh(
			ground_geometry,
			ground_material,
			0, // mass
			50,
			50
		);
		ground.position.set(-15, 17, 5);
		ground.rotation.x = Math.PI / -2;
		ground.rotation.z = Math.PI / -4;
		ground.receiveShadow = true;
		ground.name = "floor";
		scene.add( ground );
	}

	function calculateLeanAngle(speed, radian) {
		var friction = (Math.pow(speed, 2)) / (9.81 * radian);
		var answer = Math.atan(friction);
		return answer;
	}

	function convertToDegrees(radians) {
		return (radians * 180) / Math.PI
	}

	function convertToAngle(angle) {
		return (angle * Math.PI) / 180;
	}    
