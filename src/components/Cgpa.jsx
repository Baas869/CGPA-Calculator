import React, { useState, useCallback, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const CGPA = ({ semesters = [] }) => {
  const { token } = useContext(AuthContext);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  // New state for the number of years in the course
  const [yearsCourse, setYearsCourse] = useState("");

  // Validate that yearsCourse is a single digit between 1 and 9
  const validateYearsCourse = (value) => /^[1-9]$/.test(value);

  const handleYearsCourseChange = (e) => {
    const value = e.target.value;
    // Allow empty value or a single valid digit
    if (value === "" || validateYearsCourse(value)) {
      setYearsCourse(value);
    } else {
      toast.error("Please enter a single digit between 1 and 9.");
    }
  };

  // Memoized function to calculate GPA for each semester
  const calculateSemesterGPA = useCallback((semester) => {
    if (!semester || !semester.courses || semester.courses.length === 0) return 0;
    let totalUnits = 0;
    let totalGradePoints = 0;
    semester.courses.forEach((course) => {
      const unit = parseInt(course.unit) || 0;
      const grade = parseInt(course.grade) || 0;
      totalUnits += unit;
      totalGradePoints += unit * grade;
    });
    let gpa = totalUnits > 0 ? (totalGradePoints / totalUnits).toFixed(2) : "0.00";
    return parseFloat(gpa);
  }, []);

  // Extract past GPAs safely
  const pastGPAList = semesters.map((semester) => calculateSemesterGPA(semester));

  // Function to predict CGPA using the backend predict API.
  const predictCGPA = async () => {
    if (yearsCourse === "") {
      toast.error("❌ Please enter the number of years in your course.");
      return;
    }
    if (!validateYearsCourse(yearsCourse)) {
      toast.error("❌ The number of years must be a single digit (1-9).");
      return;
    }
    if (!Array.isArray(semesters) || semesters.length === 0) {
      toast.error("❌ No semester data available!");
      return;
    }
    if (pastGPAList.every((gpa) => gpa === 0)) {
      toast.warning("⚠️ Please enter valid grades before predicting CGPA.");
      return;
    }

    const payload = {
      years_course: Number(yearsCourse), // Use the input value
      past_sgp: pastGPAList,              // List of GPAs from each semester
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
    <div className="mt-6 p-6 border rounded-lg bg-green-50 shadow-lg text-center">
      <h2 className="text-3xl font-extrabold text-green-700 mb-4">AI CGPA Predictor</h2>
      <p className="text-lg text-gray-700 mb-4">
        Unlock your academic potential with our AI-powered CGPA Predictor. Simply enter the number of years in your course and let our tool analyze your past semester performance to provide a personalized CGPA prediction, graduation class, and improvement suggestions.
      </p>

      {/* Input for number of years in the course */}
      <div className="my-4">
        <label htmlFor="yearsCourse" className="block font-bold text-green-800 mb-2">
          Enter number of years in your course:
        </label>
        <input
          type="number"
          id="yearsCourse"
          className="border border-green-300 p-2 rounded w-full max-w-xs mx-auto focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="e.g., 4"
          value={yearsCourse}
          onChange={handleYearsCourseChange}
          min="1"
          max="9"
        />
      </div>

      {prediction && (
        <div className="mt-6 text-lg text-gray-800">
          <p className="border-b border-gray-300 border-opacity-50 pb-2 mb-2">
            <strong>Current CGPA:</strong> {prediction.current_cgpa}
          </p>
          <p className="border-b border-gray-300 border-opacity-50 pb-2 mb-2">
            <strong>Predicted Next CGPA:</strong> {prediction.predicted_next_cgpa}
          </p>
          <p className="border-b border-gray-300 border-opacity-50 pb-2 mb-2">
            <strong>Predicted Graduation Class:</strong> {prediction.predicted_graduation_class}
          </p>
          <p className="border-b border-gray-300 border-opacity-50 pb-2 mb-2">
            <strong>Improvement Suggestion:</strong> {prediction.improvement_suggestion}
          </p>
        </div>
      )}

      <button
        onClick={predictCGPA}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full w-full max-w-xs"
        disabled={loading}
      >
        {loading ? "Calculating..." : "Predict CGPA"}
      </button>
    </div>
  );
};

export default CGPA;
