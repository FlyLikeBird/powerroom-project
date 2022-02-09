import React, { useEffect ,useRef, useState } from 'react';
import { Spin } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import style from '@/pages/index.less';


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

// 创建地面模型
function createGroundMesh(width, height){    
    var geometry = new THREE.BoxGeometry( width, 5, height );
    var material = new THREE.MeshLambertMaterial({
        transparent:true,
        opacity:0.6,
        color:0x10264e
    });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
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
let planeWidth = 300;
let planeHeight = 120;
function createInfoMesh( target, isWarning, data ){
    // 渲染信息框
    target.isShowing = true;
    var group = new THREE.Group();
    group.name = 'info';
    var planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    // planeGeometry.attributes.uv.array = [0,1,1,0,0,0];
    // 生成canvas纹理
    var canvas = document.createElement("canvas");
    canvas.width = planeWidth;
    canvas.height = planeHeight;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = isWarning ? '#fd0606' : '#1286dd';
    ctx.fillRect(0,0,planeWidth, 30);
    ctx.fillStyle = isWarning ? 'rgba(253,6,6,0.2)':'rgba(18,134, 221,0.2)';
    ctx.fillRect(0,10, planeWidth, planeHeight );
    ctx.strokeStyle = isWarning ? '#fd0606' : '#1286dd';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, planeWidth, planeHeight);
    
    // 标题下划线
    ctx.fillStyle = '#fff';
    ctx.font = "14px Arial"; //字体样式设置
    ctx.textBaseline = "top"; //文本与fillText定义的纵坐标
    ctx.textAlign = "left"; //文本居中(以fillText定义的横坐标)
    ctx.fillText(target.name, 10, 10);
    let infoData;
    if ( isWarning ){
        // 告警状态
        infoData = [{ title:'告警类型', value:'温度越限'},{ title:'告警时间', value:'2021-06-16 18:00'}];
        infoData.forEach((item,index)=>{
            ctx.beginPath();
            ctx.fillText(`${item.title}: ${item.value}${item.unit}`, 10, 50 + 24 * index);
        });
    } else {
        // 标记了的设备
        infoData = [
            {title:'A相电流', value:Math.round(data.I1), unit:'A'},{ title:'    ', value:'', unit:''},{ title:'AB线电压', value:Math.round(data.U12), unit:'V'},
            {title:'B相电流', value:Math.round(data.I2), unit:'A'},{ title:'    ', value:'', unit:''},{ title:'BC线电压', value:Math.round(data.U23), unit:'V'},
            {title:'C相电流', value:Math.round(data.I3), unit:'A'},{ title:'    ', value:'', unit:''},{ title:'CA线电压', value:Math.round(data.U31), unit:'V'},
        ];
        let rowIndex = 0;
        for(let i=0;i<infoData.length;i+=3){
            ctx.beginPath();  
            ctx.fillStyle = rowIndex === 0 ? '#eff400' : rowIndex === 1 ? '#00ff00' : '#ff0000';
            ctx.fillText(`${infoData[i].title}:${infoData[i].value}${infoData[i].unit}${infoData[i+1].title}${infoData[i+2].title}:${infoData[i+2].value}${infoData[i+2].unit}`, 10, 50 + 24 * rowIndex);
            rowIndex++;
        }
    } 
    // else {
    //     // 未标记的设备
    //     ctx.fillText(parentMesh.name, 10, 20);
    //     infoData = [{ title:'温度', value:'48.3', unit:'℃'}, { title:'负荷', value:'84.18', unit:'%' }, { title:'风机', value:'开', unit:'' }];
    //     infoData.forEach((item,index)=>{
    //         ctx.beginPath();
    //         ctx.fillText(`${item.title}: ${item.value}${item.unit}`, 10, 50 + 24 * index);
    //     })
    // }

    var texture = new THREE.CanvasTexture(canvas);
    var planeMaterial = new THREE.MeshBasicMaterial({
        transparent:true,
        map:texture,
        side:THREE.DoubleSide
    });
    var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
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
    circleShape.absarc(0,6,6,0,Math.PI * 2);
    var shapeGeometry = new THREE.ShapeGeometry(circleShape,25);
    var shapeMaterial = new THREE.MeshBasicMaterial({
        color:0x1286dd,
        side:THREE.DoubleSide
    });
    var shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
    // lineMesh.position.set(0, target.height, 0);
    // shapeMesh.position.set(0, target.height, 0);
    planeMesh.position.set(0, 150 + planeHeight/2, 0);
    if ( isBack ){
        planeMesh.rotateY(Math.PI);
    } 
    group.add(lineMesh);
    group.add(shapeMesh);
    group.add(planeMesh);
    group.position.set(target.position.x, target.height, target.position.z);
    return group;
}

