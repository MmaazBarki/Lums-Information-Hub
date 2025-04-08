<<<<<<< HEAD
import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";
=======
import {v2 as cloudinary} from "cloudinary";

import {config} from "dotenv";
>>>>>>> 33df0c4f2a1f2b80e32fc691ad52c8c600d85721

config();

cloudinary.config({
<<<<<<< HEAD
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
=======
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
>>>>>>> 33df0c4f2a1f2b80e32fc691ad52c8c600d85721
