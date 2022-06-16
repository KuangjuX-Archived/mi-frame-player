

// // 异步函数实际上不是顺序执行的，要将其转化为顺序
// export const getImageToBase64 = async(url, encode_images, order) => {
//     let response = await fetch(url)
//     let blob = await response.blob()
//     const reader = new FileReader()
//     reader.onloadend = function() {
//         encode_images[order] = reader.result
//     }
//     reader.readAsDataURL(blob)
// }

// export const fetchCloudData = async(url) => {
//     let response = await fetch(url)
//     let data = await response.arrayBuffer()
//     return data
// }

// export const parseCloudData = (data) => {
//     // let buffer = new ArrayBuffer(data.byteLength / 4 * 3)
//     let int32data = new Float32Array(data)
//     let buffer = new Float32Array(int32data.length / 4 * 3)
//     // console.log("data: ", int32data)
//     for(let i = 0; i < int32data.length / 4; i++) {
//         buffer[3 * i] = int32data[4 * i]
//         buffer[3 * i + 1] = int32data[4 * i + 1]
//         buffer[3 * i + 2] = int32data[4 * i + 2]
//     }
//     return buffer
// }

// export const genName = (num, array) => {
//     for(let i = 0; i <= num; i++) {
//         let name = "0000000"
//         if(i < 10) {
//           name += '00'
//           name += i
//         }else if(i < 100) {
//           name += '0'
//           name += i
//         }else {
//           name += i
//         }
//         array.push(name)
//       }
// }

// export const getCloudData = async(num, array) => {
//     let names = new Array()
//     genName(num, names)
//     for(let order in names) {
//         let url = "/data/velodyne_points/data/" + names[order] + ".bin"
//         let point_cloud = await fetchCloudData(url)
//         let data = parseCloudData(point_cloud)
//         array[order] = data
//     }
// }