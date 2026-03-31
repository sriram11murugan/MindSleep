from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

from sklearn.cluster import KMeans
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# =========================
# INIT APP
# =========================
app = Flask(__name__)
CORS(app)

# =========================
# LOAD DATA
# =========================
try:
    data = pd.read_csv("sleep_data.csv")
    print("✅ Dataset loaded")
except Exception as e:
    print("❌ Error loading dataset:", e)

# =========================
# PREPARE DATA
# =========================
features = ['sleep_hours', 'heart_rate', 'spo2', 'movement', 'sleep_score']
X = data[features]
y = data['label']

# =========================
# SCALER
# =========================
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# =========================
# MODELS
# =========================
kmeans = KMeans(n_clusters=2, random_state=42)
kmeans.fit(X_scaled)

log_model = LogisticRegression()
log_model.fit(X_scaled, y)

rf_model = RandomForestClassifier(n_estimators=100)
rf_model.fit(X_scaled, y)

print("✅ Models trained successfully")

# =========================
# VALIDATION FUNCTION
# =========================
def validate_input(data):
    for field in features:
        if field not in data:
            return False, f"Missing field: {field}"
    return True, None

# =========================
# HOME ROUTE
# =========================
@app.route("/")
def home():
    return jsonify({
        "message": "MindSleep API Running 🚀"
    })

# =========================
# PREDICTION ROUTE
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Validate
        is_valid, error = validate_input(data)
        if not is_valid:
            return jsonify({"error": error}), 400

        # Convert input
        input_data = [[
            float(data['sleep_hours']),
            float(data['heart_rate']),
            float(data['spo2']),
            float(data['movement']),
            float(data['sleep_score'])
        ]]

        # Scale
        input_scaled = scaler.transform(input_data)

        # Predictions
        kmeans_result = int(kmeans.predict(input_scaled)[0])
        log_result = int(log_model.predict(input_scaled)[0])
        rf_result = int(rf_model.predict(input_scaled)[0])

        # Final decision
        final_status = "Normal"
        risk_code = 0

        if log_result == 1 or rf_result == 1:
            final_status = "Depression Risk"
            risk_code = 1

        return jsonify({
            "kmeans_cluster": kmeans_result,
            "logistic_result": log_result,
            "random_forest_result": rf_result,
            "risk_code": risk_code,
            "final_prediction": final_status
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True)