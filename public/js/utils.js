function Utils(){
	this.raycaster = new THREE.Raycaster();
	this.collidableMeshList = [];
	this.collidedMeshes = [];
}

Utils.prototype.getRandomInRange = function(min, max){
	/*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random*/
	return Math.random() * (max - min) + min;
}

Utils.prototype.playFile = function(directory, file){
	/* http://theforce.net/fanfilms/postproduction/soundfx/saberfx_fergo.asp */
	var audio = new Audio(directory+file);
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
	    			collidedMeshes.push(result.uuid);
	    		}
	    		cb(result);
	    	}
	    }
	}
}

var u = new Utils();

module.exports = u;