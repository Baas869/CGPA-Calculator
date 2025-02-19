import React, { useState } from "react"; // ✅ Removed useEffect
import axios from "axios";
import { toast } from "react-toastify";

const CGPA = ({ semesters }) => {
  const [predictedCGPA, setPredictedCGPA] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to calculate GPA for each semester
  const calculateSemesterGPA = (semester) => {
    let totalUnits = 0;
    let totalGradePoints = 0;

    semester.courses.forEach((course) => {
      totalUnits += parseInt(course.unit);
      totalGradePoints += parseInt(course.unit) * parseInt(course.grade);
    });

    let gpa = (totalGradePoints / totalUnits).toFixed(2);
    return isNaN(gpa) ? 0 : parseFloat(gpa);
  };

  // Extract past GPAs
  const pastGPAList = semesters.map((semester) => calculateSemesterGPA(semester));

  // Function to predict CGPA
  const predictCGPA = async () => {
    if (semesters.length === 0) {
      toast.error("❌ No semester data available!");
      return;
    }

    const payload = {
      years_course: semesters.length, // Number of semesters
      past_sgp: pastGPAList, // List of GPAs from each semester
    };

    console.log("📤 Sending CGPA Prediction Request:", payload);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://cgpacalculator-0ani.onrender.com/predict/predict_cgpa",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ CGPA Prediction Response:", response.data);
      if (response.data && response.data.predicted_cgpa) {
        setPredictedCGPA(response.data.predicted_cgpa.toFixed(2));
        toast.success(`✅ Predicted CGPA: ${response.data.predicted_cgpa.toFixed(2)}`);
      } else {
        toast.error("⚠️ Failed to predict CGPA.");
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

      {predictedCGPA !== null && (
        <p className="text-lg font-semibold text-blue-500 mt-2">
          📊 Predicted CGPA: {predictedCGPA}
        </p>
      )}

      <button
        onClick={predictCGPA}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
        disabled={loading}
      >
        {loading ? "Calculating..." : "Predict CGPA"}
      </button>
    </div>
  );
};

export default CGPA;
