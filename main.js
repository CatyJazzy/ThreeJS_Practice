import * as THREE from "three";

class BasicWorldDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    /* three.js 기본 param들 설정 */
    this._threejs = new THREE.WebGLRenderer();
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._thireejs.domElement);

    window.addEventListener(
      "resize",
      () => {
        this._OnWindowReSize();
      },
      false
    );

    /* 카메라 정의 정보 */
    const fov = 60; // 시야각
    const aspect = window.innerWidth / window.innerHeight; // 종횡비
    const near = 1.0;
    const far = 1000.0;
    // 카메라 설정
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, fear);
    this._camera.position.set(75, 20, 0);

    /* Scene 설정 */
    this._scene = new THREE.Scene();

    /* 조명 설정 */
    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true; // 동적 그림자 생성
    light.shadow.bias = -0.01;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 1.0;
    light.shadow.camera.far = 500;
    light.shadow.camera.left = 200;
    light.shadow.camera.right = -200;
    light.shadow.camera.top = 200;
    light.shadow.camera.bottom = -200;
    this._scene.add(light);

    light = new THREE.AmbientLight(0x404040);
    this._scene.add(light);

    this._RAF();
  }
}
