from PIL import Image
import os
import torchvision.transforms as T

class SegmentationSample():
    def __init__(self, root_dir, image_file):
        self.image_file = os.path.join(root_dir, image_file)
        self.image = Image.open(self.image_file)

        #store sizes to return to original sizes
        self.img_width, self.img_height = self.image.size[:]
        self.device = 'cpu'

        self.preprocessing = T.Compose([
            T.Resize(450),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])
        ])
        # self.unload_tensor = T.ToPILImage()

        # Output returned: processed tensor with an additional dim for the batch:
        self.processed_image = self.preprocessing(self.image).unsqueeze(0).to(self.device)
        del self.preprocessing
        
        # self.processed_image = self.processed_image.unsqueeze(0).to(self.device)