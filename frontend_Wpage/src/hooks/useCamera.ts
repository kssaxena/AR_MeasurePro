
import { useState, useCallback } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';

export const useCamera = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });
      
      if (image.dataUrl) {
        return image.dataUrl;
      }
    } catch (error) {
      console.error('Failed to take picture:', error);
    }
    return null;
  };

  const uploadImage = async () => {
    try {
      const image = await Camera.pickImages({
        quality: 90,
        limit: 1
      });
      
      if (image.photos[0].webPath) {
        return image.photos[0].webPath;
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
    return null;
  };

  return {
    imageUrl,
    setImageUrl,
    takePicture,
    uploadImage
  };
};
