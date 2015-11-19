var camera, scene, renderer, raycaster, mouse;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var plane, clicked = 0;

var SEPARATION = 1000, AMOUNTX = 50, AMOUNTY = 50;

var COLUMNS = 50, ROWS = 50, PLANESIZE = 1500;

init();
animate();


function init() {
  container = $('#featured');

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 300;
  camera.position.y = 80;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xFC447A, 4, 1500 );


  plane = new THREE.Mesh(new THREE.PlaneGeometry( PLANESIZE, PLANESIZE, COLUMNS - 1, ROWS - 1), new THREE.MeshBasicMaterial({opacity: 1, color: 0x000000, shading: THREE.FlatShading, wireframe: false}));
  plane.geometry.verticesNeedUpdate = true;
  plane.rotation.x = Math.PI / -2;
  // plane.geometry.vertices[0].z = 100; 

  background = new THREE.Mesh(new THREE.PlaneGeometry( PLANESIZE, PLANESIZE, COLUMNS - 1, ROWS - 1), new THREE.MeshBasicMaterial({opacity: 0, transparent: true, wireframe: false}));
  background.rotation.x = Math.PI / -2;
  // background.position.y += 100;
  scene.add(plane);
  scene.add(background);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0xFC447A, 1);  
  container.append( renderer.domElement );

  // stats = new Stats();
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.top = '0px';
  // container.appendChild( stats.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );

  //

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
  
}

function onDocumentTouchStart( event ) {
  
  if ( event.touches.length === 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;

  }

  event.preventDefault();
  
  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onDocumentMouseDown( event );
}

function onDocumentTouchMove( event ) {

  if ( event.touches.length === 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;

  }

}

var clickedPoint;
var clickTimer = 121;

function onDocumentMouseDown( event ) {
  clicked = clickTimer;
  event.preventDefault();

  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( [background] );
  // console.log(intersects);
  if ( intersects.length > 0 ) {
    var mousepoint = intersects[0].point;
    clickedPoint = intersects[0].point;

    // console.log(intersects[0].point);

    // for (var i = 0; i < plane.geometry.vertices.length; i++){
    //   if ((intersects[0].point.x - 50 <= plane.geometry.vertices[i].x && plane.geometry.vertices[i].x < intersects[0].point.x + 50)){
    //     console.log(plane.geometry.vertices[i]);
    //     plane.geometry.vertices[i].z = 200;
    //     plane.geometry.verticesNeedUpdate = true;
    //   }
    // }
    // console.log(plane.geometry.vertices[i]);
    // intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

    // var particle = new THREE.Sprite();
    // particle.position.copy( intersects[ 0 ].point );
    // particle.scale.x = particle.scale.y = 16;
    // scene.add( particle );

  }
}

//

function animate() {

  requestAnimationFrame( animate );

  render();
  // stats.update();

}

var count = 0;
var factorConst = 1.4;

function render() {

  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY - camera.position.y ) * .05 + 10;
  camera.lookAt( scene.position );

  var i = 0;

  for ( var ix = 0; ix < COLUMNS; ix ++ ) {

    for ( var iy = 0; iy < ROWS; iy ++ ) {

      plane.geometry.vertices[i].z = ( Math.sin( ( ix + count ) * 2 ) *  0.5 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 8 );

      

      if (clicked){

        var dist = Math.abs(clickedPoint.x - plane.geometry.vertices[i].x);
        var factor;

        if (dist > 2000){
          factor = Math.pow(factorConst, 1);
        }else if(dist > 1500){
          factor = Math.pow(factorConst, 1);
        }else if(dist > 1000){
          factor = Math.pow(factorConst, 2);
        }else if(dist > 500){
          factor = Math.pow(factorConst, 1);
        }else{
          factor = Math.pow(factorConst, 3);
        }

        if (clicked > clickTimer/2){
          plane.geometry.vertices[i].z = plane.geometry.vertices[i].z + plane.geometry.vertices[i].z*factor*(clickTimer - clicked)/clickTimer;
        }else{
          plane.geometry.vertices[i].z = plane.geometry.vertices[i].z + plane.geometry.vertices[i].z*factor*(clicked/clickTimer);
        }

      }

      i++
    }

  }

  if (clicked){
    clicked--;
  }
  plane.geometry.verticesNeedUpdate = true;

  // console.log(plane);
  renderer.render( scene, camera );

  count += 0.1;
}