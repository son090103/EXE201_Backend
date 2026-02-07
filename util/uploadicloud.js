const upload = require("./../helper/uploadtocloud");
// dùng để upload cho 1 ảnh
module.exports.uploadIclod = async (req, res, next) => {
  if (req.file) {
    const result = await upload(req.file.buffer);
    req.body[req.file.fieldname] = result;
    console.log("result trong icloud là  : ", result);
    next();
  } else {
    next(); // không có cũng cho chạy qua
  }
};

// dùng để up cho nhiều ảnh
module.exports.uploadIclodimages = async (req, res, next) => {
  if (req.files && req.files.length > 0) {
    try {
      const imageUrls = [];

      for (const file of req.files) {
        const result = await upload(file.buffer);
        imageUrls.push(result);
      }
      // Gắn mảng ảnh vào req.body hoặc req.uploadedImages
      req.body.thumbnails = imageUrls;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next(); // Không có file thì vẫn cho qua
  }
};
