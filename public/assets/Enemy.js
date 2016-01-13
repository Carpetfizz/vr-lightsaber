function Enemy(){
	var enemyGeometry = new THREE.SphereGeometry(2, 32, 32);
	var enemyMaterial = new THREE.MeshBasicMaterial({color: "red"});
	enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
	return enemy;
}

module.exports = Enemy;