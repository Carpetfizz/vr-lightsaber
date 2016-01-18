function Hand(camera){
	/* HAND */
	var handGeometry = new THREE.SphereGeometry(1, 32, 32 );
	var handMaterial = new THREE.MeshBasicMaterial({color: "#eac086"});
	hand = new THREE.Mesh(handGeometry, handMaterial);
	hand.position.set(15, 6, camera.position.z / 2);
	return hand;
}

module.exports = Hand;