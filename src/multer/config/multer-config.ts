import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export default {
  storage: diskStorage({
    destination: './src/files',
    filename: (_req, file: Express.Multer.File, cb) => {
      const ext = extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;

      return cb(null, filename);
    },
  }),
};
