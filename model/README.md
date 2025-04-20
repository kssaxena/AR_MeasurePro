# Django Image Processing API

## 📌 Description
This Django-based API processes images to extract body measurements from a T-POSE photo sent from an app. It leverages OpenCV and other image-processing techniques to analyze and return measurements.

## 🔧 Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/CFSanchezV/Django-ImageAPI.git
   ```
2. Navigate into the project directory:
   ```sh
   cd Django-ImageAPI
   ```
3. Set up a virtual environment (recommended. AI model is large):
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
4. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

## 🚀 Usage
To run the Django server locally:
```sh
python manage.py runserver
```
The API will be available at `http://127.0.0.1:8000/`.

### API Endpoints
- `POST /upload/` - Upload a T-POSE image for processing.
- `GET /measurements/{id}/` - Retrieve extracted measurements.

## 📂 Project Structure
- **manage.py** - Django project management script.
- **requirements.txt** - List of dependencies.
- **Procfile** - Configuration for deployment on platforms like Heroku.
- **API/**
  - `models.py` - Defines database models for storing measurements.
  - `views.py` - Handles image processing and API responses.
  - `serializers.py` - Converts Django models to JSON responses.
  - `urls.py` - Defines API endpoints.

## 🛠 Dependencies
- Python 3.x
- Django
- OpenCV
- Pillow
- Django REST Framework

## ✨ Use
Feel free to clone this repository and use at will.

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
