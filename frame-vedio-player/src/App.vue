<template>
  <div>
    <el-container>
      <el-main>
        <el-row :gutter="10">
          <el-col :span="12">
            <PointCloud :counter="counter"></PointCloud>
          </el-col>
          <el-col :span="12">
            <div>
              <FrameVedioPlayer :counter="counter"></FrameVedioPlayer>
            </div>
          </el-col>
        </el-row>
        <ProgressBar
          :frame_num="frame_num"
          :counter="counter"
          @emitSpeed="onSpeedChange"
        ></ProgressBar>
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
</style>

<script>
import FrameVedioPlayer from "./components/FrameVedioPlayer/index.vue";
import ProgressBar from "./components/ProgressBar/index.vue";
import PointCloud from "./components/PointCloud/index.vue";
export default {
  components: { FrameVedioPlayer, ProgressBar, PointCloud },
  data() {
    return {
      // 帧数
      frame_num: 108,
      times: null,
      counter: 0,
      speed: 1,
    };
  },

  watch: {
    speed(value) {
      clearInterval(this.timer);
      let internal = 1000 / value;
      this.timer = setInterval(() => {
        this.counter = (this.counter + 1) % this.frame_num;
      }, internal);
    },
  },

  methods: {
    onSpeedChange(speed) {
      console.log("onSpeedChange", speed);
      this.speed = speed;
      console.log("this speed", this.speed);
    },
  },

  async mounted() {
    // 图片按 100ms 每帧播放
    let internal = 1000 / this.speed;
    this.timer = setInterval(() => {
      this.counter = (this.counter + 1) % this.frame_num;
    }, internal);
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>
