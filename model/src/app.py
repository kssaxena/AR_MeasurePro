from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from routes.users_routes import user_blueprint  # Flask equivalent of user.routes.js

# Setup Flask app
app = Flask(__name__, static_folder="public", static_url_path="/public")

# Configure CORS (similar to corsOptions in Express)
allowed_origins = [os.getenv("ORIGIN_2")]
CORS(app, origins=allowed_origins, supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE"],
     allow_headers=["Content-Type", "Authorization"])

# Middleware - Logging every request
@app.before_request
def log_request_info():
    print("--------------------------------")
    print("Received:", request.method)
    print("at:", request.url)
    if request.is_json:
        print("with JSON body:", request.get_json())
    elif request.content_type and request.content_type.startswith("text/"):
        print("with Text body:", request.data.decode('utf-8'))
    else:
        print("with Form body:", request.form)

# Serving static files like Express's app.use(express.static('public'))
@app.route('/public/<path:filename>')
def static_files(filename):
    return send_from_directory('public', filename)

# Register blueprints (routes)
app.register_blueprint(user_blueprint, url_prefix="/api/v1/users")

# Server runner
if __name__ == "__main__":
    app.run(port=5001, debug=True)
