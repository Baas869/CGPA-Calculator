import React, { useState, useCallback, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const CGPA = ({ semesters = [] }) => {
  const { token } = useContext(AuthContext);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to calculate SGPA for a single semester (weighted average)
  const calculateSemesterGPA = useCallback((semester) => {
    if (!semester || !semester.courses || semester.courses.length === 0) return 0;
    let totalUnits = 0;
    let totalGradePoints = 0;
    semester.courses.forEach((course) => {
      const unit = parseFloat(course.unit) || 0;
      const grade = parseFloat(course.grade) || 0;
      totalUnits += unit;
      totalGradePoints += unit * grade;
    });
    return totalUnits > 0 ? totalGradePoints / totalUnits : 0;
  }, []);

  // Build an array of semester GPAs (SGPAs)
  const pastGPAList = semesters.map((semester) => calculateSemesterGPA(semester));

  // Compute current CGPA as the arithmetic mean of the semester GPAs
  const currentCGPA =
    pastGPAList.length > 0
      ? (
          pastGPAList.reduce((sum, sgpa) => sum + sgpa, 0) / pastGPAList.length
        ).toFixed(2)
      : "0.00";

  // Function to predict CGPA using the backend predict API.
  const predictCGPA = async () => {
    if (!Array.isArray(semesters) || semesters.length === 0) {
      toast.error("❌ No semester data available!");
      return;
    }
    if (pastGPAList.every((gpa) => gpa === 0)) {
      toast.warning("⚠️ Please enter valid grades before predicting CGPA.");
      return;
    }

    const payload = {
      // Use the number of years (each year = 2 semesters)
      years_course: semesters.length / 2, 
      past_sgp: pastGPAList,
    };

    console.log("📤 Sending CGPA Prediction Request:", payload);

    try {
      setLoading(true);
      const response = await axios.post(
        `https://cgpacalculator-0ani.onrender.com/predict/predict_cgpa?session_token=${token}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ CGPA Prediction Response:", response.data);
      if (response.data && response.data.predicted_next_cgpa !== undefined) {
        setPrediction(response.data);
        toast.success(`✅ Predicted CGPA: ${response.data.predicted_next_cgpa.toFixed(2)}`);
      } else {
        toast.error("⚠️ Failed to predict CGPA. Please try again.");
      }
    } catch (error) {
      console.error("❌ CGPA Prediction Error:", error);
      toast.error("❌ Error predicting CGPA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded bg-white shadow-md text-center">
      <h2 className="text-xl font-bold text-green-600">CGPA Predictor</h2>
      <p className="text-gray-600">Predict your CGPA based on past semester results.</p>
      
      {/* Display the current CGPA computed as the arithmetic mean of semester SGPAs */}
      <div className="mt-4">
        <p className="text-lg font-semibold">
          <strong>Current CGPA:</strong> {currentCGPA}
        </p>
      </div>

      {prediction && (
        <div className="mt-4 text-lg">
          <p>
            <strong>Predicted Next CGPA:</strong> {prediction.predicted_next_cgpa}
          </p>
          <p>
            <strong>Predicted Graduation Class:</strong> {prediction.predicted_graduation_class}
          </p>
          <p>
            <strong>Improvement Suggestion:</strong> {prediction.improvement_suggestion}
          </p>
        </div>
      )}

      <button
        onClick={predictCGPA}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 w-full max-w-sm"
        disabled={loading}
      >
        {loading ? "Calculating..." : "Predict CGPA"}
      </button>
    </div>
  );
};

export default CGPA;
