/**
	Load and add some random-placed trees to a scene. 
	Objects' references are also copied to an array for later access.
	
	@param
		numTrees	number of trees to be placed.
		trees		array that will store the THREE.Object3D meshes.
		scene		the THREE.Scene.
		
	NOTE: Tree model must be in Wavefront OBJ/MTL format.
*/
function loadTrees(numTrees, trees, scene)
{
	// Load materials
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('models/tree/');
	mtlLoader.load('tree.mtl', function (materials) 
	{
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('models/tree/');
		
		// Load geometries
		objLoader.load('tree.obj', function (object) 
		{
			object.scale.set(10, 10, 10);
			for(var i = 0; i < numTrees; i++)
			{
				var obj = object.clone();
							
				// Randomize tree placement
				var s1 = 1, s2 = 1;
				if(Math.random() < 0.5)
					s1 = -1;
				if(Math.random() < 0.5)
					s2 = -1;
						
				var treeX = Math.random() * blockSize * 3 * s1;
				var treeZ = Math.random() * blockSize * 3 * s2;
						
				obj.position.set(treeX, getTilePointHeight(treeX, treeZ), treeZ);
				obj.traverse(function (child)
				{            
					if(child instanceof THREE.Mesh)
						child.castShadow = true;
				});
				obj.castShadow = true;
				obj.receiveShadow = true;
							
				// Add to the scene and to the tree array
				trees.push(obj);
				scene.add(obj);
			}
		});
	});
}

/**
	Load and add some random-placed yurts to a scene. 
	Objects' references are also copied to an array for later access.
	
	@param
		numYurts	number of yurts to be placed.
		yurts		array that will store the THREE.Object3D meshes.
		scene		the THREE.Scene.
		
	NOTE: Yurt model must be in Wavefront OBJ/MTL format.
*/
function loadYurts(numYurts, yurts, scene)
{
	// Load materials
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('models/yurt/');
	mtlLoader.load('yurt.mtl', function (materials) 
	{
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('models/yurt/');
		
		// Load geometries
		objLoader.load('yurt.obj', function (object) 
		{
			object.scale.set(250, 250, 250);
			for(var i = 0; i < numYurts; i++)
			{
				var obj = object.clone();
					
				// Randomize yurt placement
				var s1 = 1, s2 = 1;
				if(Math.random() < 0.5)
					s1 = -1;
				if(Math.random() < 0.5)
					s2 = -1;
						
				var treeX = Math.random() * blockSize * 2 * s1;
				var treeZ = Math.random() * blockSize * 2 * s2;
						
				// Get the mean value of Y on a 3x3 grid of side 100. The yurt has a large 
				// basement and this help to smooth the tile roughness when positioning
				var meanY = 0;
				for(var a = -1; a < 2; a++)
				{
					for(var b = -1; b < 2; b++)
						meanY += getTilePointHeight(treeX + a * 100, treeZ + b * 100);
				}
				meanY /= 9;
						
				obj.position.set(treeX, meanY + 80, treeZ);
				obj.traverse(function (child) 
				{                 
					if(child instanceof THREE.Mesh)
						child.castShadow = true;
				});
				obj.castShadow = true;
				obj.receiveShadow = true;
					
				// Add to the scene and to the yurt array					
				yurts.push(obj);
				scene.add(obj);
			}
		});
	});
}