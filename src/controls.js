import * as THREE from 'three';

export default class Controls {
  constructor(camera, initialPosition = [0, 0, 0], speed = 1) {
    this.camera = camera;
    this.speed = speed;
    this.initialPosition = initialPosition;

    this.enabled = false;

    camera.rotation.set(0, 0, 0);

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(this.camera);

    this.yawObject = new THREE.Object3D();
    this.yawObject.position.set(...this.initialPosition);
    this.yawObject.add(this.pitchObject);

    this.velocity = new THREE.Vector3();
    this.moveDirections = {};

    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('keyup', this.handleKeyup);

    this.time = window.performance.now();
  }

  handleKeydown = event => {
    switch (event.key) {
      case 'Shift': {
        this.enabled = true;
        return;
      }
      case 'W':
      case 'ArrowUp':
        if (this.enabled) {
          this.moveDirections.forwards = true;
        }
        return;
      case 'A':
      case 'ArrowLeft':
        if (this.enabled) {
          this.moveDirections.left = true;
        }
        return;
      case 'S':
      case 'ArrowDown':
        if (this.enabled) {
          this.moveDirections.backwards = true;
        }
        return;
      case 'D':
      case 'ArrowRight':
        if (this.enabled) {
          this.moveDirections.right = true;
        }
        return;
      case 'R':
        if (this.enabled) {
          this.moveDirections.up = true;
        }
        return;
      case 'F':
        if (this.enabled) {
          this.moveDirections.down = true;
        }
        return;

      case 'Backspace':
        this.moveDirections.forwards = false;
        this.moveDirections.backwards = false;
        this.moveDirections.left = false;
        this.moveDirections.right = false;
        this.moveDirections.up = false;
        this.moveDirections.down = false;

        this.velocity.x = 0;
        this.velocity.y = 0;
        this.velocity.z = 0;

        this.yawObject.position.set(...this.initialPosition);
        this.yawObject.rotation.y = 0;
        this.pitchObject.rotation.x = 0;

        return;

      default:
        return;
    }
  };

  handleKeyup = event => {
    switch (event.key) {
      case 'Shift': {
        this.enabled = false;
        this.moveDirections.forwards = false;
        this.moveDirections.left = false;
        this.moveDirections.backwards = false;
        this.moveDirections.right = false;
        this.moveDirections.up = false;
        this.moveDirections.down = false;
        return;
      }
      case 'W':
      case 'ArrowUp':
        this.moveDirections.forwards = false;
        break;
      case 'A':
      case 'ArrowLeft':
        this.moveDirections.left = false;
        break;
      case 'S':
      case 'ArrowDown':
        this.moveDirections.backwards = false;
        break;
      case 'D':
      case 'ArrowRight':
        this.moveDirections.right = false;
        break;
      case 'R':
        this.moveDirections.up = false;
        return;
      case 'F':
        this.moveDirections.down = false;
        return;

      default:
        return;
    }
  };

  handleMouseMove = event => {
    if (!this.enabled) {
      return;
    }

    const movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    this.pitchObject.rotation.x -= movementY * 0.004;
    this.yawObject.rotation.y -= movementX * 0.004;
  };

  getObject = () => {
    return this.yawObject;
  };

  update = () => {
    // Call me on every render loop!
    const currentTime = performance.now();
    const delta = (currentTime - this.time) / 1000;

    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.y -= this.velocity.y * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    const SPEED_MULTIPLIER = 200;
    const distance = SPEED_MULTIPLIER * this.speed * delta;

    if (this.moveDirections.forwards) {
      this.velocity.z -= distance;
      // Even though this is rotation.x, it affects our Y angle (:/)
      const pitchAngle = this.pitchObject.rotation.x;
      const verticalDistance = Math.tan(pitchAngle) * distance;
      this.velocity.y += verticalDistance;
    }
    if (this.moveDirections.backwards) {
      this.velocity.z += distance;
      const pitchAngle = this.pitchObject.rotation.x;
      const verticalDistance = Math.tan(pitchAngle) * distance;
      this.velocity.y -= verticalDistance;
    }
    if (this.moveDirections.left) {
      this.velocity.x -= distance;
    }
    if (this.moveDirections.right) {
      this.velocity.x += distance;
    }
    if (this.moveDirections.down) {
      this.velocity.y -= distance;
    }
    if (this.moveDirections.up) {
      this.velocity.y += distance;
    }

    const controlContainer = this.getObject();
    controlContainer.translateX(this.velocity.x * delta);
    controlContainer.translateY(this.velocity.y * delta);
    controlContainer.translateZ(this.velocity.z * delta);

    this.time = currentTime;
  };
}
