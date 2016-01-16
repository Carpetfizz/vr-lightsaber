function Lightsaber(){
	/* LIGHTSABER MODEL */
	var lsGeometry = new THREE.CylinderGeometry(0.4, 0.04, 30, 20);
	var lsMaterial = new THREE.MeshBasicMaterial({ color: "white" });
	lightsaber = new THREE.Mesh( lsGeometry, lsMaterial );
	lightsaber.position.setY(15);

	var glowGeometry = new THREE.CylinderGeometry(0.5, 0.5, 30, 20);
	var glowMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.5, color: "#00FFFF" });
	var glow = new THREE.Mesh(glowGeometry, glowMaterial);

	lightsaber.add(glow);

	return lightsaber;
}

module.exports = Lightsaber;