var vertices = new Float32Array([
    -3000, 0, 0, //顶点1坐标
    3000,0, 0
  ]);
//  受电柜 = 进线柜
var loadModels = [
    { path:'transformer_mini.gltf', name:'3#变压器'}, 
    { path:'inlineBox_mini.gltf', name:'进线柜'}, 
    { path:'feedbackBox_mini.gltf', name:'馈电柜'},
    { path:'capBox_mini.gltf', name:'电容柜'}
    // { path:'feedbackBox_mini.gltf', name:'馈电柜'},
    // { path:'feedbackBox_mini.gltf', name:'馈电柜'},
    // { path:'capBox_mini.gltf', name:'电容柜'},
    // { path:'capBox_mini.gltf', name:'电容柜'}
];
var modelList = [
    { path:'transformer_mini.gltf', name:'3#变压器', mach_id:'3101067114' }, 
    { path:'inlineBox_mini.gltf', name:'进线柜'}, 
    { path:'feedbackBox_mini.gltf', name:'馈电柜1'},
    { path:'feedbackBox_mini.gltf', name:'馈电柜2'},
    { path:'feedbackBox_mini.gltf', name:'馈电柜3'},
    { path:'capBox_mini.gltf', name:'电容柜1' },
    { path:'capBox_mini.gltf', name:'电容柜2' }
];
var cacheModels = {

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
        var grid = new THREE.GridHelper(5000, 100, 0x195582, 0x195582);
        grid.material.transparent = true;
        grid.material.opacity = 0.3;
        // grid.position.set(0,100,0);
        scene.add(grid);
        var container = containerRef.current;
        let width = containerRef.current.offsetWidth;
        let height = containerRef.current.offsetHeight;
        var axisHelper = new THREE.AxisHelper(100);
        // scene.add(axisHelper);
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
        var camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 4000); 
        camera.up.set(0,1,0);
        camera.position.set(0,680,1000); //设置相机位置
        camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
        /**
         * 创建渲染器对象
         */
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height);//设置渲染区域尺寸
        renderer.setClearColor(0x000000, 0);
        
        container.appendChild(renderer.domElement); //body元素中插入canvas对象
        //执行渲染操作   指定场景、相机作为参数
        function render(){
            renderer.render(scene, camera);
        }
        let clickMeshs = [];
        var raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        // 所有模型的组合对象
        let group = new THREE.Group();

        //  将obj压缩成gltf格式;
        let dracoLoader = new DRACOLoader();
        let gltfLoader = new GLTFLoader();
        dracoLoader.setDecoderPath('/draco/gltf/');
        dracoLoader.setDecoderConfig({ type:'js' });
        dracoLoader.preload();
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader.load('/static/a_mini.gltf',gltf=>{
            console.log(gltf);
            scene.add(gltf.scene);
            render();
        })
        // var allPromises = [] ;
        // for( var i=0;i<loadModels.length;i++){
        //     (function(item){
        //         var promise = new Promise((resolve, reject)=>{
        //             gltfLoader.load(`/static/models/${item.path}`,gltf=>{
        //                 cacheModels[item.path] = gltf.scene.children[0];
        //                 resolve();
        //             })
        //         });
        //         allPromises.push(promise);
        //     })(loadModels[i])
        // }
        // Promise.all(allPromises)
        // .then(()=>{
        //     // console.log(cacheModels);
        //     let distance = 0;
        //     modelList.forEach((item,index)=>{
        //         let model = cacheModels[item.path].clone();
        //         model.name = item.name;
        //         // console.log(model);
        //         // 获取每个模型的空间大小
        //         let box = new THREE.Box3();
        //         box.expandByObject(model);
        //         // console.log(box);
        //         var mWidth = box.max.x - box.min.x;
        //         var mDeep = box.max.z - box.min.z;
        //         var mHeight = box.max.y - box.min.y;
        //         distance += mWidth;
        //         model.height = mHeight;
        //         model.rotateY(Math.PI);
        //         model.position.set( index === 0 ? 0 : distance, mHeight/2, 0);
        //         group.add(model);
        //         // 将group里的所有子Mesh都添加到clickMeshs，射线判定只能以mesh为单位
        //         if ( model.children && model.children.length ){
        //             model.children.forEach(mesh=>{
        //                 clickMeshs.push(mesh);
        //             })
        //         }
        //     });
        //     // 计算总的模型盒子边界并使盒子X轴和Z轴方向居中
        //     var groupBox = new THREE.Box3();
        //     groupBox.expandByObject(group);
        //     let groupWidth =  groupBox.max.x - groupBox.min.x;
        //     group.position.set(-groupBox.min.x - groupWidth/2,0,0);
        //     // 创建地面模型
        //     let groundMesh = createGroundMesh(groupWidth + 200, 300);
        //     scene.add(group);
        //     scene.add(groundMesh);
        //     // render();
        //     animate();
        //     // 添加鼠标移入
        //     window.addEventListener('mousemove', handleMouseOver);
        // });
        let target = null;
        let prevTarget = null;
        let isEmpty = true;
        let isRunning = false;
        function handleMouseOver(event){
            let boundingRect = renderer.domElement.getBoundingClientRect();
            let pointX = event.clientX - boundingRect.left;
            let pointY = event.clientY - boundingRect.top;
            mouse.x = (pointX / width) * 2 - 1;
            mouse.y = -(pointY / height) * 2 + 1;  
            if ( checkIsInRect(pointX, pointY, boundingRect.width) ){  
                controls.autoRotate = false;       
                isRunning = false;
                window.cancelAnimationFrame(frameTimer);              
            } else {
                if ( !isRunning ){
                    console.log('restart');
                    isRunning = true;
                    controls.autoRotate = true;
                    animate();
                }
                return ;
            }               
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(clickMeshs);   
            if ( intersects.length ){
                isEmpty = false;
                // group.children = group.children.filter(i=>i.name !== 'info');
                target = group.children.filter(i=>i.uuid === intersects[0].object.parent.uuid )[0];
                if ( target  && prevTarget !== target && !target.isShowing ){
                    console.log('info');
                    // 清除前一次生成的信息模块
                    if ( prevTarget ){
                        group.children = group.children.map(item=>{
                            if ( item.uuid === prevTarget.uuid ){
                                item.isShowing = false;
                                return item;
                            } else {
                                return item;
                            }
                        }).filter(i=>i.name !== 'info' );
                    }        
                    let infoMesh = createInfoMesh( target, false, {});
                    group.add(infoMesh);
                    render();
                }
                prevTarget = target;
                
            } else {   
                // 离开模型区间时，清除当前生成的信息模块
                if ( !isEmpty ){
                    if ( target ){
                        group.children = group.children.map(item=>{
                            if ( item.uuid === target.uuid ){
                                item.isShowing = false;
                                return item;
                            } else {
                                return item;
                            }
                        }).filter(i=>i.name !== 'info' );
                    }
                    prevTarget = null;
                    isEmpty = true;
                    render();
                }
            }
        }
        var controls = new OrbitControls(camera, renderer.domElement);//创建控件对象
        //监听鼠标、键盘事件
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        // 顺时针方向，0 -- Math.PI/2 --- Math.PI --- -Math.PI --- -Math.PI/2 --- 0
        controls.addEventListener('change', ()=>{
            // 监听场景的翻转状态
            // console.log(controls.getAzimuthalAngle());
            let angle = controls.getAzimuthalAngle();
            if ( angle > -Math.PI/2 && angle < Math.PI /2 ) {
                isBack = false; 
            } else {
                isBack = true;
            }
            render();
        })
        function animate() {
            frameTimer = requestAnimationFrame( animate );         
            // required if controls.enableDamping or controls.autoRotate are set to true
            controls.update();
            renderer.render( scene, camera );
        }
        return ()=>{
            window.removeEventListener('mousemove', handleMouseOver);

        }
    },[]);

    return (
        <div className={style['page-container']}>
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