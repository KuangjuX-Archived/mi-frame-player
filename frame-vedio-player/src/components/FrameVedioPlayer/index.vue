<template>
  <div>
    <canvas id="frame-vedio-player" style="width: 100%"></canvas>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { getImageToBase64, genName } from "../../utils/index.js";
export default {
  props: {
    counter: Number,
  },

  setup(props) {
    let image_names = new Array();
    let encode_images = new Array();
    let timer = null;

    onMounted(async () => {
      // 生成所有图片的名称
      genName(107, image_names);
      // 将所有帧图片转化为 base64 编码
      for (let i in image_names) {
        await getImageToBase64(
          "/data/image_00/data/" + image_names[i] + ".png",
          encode_images,
          i
        );
      }

      let image = new Image();
      // 获取 canvas 元素
      let frame_vedio_player = document.getElementById("frame-vedio-player");

      let ctx = frame_vedio_player.getContext("2d");

      // 定时使用 canvas 绘制帧
      let timer = setInterval(() => {
        image.src = encode_images[props.counter];
        image.onload = () => {
          ctx.drawImage(image, 0, 0, frame_vedio_player.width, frame_vedio_player.height);
        };
      }, 100);
    });
    return { image_names, encode_images };
  },
};
</script>
