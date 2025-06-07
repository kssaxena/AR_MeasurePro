from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import cv2
import numpy as np
import math
import pandas as pd

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---- Function 1: Classify shape ----
def classify_shape(contour):
    epsilon = 0.02 * cv2.arcLength(contour, True)
    approx = cv2.approxPolyDP(contour, epsilon, True)
    vertices = len(approx)

    area = cv2.contourArea(contour)
    perimeter = cv2.arcLength(contour, True)
    x, y, w, h = cv2.boundingRect(contour)
    aspect_ratio = float(w) / h

    if perimeter > 0:
        circularity = 4 * math.pi * area / (perimeter * perimeter)
    else:
        circularity = 0

    if vertices == 3:
        return "Triangle"
    elif vertices == 4:
        if 0.95 <= aspect_ratio <= 1.05:
            return "Square"
        else:
            return "Rectangle"
    elif circularity > 0.7:
        return "Circle"
    elif vertices > 10:
        if 0.7 <= aspect_ratio <= 1.3:
            return "Circle"
        else:
            return "Ellipse"
    else:
        return f"Polygon ({vertices} sides)"

# ---- Function 2: Measurement Accuracy ----
def calculate_measurement_accuracy(contour, pixels_per_cm):
    area = cv2.contourArea(contour)
    perimeter = cv2.arcLength(contour, True)
    epsilon = 0.02 * perimeter
    approx = cv2.approxPolyDP(contour, epsilon, True)
    smoothness = len(approx) / len(contour) if len(contour) > 0 else 1

    size_factor = min(1.0, area / 10000)
    x, y, w, h = cv2.boundingRect(contour)
    rect_area = w * h
    fill_ratio = area / rect_area if rect_area > 0 else 0

    base_accuracy = 85
    smoothness_penalty = (1 - smoothness) * 10
    size_bonus = size_factor * 10
    edge_bonus = fill_ratio * 5

    accuracy = base_accuracy - smoothness_penalty + size_bonus + edge_bonus
    accuracy = max(70, min(95, accuracy))

    return round(accuracy, 1)

# ---- Function 3: Full Image Processing ----
def process_image(image_path, pixels_per_cm=10.0):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Failed to read the image.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)
    contours, _ = cv2.findContours(edges.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    results = []
    total_accuracy = 0
    detected_objects = 0

    for i, c in enumerate(contours):
        if cv2.contourArea(c) < 100:
            continue

        rect = cv2.minAreaRect(c)
        (x, y), (w, h), angle = rect
        if w == 0 or h == 0:
            continue

        width_cm = round(w / pixels_per_cm, 2)
        height_cm = round(h / pixels_per_cm, 2)
        shape_type = classify_shape(c)
        accuracy = calculate_measurement_accuracy(c, pixels_per_cm)

        total_accuracy += accuracy
        detected_objects += 1

        results.append({
            "Object #": i + 1,
            "Shape": shape_type,
            "Length (cm)": max(width_cm, height_cm),
            "Breadth (cm)": min(width_cm, height_cm),
            "Area (cm²)": round(width_cm * height_cm, 2),
            "Perimeter (cm)": round(2 * (width_cm + height_cm), 2),
            "Accuracy (%)": accuracy
        })

    avg_accuracy = total_accuracy / detected_objects if detected_objects > 0 else 0
    return {
        "total_objects": detected_objects,
        "average_accuracy": avg_accuracy,
        "results": results,
        "image": image
    }
