import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js";
class BasicWorldDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    /* three.js 기본 param들 설정 */
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    // 화면 사이즈 변경될 때 업데이트
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
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    /* Scene 설정 */
    this._scene = new THREE.Scene();

    /* 조명 설정 */
    let light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true; // 동적 그림자 생성
    light.shadow.bias = -0.002;
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

    /* 큐브맵(배경) 생성 */
    const controls = new OrbitControls(this._camera, this._threejs.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "./resources/posx.jpg",
      "./resources/negx.jpg",
      "./resources/posy.jpg",
      "./resources/negy.jpg",
      "./resources/posz.jpg",
      "./resources/negz.jpg",
    ]);
    this._scene.background = texture;

    /* 평면 생성 */
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    // 3D모델 로드
    // this._LoadModel();

    this._LoadAnimatedModel();
    // 렌더링 (계속 재귀호출)
    this._RAF();
  }

  _LoadAnimatedModel() {
    this._mixers = [];
    // 3d 모델 로드
    const loader = new FBXLoader();
    loader.setPath("./resources/man/");
    loader.load("Ch01_nonPBR.fbx", (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse((c) => {
        c.castShadow = true;
      });

      // 애니메이션 입힘
      const anim = new FBXLoader();
      anim.setPath("./resources/man/");
      anim.load("Dancing.fbx", (anim) => {
        this._mixer = new THREE.AnimationMixer(fbx);
        this._mixers.push(this._mixer);
        const idle = this._mixer.clipAction(anim.animations[0]);
        idle.play();
      });
      this._scene.add(fbx);
    });
  }

  /* 3D모델 로더 */
  _LoadModel() {
    const loader = new GLTFLoader();
    loader.load("./resources/basketball/white_basketball.gltf", (gltf) => {
      gltf.scene.traverse((c) => {
        c.castShadow = true;
      });
      this._scene.add(gltf.scene);
    });
  }

  _OnWindowReSize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }
  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map((m) => m.update(timeElapsedS));
    }
  }
}

let _APP = null;
window.addEventListener("DOMContentLoaded", () => {
  _APP = new BasicWorldDemo();
});
