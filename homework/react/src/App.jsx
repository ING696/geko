import { useState } from "react";
import "./App.css";
import StudentForm from "./components/StudentForm/StudentForm";
import StudentList from "./components/StudentList/StudentList";

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const addStudent = (student) => {
    setStudents([...students, student]);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Students App</h1>

      <StudentForm onAdd={addStudent} />

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <StudentList students={filteredStudents} onDelete={deleteStudent} />
    </div>
  );
}

export default App;
