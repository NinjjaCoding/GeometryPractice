import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from 'dat.gui';

import stars1 from '../assets/images/stars1.jpg';
import stARS from '../assets/images/stARS.jpg';
import fake from '../assets/images/fake.jpg';  //use these pics for backgeound 

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const monkeyUrl = new URL('../assets/monkey.glb', import.meta.url); //also need GLTFLoader to load this type of file


const renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled = true; //assign object recieving shadows(planeGeo) and giving shadows on items

renderer.setSize(window.innerWidth, window.innerHeight);
//append to body of html
document.body.appendChild(renderer.domElement);

    //now we bundle packes usinng parcel./src/index/html

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight,
    0.1, 
    1000
);

    //allows for users to control objects 
 const orbit = new OrbitControls(camera, renderer.domElement);

    //install helper is a tool to help us as a guide
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

    //now lets put something in our scence
 const boxGeomety = new THREE.BoxGeometry();
    // const boxMaterial = new THREE.MeshBasicMaterial({ color: 'green'});
const boxMaterial = new THREE.MeshStandardMaterial({ color: 'green'});
const box = new THREE.Mesh(boxGeomety, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
        // const plnaeMaterial = new THREE.MeshBasicMaterial({ 
        // const plnaeMaterial = new THREE.MeshLambertMaterial({ 
    const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFF,
    side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane); 
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true; 

        //we need gridHelper to organize into grid
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

        //sphere ball 
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0000FF, wireframe: false});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true; 

//     //light sources--types of material used have different reflective 
// const ambientLight = new THREE.AmbientLight(0x333333);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFFF, 0.98);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true; 
// directionalLight.shadow.camera.bottom = -12; //widens bottom of camera render area 

//     //managing lights can be tricky so threejs has dirct.LightHelpers 
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// //each camera has specific shadows casters and helpers 
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true; 
spotLight.angle = 0.5; //wide angles makes shoadows pixelted 

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//we can create fog effect in our scenes
//scene.fog = new THREE.Fog(0xffffff, 0 , 200);
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

    //qw can clear the balck background 
    //renderer.setClearColor(0xFFEA00);
    //to change backgorund to an image we need textureLoader and load it with images
 const textureLoader = new THREE.TextureLoader(); //instantiate loader
    scene.background = textureLoader.load(stars1); //this makes it roungh looking but since scene is a cube we can chang each side //we can use a different kind of loader for that task 
// const cubeTextureLoader = new THREE.CubeTextureLoader(); 
// scene.background = cubeTextureLoader.load({
//     stARS,

//     fake
// });
 

        //shader material class or pass them on as scripts 
// const sphere2Geometry = new THREE.SphereGeometry(4);
// const vShader = "
//     void mapLinear() { 
//         gl_Position = projectionMatrix * modelViewMatrix * Vector4(position, 1.0);
//      }
//      " ;,

//      const fShader = '
//         void main() {
//             gl_FragColor = vec4(0.5, 1.0, 1,0);
//         }
//         ' ;
// // const sphere2Material = new THREE.ShaderMaterial({
// //     vertexShader:  document.getElementById('vertexShader').textContent,
// //     fragmentShader: document.getElementById('fragmentShader').textContent,
// // }); 
// const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
// scene.add(sphere2);
// sphere2.position.set(-5, 10, 10);

//GLTF folder reader to load the monkey from blender
const assetLoader = new GLTFLoader();
assetLoader.load(monkeyUrl.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(5, 3, -7);
}, undefined, function(error) {
    console.log(error);
});



   //to change properties we use options with gui
const gui = new dat.GUI();

    //if we want to change color of sphere, we can manipulate these to create effects using gui
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.09,
    penumbra: 0,
    intensity: 1 
};

gui.addColor(options, 'sphereColor').onChange(function(e) {
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e) {
    sphere.material.wireframe = e; 
});

    //say we want to make the ball bounce starting with step 0
let step = 0;
    // let speed = 0.1; moved to options object as properties 

gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 0.1);
gui.add(options, 'penumbra', 0, 1.5);
gui.add(options, 'intensity', 0, 5);


    //box2 for set sides 
const box2Geometry = new THREE.BoxGeometry(5, 5, 5); 
const box2Material = new THREE.MeshBasicMaterial({ 
   color: 0x00ff00,
    map: textureLoader.load(stARS)//we can set this new box to image

});

    //array to apply texture on each side of the cube...
const box2eachSideMaterial = [
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stARS)}),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(fake)}),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(fake)}),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars1)}),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stARS)}),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stARS)}),
];

    //const box2 = new THREE.Mesh(box2Geometry, Box2Material);
const box2 = new THREE.Mesh(box2Geometry, box2eachSideMaterial);
scene.add(box2);
box2.position.set(5, 5, 5);
    box2.material.map = textureLoader.load(stARS); //to create each side with different texture must create an array above

        //plane2 geometry
        const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        const plane2Material = new THREE.MeshBasicMaterial({
            color: 'red',
            wireframe: true

        });
        const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
        scene.add(plane2);
        plane2.position.set(10, 10, -15);

        //we can change the array holding the position attributes of 
        plane2.geometry.attributes.position.array[0] -= 5 * Math.random();
        plane2.geometry.attributes.position.array[1] -= 5 * Math.random();
        plane2.geometry.attributes.position.array[2] -= 5 * Math.random();
        const lastPointZ = plane2.geometry.attributes.position.array.length -1;
        plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();
        


        // now say we want users to interact with objects in our 3d landing page 
    //1. this is called raycasting where camera is begin point and cursor is desitination using Vector2 
const mousePosition = new THREE.Vector2();
    //2. then add even listerent to capture mouse activity 
window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 -1;
    mousePosition.y = (e.clientY / window.innerHeight) * 2 + 1;
});
//3. create instance of rayCaster Class ..then set the two ends inside the animate function using setFromCamera Method
const rayCaster = new THREE.Raycaster(); 

const sphereId = sphere.id; //to be change color 
box2.name = 'theBox'; //if box i chosen or items is chosen 





    // //now we can rotate box we put into function
function animate(time) {
    // box.rotation.x += 0.01;
    box.rotation.x = time /1000 ;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
            //then create a const to intersect the cursor with raycaster on mouse position 
    const intersects = rayCaster.intersectObjects(scene.children); 
    console.log(intersects);
        //to choose objects on screen usually with objectId
    for(let i = 0; i < intersects.length; i++ ) {
        if(intersects[i].object.id === sphereId);
            intersects[i].object.material.color.set(0xfffff0);

            if(intersects[i].object.name === 'theBox') {
                intersects[i].object.rotation.x = time / 1000;
                intersects[i].object.rotation.y = time / 1000;
            }
    }

       // plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
       // plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
        //plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
        //plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();
        //plane2.geometry.attributes.position.needsUpdate= true; 
        
    renderer.render (scene, camera);
}

renderer.setAnimationLoop(animate);

//to make it repsonive
window.addEventListener('resize', function() {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})




