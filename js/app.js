'use strict';
Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = '/js/ammo.js';

$('#spd').slider({
    tooltip:"hide"
});
$('#rad').slider({
    tooltip:"hide"

});

$('#result').qtip({ // Grab some elements to apply the tooltip to
    content: {
        text: 'My common piece of text here'
    },
    style: {
        classes: ' qtip-bootstrap'}
})


var g = new JustGage({
    id: "gauge",
    value: 1,
    min: 0,
    max: 200,
    title: "Speed",
    label: "Miles per Hour",
    customSectors: [{
        color : "#FF0000",
        lo : 0,
        hi : 200
    }],
    levelColorsGradient: false,
    titleFontColor:"#FFFFFF",
    titleFontFamily: "Sniglet",
    valueFontColor:"#ffffff",
    valueFontFamily:"Sniglet"
});


var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {

    $scope.total =function(){

        $('#spdSld').slider('setValue', parseInt($scope.speedMPH));
        $('#radSld').slider('setValue', parseInt($scope.radianFeet));


        if(parseInt($scope.speedMPH)<=200 && parseInt($scope.speedMPH)>=0){
            g.refresh(parseInt($scope.speedMPH));

        }




        return (Math.atan((Math.pow((parseFloat($scope.speedMPH) * 1.609344*1000/3600),2)/(9.8*(parseFloat($scope.radianFeet) * 0.3048))))* 180 / Math.PI).toFixed(2) ;
    }
});



var angle = 0;
var car_physics = {
    power: null,
    direction: null,
    steering: 0
};
var renderer, scene, camera, light, ground_material, ground_geometry, ground, render, loader, player1;

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

    ground.position.set(-25, -20, 10);

    ground.rotation.x = Math.PI / -2;
    ground.rotation.z = Math.PI / -4;

    ground.receiveShadow = true;
    ground.name = "floor";
    /*ground.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
     // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
     console.log("The Id of the other object is " + other_object);
     });*/
    scene.add( ground );

    //Curved Line
    var SUBDIVISIONS = 20;
    var geometry = new THREE.Geometry();
    var curve = new THREE.QuadraticBezierCurve3();
    curve.v0 = new THREE.Vector3(0, 1, 2.5);
    curve.v1 = new THREE.Vector3(5, 2, 5);
    curve.v2 = new THREE.Vector3(15, 3, 20);
    for (var j = 0; j < SUBDIVISIONS; j++) {
        geometry.vertices.push( curve.getPoint(j / SUBDIVISIONS) )
    }

    var material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 100 } );
    var line = new THREE.Line(geometry, material);
    scene.add(line);

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

function addPlayer(playerSpeed) {
    /*player = new Physijs.BoxMesh(
     new THREE.BoxGeometry( 4, 4, 4 ),
     new THREE.MeshLambertMaterial(),
     5,
     0,
     0
     )
     player.position.set(20, 3, 20);
     player.rotation.x = Math.PI / -2;
     player.rotation.z = Math.PI / 4;
     player.material.color.setRGB( Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100 );
     scene.add(player);*/

    var loader = new THREE.ObjectLoader();
    loader.load("assets/motor.json",function ( player ) {
        player.scale.x = 0.01;
        player.scale.y = 0.01;
        player.scale.z = 0.01;
        player.rotation.x = -100* Math.PI / 180;
        player.rotation.z = 30* Math.PI / 180;
        player.position.set(5, 0, 30);
        scene.add( player );
    });
}

window.onload = initScene();
