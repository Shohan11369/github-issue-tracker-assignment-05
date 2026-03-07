console.log("hellooo connectedd");

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("username");
  const username = user.value;

  const pass = document.getElementById("password");
  const password = pass.value;

  if (username === "admin" && password === "admin123") {
    window.location.href = "/index.html";
  } else {
    alert("Wrong password or username");
  }
});
