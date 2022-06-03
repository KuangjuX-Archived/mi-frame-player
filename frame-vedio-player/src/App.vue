<template>
    <div>
      <el-container>
      <el-main>
        <el-row :gutter="10">
          <el-col :span="12">
            <div style="height: 500px; background-color: #000;" id="container">
            </div>
            </el-col>
          <el-col :span="12">
            <div>
              <el-image :src= "`${encode_images[counter]}`" />
            </div>
          </el-col>
        </el-row>
        <div class="select">
          <el-row :gutter="20">
            <el-col :span = "4" style="margin-top: 15px;">
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
            <el-col :span = "20">
              <div class="slider-demo-block">
                <span span class="demonstration">视频播放帧数</span>
                <el-slider v-model="counter" :max="encode_images.length"/>
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
  margin-top: 6
  0px;
}

.select {
  margin-top: 20px;
  margin-left: 15%;
  margin-right: 15%;
}
</style>

<script>
import * as Three from 'three'
import { fetchCloudData, getImageToBase64, genName, getCloudData } from './utils/index.js'

// 这两个变量需要声明成全局变量
let scene, mesh;
export default {
  data() {
        return {
            // 电云数据
            cloud_data: [],
            // 使用 base64 编码后的图片
            encode_images: [],
            image_names: [],
            // frames: ["0000000000", "0000000001", "0000000002", "0000000003"],
            times: null,
            counter: 0,
            // 使用 three.js 所需要的变量
            camera: null,
            renderer: null,

            // 复选框
            options : [
              {
                value: 1,
                label: '1x',
              },
              {
                value: 2,
                label: '2x',
              },
              {
                value: 4,
                label: '4x',
              },
          ],
          speed: 0
        }
    },


    methods: {
        checkUrl() {
            console.log(this.counter)
        },

        init() {
            let container = document.getElementById('container');

            this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
            this.camera.position.z = 1;

            scene = new Three.Scene();

            let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
            let material = new Three.MeshNormalMaterial();

            mesh = new Three.Mesh(geometry, material);
            scene.add(mesh);

            this.renderer = new Three.WebGLRenderer({antialias: true});
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(this.renderer.domElement);
        },

        animate() {
          requestAnimationFrame(this.animate)

          mesh.rotation.x += 0.01
          mesh.rotation.y += 0.01

          this.renderer.render(scene, this.camera)
        }
    },

    mounted() {
        // 获取所有电云数据
        getCloudData(107, this.cloud_data)
        console.log("点云数据", this.cloud_data)

        // 生成所有图片的名称
        genName(107, this.image_names)
        // 将所有帧图片转化为 base64 编码
        for(let i in this.image_names) {
          getImageToBase64('/data/image_00/data/' + this.image_names[i] + '.png', this.encode_images, i)
        }

        // 图片按 100ms 每帧播放
        this.timer = setInterval(() => {
            this.counter = (this.counter + 1) % this.image_names.length
        }, 100)

        // 渲染电云
        this.init()
        this.animate()
    },

    beforeDestroy(){
        clearInterval(this.timer)
        this.timer = null;
    }
}

</script>
