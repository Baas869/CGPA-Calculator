import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Semester from "../semester/Semester.js";
import SemesterButton from "./SemesterButton.js";
import SemiCircleProgressBar from "./CircleProgressBar.jsx";
import { CourseObject, calculateCGPA } from "../../utils.js";
import CGPA from "../../components/Cgpa.jsx"; // ✅ Import CGPA component

function Offers() {
  const [semesters, setSemesters] = useState([]);
  const [activeSemesterID, setActiveSemester] = useState(0);
  const localStorageKey = "results";
  const { isPaid } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    let results = localStorage.getItem(localStorageKey);
    if (results !== null) {
      results = JSON.parse(results);
    }
    if (!results || results.length === 0) {
      results = [{ courses: [new CourseObject("", 0, 5)] }];
    }

    setSemesters(results);
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(semesters));
  }, [semesters]);

  const addCourse = (semesterIndex, course) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses.push(course);
    setSemesters(newSemesters);
  };

  const addSemester = () => {
    const newSemesters = [...semesters, { courses: [new CourseObject("", 0, 5)] }];
    setSemesters(newSemesters);
    setActiveSemester(newSemesters.length - 1);
  };

  const checkIfSemesterActive = (semesterIndex) => semesterIndex === activeSemesterID;

  const handleUnitChange = (semesterIndex, courseIndex, unit) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses[courseIndex].unit = parseInt(unit);
    setSemesters(newSemesters);
  };

  const handleCourseTitleChange = (semesterIndex, courseIndex, title) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses[courseIndex].title = title;
    setSemesters(newSemesters);
  };

  const handleGradeChange = (semesterIndex, courseIndex, grade) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses[courseIndex].grade = grade;
    setSemesters(newSemesters);
  };

  const handleClearCourses = (semesterIndex) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses = [];
    setSemesters(newSemesters);
  };

  const handleDeleteCourse = (semesterIndex, courseIndex) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses.splice(courseIndex, 1);
    setSemesters(newSemesters);
  };

  const handleDeleteSemester = (semesterIndex) => {
    if (semesters.length === 1) {
      handleClearCourses(semesterIndex);
      return;
    }
    const newSemesters = [...semesters];
    newSemesters.splice(semesterIndex, 1);
    if (semesterIndex === activeSemesterID) {
      setActiveSemester(Math.max(activeSemesterID - 1, 0));
    }
    setSemesters(newSemesters);
  };

  const handleViewAnalysis = () => {
    const element = document.getElementById("details-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const results = calculateCGPA(semesters); // ✅ Used correctly

  return (
    <>
      {!isPaid && (
        <div className="bg-yellow-200 p-3 rounded flex justify-between items-center mb-4">
          <span className="text-yellow-800">
            Your account is currently disabled until you complete your payment.
          </span>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
            onClick={() => navigate("/payment")}
          >
            Make Payment
          </button>
        </div>
      )}

      <div className="content flex flex-col grow p-3 px-7 gap-1">
        <span className="content__header mb-2 border-b-4 border-[#00cc66] self-start pb-3">
          GPA CALCULATOR
        </span>

        <div className="flex flex-col md:flex-row border-b-2 pb-3">
          <div className="w-52 ml-auto mr-auto">
            <SemiCircleProgressBar value={results.CGPA} />
          </div>
          <div className="flex flex-col">
            <span className="mb-4">
              <span>Units Total: {results.totalUnits}</span>
            </span>
            <button className="bg-[#00cc66] p-3 rounded text-white" onClick={handleViewAnalysis}>
              View Analysis
            </button>
          </div>
        </div>

        <div className="flex whitespace-nowrap flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {semesters.map((semester, index) => (
              <SemesterButton
                key={index}
                id={index}
                active={checkIfSemesterActive(index)}
                onClick={() => setActiveSemester(index)}
                handleDeleteSemester={() => handleDeleteSemester(index)}
              />
            ))}
          </div>
          <button
            className="ml-auto rounded border p-2 bg-[#00cc66] text-white"
            onClick={addSemester}
          >
            Add Semester +
          </button>
        </div>

        <div className="flex flex-col bg-white grow p-3">
          {semesters.length > 0 && (
            <Semester
              courses={semesters[activeSemesterID].courses}
              id={activeSemesterID}
              addCourse={addCourse}
              handleGradeChange={handleGradeChange}
              handleUnitChange={handleUnitChange}
              handleCourseTitleChange={handleCourseTitleChange}
              handleClearCourses={() => handleClearCourses(activeSemesterID)}
              handleDeleteCourse={handleDeleteCourse}
            />
          )}

          <div id="details-section" className=""></div>

          {/* ✅ Added CGPA Component & Passed Required Props */}
          <CGPA semesters={semesters} />
        </div>
      </div>
    </>
  );
}

export default Offers;
