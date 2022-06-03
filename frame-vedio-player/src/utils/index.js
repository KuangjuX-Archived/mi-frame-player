// 异步函数实际上不是顺序执行的，要将其转化为顺序执行
export async function getImageToBase64(url, encode_images, order) {
    let response = await fetch(url)
    let blob = await response.blob()
    const reader = new FileReader()
    reader.onloadend = function() {
        // encode_images.push(reader.result)
        encode_images[order] = reader.result
    }
    reader.readAsDataURL(blob)
}

export async function fetchCloudData(url) {
    let response = await fetch(url)
    let data = await response.arrayBuffer()
    return data
}

export function parseCloudData(data) {
    let buffer = new Array(data.length / 4 * 3)
    for(let i = 0; i < data.length / 4; i++) {
        buffer[3 * i] = data[4 * i]
        buffer[3 * i + 1] = data[4 * i + 1]
        buffer[3 * i + 2] = data[3 * i + 2]
    }
    return buffer
}

export function genName(num, array) {
    for(let i = 0; i <= num; i++) {
        let name = "0000000"
        if(i < 10) {
          name += '00'
          name += i
        }else if(i < 100) {
          name += '0'
          name += i
        }else {
          name += i
        }
        array.push(name)
      }
}

export async function getCloudData(num, array) {
    let names = []
    genName(num, names)
    for(let order in names) {
        let url = "/data/velodyne_points/data/" + names[order] + ".bin"
        let cloud_data = await fetchCloudData(url)
        // array.push(cloud_data)
        array[order] = cloud_data
    }
}

function parseStr(str) {

}