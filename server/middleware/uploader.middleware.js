//image storing using GridFS and multer imports
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import path from 'path';
import crypto from 'crypto';
import { MONGO_URL } from '../utils/config.js';



//initialize gridfs storage engine
const storage = new GridFsStorage({
    url: MONGO_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            })
        })
    }
})
  
const imageUploader = multer({ storage });

export default imageUploader;