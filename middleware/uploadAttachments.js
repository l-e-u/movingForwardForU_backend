import util from 'util';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ['image/jpeg', 'image/jpg', 'image/png'];

        // html file input accepted files are set the same, this is a second safety net
        if (match.indexOf(file.mimetype) === -1) {
            throw { message: 'File type not accepted.' };
        };

        return {
            bucketName: 'attachments',
            filename: `${Date.now()}--movingForward-${file.originalname}`,
        };
    },
});

const uploadFiles = multer({ storage: storage }).array('attachments', 10);
const uploadFilesPromise = util.promisify(uploadFiles);

const uploadAttachments = async (req, res, next) => {

    try {
        await uploadFilesPromise(req, res);

        console.log('uploaded:', req.files)

        next();
    }
    catch (error) {
        console.error(error);

        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).send({
                message: 'Too many files to upload.',
            });
        };

        return res.status(500).send({
            server: {
                message: `Error when trying upload file(s): ${error.message}`
            }
        });
    };
};

export { uploadAttachments };