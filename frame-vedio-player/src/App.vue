<template>
  <div>
    <el-container>
      <el-main>
        <el-row :gutter="10">
          <el-col :span="12">
            <div style="height: 500px; background-color: #000" id="container"></div>
          </el-col>
          <el-col :span="12">
            <div>
              <!-- <el-image :src= "`${encode_images[counter]}`" /> -->
              <FrameVedioPlayer :counter="counter"></FrameVedioPlayer>
            </div>
          </el-col>
        </el-row>
        <div class="select">
          <el-row :gutter="20">
            <el-col :span="4" style="margin-top: 15px">
              <el-select
                v-model="speed"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="视频帧播放速度"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="20">
              <div class="slider-demo-block">
                <span span class="demonstration">视频播放帧数</span>
                <el-slider v-model="counter" :max="encode_images.length" />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 6 0px;
}

.select {
  margin-top: 20px;
  margin-left: 15%;
  margin-right: 15%;
}
</style>

<script>
import * as THREE from "three";
import { toRaw } from "vue";
import { getImageToBase64, genName, getCloudData } from "./utils/index.js";
import FrameVedioPlayer from "./components/FrameVedioPlayer/index.vue";
// 这两个变量需要声明成全局变量
let scene, fireflies;
let mouseX = 0,
  mouseY = 0;
export default {
  components: { FrameVedioPlayer },
  data() {
    return {
      // 点云数据
      cloud_data: new Array(),
      // 使用 base64 编码后的图片
      encode_images: new Array(),
      image_names: new Array(),
      times: null,
      counter: 0,
      // 使用 three.js 所需要的变量
      camera: null,
      renderer: null,
      // 复选框
      options: [
        {
          value: 1,
          label: "1x",
        },
        {
          value: 2,
          label: "2x",
        },
        {
          value: 4,
          label: "4x",
        },
      ],
      speed: 0,
    };
  },
  methods: {
    // 按帧数绘制点云
    pointsGenerator(frame) {
      const geometry = new THREE.BufferGeometry();
      const point_array = new Array();
      const point_cloud = toRaw(this.cloud_data);
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
    },
    onPointMove(event) {
      if (event.isPrimary === false) return;
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    },
    render() {
      const time = Date.now() * 0.00005;
      this.camera.position.x += (mouseX - this.camera.position.x) * 0.05;
      this.camera.position.y += (-mouseY - this.camera.position.y) * 0.05;
      this.camera.lookAt(scene.position);
      for (let i = 0; i < scene.children.length; i++) {
        const object = scene.children[i];
        if (object instanceof THREE.Points) {
          object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
        }
      }
      this.renderer.render(scene, this.camera);
    },
    init() {
      let container = document.getElementById("container");
      scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight
      );
      this.camera.position.set(0, 0, 60);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      scene.add(this.camera);
      let points = this.pointsGenerator(0);
      points.attributes.position.needsUpdate = true;
      let material = new THREE.PointsMaterial({ size: 0.1 });
      fireflies = new THREE.Points(points, material);
      scene.add(fireflies);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
      // container.addEventListener( 'pointermove', this.onPointerMove );
    },
    animate() {
      requestAnimationFrame(this.animate);
      // 将点坐标修改为该帧点坐标
      let points = this.pointsGenerator(this.counter);
      fireflies.geometry = points;
      // this.render()
      this.renderer.render(scene, this.camera);
    },
  },
  async mounted() {
    // 获取所有电云数据
    await getCloudData(107, this.cloud_data);
    // 生成所有图片的名称
    genName(107, this.image_names);
    // 将所有帧图片转化为 base64 编码
    for (let i in this.image_names) {
      await getImageToBase64(
        "/data/image_00/data/" + this.image_names[i] + ".png",
        this.encode_images,
        i
      );
    }
    // 图片按 100ms 每帧播放
    this.timer = setInterval(() => {
      this.counter = (this.counter + 1) % this.image_names.length;
    }, 500);
    // 渲染点云
    this.init();
    this.animate();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>
