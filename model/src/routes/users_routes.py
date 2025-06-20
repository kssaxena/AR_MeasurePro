from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from urllib.request import urlretrieve
# Import your image processing function
from controllers.image_processing import process_image

user_blueprint = Blueprint("user_blueprint", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def download_image(imageUrl):
    image_url = imageUrl
    save_path = os.path.join(UPLOAD_FOLDER, 'downloaded_image.jpg')
    # save_path = os.path.join(app.root_path, 'static', 'downloaded_image.jpg')
    
    try:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        urlretrieve(image_url, save_path)
        return "Image downloaded successfully!", 200
    except Exception as e:
        return f"Failed to download image: {e}", 500

@user_blueprint.route('/image-analysis', methods=['POST'])
def analyze_image():
    # if 'image' not in request.files:
    #     return jsonify({"error": "No image uploaded"}), 400
    # print(request)
    if 'imageUrl' in request.json:
        imageUrl = request.json['imageUrl']
        if not imageUrl:
            return jsonify({"error": "Image URL is required"}), 400
        
        # Download the image
        download_message, status_code = download_image(imageUrl)
        if status_code != 200:
            return jsonify({"error": download_message}), status_code
        
        # Process the downloaded image
    
    image_path = os.path.join(UPLOAD_FOLDER, 'downloaded_image.jpg')

    # image = request.files['image']
    # filename = secure_filename(image.filename)
    # image_path = os.path.join(UPLOAD_FOLDER, filename)
    # image.save(image_path)

    try:
        result = process_image(image_path)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
# @user_blueprint.route('/image-analysis', methods=['POST'])
# def analyze_image():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image uploaded"}), 400

#     image = request.files['image']
#     filename = secure_filename(image.filename)
#     image_path = os.path.join(UPLOAD_FOLDER, filename)
#     image.save(image_path)

#     try:
#         result = process_image(image_path)
#         return jsonify(result), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    
    
    
    
    
    
# @user_blueprint.route("/register", methods=["POST"])
# def register_user():
#     data = request.get_json()
#     print("Registering user:", data)
#     return jsonify({"message": "User registered"}), 201

# @user_blueprint.route("/login", methods=["POST"])
# def login_user():
#     data = request.get_json()
#     return jsonify({"message": "Login successful", "token": "fake-token"}), 200

# @user_blueprint.route("/logout", methods=["POST"])
# def logout_user():
#     return jsonify({"message": "User logged out"}), 200

# @user_blueprint.route("/refresh-tokens", methods=["POST"])
# def refresh_tokens():
#     return jsonify({"accessToken": "new-access", "refreshToken": "new-refresh"}), 200

# @user_blueprint.route("/image-analysis", methods=["POST"])
# def analyze_image():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image uploaded"}), 400
#     image = request.files['image']
#     image.save(f"uploads/{image.filename}")
#     return jsonify({"message": "Image uploaded"}), 200
