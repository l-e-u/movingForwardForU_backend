import mongoose from 'mongoose';

const deleteAttachments = async (files) => {
    let gfs;
    const conn = new mongoose.createConnection(process.env.MONGO_URI);

    conn.once('open', () => {
        gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'attachments' });

        files.forEach(file => {
            const { id } = file;
            const _id = new mongoose.Types.ObjectId(id);

            // this will delete the file and its chunks from mongodb attachments.files & attachments.chunks
            gfs.delete(_id);
            console.log(`File ${id} and chunks have been deleted.`);
        });
    });
};

const getAttachment = async (req, res) => {
    const { filename } = req.params;

    try {
        let gfs;
        const conn = new mongoose.createConnection(process.env.MONGO_URI);

        conn.once('open', () => {
            gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'attachments' });

            // const _id = new mongoose.Types.ObjectId(file_id);
            const downloadStream = gfs.openDownloadStreamByName(filename);

            downloadStream.on('data', function (data) {
                return res.status(200).write(data);
            });

            downloadStream.on('error', function (err) {
                console.error(err);
                return res.status(404).send({ file: { message: 'Cannot download the attachment.' } });
            });

            downloadStream.on('end', () => {
                return res.end();
            });
        });
    }
    catch (error) {
        return res.status(500).send({ server: { message: error.message } });
    };
};

export { deleteAttachments, getAttachment };