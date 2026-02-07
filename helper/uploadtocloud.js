// có 2 trang web lưu lại để cấu hình icloud
// https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
//https://cloudinary.com/blog/uploading-images-node-js-cloudinary-node-sdk

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
//config icloud
cloudinary.config({
  cloud_name: "dmdogr8na",
  api_key: "844685131446754",
  api_secret: "Ardg0PpoHGac-DbeUDDxEYIy6Yg",
  // cloud_name: process.env.CLOUD_KEY,
  // api_key: process.env.API_KEY,
  // api_secret: process.env.API_SECRET,
  // nên định nghĩa như vậy để có thể bảo mật
});
let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadToCloud = async (buffer) => {
  let result = await streamUpload(buffer);
  console.log(result);
  return result.url;
  // next(); // nếu có ảnh thì cho chạy quaqua
};
module.exports = uploadToCloud;
