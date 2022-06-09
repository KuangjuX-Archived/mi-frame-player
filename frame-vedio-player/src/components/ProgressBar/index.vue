<template>
  <div class="panel">
    <el-row :gutter="20">
      <el-col :span="3" style="margin-top: 15px">
        <el-select
          v-model="speed"
          class="m-2"
          size="large"
          placeholder="视频帧播放速度"
          @change="emitSpeed"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="2">
        <div class="player-button">
          <el-image
            :src="'/src/assets/icon/rewind-symbol.png'"
            @click="subFrame"
          ></el-image>
        </div>
      </el-col>

      <el-col :span="2">
        <div class="player-button">
          <el-image
            v-if="!start"
            :src="'/src/assets/icon/play.png'"
            @click="flipVedio"
          ></el-image>
          <el-image
            v-else
            :src="'/src/assets/icon/pause.png'"
            @click="flipVedio"
          ></el-image>
        </div>
      </el-col>

      <el-col :span="2">
        <div class="player-button">
          <el-image
            :src="'/src/assets/icon/fast-forward-media-control-button.png'"
            @click="addFrame"
          ></el-image>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="slider-demo-block">
          <span span class="demonstration">视频播放帧数</span>
          <el-slider v-model="counter" :max="frame_num" @change="emitFrame" />
        </div>
      </el-col>
      <el-col :span="3">
        <div>当前帧数: {{ counter }}</div>
        <div>当前速度: {{ getSpeed }}ms / 帧</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
export default {
  props: {
    frame_num: Number,
    counter: Number,
  },
  setup(props, context) {
    let options = [
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

      {
        value: 10,
        label: "10x",
      },
    ];

    // 播放速度
    const speed = ref(1);
    // 是否开始播放状态
    const start = ref(false);

    const flipVedio = () => {
      start.value = !start.value;
      context.emit("flipVedio", start.value);
    };

    const emitSpeed = () => {
      context.emit("emitSpeed", speed.value);
    };

    const emitFrame = () => {
      context.emit("emitFrame", props.counter);
    };

    const addFrame = () => {
      context.emit(
        "addFrame",
        props.counter + 5 <= props.frame_num ? props.counter + 5 : props.frame_num
      );
    };

    const subFrame = () => {
      context.emit("subFrame", props.counter - 5 >= 0 ? props.counter - 5 : 0);
    };

    return {
      options,
      speed,
      start,
      emitSpeed,
      emitFrame,
      flipVedio,
      addFrame,
      subFrame,
    };
  },

  computed: {
    getSpeed() {
      return 1000 / this.speed;
    },
  },
};
</script>

<style lang="scss">
$backgroud-color: #fafafa;

.panel {
  height: 100px;
  background: $backgroud-color;
  margin-top: 25px;
  margin-left: 5%;
  margin-right: 5%;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

div .player-button {
  padding: 25px;
  &:hover {
    background-color: #dcdfe6;
  }
}
</style>
