import React, { useEffect ,useRef, useState } from 'react';
import { Spin } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import style from '@/pages/index.less';
import { createTubeMesh, layout } from './utils';

let machReg = /(\d+)_([a-zA-Z]+)/;
let frameTimer = null;
let isBack = false;
let pathMaps = {
    '江苏飞船股份':'feichuan',
    '胜华电子(惠阳)有限公司':'shdz',
    '德赛电池':'desai'
}
function fixObjectCenter(object){
    // 校正导入的group模型中心点s
    var box = new THREE.Box3();
    box.expandByObject(object);
    console.log(box);
    var mdlen = box.max.x - box.min.x;
    var mdwid = box.max.z - box.min.z;
    var mdhei = box.max.y - box.min.y;
    var x1 = box.min.x + mdlen / 2;
    // y轴设置比中心点上移50
    var y1 = box.min.y + 100;
    var z1 = box.min.z + mdwid / 2;
    // console.log(box);
    // object.position.set(-x1, y1, -z1);
    object.position.set(-x1,0,-z1);
    // object.position.set(-x1,0,0);
    // 计算出xyz轴方向的缩放因子(group旋转后会影响到坐标轴);
    // let xRatio = 1/(Math.abs(box.max.x - box.min.x)/380);
    // let yRatio = 1/(Math.abs(box.max.y - box.min.y)/2/65);
    // let zRatio = 1/(Math.abs(box.max.z - box.min.z)/180);
    // console.log(yRatio);
    // transformerGroup.scale.set(xRatio,yRatio,1);
    // transformerGroup.translateY(Math.abs(box.max.y - box.min.y)/2*yRatio + 10);
    // scene.add(transformerGroup);
}

