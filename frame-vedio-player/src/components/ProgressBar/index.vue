<template>
  <div class="backgroud-nav panel">
    <el-row :gutter="20">
      <el-col :span="4" style="margin-top: 15px">
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
      <el-col :span="16">
        <div class="slider-demo-block">
          <span span class="demonstration">视频播放帧数</span>
          <el-slider v-model="counter" :max="frame_num" />
        </div>
      </el-col>
      <el-col :span="4">
        <div>当前帧数: {{ counter }}</div>
        <div>当前速度: {{ getSpeed }}ms / 帧</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref } from "vue";
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

    const speed = ref(1);

    const emitSpeed = () => {
      context.emit("emitSpeed", speed.value);
    };

    return {
      options,
      speed,
      emitSpeed,
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
.backgroud-nav {
  height: 100px;
  background: $backgroud-color;
}

.panel {
  margin-top: 25px;
  margin-left: 5%;
  margin-right: 5%;
}
</style>
