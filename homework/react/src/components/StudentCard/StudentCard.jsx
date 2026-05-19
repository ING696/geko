import React from "react";

function StudentCard({
  name,
  age,
  profession,
  color,
  onDelete,
}) {
  return (
    <div
      style={{
        backgroundColor: color,
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "10px",
        color: "white",
      }}
    >
      <h3>{name}</h3>

      <p>Age: {age}</p>

      <p>Profession: {profession}</p>

      <button onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}

export default StudentCard;