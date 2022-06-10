import * as fs from 'node:fs/promises';
import path from 'path'; 


// 异步获取图片并将其转换为 base64 编码
export const fetchImage = async(req, resp) => {
    const image_id = req.params["imageid"]
    const root = path.join(__dirname, '../../public')
    const image = root + "\\data\\image_00\\data\\" + generateName(image_id) + ".png"
    let bitmap = await fs.readFile(image, {encoding: 'base64'})
    resp.send(bitmap)
}

// 异步获取点云并返回坐标
export const fetchPointCloud = async(req, resp) => {
  const frame_id = req.params["frameid"]
  const root = path.join(__dirname, '../../public')
  // 获取二进制文件
  const bin = root + "\\data\\velodyne_points\\data\\" + generateName(frame_id) + ".bin"
  let buf = await fs.readFile(bin)
  let float32buf = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / Float32Array.BYTES_PER_ELEMENT);
  let data = new Float32Array(float32buf.length / 4 * 3)
  // 将二进制数据转换成 float32 的点数据
  for(let i = 0; i < float32buf.length / 4; i++) {
    data[3 * i] = float32buf[4 * i]
    data[3 * i + 1] = float32buf[4 * i + 1]
    data[3 * i + 2] = float32buf[4 * i + 2]
  }
  resp.send(data)
}

const generateName = (id) => {
    let name = "0000000"
        if(id < 10) {
          name += '00'
          name += id
        }else if(id < 100) {
          name += '0'
          name += id
        }else {
          name += id
        }
    return name
}