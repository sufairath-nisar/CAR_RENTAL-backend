// import multer from "multer";

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// export default upload;

import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(file.originalname.split('.').pop().toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error("File upload only supports the following filetypes - " + fileTypes));
  }
});

export default upload;
