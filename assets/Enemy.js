function Enemy(){
	var enemyGeometry = new THREE.SphereGeometry(2, 40, 40);
	var enemyMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.75, color: "red"});

	var enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);

	return enemy;
}

module.exports = Enemy;