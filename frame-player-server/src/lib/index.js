import * as fs from 'node:fs';
// import fetch from "node-fetch";

import path from 'path'; 


export const fetchImage = async(req, res) => {
    const image_id = req.params["imageid"]
    let root = path.join(__dirname, '../../public')
    const image = root + "\\data\\image_00\\data\\" + generateName(image_id) + '.png'
    // let image = await fetch(url)
    let bitmap = fs.readFileSync(image, {encoding: 'base64'})
    res.send(bitmap)
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