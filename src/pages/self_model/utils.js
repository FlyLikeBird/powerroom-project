import * as THREE from 'three';
export function combineMesh(){
    originModel.children.forEach(mesh=>{
        posLen += mesh.geometry.attributes.position.array.length;
        normalLen += mesh.geometry.attributes.normal.array.length;
        uvLen += mesh.geometry.attributes.uv.array.length;
    })
    let sumPosArr = new Float32Array(posLen);
    let sumNormalArr = new Float32Array(normalLen);
    let sumUVArr = new Float32Array(uvLen);
    originModel.children.forEach(mesh=>{
        let posArr = mesh.geometry.attributes.position.array;
        let normalArr = mesh.geometry.attributes.normal.array;
        let uvArr = mesh.geometry.attributes.uv.array;
        for(let i=0;i<posArr.length;i++){
            sumPosArr[i+posIndex] = posArr[i];
        }
        posIndex += posArr.length;
        for(let i=0;i<normalArr.length;i++){
            sumNormalArr[i+normalIndex] = normalArr[i];
        }
        normalIndex += normalArr.length;
        for(let i=0;i<uvArr.length;i++){
            sumUVArr[i+uvIndex] = uvArr[i];
        }
        uvIndex += uvArr.length;
    });
    geometry.addAttribute('position', new THREE.BufferAttribute(sumPosArr,3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(sumNormalArr, 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(sumUVArr,3));
    let mtl = new THREE.MeshBasicMaterial({ color:0x0000ff });
    mesh = new THREE.Mesh(geometry, mtl);
    console.log(mesh);
}

export function createTube(curve, color = 'green', repeatX = 5){
    var group = new THREE.Group();
    var outerGeometry = new THREE.TubeGeometry(curve, 300, 4, 50, false);
    var outerTexture = new THREE.MeshLambertMaterial({
        color:0xf2f2f2,
        transparent:true,
        opacity:0.6,
        depthWrite: false,
        side:THREE.DoubleSide
    });
    var outerMesh = new THREE.Mesh(outerGeometry, outerTexture);
    outerMesh.castShadow = true;
    group.add(outerMesh);
    var tubeGeometry = new THREE.TubeGeometry(curve, 300, 2, 50, false);
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(`/textures/${ color === 'green' ? 'green_flow' : 'blue_flow'}.png`);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, 1);
    var tubeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side:THREE.DoubleSide,
    });
    let tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    group.add(tubeMesh);
    return { tube:group, texture };
}

let roundCap = 4;
let meshDis = 20;
let rowDis = 60;
let tubeLength = 30;

export function createCurveTube(startVector, endVector, direc = '+z', length, color, repeatX) {
    var curvePath = new THREE.CurvePath();
    let startX = startVector.x, startY = startVector.y;
    let endX = endVector.x;
    var a = new THREE.LineCurve3(startVector, new THREE.Vector3( startX, startY, direc === '+z' ? length - roundCap : length + roundCap ));
    var leftCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3( startX, startY, direc === '+z' ? length - roundCap : length + roundCap),
        new THREE.Vector3( startX, startY, length ),
        new THREE.Vector3( startX + roundCap, startY, length),
    );
    var b = new THREE.LineCurve3(new THREE.Vector3(startX+roundCap, startY, length), new THREE.Vector3(endX-roundCap, startY, length));
    var rightCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(endX - roundCap, startY, length),
        new THREE.Vector3(endX, startY, length),
        new THREE.Vector3(endX, startY, direc === '+z' ? length - roundCap : length + roundCap)
    );
    var c = new THREE.LineCurve3(new THREE.Vector3(endX, startY, direc === '+z' ? length - roundCap : length + roundCap), new THREE.Vector3(endX, 0, 0));
    curvePath.curves.push(a, leftCurve, b, rightCurve, c);
    // console.log(curvePath.curves);
    return createTube(curvePath, color, repeatX);
}

let modelList = [];
let row1 = [];
let row2 = [];
for(var i=0;i<10;i++){
    if ( i === 5 ){
        row1.push({ offset:0, type:'branch',  branchDis:2, name:`row1-设备${i}`});
    } else if ( i=== 7) {
        row1.push({ offset:0, type:'branch',  branchDis:0, name:`row1-设备${i}`});
    } else {
        row1.push({ offset:0, name:`row1-设备${i}`});
    }
}

for( var i=0;i<8;i++){
    if ( i === 5 ) {
        row2.push({ offset:1, name:`row2-设备${i}`});
    } else if ( i=== 6 ) {
        row2.push({ offset:1, name:`row2-设备${i}`});
    } else {
        row2.push({ offset:0, name:`row2-设备${i}`});
    }
}
modelList.push(row1);
modelList.push(row2);
export function layout(){
    // console.log(modelList);
    let group = new THREE.Group();
    let textures = [];
    var boxGeometry = new THREE.BoxGeometry(10,20,24);
    var boxMaterial = new THREE.MeshLambertMaterial({ color:0x96fcfe });
    let rowMin = 0, rowMax = 0;
    modelList.forEach((row,i)=>{
        let posX = 0;
        // 添加设备
        row.forEach((item,j)=>{
            posX += j === 0 ? 0 : item.offset * meshDis + meshDis;
            if ( j === 0 ) {
                rowMin = posX;
            }
            if ( j === row.length - 1){
                rowMax = posX;
            }
            var box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.castShadow = true;
            box.position.set(posX, 0, -i*rowDis);
            group.add(box);
            if ( i === 0 ) {
                if ( j === 0 || j === row.length - 1 ){
                    return ;
                } else {
                    // 添加绿色管道支路
                    let greenTubeCurve = new THREE.LineCurve3(new THREE.Vector3(posX, 0, 0), new THREE.Vector3(posX, 0, tubeLength));
                    let greenTubeMesh = createTube(greenTubeCurve, 'green');
                    group.add(greenTubeMesh.tube);
                    textures.push(greenTubeMesh.texture);
                    if ( item.type === 'branch' ) {
                        //  添加蓝色管道支路
                        if ( item.branchDis ){
                            let startVector = new THREE.Vector3(posX, 0, 0), endVector = new THREE.Vector3(posX + item.branchDis * meshDis, 0, 0);
                            let blueCurve = createCurveTube(startVector, endVector, '-z', -30, 'blue', 15);
                            group.add(blueCurve.tube); 
                            textures.push(blueCurve.texture);
                        }
                    } else {
                        let blueTubeCurve = new THREE.LineCurve3(new THREE.Vector3(posX, 0, 0), new THREE.Vector3(posX, 0, -100));
                        let blueTubeMesh = createTube(blueTubeCurve, 'blue');
                        group.add(blueTubeMesh.tube);
                        textures.push(blueTubeMesh.texture);
                    }
                    
                }
            }
            // 添加最外部绿色管道
        });
    });
    let startVector = new THREE.Vector3(0, 0, 0), endVector = new THREE.Vector3(rowMax, 0, 0);
    let curveTube1 = createCurveTube(startVector, endVector, '+z', tubeLength,  'green', 24);
    let curveTube2 = createCurveTube(startVector, endVector, '-z', -100, 'blue', 30);
    group.add(curveTube1.tube);
    group.add(curveTube2.tube);
    textures.push(curveTube1.texture);
    textures.push(curveTube2.texture);
    return { group, textures };
}