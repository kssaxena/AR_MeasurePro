from django.db import models
from django.utils.timezone import now
from API.utils import get_input_image_path, get_output_image_path
import uuid

# Create your models here.

### Images for processing ###
class ImageSegmentation(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, null=True, blank=True)
    input_image = models.FileField(upload_to=get_output_image_path, null=True, blank=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{0}".format(self.name)


### Images from request ###
class Image(models.Model):
    property_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.FileField(upload_to=get_input_image_path, null=True, blank=True)


### Measurements from Images | no association to user | Imgs get deleted in server (privacy policy) ###
class Measurement(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    neck = models.FloatField(default=0)
    chest = models.FloatField(default=0)
    waist = models.FloatField(default=0)
    hip = models.FloatField(default=0)
    height = models.FloatField(default=0)
    arm = models.FloatField(default=0)
    leg = models.FloatField(default=0)
    created_at = models.DateTimeField(default=now, editable=False)