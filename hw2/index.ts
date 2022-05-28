const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const max_width = 300
const max_height = 150
const default_point_num = 1000

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

let points: Array<[number, number]> = Array.from( 
  {length : default_point_num}, () => [getRandomInt(0, max_width), getRandomInt(0, max_height)]
)

function draw(ctx: CanvasRenderingContext2D, points: Array<[number, number]>) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '48px serif';
    for(let point of points) {
      console.log(point)
      ctx.fillRect(point[0], point[1], 0.5, 0.5)
    }
}


if(ctx) {

  // 绘制第一帧
  draw(ctx, points)
  
  function animate() {

    // 擦除之前图像
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    for(let index in points) {
      points[index] = [getRandomInt(0, max_width), getRandomInt(0, max_height)]
    }

    draw(ctx!, points)
  
    console.log('draw')
    requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(animate);

} else {
  console.error('no context')
}


// console.log(points)



