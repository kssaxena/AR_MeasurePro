from django.urls import path
from django.urls import include, path
from rest_framework import routers
from . import views
from . import views

app_name = 'api'

# URL config
urlpatterns = [
    path('hello/', views.say_hello),
    path('test/', views.test_api, name='test_api_communication'),
    path('measureme/', views.run_measureme_tool, name='run_measurements_on_images'),
    path('clean/', views.clean_folders, name='clean_img_folders'),
    path('measuredata/', views.measurements_list, name='measurement_data'),
    path('delete/', views.delete_last, name='delete_last'),
    path('delete/<uuid>', views.delete_by_id, name='delete_by_uuid'),
    path('first/', views.first_measurement, name='single_measurement')
]