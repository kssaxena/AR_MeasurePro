from django.shortcuts import render
from django.views.decorators.cache import never_cache
from rest_framework.decorators import api_view
from rest_framework.response import Response
import shutil
from . utils import *
from . models import ImageSegmentation, Measurement
from . serializers import MeasurementSerializer, ImageSerializer

# Create your views here.
def say_hello(request):
    return render(request, 'hello.html', {'name': 'Chris'})


@api_view(['GET'])
@never_cache
def test_api(request):
    return Response({'response':"Successfully connected to ImageApi"})


@api_view(['POST'])
@never_cache
def run_measureme_tool(request):
    property_id = request.POST.get('property_id')

    # converts querydict to original dict
    images = dict((request.data).lists())['image']
    flag = 1
    arr = []
    for img_name in images:
        modified_data = modify_input_for_multiple_files(property_id,
                                                        img_name)
        file_serializer = ImageSerializer(data=modified_data)
        if file_serializer.is_valid():
            file_serializer.save()
            arr.append(file_serializer.data)
        else:
            flag = 0

    if flag == 1:
        frontimg_path = os.path.relpath(arr[0]['image'], '/')
        sideimg_path = os.path.relpath(arr[1]['image'], '/')
        front_image = ImageSegmentation.objects.create(input_image=frontimg_path, name='image_{:02d}'.format(int(uuid.uuid1() )))
        side_image = ImageSegmentation.objects.create(input_image=sideimg_path, name='image_{:02d}'.format(int(uuid.uuid1() )))
        # runner = ModelSegmentationClass(front_image, side_image)
        # runner.remove_backgrounds_save_imgs()
        # measurements = runner.process_imgs()
        runner = RunSegmentationInference(front_image, side_image)
        runner.save_frontbg_output()
        runner.save_sidebg_output()
        measurements = runner.process_imgs()
        

        #store measurements
        measure = Measurement()
        measure.neck = measurements.neck_perimeter
        measure.chest = measurements.chest_perimeter
        measure.waist = measurements.waist_perimeter
        measure.hip = measurements.hip_perimeter
        measure.height = measurements.MFront.Height
        measure.arm = measurements.MFront.FLarmDist
        measure.leg = measurements.MFront.FLlegDist
        measure.save()

        serializer = MeasurementSerializer(measure)
        return Response(serializer.data)


@api_view(['GET'])
@never_cache
def clean_folders(request):
    folder_input = 'media/Input_image/'
    for filename in os.listdir(folder_input):
        file_path = os.path.join(folder_input, filename)
        # except gitkeep
        _, ext = os.path.splitext(file_path)     
        if (filename == '.gitkeep' or ext == '.txt'): continue
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete {}. Reason: {}'.format(file_path, e) )

    folder_output = 'media/Output_image/'
    for filename in os.listdir(folder_output):
        file_path = os.path.join(folder_output, filename)
        # except gitkeep
        _, ext = os.path.splitext(file_path)     
        if (filename == '.gitkeep' or ext == '.txt'): continue
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete {}. Reason: {}'.format(file_path, e) )

    return Response("response: " + "Media folders were cleaned up!!")


@api_view(['GET'])
def measurements_list(request):
    queryset = Measurement.objects.all()

    serializer = MeasurementSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
def delete_last(request):
    measure = Measurement.objects.last()
    Measurement.objects.filter(uuid=measure.uuid).delete()

    serializer = MeasurementSerializer(measure)
    return Response(data=serializer.data)


@api_view(['DELETE'])
def delete_by_id(request, uuid):
    measure = Measurement.objects.get(pk=uuid)
    Measurement.objects.filter(uuid=measure.uuid).delete()

    serializer = MeasurementSerializer(measure)
    return Response(data=serializer.data)


@api_view(['GET'])
def first_measurement(request):
    measurement = Measurement.objects.first()

    serializer = MeasurementSerializer(measurement)
    return Response(serializer.data)