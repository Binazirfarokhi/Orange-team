const { ref, uploadBytes, uploadString, getDownloadURL } = require('firebase/storage');
const { v4: uuidv4 } = require('uuid');
const { storage } = require('../repo/firebase');
const fs = require('fs');
const path = require('path');
const os = require('node:os');
const busboy = require('busboy');

const getPhoto = async (req, res) => {
    const url = await getDownloadURL(ref(storage, req.params.id));
    res.send({
        status: 'OK',
        data: [
            url
        ]
    })

}
const savePhoto = async (req, res) => {
    const id = uuidv4();

    try {
        let imgToBeUploaded, imgName;
        const headers = { ...req.headers };
        const bb = busboy({ headers });
        bb.on('file', (name, file, info) => {
            const { filename, encoding, mimeType } = info;
            // console.log(
            //     `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
            //     filename,
            //     encoding,
            //     mimeType
            // );
            imgName = id+ filename.substring(filename.lastIndexOf('.'))
            file.on('data', (data) => {
                // console.log(`File [${name}] got ${data.length} bytes`);
            }).on('close', () => {
                // console.log(`File [${name}] done`);
            });
            const filepath = path.join(os.tmpdir(), imgName);
            // modifiedUrl = `avatar_${req.user.userName}_200x200.${imgExt}`;
            file.pipe(fs.createWriteStream(filepath));
            imgToBeUploaded = { filepath, mimeType, file };
        });
        bb.on('field', (name, val, info) => {
            console.log(`Field [${name}]: value: %j`, val);
        });
        bb.on('close', async() => {
            storageRef = ref(storage, imgName)
            const file = _fileToBase64(imgToBeUploaded.filepath)
            const uploadTask = await uploadString(storageRef, file, 'base64');
            res.send({
                status: 'Failed',
                data:{
                    id: uuidv4(), uploadTask
                }
            })
        });
        req.pipe(bb);
    } catch (error) {
        console.error(error)
        res.send({
            status: 'Failed',
            message: error.message
        })
    }


}

const _fileToBase64 = (file)=> {
    const contents = fs.readFileSync(file, {encoding: 'base64'});
    return contents;
  }
module.exports = {
    getPhoto, savePhoto
}