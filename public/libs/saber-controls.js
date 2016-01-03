/* Small modification of THREE.DeviceOrientationControls.js to support external orientation data passed in through SaberControls.update() */

/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 * @modded by Ajay Ramesh / http://ajayramesh.com
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

var SaberControls = function (object) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( "YXZ" );

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, -gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler );                               // orient the device

			quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

		}

	}();


	this.update = function (orientation) {

		var alpha  = orientation.a ? THREE.Math.degToRad(orientation.a) : 0; // Z
		var beta   = orientation.b ? THREE.Math.degToRad(orientation.b) : 0; // X'
		var gamma  = orientation.g ? THREE.Math.degToRad(orientation.g) : 0; // Y''
		var orient = orientation.o ? THREE.Math.degToRad(orientation.o) : 0; // O

		setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

	};

};