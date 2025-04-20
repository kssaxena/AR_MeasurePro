from torch import argmax
import numpy as np
from cv2 import cvtColor, imread, add, resize, threshold, GaussianBlur, multiply, THRESH_BINARY, COLOR_BGR2RGB, INTER_AREA, INTER_LINEAR
import torchvision.models.segmentation as seg_models
from ImageProcessing.semantic_data import SegmentationSample
from ImageProcessing.ProcessAllSizes import MUtils


class SemanticSeg():
    def __init__(self, pretrained: bool):

        self.device = 'cpu'
        self.model = self.load_model(pretrained)

    def load_model(self, pretrained=False):
        # model = seg_models.deeplabv3_resnet101(pretrained)
        model = seg_models.fcn_resnet101(pretrained=True)

        model.to(self.device)
        model.eval()
        return model

    def forward(self, input: SegmentationSample):
        output = self.model(input.processed_image)['out']
        reshaped_output = argmax(output.squeeze(), dim=0).detach().cpu().numpy()
        del output

        return reshaped_output


def remove_background(input_image, source, num_channels=21):
    # 0=background, 12=dog, 13=horse, 14=motorbike, 15=person
    label_colors = np.array([(0, 0, 0),
        (128, 0, 0), (0, 128, 0), (128, 128, 0), (0, 0, 128), (128, 0, 128),
        (0, 128, 128), (128, 128, 128), (64, 0, 0), (192, 0, 0), (64, 128, 0),
        (192, 128, 0), (64, 0, 128), (192, 0, 128), (64, 128, 128), (192, 128, 128),
        (0, 64, 0), (128, 64, 0), (0, 192, 0), (128, 192, 0), (0, 64, 128)])

    r = np.zeros_like(input_image).astype(np.uint8)
    g = np.zeros_like(input_image).astype(np.uint8)
    b = np.zeros_like(input_image).astype(np.uint8)

    # label 15 = person
    for l in range(0, num_channels):
        if l == 15:
            idx = input_image == l
            r[idx] = label_colors[l, 0]
            g[idx] = label_colors[l, 1]
            b[idx] = label_colors[l, 2]

    rgb = np.stack([r, g, b], axis=2)
    # return rgb

    # and resize image to match shape of R-band in RGB output map
    foreground = imread(source)
    foreground = cvtColor(foreground, COLOR_BGR2RGB)
    foreground = resize(foreground, (rgb.shape[1], rgb.shape[0]), interpolation=INTER_AREA)
    
    # Create a background array to hold white pixels
    background = 255 * np.ones_like(rgb).astype(np.uint8)

    # Convert uint8 to float
    foreground = foreground.astype(float)
    background = background.astype(float)

    # Create a binary mask of the RGB output map using the threshold value 0
    _, alpha = threshold(np.array(rgb), 0, 255, THRESH_BINARY)

    # Apply a slight blur to the mask to soften edges
    alpha = GaussianBlur(alpha, (7, 7), 0)

    # Normalize the alpha mask to keep intensity between 0 and 1
    alpha = alpha.astype(float)/255

    # Multiply the foreground with the alpha matte
    foreground = multiply(alpha, foreground)

    # Multiply the background with ( 1 - alpha )
    background = multiply(1.0 - alpha, background)

    # Add the masked foreground and background
    outImage = add(foreground, background)

    return outImage / 255


def run_bg_inference(image_foreground: SegmentationSample, model : SemanticSeg):
    output = model.forward(image_foreground)
    new_img = remove_background(output, image_foreground.image_file)
    new_img = MUtils.convert_image(new_img)
    returnedIMG = MUtils.image_resize(new_img, image_foreground.img_width, image_foreground.img_height, INTER_LINEAR)
    return returnedIMG