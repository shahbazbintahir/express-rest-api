const path = require("path")
const multer = require("multer")

const uploadMiddleware = (req, res, next) => {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads')

            },
            filename: function (req, file, cb) {
                const ext = file.originalname.split('.').pop();
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + ext
                cb(null, file.fieldname + '-' + uniqueSuffix)
            }
        })
        const upload = multer({ storage: storage })

        const file = upload.single('file');
        file(req, res, function (err) {
            if (err) {
               next(err)
            }
            if (req.file === undefined) {
                next();
            }
            else {
                const ext = req.file.originalname.split('.').pop();
                req.body.file = req.file.filename;
                next();
            }
        });
    } catch (err) {
        next(err);
    }
}



module.exports = uploadMiddleware;