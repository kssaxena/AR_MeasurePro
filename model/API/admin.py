from django.contrib import admin
from . models import Measurement, ImageSegmentation, Image

# Register your models here.
admin.site.register(Image)
admin.site.register(ImageSegmentation)
admin.site.register(Measurement)