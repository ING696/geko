import { useState } from "react";

function StudentForm({ onAdd }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [profession, setProfession] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !age || !profession) return;

    const colors = ["red", "blue", "green", "orange", "purple"];

    const newStudent = {
      id: Date.now(),
      name,
      age,
      profession,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    onAdd(newStudent);

    setName("");
    setAge("");
    setProfession("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <select
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
      >
        <option value="">Choose Profession</option>
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="Designer">Designer</option>
        <option value="QA">QA</option>
      </select>

      <button type="submit">Add Student</button>
    </form>
  );
}

export default StudentForm;