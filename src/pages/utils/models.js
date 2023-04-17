import * as THREE from 'three';

let infoWidth = 340, infoHeight = 160;
function updateTexture(name, ctx, data){
    ctx.clearRect(0, 0, infoWidth, infoHeight);
    ctx.fillStyle = 'rgba(28, 30, 32, 0.8)';
    ctx.fillRect(0, 10, infoWidth, infoHeight );
    ctx.fillStyle = 'rgba(18, 134, 221, 0.8)';
    ctx.fillRect(0, 0, infoWidth, 30);
    // ctx.strokeStyle = '#1286dd';
    // ctx.lineWidth = 2;
    // ctx.strokeRect(0, 0, infoWidth, infoHeight);
    // 标题下划线
    ctx.fillStyle = '#fff';
    ctx.font = "16px Arial"; //字体样式设置
    ctx.textBaseline = "top"; //文本与fillText定义的纵坐标
    ctx.textAlign = "left"; //文本居中(以fillText定义的横坐标)
    ctx.fillText(name, 10, 10);
        // 标记了的设备
    let infoData = [
        {title:'A相电流', value: data.I1 ? Math.round(data.I1) : '-- --', unit:'A'}, { title:'AB线电压', value: data.U12 ? Math.round(data.U12) : '-- --', unit:'V'},
        {title:'B相电流', value: data.I2 ? Math.round(data.I2) : '-- --', unit:'A'}, { title:'BC线电压', value: data.U23 ? Math.round(data.U23) : '-- --', unit:'V'},
        {title:'C相电流', value: data.I3 ? Math.round(data.I3) : '-- --', unit:'A'}, { title:'CA线电压', value: data.U31 ? Math.round(data.U31) : '-- --', unit:'V'},
    ];
    let rowIndex = 0;
    for(let i=0;i<infoData.length;i+=2){
        ctx.beginPath();  
        ctx.fillStyle = rowIndex === 0 ? '#eff400' : rowIndex === 1 ? '#00ff00' : '#fc2122';
        ctx.fillText(`${infoData[i].title} : ${infoData[i].value} ${infoData[i].unit}`, 10, 60 + 30 * rowIndex);
        ctx.fillText(`${infoData[i+1].title} : ${infoData[i+1].value} ${infoData[i+1].unit}`, 180, 60 + 30 * rowIndex);
        rowIndex++;
    }
}
function createCanvasTexture(name, data, ctx){
    // 生成canvas纹理
    var canvas = document.createElement("canvas");
    canvas.width = infoWidth;
    canvas.height = infoHeight;
    var ctx = canvas.getContext('2d');
    updateTexture(name, ctx, data);    
    return new THREE.CanvasTexture(canvas);    
}

// 创建信息窗口
export function createSprite(model, data){
    let box = new THREE.Box3();
    box.expandByObject(model);
    let width = box.max.x - box.min.x;
    let height = box.max.y - box.min.y;
    let deep = box.max.z - box.min.z;
    let x = box.min.x + width/2;
    let y = box.min.y + height;
    let z = box.min.z + deep/2;
    let planeGeometry = new THREE.PlaneGeometry(infoWidth, infoHeight);
    let spriteMtl = new THREE.SpriteMaterial({
        map:createCanvasTexture(model.name, data)
    })
    let sprite = new THREE.Sprite(spriteMtl);
    sprite.geometry = planeGeometry;
    sprite.position.set(x, y + 200, z);
    return sprite;
}
// 更新Sprite的材质
export function updateSprite(model, data){
    let mtl = model.material.map ;
    let ctx = mtl.image.getContext('2d');
    updateTexture(model.name, ctx, data );
    mtl.needsUpdate = true;
}
// 创建地面模型
export function createGroundMesh(width, height){    
    var geometry = new THREE.BoxGeometry( width, 5, height );
    var material = new THREE.MeshPhysicalMaterial({
        transparent:true,
        opacity:0.8,
        // color:0xccdde8,
        color:0x1a73b6,
        metalness:1,
        roughness:1
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
}