function PowerRoomScene({ dispatch, currentCompany, currentScene, sceneIndex }){
    const containerRef = useRef();
    const [loading, toggleLoading] = useState(true);
    const [info, setInfo] = useState(0);
    const loadingRef = useRef(true);
    useEffect(()=>{
        loadingRef.current = loading;
    },[loading])
    useEffect(()=>{
        var scene = new THREE.Scene();
        // scene.fog = new THREE.Fog( 0x4ff904, 0, 750 );
        var grid = new THREE.GridHelper(5000, 100, 0x195582, 0x195582);
        grid.material.transparent = true;
        grid.material.opacity = 0.3;
        // scene.add(grid);
        // grid.position.set(0,100,0);
        // cubeTexture方向：左-右-上-下-前-后
        // scene.background = new THREE.CubeTextureLoader().setPath('/textures/').load([
        //     'posx.jpg',
        //     'negx.jpg',
        //     'posy.jpg',
        //     'negy.jpg',
        //     'posz.jpg',
        //     'negz.jpg',
        //     // '3.png',
        //     // '2.png',
        //     // '1.png',
        //     // '4.png',
        //     // '5.png',
        //     // '6.png'
        // ]);
        
        // textures.mapping = THREE.CubeReflectionMapping;
        // console.log(THREE);
        // const textureLoader = new THREE.TextureLoader();
        // textureLoader.load( '/textures/posx.jpg', function ( texture ) {
        // 	texture.encoding = THREE.sRGBEncoding;
        // 	texture.mapping = THREE.EquirectangularReflectionMapping;
            
        //     scene.background = texture;
        //     render();
        // } );
        var container = containerRef.current;
        let width = containerRef.current.offsetWidth;
        let height = containerRef.current.offsetHeight;
        var axisHelper = new THREE.AxisHelper(100);
        var shadowLoader = new THREE.TextureLoader();
        var shadow = shadowLoader.load('/textures/shadow.png');
        console.log(shadow);
        var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000 });
        //表面粗糙的一种材质，可以起镜面反射作用；没有光照的时候，该材质反射黑色；当有光照的时候，可以将物体颜色反射出来
        // var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
        // cube.castShadow = true;
        // scene.add(cube);
        // var sphereGeo = new THREE.SphereGeometry(50, 40, 40);//创建球体
        // var sphereMat = new THREE.MeshLambertMaterial({//创建材料
        //     color:0x0000FF,
        //     wireframe:false
        // });
        // var sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);//创建球体网格模型
        // sphereMesh.position.set(-100, 0, 0);//设置球的坐标
        // sphereMesh.castShadow = true;
        // scene.add(sphereMesh);
        // 添加环境光
        scene.add(new THREE.AmbientLight(0xcccccc,0.8));
        // 创建点光源
        // let spotLight2 = new THREE.SpotLight(0xffffff);
        // spotLight2.position.set(-400, 400, 400);
        // spotLight2.castShadow = true;
        // scene.add(spotLight2); 
        // 添加平行光
        var directionalLight = new THREE.DirectionalLight(0xc9f8f8, 0.8);
        // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
        directionalLight.position.set(0, 100, -50);
        // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0
        directionalLight.castShadow = true;
        console.log(directionalLight.shadow.camera);
        directionalLight.shadow.camera.near = 100;
        directionalLight.shadow.camera.far = 300;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        // scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
        scene.add(directionalLight);
        
        // 创建摄影机对象
        var camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 4000); 
        camera.up.set(0,1,0);
        camera.position.set(0,200,200); //设置相机位置
        camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
        /**
         * 创建渲染器对象
         */
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

        renderer.setSize(width, height);//设置渲染区域尺寸
        renderer.setClearColor(0xd0d4d9, 0);
        // renderer.shadowMapEnabled = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement); //body元素中插入canvas对象
        //执行渲染操作   指定场景、相机作为参数
        function render(){
            renderer.render(scene, camera);
        }
        let clickMeshs = [];
        var raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        // 所有模型的组合对象       
        var mtlLoader1 = new MTLLoader();
        var objLoader1 = new OBJLoader();
        // mtlLoader1.load('/static/ceshi.mtl', function(mtl) {
        //     // objLoader.setMaterials(mtl);
        //     objLoader1.load('/static/ceshi.obj',(obj)=>{
        //         console.log(obj);  
        //         scene.add(obj);
        //         box.position.set(300,0,0);
        //         scene.add(box);
        //         render();
        //     })
        // });
        // var mtlLoader2 = new MTLLoader();
        // var objLoader2 = new OBJLoader();
        // mtlLoader2.load('/static/ceshi2.mtl', function(mtl) {
        //     objLoader2.setMaterials(mtl);
        //     console.log(mtl);
        //     objLoader2.load('/static/ceshi2.obj',(obj)=>{
        //         obj.position.set(-300,0,0);
        //         scene.add(obj);
        //         render();
        //     })
        // });
       
        let { group, textures } = layout();
        console.log(textures);
        fixObjectCenter(group);
        
        scene.add(group);
        
        var planeGeometry = new THREE.PlaneGeometry(1500,1500);
        var planeMaterial = new THREE.MeshLambertMaterial({color:0xd0d8e1 });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, -10, 0);
        plane.rotateX(-Math.PI/2);
        plane.receiveShadow = true;
        scene.add(plane);
        function renderTexture() {
          renderer.render(scene, camera); //执行渲染操作
          requestAnimationFrame(renderTexture);
          // 使用加减法可以设置不同的运动方向
          // 设置纹理偏移
          textures.forEach(texture=>{
              texture.offset.x += 0.01;
          })
        //   tube1.texture.offset.x -= 0.01;
        //   tube2.texture.offset.x += 0.01;
        //   tube3.texture.offset.x += 0.01;
        }
        // setTimeout(()=>{
        //     renderTexture();
        // },3000)
        
        renderTexture();
        var controls = new OrbitControls(camera, renderer.domElement);//创建控件对象
        //监听鼠标、键盘事件
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.5;
        // 顺时针方向，0 -- Math.PI/2 --- Math.PI --- -Math.PI --- -Math.PI/2 --- 0
        controls.addEventListener('change', ()=>{
            // 监听场景的翻转状态
            // console.log(controls.getAzimuthalAngle());
            // let angle = controls.getAzimuthalAngle();
            // if ( angle > -Math.PI/2 && angle < Math.PI /2 ) {
            //     isBack = false; 
            // } else {
            //     isBack = true;
            // }
            render();
        })
        function animate() {
            // frameTimer = requestAnimationFrame( animate );         
            // // required if controls.enableDamping or controls.autoRotate are set to true
            // controls.update();
            renderer.render( scene, camera );
        }
        return ()=>{
            // window.removeEventListener('mousemove', handleMouseOver);

        }
    },[]);

    return (
        <div className={style['page-container']} style={{
            backgroundImage:'linear-gradient(to bottom, #d0d8e1 , #c1c8d8)'
        }}>
            <div style={{ position:'absolute', left:'100px', top:'100px', color:'#fff' }}>{ info }</div>

            {/* {
                loading
                ?
                <Spin className={style['spin']} size='large' tip='场景加载中，请稍后...' style={{ top:'40%' }} />
                :
                null
            } */}
            <div ref={containerRef} style={{ width:'100%', height:'100%' }}>
            
            </div>
        </div>
        
    )
}


export default PowerRoomScene;

function checkIsInRect(pointX, pointY, width){
    // 确定鼠标在模型区间内
    if ( pointX >= width * 0.2 && pointX <= width * 0.8 && pointY >= 0  ) {
        return true;
    } else {
        return false;
    }
}