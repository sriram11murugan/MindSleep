async function sendPrediction(data){

    const response = await fetch("https://your-backend-url/predict", { // 🔥 change this
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if(!response.ok){
        throw new Error("Server Error");
    }

    return await response.json();
}

function validateInput(data){
    const requiredFields = [
        "sleep_hours",
        "heart_rate",
        "spo2",
        "movement",
        "sleep_score"
    ];

    for(const field of requiredFields){
        if(data[field] === undefined || data[field] === null){
            throw new Error(`Missing field: ${field}`);
        }
    }

    return true;
}

function normalizeInput(data){
    return {
        sleep_hours: Number(data.sleep_hours),
        heart_rate: Number(data.heart_rate),
        spo2: Number(data.spo2),
        movement: Number(data.movement),
        sleep_score: Number(data.sleep_score)
    };
}

function mapRiskLevel(riskCode){

    if(riskCode === 0){
        return {
            level: "Normal",
            color: "normal"
        };
    }

    if(riskCode === 1){
        return {
            level: "High Risk",
            color: "high"
        };
    }

    return {
        level: "Unknown",
        color: "mild"
    };
}

export async function runPrediction(rawData){

    try{
        validateInput(rawData);

        const cleanData = normalizeInput(rawData);

        const result = await sendPrediction(cleanData);

        const riskInfo = mapRiskLevel(result.risk_code);

        return {
            riskCode: result.risk_code,
            riskLevel: riskInfo.level,
            uiClass: riskInfo.color,
            logistic: result.logistic_result,
            randomForest: result.random_forest_result,
            cluster: result.kmeans_cluster
        };

    }catch(error){

        console.error("Prediction Error:", error.message);

        return {
            riskCode: -1,
            riskLevel: "Error",
            uiClass: "mild"
        };
    }
}