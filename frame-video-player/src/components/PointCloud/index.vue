<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, watch, ref } from "vue";
import { fetchPointCloud } from "../../utils/requests";
import { LRUMap } from "lru_map";
// 这两个变量需要声明成全局变量
let scene, fireflies;
let mouseX = 0,
  mouseY = 0;

const fps = 60;
let lastTime = 0;
export default {
  props: {
    frame_num: Number,
    counter: Number,
  },
  setup(props, context) {
    // 用于存储点云数据的 LRU
    let lru = new LRUMap(20);
    // 帧锁
    let frame_lock = ref(false);
    // 使用 three.js 所需要的变量
    let camera;
    let renderer;
    let controls;
    let moved = false;

    // 按帧数绘制点云
    const pointsGenerator = (frame) => {
      const points = lru.get(frame);
      const geometry = new THREE.BufferGeometry();
      const positions = new Array();
      const colors = new Array();
      if (points !== undefined) {
        for (let i = 0; i < points.length / 3; i++) {
          // 设置点坐标
          let pX = points[3 * i];
          let pY = points[3 * i + 1];
          let pZ = points[3 * i + 2];
          // let vector = new THREE.Vector3(pX, pY, pZ);
          positions.push(pX, pY, pZ);
          // 设置点颜色

          let vx = 0.0;
          let vy = 0.0;
          let vz = 1.0 - 1.0 / pZ;
          const color = new THREE.Color();
          color.setRGB(vx, vy, vz);
          colors.push(color.r, color.g, color.b);
          // console.log(color.r, color.g, color.b);
        }
        console.log(colors);
        // geometry.setFromPoints(point_array);
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      }
      return geometry;
    };

    // 监听 couter 用来获取点云数据
    watch(
      () => props.counter,
      async (value) => {
        for (let i = value; i < value + 10; i++) {
          if (!lru.get(i) && i < props.frame_num) {
            let data = await fetchPointCloud(i);
            lru.set(i, data);
          }
        }
        if (frame_lock.value) {
          frame_lock.value = false;
        }
      }
    );

    watch(frame_lock, (locked) => {
      context.emit("frameLock", locked);
    });

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

      // 生成点数据
      let points = pointsGenerator(0);
      points.attributes.position.needsUpdate = true;
      let material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
      });
      fireflies = new THREE.Points(points, material);
      scene.add(fireflies);

      // 设置 renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);

      // 设置控制器
      controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 50;
      controls.maxDistance = 200;
      controls.addEventListener("change", function () {
        moved = true;
      });

      container.appendChild(renderer.domElement);

      // container.addEventListener("pointermove", onPointMove);
    };

    const pointAnimate = () => {
      requestAnimationFrame(pointAnimate);
      if (frame_lock.value) {
        return;
      }
      // 将点坐标修改为该帧点坐标
      let points = pointsGenerator(props.counter);
      if (!points.attributes.hasOwnProperty("position")) {
        frame_lock.value = true;
        return;
      }
      // frame_lock.value = false;
      fireflies.geometry = points;
      // render()
      renderer.render(scene, camera);
    };

    onMounted(async () => {
      // 首先获取五帧的数据
      for (let i = 0; i < 5; i++) {
        let data = await fetchPointCloud(i);
        lru.set(i, data);
      }
      // 渲染点云
      pointInit();
      pointAnimate();
    });

    return { camera, renderer, controls, moved };
  },
};
</script>

<style lang="scss">
#container {
  height: 100%;
  background-color: #000;
}
</style>
