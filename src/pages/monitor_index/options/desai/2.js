import * as THREE from 'three';
export var loadModels = [
    { path:'transformer_mini.gltf'}, 
    { path:'capBox_mini.gltf'},
    { path:'inlineBox_mini.gltf'}, 
    { path:'feedbackBox_mini.gltf'},
    { path:'eleBox_mini.gltf'},
    { path:'connectBox_mini.gltf'}
];
export var modelList = [
    { path:'transformer_mini.gltf', type:'transformer', name:'6#变压器', mach_id:'2912015248' }, 
    { path:'transformer_mini.gltf', type:'transformer', name:'5#变压器', mach_id:'3106084077' }, 
    { path:'transformer_mini.gltf', type:'transformer', name:'4#变压器', mach_id:'3106084079' }, 
    { path:'inlineBox_mini.gltf', type:'inlineBox', name:'进线柜1' },
    { path:'capBox_mini.gltf', type:'capBox', name:'电容柜1' },
    { path:'capBox_mini.gltf', type:'capBox', name:'电容柜2' },
    { path:'feedbackBox_mini.gltf', type:'feedbackBox', name:'馈电柜1'},
    { path:'feedbackBox_mini.gltf', type:'feedbackBox', name:'馈电柜2'},
    { path:'connectBox_mini.gltf', type:'connectBox', name:'联络柜' },
    { path:'feedbackBox_mini.gltf', type:'feedbackBox', name:'馈电柜3'},
    { path:'feedbackBox_mini.gltf', type:'feedbackBox', name:'馈电柜4'},
    { path:'capBox_mini.gltf', type:'capBox', name:'电容柜3' },
    { path:'capBox_mini.gltf', type:'capBox', name:'电容柜4' },
    { path:'inlineBox_mini.gltf', type:'inlineBox', name:'进线柜2' },
    { path:'inlineBox_mini.gltf', type:'inlineBox', name:'进线柜3' },
    { path:'capBox_mini.gltf', type:'capBox', name:'电容柜5' },
    { path:'capBox_mini.gltf', type:'capBox', name:'电容柜6' },
    { path:'feedbackBox_mini.gltf', type:'feedbackBox', name:'馈电柜5'},
    { path:'feedbackBox_mini.gltf', type:'feedbackBox', name:'馈电柜6'}, 
    { path:'feedbackBox_mini.gltf', type:'feedbackBox', name:'馈电柜7'},
    { path:'feedbackBox_mini.gltf', type:'feedbackBox', name:'馈电柜8'}, 
];

export function layout(cacheModels, group, clickMeshs){
    let distance = 0;
    modelList.filter(i=>i.type !== 'transformer').forEach((item,index)=>{
        let model = cacheModels[item.path].clone();
        model.name = item.name;
        model.mach_id = item.mach_id;
        // console.log(model);
        // 获取每个模型的空间大小
        let box = new THREE.Box3();
        box.expandByObject(model);
        // console.log(box);
        var mWidth = box.max.x - box.min.x;
        var mDeep = box.max.z - box.min.z;
        var mHeight = box.max.y - box.min.y;
        console.log(mWidth);
        model.height = mHeight;
        model.rotateY(Math.PI);
        model.position.set(distance, mHeight/2, 0);
        distance += mWidth;
        group.add(model);
        // 将group里的所有子Mesh都添加到clickMeshs，射线判定只能以mesh为单位
        if ( model.children && model.children.length ){
            model.children.forEach(mesh=>{
                clickMeshs.push(mesh);
            })
        }
    });
    // 添加3台变压器
    let groupBox = new THREE.Box3();
    groupBox.expandByObject(group);
    let containerWidth = groupBox.max.x - groupBox.min.x;
    modelList.filter(i=>i.type === 'transformer').forEach((item,index)=>{
        let model = cacheModels[item.path].clone();
        model.name = item.name;
        model.mach_id = item.mach_id;
        // 获取每个模型的空间大小
        let box = new THREE.Box3();
        box.expandByObject(model);
        // console.log(box);
        var mWidth = box.max.x - box.min.x;
        var mDeep = box.max.z - box.min.z;
        var mHeight = box.max.y - box.min.y;
        model.height = mHeight;
        model.rotateY(Math.PI);
        model.position.set( ( index + 1)/4 * containerWidth , mHeight/2, mDeep + mDeep / 2);
        group.add(model);
        if ( model.children && model.children.length ){
            model.children.forEach(mesh=>{
                clickMeshs.push(mesh);
            })
        }
    })
}
