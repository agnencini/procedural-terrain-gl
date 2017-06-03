/**
	Create 16 seamless ground tiles. 
	Tiles are added to the scene and stored in an array for later access.
*/
function createTiles()
{
	heightMap = generateHeightMap();
	var meshNorm = createTerrainMesh(heightMap);
				
	copy = heightMap.slice();
	var d1 = flip1(copy, blockDensity);
	var meshFlip1 = createTerrainMesh(d1);
				
	copy = heightMap.slice();
	var d2 = flip2(copy, blockDensity);
	var meshFlip2 = createTerrainMesh(d2);				
				
	copy = heightMap.slice();
	var d3 = copy.reverse();
	var meshInv = createTerrainMesh(d3);

	var mesh00 = meshNorm.clone();
	mesh00.position.set(-2 * blockSize, 0, -2 * blockSize);
	scene.add(mesh00);
	grid.push(mesh00);

	var mesh01 = meshFlip2.clone();
	mesh01.position.set(-1 * blockSize, 0, -2 * blockSize);
	scene.add(mesh01);
	grid.push(mesh01);

	var mesh02 = meshNorm.clone();
	mesh02.position.set(0 * blockSize, 0, -2 * blockSize);
	scene.add(mesh02);
	grid.push(mesh02);

	var mesh03 = meshFlip2.clone();
	mesh03.position.set(blockSize, 0, -2 * blockSize);
	scene.add(mesh03);
	grid.push(mesh03);

	var mesh04 = meshFlip1.clone();
	mesh04.position.set(-2 * blockSize,0, -1 * blockSize);
	scene.add(mesh04);
	grid.push(mesh04);

	var mesh05 = meshInv.clone();
	mesh05.position.set(-1 * blockSize, 0, -1 * blockSize);
	scene.add(mesh05);
	grid.push(mesh05);	

	var mesh06 = meshFlip1.clone();
	mesh06.position.set(0 * blockSize, 0, -1 * blockSize);
	scene.add(mesh06);
	grid.push(mesh06);

	var mesh07 = meshInv.clone();
	mesh07.position.set(1 * blockSize, 0, -1 * blockSize);
	scene.add(mesh07);
	grid.push(mesh07);	

	var mesh08 = meshNorm.clone();
	mesh08.position.set(-2 * blockSize, 0, 0 * blockSize);
	scene.add(mesh08);
	grid.push(mesh08);

	var mesh09 = meshFlip2.clone();
	mesh09.position.set(-1 * blockSize, 0, 0 * blockSize);
	scene.add(mesh09);
	grid.push(mesh09);

	var mesh10 = meshNorm.clone();
	mesh10.position.set(0 * blockSize, 0, 0 * blockSize);
	scene.add(mesh10);
	grid.push(mesh10);	

	var mesh11 = meshFlip2.clone();
	mesh11.position.set(1 * blockSize, 0, 0 * blockSize);
	scene.add(mesh11);
	grid.push(mesh11);
				
	var mesh12 = meshFlip1.clone();
	mesh12.position.set(-2 * blockSize, 0, 1 * blockSize);
	scene.add(mesh12);
	grid.push(mesh12);	

	var mesh13 = meshInv.clone();
	mesh13.position.set(-1 * blockSize, 0, 1 * blockSize);
	scene.add(mesh13);
	grid.push(mesh13);

	var mesh14 = meshFlip1.clone();
	mesh14.position.set(0 * blockSize, 0, 1 * blockSize);
	scene.add(mesh14);
	grid.push(mesh14);

	var mesh15 = meshInv.clone();
	mesh15.position.set(1 * blockSize, 0, 1 * blockSize);
	scene.add(mesh15);
	grid.push(mesh15);
}

/**
	Generate a heightmap for a plane geometry with Simplex noise.
	Height data are stored in an array of length (blockDensity x blockDensity).
	
	@return	a coherent-noise height map.
*/
function generateHeightMap() 
{
	var size = blockDensity * blockDensity, data = new Uint8Array(size), quality = 1, z = Math.random() * 100;
	noise.seed(Math.random());
			
	for(var j = 0; j < 4; j ++) 
	{
		for(var i = 0; i < size; i++) 
		{
			var x = i % blockDensity, y = ~~(i / blockDensity);
			data[i] += Math.abs(noise.simplex2(x / quality, y / quality, z) * quality * 1.75) * heightMultiplier;
		}
		quality *= 5;
	}
	return data;
}
			
/**
	Create a complete terrain tile mesh.
	Terrain geometry is handled by a THREE.PlaneBufferGeometry object, then are 
	added a ground texture and a bump map to enhance terrain detail without 
	increasing the number of vertices.
	
	@param
		data	the height map that stores the Y coordinates of the vertices.

	@return	a terrain tile mesh.
*/
function createTerrainMesh(data)
{
	var geometry = new THREE.PlaneBufferGeometry(blockSize, blockSize, blockDensity - 1, blockDensity - 1);
	geometry.rotateX(-Math.PI / 2);
				
	var vertices = geometry.attributes.position.array;
	for(var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) 
		vertices[j + 1] = data[i];
				
	var texture = new THREE.TextureLoader().load(groundTexture, function (texture)
	{
		texture.anisotropy = 4;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
	});
				
	// Loading bump map
	var bump = new THREE.TextureLoader().load(groundBump, function (texture)
	{
		texture.anisotropy = 4;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
	});
			
	var material = new THREE.MeshPhongMaterial( {map : texture, side : THREE.DoubleSide, bumpMap : bump} );
	material.map.repeat.set(1, 1);
				
	var terrain = new THREE.Mesh(geometry, material);
	terrain.receiveShadow = true; 
	terrain.castShadow = false;
				
	return terrain;
}

/**
	Flip a height map along X axis.
	
	@param
		heightMap	a height map.
	
	@return	the flipped mesh.
*/
function flip1(heightMap)
{
	var c = heightMap.slice();
	var rev = c.reverse();
	var flipped = new Uint8Array(blockDensity * blockDensity);
				
	for(var i = 0; i < blockDensity; i++)
	{
		var tmp = rev.slice(i * blockDensity, i * blockDensity + blockDensity);
		var tmp2 = tmp.reverse();
		flipped.set(tmp2, i * blockDensity);
	}
	return flipped;
}
				
/**
	Flip a height map along Z axis.
	
	@param
		heightMap	a height map.
	
	@return	the flipped mesh.
*/
function flip2(heightMap)
{
	var copy = heightMap;
	var flipped = new Uint8Array(blockDensity * blockDensity);
				
	for(var i = 0; i < blockDensity; i++)
	{
		var tmp = copy.slice(i * blockDensity, i * blockDensity + blockDensity);
		var tmp2 = tmp.reverse();
		flipped.set(tmp2, i * blockDensity);
	}
	return flipped;
}