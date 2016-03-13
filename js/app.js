'use strict';
	Physijs.scripts.worker = '/js/physijs_worker.js';
	Physijs.scripts.ammo = '/js/ammo.js';

	var renderer, scene, camera, light, ground_material, ground_geometry, ground, render, loader, frontMotor, backMotor;

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
			35,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		camera.position.set( 60, 50, 60 );
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

		loader = new THREE.TextureLoader();
		
		//Ground
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

		ground.position.set(-15, 15, 5);

		ground.rotation.x = Math.PI / -2;
		ground.rotation.z = Math.PI / -4;

		ground.receiveShadow = true;
		ground.name = "floor";
		/*ground.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    		// `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`			
			console.log("The Id of the other object is " + other_object);
		});*/
		scene.add( ground );

		calculateLeanAngle(35.6, 114.8);

		render();
	};

	function render() {
		/*player.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    		// `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`			
			if (other_object.name === "left" || other_object.name === "right") {
				setTimeout(function() {
					scene.remove(player);
				}, 400);
				setTimeout(function() {
					addPlayer();
				}, 400);
			} else if (other_object.name === "Finish") {
				console.log("Finish Game");
			}
		});*/
		//player1.__dirtyPosition = true;
		//player1.setAngularVelocity(new THREE.Vector3(0, 0, 0));
	    //player1.setLinearVelocity(new THREE.Vector3(-6, 0, -6));
		//player.applyCentralImpulse({x: -1, y: null, z: -1});  
		
		requestAnimationFrame( render );
		renderer.render( scene, camera );
		scene.simulate();
	};

	$("#search").click(function() {
		var speed = document.getElementById("speed").value
		var radian = document.getElementById("radian").value
		var lean = calculateLeanAngle(speed, radian);
		var angle = convertToDegrees(lean);
		var loader = new THREE.ObjectLoader();
		document.getElementById("lean").innerHTML = Math.round(angle) + "\xB0";
		
		loader.load("assets/motor.json",function ( front ) {
 			front.scale.x = 0.03;
            front.scale.y = 0.03;
            front.scale.z = 0.03;	
            front.rotation.x = (-90 * Math.PI) / 180;
            front.rotation.y = (1 * angle * Math.PI) / 180;
            front.rotation.z = (-145 * Math.PI) / 180;
    		front.position.set(20, 25, 3);
            scene.add( front );
		});
		console.log(scene);
	});	

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
	
	window.onload = initScene();
