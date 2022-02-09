import React, { useEffect ,useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols';
import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 引入three-obj-mtl-loader库要改写loadTexture方法，特此记录
// loadTexture: function ( url, mapping, onLoad, onProgress, onError ) {
//     var texture;
//     // var loader = THREE.Loader.Handlers.get( url );
//     var manager = ( this.manager !== undefined ) ? this.manager : THREE.DefaultLoadingManager;
//     var loader = manager.getHandler(url);
//     if ( loader === null ) {
//         loader = new THREE.TextureLoader( manager );
//     }
//     if ( loader.setCrossOrigin ) loader.setCrossOrigin( this.crossOrigin );
//     texture = loader.load( url, onLoad, onProgress, onError );
//     if ( mapping !== undefined ) texture.mapping = mapping;
//     return texture;
// }
function fixObjectCenter(object){
    // 校正导入的group模型中心点s
    var box = new THREE.Box3();
    box.expandByObject(object);
    var mdlen = box.max.x - box.min.x;
    var mdwid = box.max.z - box.min.z;
    var mdhei = box.max.y - box.min.y;
    var x1 = box.min.x + mdlen / 2;
    // y轴设置比中心点上移50
    var y1 = box.min.y + 100;
    var z1 = box.min.z + mdwid / 2;
    // console.log(box);
    object.position.set(-x1, y1, -z1);
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
function createInfoMesh(render, parentMesh, posX, posY, posZ){
    // 渲染信息框
    var planeGeometry = new THREE.PlaneGeometry(300,100);
    var canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 100;
    var c = canvas.getContext('2d');
    // 矩形区域填充背景
    c.fillStyle = "#0000ff";
    c.fillRect(0, 0, 300, 50);
    c.fillStyle = 'rgba(255,0,0,0.3)';
    c.fillRect(0,50, 300,100);
    // 文字
    c.beginPath();
    c.fillStyle = "#000000"; //文本填充颜色
    c.font = "bold 50px 宋体"; //字体样式设置
    c.textBaseline = "top"; //文本与fillText定义的纵坐标
    c.textAlign = "left"; //文本居中(以fillText定义的横坐标)
    c.fillText("郭隆邦_技术博客", 0, 0);
    var texture = new THREE.CanvasTexture(canvas);
    texture.flipZ = true;
    var planeMaterial = new THREE.MeshBasicMaterial({
        transparent:true,
        map:texture,
        side:THREE.DoubleSide,
    });
    var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(posX,posY,posZ);
    if ( !isFrontView ){
        if ( !parentMesh.isFlip ) {
            parentMesh.isFlip = true;
            planeMesh.rotateY(Math.PI);
        }
    }
    parentMesh.add(planeMesh);
    render();
}

let frameTimer = null;
let loadMesh = null;
let motionLock = false;
let flipLock = false;
let autoRotateLock = false;
let isFrontView = true;
let canDrop = false;
function PowerRoomScene(){
    const containerRef = useRef();
    const [loading, toggleLoading] = useState(true);
    const loadingRef = useRef(true);
    useEffect(()=>{
        loadingRef.current = loading;
    },[loading])
    useEffect(()=>{
        var scene = new THREE.Scene();
        var dom = containerRef.current;
        let width = containerRef.current.offsetWidth;
        let height = containerRef.current.offsetHeight;
        // let width = window.innerWidth;
        // let height = window.innerHeight;
        var axisHelper = new THREE.AxisHelper(300);
        scene.add(axisHelper);
        let mtlLoader = new MTLLoader();

        let objLoader = new OBJLoader();
        // 将obj压缩成gltf格式;
        // let dracoLoader = new DRACOLoader();
        // let gltfLoader = new GLTFLoader();
        // dracoLoader.setDecoderPath('/draco/gltf/');
        // dracoLoader.setDecoderConfig({ type:'js' });
        // dracoLoader.preload();
        // gltfLoader.setDRACOLoader(dracoLoader);
        // gltfLoader.load('/static/power_room/compress/pr2.gltf',(gltf)=>{
        //     console.log(gltf);
        //     scene.add(gltf.scene);
        //     render();
           
        // })
        // 通过mtl和loader正常加载
        // 计算空间中两个向量的夹角
        var v1 = new THREE.Vector3(-50,100,100);
        var v2 = new THREE.Vector3(100,0,0);
        console.log(v1);
        console.log(v1.angleTo(v2) === Math.PI/2);
        console.log(v2.angleTo(v1));
        
        var vertices = new Float32Array([
            0, 0, 0, //顶点1坐标
            50, 0, 0, //顶点2坐标
            0, 100, 0, //顶点3坐标
            0, 0, 10, //顶点4坐标
            0, 0, 100, //顶点5坐标
            50, 0, 10, //顶点6坐标
          ]);
        var geometry = new THREE.BufferGeometry();
        geometry.attributes.position = new THREE.BufferAttribute(vertices,3);
        console.log(geometry);
        var material=new THREE.LineBasicMaterial({
            color:0xff0000 //线条颜色
        });//材质对象
        var line=new THREE.Line(geometry,material);//线条模型对象
        console.log(line);
        scene.add(line);//线条对象添加到场景中
        // 创建点光源
        var point = new THREE.PointLight(0xffffff);
        point.position.set(0, 400, 100); 
        scene.add(point);
        // 创建平行光源
        var directionalLight = new THREE.DirectionalLight(0x136076, 1);
        // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
        directionalLight.position.set(0, -500, 200);
        // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0
        
        // scene.add(directionalLight); 
        // 创建摄影机对象
        var camera = new THREE.PerspectiveCamera(60, width/height, 1, 2000); 
        // camera.up.set(0,0,1);
        // camera.position.set(0,-400,400); //设置相机位置
       
        /**
         * 创建渲染器对象
         */
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height);//设置渲染区域尺寸
        renderer.setClearColor(0x000000, 0);
        containerRef.current.appendChild(renderer.domElement); //body元素中插入canvas对象
        //执行渲染操作   指定场景、相机作为参数
        let initPos = new THREE.Vector3(0,500,600);
        let angle;
        function render(noCondition){
            console.log(scene.rotation.y);
            // 限定y轴方向的偏移角度
            if ( scene.rotation.x >= Math.PI / 2 ) {
                scene.rotation.x = Math.PI / 2;
            }
            if ( scene.rotation.x <= -Math.PI / 2) {
                scene.rotation.x = -Math.PI / 2;
            }
            // 限定y轴方向的偏移角度
            if ( Math.abs(scene.rotation.y) >= Math.PI * 2  ) {
                scene.rotation.y = 0;
            }
            if ( Math.abs(scene.rotation.y) >= Math.PI /2 && !autoRotateLock ){
                autoRotateLock = true;
                isFrontView = false;
                loadMesh.children.forEach(mesh=>{
                    mesh.isFlip = true;
                    if( mesh.isShowing ){
                        mesh.children[0].rotateY(Math.PI);
                    }
                })
            }
            if ( Math.abs(scene.rotation.y) < Math.PI / 2 && autoRotateLock ) {
                autoRotateLock = false;
                isFrontView = true;
                loadMesh.children.forEach(mesh=>{
                    if( mesh.isShowing && mesh.isFlip ){
                        mesh.children[0].rotateY(-Math.PI);
                    }
                })
            }
            renderer.render(scene, camera);
        }
        let yAxis = new THREE.Vector3(0,1,0);
        function motion(){
            motionLock = true;
            frameTimer = setInterval(()=>{
                scene.rotation.y += 0.002;
                // 绕一周重置为0
                render(true);
            },40)           
        }
        
        camera.up.set(0,1,0);
        camera.position.set(0,600,800);
        camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
        render();
        // var controls = new OrbitControls(camera, renderer.domElement);
        // controls.addEventListener('change', render); 
        let clickMeshs = [];
        if ( loadMesh ){
            console.log('loadeMesh load');
            scene.add(loadMesh);
            if ( loadMesh.children.length ){
                loadMesh.children.forEach(mesh=>{
                    clickMeshs.push(mesh);
                    
                })
            }
            motion();
            toggleLoading(false);
        } else {
            objLoader.load('/static/model/pr4/pr4.obj',object=>{
                console.log(object);
                fixObjectCenter(object);
                scene.add(object);
                loadMesh = object;
                if ( object.children.length ){
                    object.children.forEach(i=>{
                        if ( i.name !== '门' && i.name !== '外墙' && i.name !== '底座') {
                            clickMeshs.push(i);
                        }
                    })
                }
                motion();
                // render();
                
                toggleLoading(false);
            })
        } 
        let clickPosX, clickPosY;
        let clickPots = [];
    
        function handleMouseMove(e){
            if ( loadingRef.current ) return;
            let boundingRect = renderer.domElement.getBoundingClientRect();
            let pointX = e.clientX - boundingRect.left;
            let pointY = e.clientY - boundingRect.top;
            let result = checkIsInRect(pointX, pointY, boundingRect);
            // console.log('result:',result);
            if ( result ){
                motionLock = false;
                // console.log(frameTimer);
                window.clearInterval(frameTimer);
                // 添加对模型的控制事件
                if ( !canDrop ) return;
                // clickPots.push({x:e.clientX, y:e.clientY});
                // console.log(clickPots);
            
                setTimeout(()=>{
                    clickPosX = e.clientX;
                    clickPosY = e.clientY;            
                },500)
                let offsetX = e.clientX - clickPosX;
                let offsetY = e.clientY - clickPosY;
                console.log(offsetX, offsetY);
                if ( Math.abs(offsetX) >= 30 ){
                    if ( offsetX < 0 ){
                        scene.rotation.y = scene.rotation.y - 0.02  ;
                    } else {
                        scene.rotation.y = scene.rotation.y + 0.02;
                    }
                    render();
                }
                if ( Math.abs(offsetY) >= 30 ){
                    if ( offsetY < 0 ){
                        scene.rotation.x = scene.rotation.x - 0.02;
                    } else {
                        scene.rotation.x = scene.rotation.x + 0.02;
                    }
                    render();
                }       
            } else {
                if ( !motionLock ) {
                    console.log('moveout');
                    motion();
                }
                
            }
        }
        var raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        function handleModelMouseMove(event){
            event.preventDefault();
            let boundingRect = renderer.domElement.getBoundingClientRect();
            let pointX = event.clientX - boundingRect.left;
            let pointY = event.clientY - boundingRect.top;
            mouse.x = (pointX / width) * 2 - 1;
            mouse.y = -(pointY / height) * 2 + 1;            
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(clickMeshs);            
            // console.log(intersects);
            if ( intersects.length ){
                let targetMesh = intersects[0].object;
                console.log(targetMesh);
                if ( !targetMesh.isShowing   ) {
                    targetMesh.geometry.computeBoundingBox();
                    let box = targetMesh.geometry.boundingBox;
                    // console.log(box);
                    let posX = box.min.x + ( box.max.x - box.min.x ) / 2;
                    let posY = box.max.y + 100;
                    let posZ = box.min.z + ( box.max.z - box.min.z )/ 2;
                    // console.log(posX,posY,posZ);
                    targetMesh.isShowing = true;
                    createInfoMesh(render, targetMesh, posX, posY, posZ);       
                } 
                clickMeshs.forEach(mesh=>{
                    if ( mesh.uuid !== targetMesh.uuid ){
                        mesh.remove(mesh.children[0]);
                        mesh.isShowing = false;
                        mesh.isFlip = false;
                        render();
                    }
                    
                })
                
            } 
        }
        function handleMouseDown(e){
            clickPosX = e.clientX;
            clickPosY = e.clientY;
            // console.log(clickPosX,clickPosY);
            canDrop = true;
        }
        function handleMouseUp(e){
            canDrop = false;
            clickPots = [];
        }
        window.addEventListener('mousedown',handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        dom.addEventListener('mousemove', handleModelMouseMove);
        window.addEventListener('mousemove',handleMouseMove);
        
        return ()=>{
            window.removeEventListener('mousemove', handleMouseMove);
            window.clearInterval(frameTimer);
        }
    },[])
    return (
        <div ref={containerRef} style={{ width:'80%', height:'60%', margin:'0 auto' }}></div>
    )
}

export default PowerRoomScene;


function checkIsInRect(pointX, pointY, rect){
    // 确定鼠标在模型区间内
    if ( pointX >= rect.width * 0.2 && pointX <= rect.width * 0.8 && pointY >= 0  ) {
        return true;
    } else {
        return false;
    }
}