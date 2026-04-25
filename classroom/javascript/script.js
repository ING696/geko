// document.getElementById("btn").onclick = () => {
//   document.body.style.backgroundColor =
//     `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
// };
  const cursor = document.querySelector(".cursor");

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });