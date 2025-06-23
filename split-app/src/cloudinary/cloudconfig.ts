// import * as dotenv from 'dotenv';
// dotenv.config();

// export const cloudinaryConfig = {
//   cloud_name:process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret:process.env.api_secret

// };

import * as dotenv from 'dotenv';
dotenv.config();

export const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};