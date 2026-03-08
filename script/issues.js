let allIssues = [];

// ১. পেজ লোড হওয়ার সাথে সাথে ডেটা ফেচ করা
const fetchIssues = async () => {
    const loadingSpinner = document.getElementById('loading-spinner');
    const issueContainer = document.getElementById("issue-container");
    
    loadingSpinner.classList.remove('hidden');
    issueContainer.innerHTML = "";

    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await res.json();
        
        // ফিক্স: যদি ডাটা সরাসরি অ্যারে না হয়, তবে data.data চেক করা
        allIssues = Array.isArray(data) ? data : (data.data || []);
        
        displayIssues(allIssues);
        updateCounts(allIssues);
    } catch (error) {
        console.error("Error fetching issues:", error);
    } finally {
        loadingSpinner.classList.add('hidden');
    }
};

// ২. ইস্যুগুলো কার্ড আকারে দেখানো
const displayIssues = (issues) => {
    const issueContainer = document.getElementById("issue-container");
    issueContainer.innerHTML = "";

    // সেফটি চেক: যদি issues অ্যারে না হয়
    if (!Array.isArray(issues)) {
        console.error("Expected an array but got:", issues);
        return;
    }

    issues.forEach((issue) => {
        // Figma রিকোয়ারমেন্ট: open = Green, closed = Purple top border
        const borderStatus = issue.status === "open" ? "border-green-500" : "border-purple-500";

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

// ৩. ট্যাব ফিল্টার (All, Open, Closed)
const filterIssues = (status, element) => {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => tab.classList.remove("tab-active", "bg-blue-500", "text-white", "rounded-xl"));
    
    element.classList.add("tab-active", "bg-blue-500", "text-white", "rounded-xl");

    if (status === 'all') {
        displayIssues(allIssues);
    } else {
        const filtered = allIssues.filter(item => item.status === status);
        displayIssues(filtered);
    }
};

// ৪. সার্চ ফাংশন
const handleSearch = async () => {
    const searchText = document.getElementById("searchInput").value;
    if (!searchText) return;
    
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.classList.remove('hidden');

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
        const data = await res.json();
        
        // সার্চ রেজাল্ট অ্যারে কি না চেক করা
        const searchResults = Array.isArray(data) ? data : (data.data || []);
        displayIssues(searchResults);
    } catch (error) {
        console.error("Search error:", error);
    } finally {
        loadingSpinner.classList.add('hidden');
    }
};

// ৫. মডাল এর মাধ্যমে ডিটেইলস দেখানো
const showIssueDetails = async (id) => {
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await res.json();
        const issue = data.data || data; // API রেসপন্স ফরম্যাট অনুযায়ী হ্যান্ডেল করা

        const modalContent = document.getElementById("my_modal_content");
        modalContent.innerHTML = `
            <div class="space-y-4">
                <h2 class="text-2xl font-bold text-gray-800">${issue.title}</h2>
                <div class="flex gap-2">
                    <span class="badge ${issue.status === 'open' ? 'badge-success' : 'badge-secondary'} text-white">${issue.status.toUpperCase()}</span>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-700 leading-relaxed">${issue.description}</p>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Priority:</strong> ${issue.priority}</p>
                    <p><strong>Author:</strong> ${issue.author}</p>
                    <p><strong>Category:</strong> ${issue.category}</p>
                </div>
            </div>
        `;
        document.getElementById("my_modal").showModal();
    } catch (error) {
        console.error("Detail fetch error:", error);
    }
};

// ৬. ওপেন এবং ক্লোজড কাউন্ট আপডেট
const updateCounts = (issues) => {
    const open = issues.filter(i => i.status === "open").length;
    const closed = issues.filter(i => i.status === "closed").length;
    document.getElementById("openCount").innerText = open;
    document.getElementById("closedCount").innerText = closed;
};

// পেজ লোড হলে কল হবে
fetchIssues();