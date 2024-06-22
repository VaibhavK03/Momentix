import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: 'dbzr76y7l', 
  api_key: '733646276553314', 
  api_secret: 'SBoVvzmcS_jhCWT7_Ht27uE08DI' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null; // if no path for image given
        console.log("local file path line 13: ",localFilePath);

        // upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        });
        console.log("file uploaded on cloudinary")
        fs.unlinkSync(localFilePath);

        return response;

    }catch(error){
        console.error(error);
        console.log("File not uploaded on cloudinary")
        fs.unlinkSync(localFilePath) // this will remove locally saved temporary file as upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary }