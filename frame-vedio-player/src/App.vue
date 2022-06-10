<template>
  <div>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="8">
            <PointCloud
              :counter="counter"
              :frame_num="frame_num"
              @frameLock="onFrameLock"
            ></PointCloud>
          </el-col>
          <el-col :span="16">
            <div>
              <FrameVedioPlayer
                :counter="counter"
                :frame_num="frame_num"
                @imageLock="onImageLock"
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
import { ElLoading } from "element-plus";
export default {
  components: { FrameVedioPlayer, ProgressBar, PointCloud },
  setup(props) {
    // 添加帧锁和图片锁，当帧和图片都不上锁时开始重新计时
    // const lock = reactive({
    //   frame_lock: ref(false),
    //   image_lock: ref(false),
    // });
    const lock = {
      frame_lock: ref(false),
      image_lock: ref(false),
    };
    let loading = null;
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

    const onFrameLock = (value) => {
      console.log("App lock frame");
      lock.frame_lock.value = value;
      // console.log("frame value", value);
      // console.log("frame lock", lock.frame_lock);
    };

    const onImageLock = (value) => {
      console.log("APP lock image");
      lock.image_lock.value = value;
      // console.log("image value", value);
      // console.log("image lock", lock.image_lock);
    };

    const startLoading = () => {
      // loading.value = true;
      loading = ElLoading.service({
        lock: true,
        background: "rgba(0, 0, 0, 0.7)",
      });
    };

    const stopLoading = () => {
      loading.close();
      loading = null;
    };

    watch(speed, (value) => {
      clearInterval(timer);
      let internal = 1000 / value;
      timer = setInterval(() => {
        counter.value = (counter.value + 1) % frame_num.value;
      }, internal);
    });

    watch([lock.frame_lock, lock.image_lock], ([frame_locked, image_locked]) => {
      // console.log("lock", locked);
      console.log("frame lock", frame_locked);
      console.log("image lock", image_locked);
      if (!frame_locked && !image_locked) {
        // 当帧和图片都不上锁时开始计时
        let internal = 1000 / speed.value;
        timer = setInterval(() => {
          counter.value = (counter.value + 1) % frame_num.value;
        }, internal);
        stopLoading();
      } else {
        // 当帧或者图片有一个上锁了的时候，注销定时器
        console.log("counter lock");
        if (timer != null) {
          clearInterval(timer);
          timer = null;
        }
        startLoading();
      }
    });

    onMounted(async () => {
      // 图片按 100ms 每帧播放
      // let internal = 1000 / speed.value;
      // timer = setInterval(() => {
      //   counter.value = (counter.value + 1) % frame_num.value;
      // }, internal);
      // let data = await fetchPointCloud(1);
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
      onImageLock,
      onFrameLock,
    };
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>
