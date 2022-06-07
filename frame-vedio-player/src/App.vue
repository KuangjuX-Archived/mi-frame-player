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
              <FrameVedioPlayer
                :counter="counter"
                :frame_num="frame_num"
              ></FrameVedioPlayer>
            </div>
          </el-col>
        </el-row>
        <ProgressBar
          :frame_num="frame_num"
          :counter="counter"
          @emitSpeed="onSpeedChange"
          @emitFrame="onFrameChange"
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
import { onMounted, watch, ref } from "vue";
import FrameVedioPlayer from "./components/FrameVedioPlayer/index.vue";
import ProgressBar from "./components/ProgressBar/index.vue";
import PointCloud from "./components/PointCloud/index.vue";
export default {
  components: { FrameVedioPlayer, ProgressBar, PointCloud },
  setup(props) {
    const frame_num = ref(108);
    let timer = null;
    const counter = ref(0);
    const speed = ref(1);

    const onSpeedChange = (value) => {
      speed.value = value;
    };

    const onFrameChange = (value) => {
      counter.value = value;
    };

    watch(speed, (value) => {
      clearInterval(timer);
      let internal = 1000 / value;
      timer = setInterval(() => {
        counter.value = (counter.value + 1) % frame_num.value;
      }, internal);
    });

    onMounted(async () => {
      // 图片按 100ms 每帧播放
      let internal = 1000 / speed.value;
      timer = setInterval(() => {
        counter.value = (counter.value + 1) % frame_num.value;
      }, internal);
    });

    return {
      frame_num,
      timer,
      counter,
      speed,
      onSpeedChange,
      onFrameChange,
    };
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>
