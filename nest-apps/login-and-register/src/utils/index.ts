import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    try {
      fs.mkdirSync(path.join(process.cwd(), 'uploads'));
    } catch (e) {}

    callback(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});

export { storage };
