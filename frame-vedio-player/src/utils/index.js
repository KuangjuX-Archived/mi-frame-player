export async function getImageToBase64(url, encode_images) {
    let response = await fetch(url)
    let blob = await response.blob()
    const reader = new FileReader()
    reader.onloadend = function() {
        encode_images.push(reader.result)
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