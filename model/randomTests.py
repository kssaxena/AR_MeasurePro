# import os
# from ImageProcessing.ProcessAllSizes import IMGSProcessor, AllMeasurements, BackgroundAI

# ## TESTING CLASSES ##
# dirname = os.path.dirname(__file__)

# bgAI = BackgroundAI()
# imgFront = bgAI.segment(os.path.join(dirname, 'ImageProcessing/images/front1.jpg'))
# imgSide = bgAI.segment(os.path.join(dirname, 'ImageProcessing/images/side1.jpg'))

# img_processor = IMGSProcessor(imgFront, imgSide)
# frontMeasure, sideMeasure = img_processor.process_measurements()
# measurements = AllMeasurements(frontMeasure, sideMeasure)

# del img_processor



# ## PRINT RESULTS ##
# print("")
# print("Front Measurements:")
# print(vars(measurements.MFront))
# print("Side Measurements:")
# print(vars(measurements.MSide))

# measurements_dict = vars(measurements).copy()
# measurements_dict.pop('MFront')
# measurements_dict.pop('MSide')
# print("Additional Measurements:")
# print(measurements_dict)