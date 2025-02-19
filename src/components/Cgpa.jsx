import React, { useState, useEffect } from "react"; // ✅ Keep useEffect if needed
import axios from "axios";
import { toast } from "react-toastify";

const CGPA = ({ semesters }) => {
  const [predictedCGPA, setPredictedCGPA] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const pastGPAList = semesters.map((semester) => calculateSemesterGPA(semester));

  useEffect(() => {
    // Automatically predict CGPA when semesters change
    if (semesters.length > 0) {
      predictCGPA();
    }
  }, [semesters]);

  const predictCGPA = async () => {
    if (semesters.length === 0) return;

    const payload = {
      years_course: semesters.length,
      past_sgp: pastGPAList,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://cgpacalculator-0ani.onrender.com/predict/predict_cgpa",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.predicted_cgpa) {
        setPredictedCGPA(response.data.predicted_cgpa.toFixed(2));
      }
    } catch (error) {
      console.error("CGPA Prediction Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>CGPA Predictor</h2>
      {predictedCGPA && <p>Predicted CGPA: {predictedCGPA}</p>}
      <button onClick={predictCGPA} disabled={loading}>
        {loading ? "Calculating..." : "Predict CGPA"}
      </button>
    </div>
  );
};

export default CGPA;
