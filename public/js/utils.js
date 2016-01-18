function Utils(){
	this.raycaster = new THREE.Raycaster();
	this.collidableMeshList = []; // All meshes raycaster cares about
	this.collidedMeshes = []; // UUIDs of meshes that have already been collided with
}

Utils.prototype.getRandomInRange = function(min, max){
	/*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random*/
	return Math.random() * (max - min) + min;
}

Utils.prototype.playAudio = function(audio){
	audio.play();
}

Utils.prototype.checkCollision = function(object, targetName, once, cb){
	/*
		Raycaster.
		Iterate through all vertices of an object. Cast a ray from its center to the outside.
		Ray will pick up all of its intersecting objects in raycaster.intersectObjects
		Check if the object picked up is the one we want, "targetName"
		FOR THIS PROJECT: We don't want to multi-count targets that may still be touching, so their UUIDs are cached and checked against
	*/

	if(!once){
		once = false;
	}

	for (var vertexIndex = 0; vertexIndex < object.geometry.vertices.length; vertexIndex++)
	{       
	    var localVertex = object.geometry.vertices[vertexIndex].clone();
	    var globalVertex = localVertex.applyMatrix4(object.matrixWorld)
	    var directionVector = globalVertex.sub( object.position );

	    this.raycaster.set( object.position, directionVector.clone().normalize() );
	    
	    var collisionResults = this.raycaster.intersectObjects( this.collidableMeshList );
	    
	    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
	    {
	    	var result = collisionResults[0].object;

	    	if(result.name==targetName){
	    		
	    		if(once){
	    			for(var i=0; i< this.collidedMeshes.length; i++){
		    			var uuid = this.collidedMeshes[i];
		    			if(result.uuid==uuid){
		    				return;
		    			}
	    			}
	    			
	    			this.collidedMeshes.push(result.uuid);
	    		}
	    		cb(result);
	    	}
	    }
	}
}

Utils.prototype.cameraLookDir =  function(camera) {
	/* http://stackoverflow.com/a/17286752/896112 */
    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyEuler(camera.rotation, camera.rotation.order);
    return vector;
}

Utils.prototype.debugAxes = function(axisLength, scene){
    //Shorten the vertex function
    function v(x,y,z){ 
            return new THREE.Vector3(x,y,z); 
    }
    
    //Create axis (point1, point2, colour)
    function createAxis(p1, p2, color){
            var line, lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});
            lineGeometry.vertices.push(p1, p2);
            line = new THREE.Line(lineGeometry, lineMat);
            scene.add(line);
    }
    
    createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000);
    createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00);
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
};

var u = new Utils();

module.exports = u;