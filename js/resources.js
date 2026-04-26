const resources = [
    {
        id: 1,
        title: "Data Structures using C",
        subject: "Data Structures",
        semester: "2nd Year",
        type: "Notes",
        contributor: "Megha Sharma",
        link: "#",
        tags: ["#DSA", "#C", "#Algorithms"]
    },
    {
        id: 2,
        title: "Database Management Systems",
        subject: "DBMS",
        semester: "3rd Year",
        type: "Notes",
        contributor: "Aditya Verma",
        link: "#",
        tags: ["#SQL", "#Database", "#Normalization"]
    },
    {
        id: 3,
        title: "Operating Systems Hand-written Notes",
        subject: "Operating Systems",
        semester: "3rd Year",
        type: "Notes",
        contributor: "Aditya Verma",
        link: "#",
        tags: ["#OS", "#Kernel", "#Scheduling"]
    },
    {
        id: 4,
        title: "Mid-Term Papers 2024 - Computer Networks",
        subject: "Computer Networks",
        semester: "3rd Year",
        type: "Paper",
        contributor: "College Library",
        link: "#",
        tags: ["#CN", "#Networking", "#TCP_IP"]
    },
    {
        id: 5,
        title: "End-Semester Papers 2023 - All Subjects",
        subject: "General",
        semester: "1st Year",
        type: "Paper",
        contributor: "Student Union",
        link: "#",
        tags: ["#Exams", "#PYQ", "#Freshers"]
    },
    {
        id: 6,
        title: "Software Engineering Question Bank",
        subject: "Software Engineering",
        semester: "3rd Year",
        type: "Notes",
        contributor: "Prof. K. Sharma",
        link: "#",
        tags: ["#SDLC", "#Agile", "#Testing"]
    },
    {
        id: 7,
        title: "TCS NQT Preparation Strategy and Aptitude Questions",
        subject: "Aptitude",
        semester: "4th Year",
        type: "Guide",
        contributor: "Placement Cell",
        link: "#",
        tags: ["#Placement", "#TCS", "#Aptitude"]
    },
    {
        id: 8,
        title: "Top 100 Coding Questions asked in Tech Mahindra / Infosys",
        subject: "Coding Prep",
        semester: "4th Year",
        type: "Guide",
        contributor: "Siddharth Jain",
        link: "#",
        tags: ["#Coding", "#Interview", "#Java"]
    },
    {
        id: 9,
        title: "HR Interview Questions - How to Answer Them Effectively",
        subject: "Interview Prep",
        semester: "4th Year",
        type: "Guide",
        contributor: "Anjali Gupta",
        link: "#",
        tags: ["#SoftSkills", "#HR", "#Interview"]
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('resources-grid');
    const searchInput = document.getElementById('resource-search');
    const subjectFilter = document.getElementById('subject-filter');
    const semesterFilter = document.getElementById('semester-filter');
    const typeFilter = document.getElementById('type-filter');

    function renderResources(filteredResources) {
        if (!grid) return;
        
        grid.innerHTML = '';
        
        if (filteredResources.length === 0) {
            grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;">No resources found matching your criteria.</div>';
            return;
        }

        filteredResources.forEach(res => {
            const card = document.createElement('div');
            card.className = 'card resource-card';
            
            const tagsHtml = res.tags.map(tag => `<span class="tag clickable-tag">${tag}</span>`).join('');
            
            card.innerHTML = `
                <div class="resource-type-badge ${res.type.toLowerCase()}">${res.type}</div>
                <h3 class="resource-title">${res.title}</h3>
                <div class="resource-meta">
                    <span class="meta-item"><strong>Subject:</strong> ${res.subject}</span>
                    <span class="meta-item"><strong>Semester:</strong> ${res.semester}</span>
                </div>
                <div class="resource-contributor">Shared by: ${res.contributor}</div>
                <div class="resource-tags">${tagsHtml}</div>
                <a href="${res.link}" class="btn download-btn">Download Resource</a>
            `;
            
            grid.appendChild(card);
        });

        // Add event listeners to tags for filtering
        document.querySelectorAll('.clickable-tag').forEach(tagSpan => {
            tagSpan.addEventListener('click', () => {
                searchInput.value = tagSpan.textContent;
                filterResources();
            });
        });
    }

    function filterResources() {
        const query = searchInput.value.toLowerCase();
        const subject = subjectFilter.value;
        const semester = semesterFilter.value;
        const type = typeFilter.value;

        const filtered = resources.filter(res => {
            const matchesSearch = res.title.toLowerCase().includes(query) || 
                                res.subject.toLowerCase().includes(query) || 
                                res.tags.some(tag => tag.toLowerCase().includes(query));
            
            const matchesSubject = subject === "" || res.subject === subject;
            const matchesSemester = semester === "" || res.semester === semester;
            const matchesType = type === "" || res.type === type;

            return matchesSearch && matchesSubject && matchesSemester && matchesType;
        });

        renderResources(filtered);
    }

    // Event listeners for real-time filtering
    if (searchInput) searchInput.addEventListener('input', filterResources);
    if (subjectFilter) subjectFilter.addEventListener('change', filterResources);
    if (semesterFilter) semesterFilter.addEventListener('change', filterResources);
    if (typeFilter) typeFilter.addEventListener('change', filterResources);

    // Initial render
    renderResources(resources);
});
