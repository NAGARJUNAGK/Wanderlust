const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET 
});//creidentials for the code to connect to the cloud

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wanderlust_NGK',
    allowedFormats: ["png","jpg","jpeg"], // supports promises as well
  },
});//defining the storage

module.exports = {
    cloudinary,
    storage,
}