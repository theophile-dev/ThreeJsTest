import * as THREE from 'three';
import * as dat from 'dat.gui';

//Create the Scenes
let cutViewScene = new THREE.Scene();
let previewScene = new THREE.Scene();

//Create the Camera
//const cutViewCamera = new THREE.OrthographicCamera(70, 2, 1, 1000);
const cutViewCamera = new THREE.PerspectiveCamera(70, 2, 1, 1000);
cutViewCamera.position.z = 2;
let cutViewRenderer = new THREE.WebGLRenderer();

//const previewCamera = new THREE.OrthographicCamera(70, 2, 1, 1000);
const previewCamera = new THREE.PerspectiveCamera(70, 2, 1, 1000);
previewCamera.position.z = 3;
let previewRenderer = new THREE.WebGLRenderer();
previewRenderer.setClearColor(0x808080, 1);
//Load crate texture
let texture = new THREE.TextureLoader().load('./dist/crate.gif');

//Create the plane
var planeGeometry = new THREE.PlaneGeometry(1,1);
var planeMaterial = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
cutViewScene.add( plane ); 

//Create the box
let cubeGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
let cubeMaterial = new THREE.MeshBasicMaterial( { map: texture } );
let cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
previewScene.add( cube );

//Append the canvas to the correct div
let cutViewElement = document.getElementById('scene-cut-view'); 
cutViewElement.appendChild(cutViewRenderer.domElement);
let previewElement = document.getElementById('scene-preview'); 
previewElement.appendChild(previewRenderer.domElement);

let deg2rad = function(degree) {return degree*(Math.PI/180);};

//Handle Gui
let controller = new function() {
    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleZ = 1;
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
  }();

  let gui = new dat.GUI();
  let f1 = gui.addFolder('Scale');
  f1.add(controller, 'scaleX', 0.1, 5).onChange( function() {
    cube.scale.x = (controller.scaleX);
    plane.scale.x = (controller.scaleX);
  });
  f1.add(controller, 'scaleY', 0.1, 5).onChange( function() {
    cube.scale.y = (controller.scaleY);
    plane.scale.y = (controller.scaleY);
  });
  f1.add(controller, 'scaleZ', 0.1, 5).onChange( function() {
    cube.scale.z = (controller.scaleZ);
  });


  let f2 = gui.addFolder('Rotation');
  f2.add(controller, 'rotationX', -180, 180).onChange( function() {
    cube.rotation.x = deg2rad(controller.rotationX);
    plane.rotation.x = deg2rad(controller.rotationX);
  });
  f2.add(controller, 'rotationY', -180, 180).onChange( function() {
    cube.rotation.y = deg2rad(controller.rotationY);
    plane.rotation.y = deg2rad(controller.rotationY);
  });
  f2.add(controller, 'rotationZ', -180, 180).onChange( function() {
    cube.rotation.z = deg2rad(controller.rotationZ);
    plane.rotation.z = deg2rad(controller.rotationZ);
  });

function resizeCanvasToDisplaySize(renderer, camera, element) {
    const canvas = renderer.domElement;
    // look up the size the canvas is being displayed
    const width = element.clientWidth;
    const height = window.innerHeight;
    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      renderer.setSize(width, height, true);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // update any render target sizes here
    }
}


function onWindowResize() {
    resizeCanvasToDisplaySize(cutViewRenderer, cutViewCamera, cutViewElement);
    resizeCanvasToDisplaySize(previewRenderer, previewCamera, previewElement);
}

window.addEventListener( 'resize', onWindowResize, false );

function animate() {
    
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    requestAnimationFrame( animate );
    previewRenderer.render( previewScene, previewCamera );
	cutViewRenderer.render( cutViewScene, cutViewCamera );
}

onWindowResize();
animate();