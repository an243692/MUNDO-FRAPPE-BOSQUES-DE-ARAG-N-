import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";

export const uploadImage = async (file, path = "productos") => {
  try {
    const timestamp = Date.now();
    const fileName = `${path}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw error;
  }
};









