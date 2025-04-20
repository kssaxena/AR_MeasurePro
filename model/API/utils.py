import uuid
import os
from PIL import Image
from ImageProcessing.semantic_data import SegmentationSample
from ImageProcessing.fcn_implementation import SemanticSeg, run_bg_inference
from ImageProcessing.ProcessAllSizes import IMGSProcessor, AllMeasurements

def get_input_image_path(instance, filename):
    _, ext = os.path.splitext(filename)
    return 'media/Input_image/{}{}'.format(uuid.uuid4(), ext)


def get_output_image_path(instance, filename):
    _, ext = os.path.splitext(filename)
    return 'media/Output_image/{}{}'.format(uuid.uuid4(), ext)


def modify_input_for_multiple_files(property_id, image):
    dict = {}
    dict['property_id'] = property_id
    dict['image'] = image
    return dict


class RunSegmentationInference(): # Takes ImgSegmentation Model Objects
    def __init__(self, image_front, image_side):
        self.front_image = image_front
        self.side_image = image_side

        self.output_folder = 'media/Output_image/'

        self.front_base_path, self.front_filename = os.path.split(self.front_image.input_image.path)
        self.side_base_path, self.side_filename = os.path.split(self.side_image.input_image.path)

        self.front_sample_image = SegmentationSample(root_dir = self.front_base_path, image_file = self.front_filename)
        self.side_sample_image = SegmentationSample(root_dir = self.side_base_path, image_file = self.side_filename)

        self.model = SemanticSeg(pretrained=True)

        self.updated_front_image = None
        self.updated_side_image = None
        self.measurements = None


    def save_frontbg_output(self):
        res = run_bg_inference(self.front_sample_image, self.model)
        self.updated_front_image = res
        # image_to_array = Image.fromarray((res * 255).astype(np.uint8))
        image_to_array = Image.fromarray(res)
        image_to_array.save(self.output_folder + self.front_filename)
        self.front_image.output_image = self.output_folder + self.front_filename
        self.front_image.save()


    def save_sidebg_output(self):
        res = run_bg_inference(self.side_sample_image, self.model)
        self.updated_side_image = res

        image_to_array = Image.fromarray(res)
        image_to_array.save(self.output_folder + self.side_filename)
        self.side_image.output_image = self.output_folder + self.side_filename
        self.side_image.save()


    def process_imgs(self):
        front_img = self.updated_front_image
        side_img = self.updated_side_image

        img_processor = IMGSProcessor(front_img, side_img)
        frontMeasure, sideMeasure = img_processor.process_measurements()
        
        return AllMeasurements(frontMeasure, sideMeasure)



# class ModelSegmentationClass(): # Takes ImgSegmentation Model Objects
#     def __init__(self, image_front, image_side):
#         self.front_image = image_front
#         self.side_image = image_side

#         self.output_folder = 'media/Output_image/'

#         self.front_base_path, self.front_filename = os.path.split(self.front_image.input_image.path)
#         self.side_base_path, self.side_filename = os.path.split(self.side_image.input_image.path)

#         self.updated_front_image = None
#         self.updated_side_image = None
#         self.measurements = None

#     def remove_backgrounds_save_imgs(self):
#         bgAI = BackgroundAI()
#         imgFront = bgAI.segment(self.front_image.input_image.path)
#         imgSide = bgAI.segment(self.side_image.input_image.path)
#         del bgAI

#         self.updated_front_image = imgFront
#         self.updated_side_image = imgSide

#         self.save_frontBG_output(self.updated_front_image)
#         self.save_sideBG_output(self.updated_side_image)

#     def save_frontBG_output(self, result):
#         image_to_array = Image.fromarray(result)
#         image_to_array.save(self.output_folder + self.front_filename)
#         # model saves itself
#         self.front_image.output_image = self.output_folder + self.front_filename
#         self.front_image.save()


#     def save_sideBG_output(self, result):
#         image_to_array = Image.fromarray(result)
#         image_to_array.save(self.output_folder + self.side_filename)
#         # model saves itself
#         self.side_image.output_image = self.output_folder + self.side_filename
#         self.side_image.save()

#     def process_imgs(self): # Only run after both newBG versions are done
#         front_img = self.updated_front_image
#         side_img = self.updated_side_image

#         img_processor = IMGSProcessor(front_img, side_img)
#         frontMeasure, sideMeasure = img_processor.process_measurements()
        
#         return AllMeasurements(frontMeasure, sideMeasure)