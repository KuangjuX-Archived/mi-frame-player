<template>
  <div style="height: 500px; background-color: #000" id="container"></div>
</template>

<script>
import * as THREE from "three";
import { toRaw, onMounted } from "vue";
import { getCloudData } from "../../utils/index.js";
// 这两个变量需要声明成全局变量
let scene, fireflies;
let mouseX = 0,
  mouseY = 0;
export default {
  props: {
    counter: Number,
  },
  setup(props, context) {
    // 点云数据
    let cloud_data = new Array();
    // 使用 three.js 所需要的变量
    let camera;
    let renderer;

    // 按帧数绘制点云
    const pointsGenerator = (frame) => {
      const geometry = new THREE.BufferGeometry();
      const point_array = new Array();
      const point_cloud = toRaw(cloud_data);
      const points = point_cloud[frame];
      for (let i = 0; i < points.length / 3; i++) {
        let pX = points[3 * i];
        let pY = points[3 * i + 1];
        let pZ = points[3 * i + 2];
        let vector = new THREE.Vector3(pX, pY, pZ);
        point_array.push(vector);
      }
      geometry.setFromPoints(point_array);
      return geometry;
    };

    const onPointMove = (event) => {
      if (event.isPrimary === false) return;
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    const render = () => {
      const time = Date.now() * 0.00005;
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      for (let i = 0; i < scene.children.length; i++) {
        const object = scene.children[i];
        if (object instanceof THREE.Points) {
          object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
        }
      }
      renderer.render(scene, camera);
    };

    const pointInit = () => {
      let container = document.getElementById("container");
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);
      camera.position.set(0, 0, 60);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      scene.add(camera);
      let points = pointsGenerator(0);
      points.attributes.position.needsUpdate = true;
      let material = new THREE.PointsMaterial({ size: 0.1 });
      fireflies = new THREE.Points(points, material);
      scene.add(fireflies);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      // container.addEventListener( 'pointermove', onPointerMove );
    };

    const pointAnimate = () => {
      requestAnimationFrame(pointAnimate);
      // 将点坐标修改为该帧点坐标
      let points = pointsGenerator(props.counter);
      fireflies.geometry = points;
      // render()
      renderer.render(scene, camera);
    };

    onMounted(async () => {
      // 获取所有点云数据
      await getCloudData(107, cloud_data);
      // 渲染点云
      pointInit();
      pointAnimate();
    });

    return { cloud_data, camera, renderer };
  },
};
</script>
