console.log("connected issusessss");

let allIssues = [];

const toggleLoading = (show) => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.toggle("hidden", !show);
};

// page load

const fetchIssues = async () => {
  const loadingSpinner = document.getElementById("loading-spinner");
  const issueContainer = document.getElementById("issue-container");

  loadingSpinner.classList.remove("hidden");
  issueContainer.innerHTML = "";

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  // console.log(data);

  //   data set

  allIssues = data.data || [];

  displayIssues(allIssues);
  updateCounts(allIssues);

  loadingSpinner.classList.add("hidden");
};

// issues card
const displayIssues = (issues) => {
  const issueContainer = document.getElementById("issue-container");
  issueContainer.innerHTML = "";

  if (!Array.isArray(issues)) return;

  issues.forEach((issue) => {
    const borderStatus =
      issue.status === "open" ? "border-green-500" : "border-purple-500";

    const card = document.createElement("div");
    card.className = `card bg-base-100 shadow-xl border-t-4 ${borderStatus} p-5 cursor-pointer hover:shadow-2xl transition-all`;

    card.onclick = () => showIssueDetails(issue.id);

    card.innerHTML = `
       <div class="flex justify-end mb-2">
            <span class="badge badge-sm bg-red-200 text-[16px] text-red-600 px-3 py-4 border-none">${issue.priority}</span>
       </div>
      <div class="space-y-3">
                <h3 class="text-lg font-bold text-gray-800">${issue.title}</h3>
                <p class="text-gray-500 text-sm line-clamp-2">${issue.description}</p>
                
              <div class="flex flex-wrap gap-2 pt-2">
                ${
                  issue.labels
                    ?.map((label, index) => {
                      const colors = [
                        "bg-red-100 text-red-800",
                        "bg-yellow-100 text-red-800",
                        "bg-blue-200 text-gray-800",
                        "bg-green-200 text-gray-800",
                      ];

                      return `<span class="badge badge-sm ${colors[index % colors.length]} px-3 py-4 border-none">${label}</span>`;
                    })
                    .join("") || `<span class="badge badge-sm">No label</span>`
                }
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

// tab-filter all,close,open

const filterIssues = (status, element) => {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) =>
    tab.classList.remove(
      "tab-active",
      "bg-blue-500",
      "text-white",
      "rounded-xl",
    ),
  );

  element.classList.add(
    "tab-active",
    "bg-blue-500",
    "text-white",
    "rounded-xl",
  );

  if (status === "all") {
    filtered = allIssues;
  } else {
    filtered = allIssues.filter((item) => item.status === status);
  }
  displayIssues(filtered);
  updateCounts(filtered);
};

// search function
const handleSearch = async () => {
  const searchInput = document.getElementById("searchInput");
  const searchText = searchInput.value;
  if (!searchText) {
    await fetchIssues();
    return;
  }

  const loadingSpinner = document.getElementById("loading-spinner");
  loadingSpinner.classList.remove("hidden");

  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`,
  );
  const data = await res.json();

  const searchResults = data.data || data;
  allIssues = Array.isArray(searchResults) ? searchResults : [];

  // displayIssues(Array.isArray(searchResults) ? searchResults : []);
  displayIssues(allIssues);

  updateCounts(searchResults);
  loadingSpinner.classList.add("hidden");
};

// open function
const showIssueDetails = async (id) => {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const data = await res.json();
  const issue = data.data || data;

  const modalContent = document.getElementById("my_modal_content");
  modalContent.innerHTML = `
        <div class="space-y-4">
            <h2 class="text-2xl font-bold text-gray-800">${issue.title}</h2>
            <div class="flex gap-2">
                <span class="badge ${issue.status === "open" ? "badge-success" : "badge-secondary"} text-white">${issue.status.toUpperCase()}</span>
                <span class="badge badge-outline">${issue.labels?.join(", ") || "No label"}</span>

            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-700 leading-relaxed">${issue.description}</p>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm pt-4">
                <p><strong >Priority:</strong> ${issue.priority}</p>
                <p><strong>Author:</strong> ${issue.author}</p>
                <p><strong>Labels:</strong> ${issue.labels ? issue.labels.join(", ") : "No labels"}</p>
                <p><strong>Date:</strong> ${new Date(issue.createdAt).toLocaleString()}</p>
            </div>
        </div>
    `;
  document.getElementById("my_modal").showModal();
};

// update
const updateCounts = (issues) => {
  const open = issues.filter((i) => i.status === "open").length;
  const closed = issues.filter((i) => i.status === "closed").length;
  const total = issues.length;

  document.getElementById("openCount").innerText = open;
  document.getElementById("closedCount").innerText = closed;
  document.getElementById("totalCount").innerText = total;
};

fetchIssues();
