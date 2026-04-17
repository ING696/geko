const users = [
  { username: "admin", password: "1234", isBlocked: false },
  { username: "john", password: "qwerty", isBlocked: true },
  { username: "anna", password: "pass", isBlocked: false },
];

function login(users, username, password) {
  const user = users.find((u) => u.username === username);

  if (!user) {
    console.log("User is not found");
    return;
  }

  if (user.password !== password) {
    console.log("Invalid password");
    return;
  }

  if (user.isBlocked) {
    console.log("User is blocked");
    return;
  }

  console.log(`Welcome, ${username}`);
}

login(users, "admin", "1234"); 
login(users, "john", "qwerty"); 
login(users, "anna", "wrongpass"); 
login(users, "nonexistent", "pass");
