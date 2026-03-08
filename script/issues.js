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

// issues card

const displayIssues = (issues) => {
  const issueContainer = document.getElementById("issue-container");

  if (!Array.isArray(issues)) return;

  issues.forEach((issue) => {
    const borderStatus =
      issue.status === "open" ? "border-green-500" : "border-purple-500";

    const card = document.createElement("div");
    card.className = `card bg-base-100 shadow-xl border-t-4 ${borderStatus} p-5 cursor-pointer hover:shadow-2xl transition-all`;

    card.onclick = () => showIssueDetails(issue.id);

    card.innerHTML = `
      <div class="space-y-3">
                <h3 class="text-lg font-bold text-gray-800">${issue.title}</h3>
                <p class="text-gray-500 text-sm line-clamp-2">${issue.description}</p>
                
                <div class="flex flex-wrap gap-2 pt-2">
                    <span class="badge badge-sm bg-gray-100 text-gray-700 p-3 border-none">${issue.category}</span>
                    <span class="badge badge-sm bg-blue-50 text-blue-600 p-3 border-none">${issue.priority}</span>
                </div>

                <div class="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                    <span class="font-medium text-gray-600">By: ${issue.author}</span>
                    <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
    `;
    issueContainer.appendChild(card);
  });
};
