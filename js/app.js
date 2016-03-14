'use strict';
	//THREE JS Implementation
	Physijs.scripts.worker = '/js/physijs_worker.js';
	Physijs.scripts.ammo = '/js/ammo.js';

	var renderer, scene, camera, light, ground_material, ground_geometry, ground, render, loader, id;
	var created = false;

	function initScene() {
		renderer = new THREE.WebGLRenderer( { alpha: true } );
		renderer.setClearColor( 0x000000, 0 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;

		document.getElementById( 'viewport' ).appendChild( renderer.domElement );
		
		scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
		scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
		
		camera = new THREE.PerspectiveCamera(
			90,
			window.innerWidth / window.innerHeight,
			1,
			750
		);
		//camera.position.set( 60, 50, 60 );
		camera.position.set( 30, 18, 30 );
		camera.lookAt( scene.position );
		scene.add( camera );
		
		// Light
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
		createGround();
		render();
	};

	initScene();

	function render() {
		id = requestAnimationFrame( render );
		/*if (created) {
			for (var i = 0; i < 5; i++) {
				for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
					if (scene.children[i].isMotorcycle) {
						scene.children[i].rotation.y = scene.children[i].rotation.y + 0.3;
					}
				}
			}
		}*/
		renderer.render( scene, camera );
		scene.simulate();
	};

	$("#search").click(function() {
		created = true;
		createMotorCycle();
	});	

	function createMotorCycle() {
		removeEntity();

		var speed = document.getElementById("speed").value;
		var radian = document.getElementById("radian").value;
		var lean = calculateLeanAngle(speed, radian);
		var angle = convertToDegrees(lean);
		var objectLoader = new THREE.ObjectLoader();
		document.getElementById("lean").innerHTML = Math.round(angle) + "\xB0";

		objectLoader.load("assets/motortest5.json",function ( front ) {
			front.name = "Motorcycle";
			front.scale.x = 0.03;
	        front.scale.y = 0.03;
	        front.scale.z = 0.03;
            front.rotation.x = ((-1 * angle * Math.PI) / 180) / 3;
	        front.rotation.z = ((-1 * angle * Math.PI) / 180);
	        front.position.set(-5, 22, 10);
	        front.isMotorcycle = true;
            scene.add( front );
            animate(front);
		});
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

	function removeEntity(){
	    var obj, i;
        for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
            obj = scene.children[ i ];
            if (obj.isMotorcycle) {
                scene.remove(obj);

            }
        }
	}

	function animate(scene) {
		/*for(var i = 0; i < 5; i++) {
			scene.children[0].rotation.y = scene.children[0].rotation.y + 0.2;
		}*/
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
