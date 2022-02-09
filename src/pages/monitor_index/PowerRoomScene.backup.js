import React, { useEffect ,useRef, useState } from 'react';
import { Spin } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols';
import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader';
import style from './monitorIndex.css';
let frameTimer = null;
let timer = null;
let eventTimer = null;
let loadMesh = null;
let flipLock = false;
let autoRotateLock = false;
let motionLock = false;
let isFrontView = true;

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

let textOption = {
    size: 14,
    height: 2,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 10,
    bevelSize: 8,
    bevelSegments: 5
}
function createTextMesh(font, data, material){
    var textGeometry = new THREE.TextGeometry( `${data.title}${data.value ? ':' : ''}  ${data.value}`, {
        ...textOption,
        font
    } );
    var textMesh = new THREE.Mesh(textGeometry, material);
    return textMesh;
}

function createInfoMesh(render, parentMesh, posX, posY, posZ, isWarning){
    // 渲染信息框
    var group = new THREE.Group();
    var planeGeometry = new THREE.PlaneGeometry(200,100);
    // planeGeometry.attributes.uv.array = [0,1,1,0,0,0];
    // 生成canvas纹理
    var canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 100;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = isWarning ? '#fd0606' : '#1286dd';
    ctx.fillRect(0,0,200,10);
    ctx.fillStyle = isWarning ? 'rgba(253,6,6,0.4)':'rgba(18,134, 221,0.4)';
    ctx.fillRect(0,10,200,100);
    ctx.fillStyle = '#fff';
    ctx.font = "14px Arial"; //字体样式设置
    ctx.textBaseline = "top"; //文本与fillText定义的纵坐标
    ctx.textAlign = "left"; //文本居中(以fillText定义的横坐标)
    ctx.fillText(parentMesh.name, 10, 20);
    let data = [{ title:'温度', value:'48.3', unit:'℃'}, { title:'负荷', value:'84.18', unit:'%' }, { title:'风机', value:'开', unit:'' }];
    data.forEach((item,index)=>{
        ctx.beginPath();
        ctx.fillText(`${item.title}: ${item.value}${item.unit}`, 10, 40 + 20 * index);
    })
    var texture = new THREE.CanvasTexture(canvas);
    var planeMaterial = new THREE.MeshBasicMaterial({
        transparent:true,
        map:texture,
        side:THREE.DoubleSide
    });
    var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(0, 200, 0);
    group.add(planeMesh);
    // console.log(planeGeometry);
    // 渲染底部连接线
    var vertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        0,150,0
      ]);
    var lineGeometry = new THREE.BufferGeometry();
    lineGeometry.attributes.position = new THREE.BufferAttribute(vertices,3);
    var lineMeterial = new THREE.LineBasicMaterial({
        color:0x1286dd
    });
    var lineMesh = new THREE.Line(lineGeometry, lineMeterial);
    var circleShape = new THREE.Shape();
    circleShape.absarc(0,4,4,0,Math.PI * 2);
    var shapeGeometry = new THREE.ShapeGeometry(circleShape,25);
    var shapeMaterial = new THREE.MeshBasicMaterial({
        color:0x1286dd,
        side:THREE.DoubleSide
    });
    var shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
    group.add(lineMesh);
    group.add(shapeMesh);
    group.position.set(posX,posY,posZ);
    // group.rotateY(Math.PI);
    if ( !isFrontView ){
        parentMesh.isFlip = true;
        group.rotateY(Math.PI);
    }
    parentMesh.add(group);
    render();
    // // 渲染文字
    // var loader = new THREE.FontLoader();
    // loader.load( '/fonts/helvetiker_regular.typeface.json', function ( font ) {
    //     let data = [{ title:'11111', value:''}, { title:'222222', value:'温度越限' }, { title:'33333', value:'2021-5-22 9:55'}];
    //     var textMaterial = new THREE.MeshBasicMaterial({
    //         color:0xffffff
    //     });
    //     var warningMaterial = new THREE.MeshBasicMaterial({
    //         color:0x04fde7
    //     });
    //     data.forEach((value,index)=>{
    //         let textPosX = -150 + 10, textPosY = 250 - 30;
    //         let textMesh = createTextMesh(font, value, textMaterial);
    //         // console.log(textMesh);
    //         textMesh.position.set(textPosX, textPosY - index * 24, 0);
    //         group.add(textMesh);
    //     })
    //     group.position.set(posX,posY,posZ);
    //     parentMesh.add(group);
    //     render();
    // } );
}

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
        var axisHelper = new THREE.AxisHelper(100);
        scene.add(axisHelper);
        // 加载变压器组模型
        let clickMeshs = [];
        var loader = new OBJLoader();
        var mtlLoader = new MTLLoader();
        mtlLoader.load('/static/model/pr6/pr6.mtl', (materials) => {
            materials.preload()
            loader.setMaterials(materials);
            // console.log(materials);
            if ( loadMesh ){
                scene.add(loadMesh);
                if ( loadMesh.children.length ){
                    loadMesh.children.forEach(i=>{
                        if ( i.name !== '门' && i.name !== '外墙' && i.name !== '底座' ) {
                            clickMeshs.push(i);
                        }
                    })
                }
                // motion();
                render();
                // timer = setTimeout(()=>{
                //     let current = loadMesh.children.filter(i=>i.name === '变压器C')[0];
                //     if ( current ){
                //         current.geometry.computeBoundingBox();
                //         let box = current.geometry.boundingBox;
                //         // console.log(box);
                //         let posX = box.min.x + ( box.max.x - box.min.x ) / 2;
                //         let posY = box.max.y;
                //         let posZ = box.min.z + ( box.max.z - box.min.z )/ 2;
                //         // console.log(posX,posY,posZ);
                //         current.isShowing = true;
                //         createInfoMesh(render, current, posX, posY, posZ);
                //     }
                // },1000)
                toggleLoading(false);
            } else {
                loader.load('/static/model/pr6/pr6.obj', (object) => {
                    fixObjectCenter(object);
                    scene.add(object);
                    loadMesh = object;
                    if ( object.children.length ){
                        object.children.forEach(i=>{
                            if (i.name !== '门' && i.name !== '外墙' && i.name !== '底座') {
                                clickMeshs.push(i);
                            }
                        })
                    }
                    // motion();
                    render();
                    // timer = setTimeout(()=>{
                    //     let current = object.children.filter(i=>i.name === '变压器C')[0];
                    //     if ( current ){
                    //         console.log(current);
                    //         current.geometry.computeBoundingBox();
                    //         let box = current.geometry.boundingBox;
                    //         // console.log(box);
                    //         let posX = box.min.x + ( box.max.x - box.min.x ) / 2;
                    //         let posY = box.max.y;
                    //         let posZ = box.min.z + ( box.max.z - box.min.z )/ 2;
                    //         // console.log(posX,posY,posZ);
                    //         current.isShowing = true;
                    //         createInfoMesh(render, current, posX, posY, posZ);
                    //     }
                    // },1000)
                    toggleLoading(false);

                })
            }
        })
           
        // 模型添加点击事件
        var raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        // 创建点光源
        var point = new THREE.PointLight(0xffffff,0.8);
        point.position.set(0, 400, 100); 
        scene.add(point);
        // 创建正面平行光源
        var directionalLight = new THREE.DirectionalLight(0x226890, 0.8);
        // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
        directionalLight.position.set(0, 300, 300);
        // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0
        scene.add(directionalLight); 
        // 创建背面光源
        var backLight = new THREE.DirectionalLight(0xffffff,0.4);
        backLight.position.set(0,300,-300);
        scene.add(backLight);
        // 创建摄影机对象
        var camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 2000); 
        camera.up.set(0,1,0);
        camera.position.set(0,680,1000); //设置相机位置
        camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
        /**
         * 创建渲染器对象
         */
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height);//设置渲染区域尺寸
        renderer.setClearColor(0x000000, 0);
        dom.appendChild(renderer.domElement); //body元素中插入canvas对象
        //执行渲染操作   指定场景、相机作为参数
        let angle;
        let initPos = new THREE.Vector3(0, 680, 1000);
        render();
        
        console.log(initPos);
        function render(noCondition){
            if ( noCondition ) {
                angle = 0;
            } else {
                angle = initPos.angleTo(camera.position);
            }
            // console.log(angle);
            if ( angle >= Math.PI /2 && !flipLock  ) {
                // console.log()
                // console.log('此时正面翻转');
                flipLock = true;
                isFrontView = false;
                loadMesh.children.forEach(mesh=>{
                    if( mesh.isShowing ){
                        mesh.children[0].isFlip = true;
                        mesh.children[0].rotateY(Math.PI);
                    }
                })
                
            } else if ( angle < Math.PI / 2 && flipLock ){
                // console.log('此时背面翻转');
                flipLock = false;
                isFrontView = true;
                loadMesh.children.forEach(mesh=>{
                    if(mesh.isShowing){
                        mesh.children[0].rotateY(-Math.PI);
                    }
                });
            }
            renderer.render(scene, camera);
        }
        var controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render); 
        
        function motion(){
            motionLock = true;
            frameTimer = setInterval(()=>{
                scene.rotation.y += 0.002;
                // 绕一周重置为0
                if ( Math.abs(scene.rotation.y) >= Math.PI * 2 ) {
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
                if ( Math.abs(scene.rotation.y) >= Math.PI * 3 /2 && Math.abs(scene.rotation.y) < Math.PI * 2 && autoRotateLock ) {
                    autoRotateLock = false;
                    isFrontView = true;
                    loadMesh.children.forEach(mesh=>{
                        if( mesh.isShowing && mesh.isFlip ){
                            mesh.children[0].rotateY(-Math.PI);
                        }
                    })
                }
                // console.log(scene.rotation.y);
                render(true);
            },40)           
        }
        
        function handleMouseMove(e){
                if ( loadingRef.current ) return;
                let boundingRect = renderer.domElement.getBoundingClientRect();
                let pointX = e.clientX - boundingRect.left;
                let pointY = e.clientY - boundingRect.top;
                let result = checkIsInRect(pointX, pointY, boundingRect);
                // console.log('result:',result);
                if ( result ) {
                    // console.log('in rect');
                    window.clearInterval(frameTimer);
                    motionLock = false;
                } else {
                    // console.log('out rect');
                    if ( !motionLock ) {
                        motion();
                    }
                }
        }

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
                if ( !targetMesh.isShowing  ) {
                    console.log(targetMesh);
                    targetMesh.geometry.computeBoundingBox();
                    let box = targetMesh.geometry.boundingBox;
                    // console.log(box);
                    let posX = box.min.x + ( box.max.x - box.min.x ) / 2;
                    let posY = box.max.y;
                    let posZ = box.min.z + ( box.max.z - box.min.z )/ 2;
                    // console.log(posX,posY,posZ);
                    targetMesh.isShowing = true;
                    createInfoMesh(render, targetMesh, posX, posY, posZ, false);
            
                } 
                clickMeshs.forEach(mesh=>{
                    if ( mesh.uuid !== targetMesh.uuid ){       
                        mesh.remove(mesh.children[0]);                       
                        mesh.isShowing = false;
                        render();
                    }
                })
            }  
        }
        dom.addEventListener('mousemove', handleModelMouseMove);
        window.addEventListener('mousemove',handleMouseMove);
        return ()=>{
            window.clearInterval(frameTimer);
            window.clearTimeout(eventTimer);
            dom.removeEventListener('mousemove', handleModelMouseMove);
            window.removeEventListener('mousemove', handleMouseMove);
            frameTimer = null;
            eventTimer = null;
            flipLock = false;
            autoRotateLock = false;
            motionLock = false;
            isFrontView = true;
            // 清除模型上的所有信息数据
            if ( loadMesh && loadMesh.children ) {
                loadMesh.children.forEach((mesh)=>{
                    mesh.remove(mesh.children[0]);
                    mesh.isShowing = false;
                })
            }
        }
    },[])
    return (
        <div style={{ height:'100%'}}>
            {
                loading
                ?
                <Spin className={style['spin']} size='large' tip='场景加载中，请稍后...' style={{ top:'40%' }} />
                :
                null
            }
            <div ref={containerRef} style={{ width:'100%', height:'100%' }}>
            
            </div>
        </div>
        
    )
}

export default PowerRoomScene;

function checkIsInRect(pointX, pointY, rect){
    // 确定鼠标在模型区间内
    if ( pointX >= rect.width * 0.2 && pointX <= rect.width * 0.8 && pointY >= 0 && pointY <= rect.height * 0.75  ) {
        return true;
    } else {
        return false;
    }
}