from flask import Blueprint, request, jsonify

user_blueprint = Blueprint("user_blueprint", __name__)

@user_blueprint.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    print("Registering user:", data)
    return jsonify({"message": "User registered"}), 201

@user_blueprint.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    return jsonify({"message": "Login successful", "token": "fake-token"}), 200

@user_blueprint.route("/logout", methods=["POST"])
def logout_user():
    return jsonify({"message": "User logged out"}), 200

@user_blueprint.route("/refresh-tokens", methods=["POST"])
def refresh_tokens():
    return jsonify({"accessToken": "new-access", "refreshToken": "new-refresh"}), 200

@user_blueprint.route("/raw-image-upload", methods=["POST"])
def raw_image_upload():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    image = request.files['image']
    image.save(f"uploads/{image.filename}")
    return jsonify({"message": "Image uploaded"}), 200
