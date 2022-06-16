<template>
  <div>
    <canvas
      id="frame-vedio-player"
      style="width: 100%"
      width="1242"
      height="375"
    ></canvas>
  </div>
</template>

<script>
import { onMounted, watch, ref } from "vue";
import { LRUMap } from "lru_map";
import { fetchImageBase64 } from "../../utils/requests.js";
export default {
  props: {
    counter: Number,
    frame_num: Number,
  },

  setup(props, context) {
    let timer = null;
    let lru = new LRUMap(20);
    const image_lock = ref(false);

    // 监听 couter 用来获取点云数据
    watch(
      () => props.counter,
      async (value) => {
        for (let i = value; i < value + 10; i++) {
          if (!lru.get(i) && i < props.frame_num) {
            let data = await fetchImageBase64(i);
            lru.set(i, data);
          }
        }
        if (image_lock) {
          image_lock.value = false;
        }
      }
    );

    watch(image_lock, (locked) => {
      context.emit("imageLock", locked);
    });

    onMounted(async () => {
      // 生成所有图片的名称
      // genName(props.frame_num, image_names);
      // 将所有帧图片转化为 base64 编码
      // for (let i in image_names) {
      //   await getImageToBase64(
      //     "/data/image_00/data/" + image_names[i] + ".png",
      //     encode_images,
      //     i
      //   );
      // }

      for (let i = 0; i < 5; i++) {
        let data = await fetchImageBase64(i);
        lru.set(i, data);
      }

      let image = new Image();
      // 获取 canvas 元素
      let frame_vedio_player = document.getElementById("frame-vedio-player");

      let ctx = frame_vedio_player.getContext("2d");

      // 定时使用 canvas 绘制帧
      timer = setInterval(() => {
        let base64 = lru.get(props.counter);
        if (base64 === undefined) {
          image_lock.value = true;
          return;
        }
        image.src = base64;
        const scale = window.devicePixelRatio;

        const height = (image.height / image.width) * frame_vedio_player.width;
        image.onload = () => {
          // 计算图片实际要渲染的高度
          ctx.drawImage(image, 0, 0);
          // ctx.drawImage(image, 0, 0, frame_vedio_player.width * scale, height * scale);
        };
      }, 100);
    });
    return { timer };
  },
};
</script>
