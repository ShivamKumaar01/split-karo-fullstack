
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from './cloudconfig';
import { Readable } from 'typeorm/platform/PlatformTools';


cloudinary.config(cloudinaryConfig);

@Injectable()
export class CloudinaryService {
  constructor(){}

  async uploadImage(file: Express.Multer.File): Promise<any> {
    console.log(file,file.buffer?.length, "this is comming from express.multer.file");
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream({},(error, result) => {
        if (error) return reject(error);
        resolve(result);
        console.log(result?.secure_url,"this is download_Link");
      });
      const readableStream=new Readable()
      readableStream.push(file.buffer)
      readableStream.push(null)
      readableStream.pipe(upload)

      
    });
  }
}