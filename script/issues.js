console.log("connected issusessss");

let allIssues = [];

// page load

const fetchIssues = async () => {
  const loadingSpinner = document.getElementById("loading-spinner");
  const issueContainer = document.getElementById("issue-container");

  loadingSpinner.classList.remove("hidden");
  issueContainer.innerHTML = "";

  const res = await fetch("http://phi-lab-server.vercel.app/api/v1/lab/issues");
  const data = res.json();

  //   data set

  allIssues = Array.isArray(data) ? data : data.data || [];

  loadingSpinner.classList.add("hidden");

  
};
