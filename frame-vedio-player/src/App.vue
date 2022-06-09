<template>
  <div>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="8">
            <PointCloud :counter="counter"></PointCloud>
          </el-col>
          <el-col :span="16">
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
          @flipVedio="onFlipVedio"
          @addFrame="onAddFrame"
          @subFrame="onSubFrame"
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

    const onFlipVedio = (start) => {
      if (start) {
        // 如果 timer 不为空的话先将其注销
        if (timer != null) {
          clearInterval(timer);
          timer = null;
        }
        let internal = 1000 / speed.value;
        timer = setInterval(() => {
          counter.value = (counter.value + 1) % frame_num.value;
        }, internal);
      } else {
        clearInterval(timer);
        timer = null;
      }
    };

    const onAddFrame = (value) => {
      counter.value = value;
    };

    const onSubFrame = (value) => {
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
      // let internal = 1000 / speed.value;
      // timer = setInterval(() => {
      //   counter.value = (counter.value + 1) % frame_num.value;
      // }, internal);
    });

    return {
      frame_num,
      timer,
      counter,
      speed,
      onSpeedChange,
      onFrameChange,
      onFlipVedio,
      onAddFrame,
      onSubFrame,
    };
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>
