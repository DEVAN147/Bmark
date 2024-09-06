// Listen for form submissions
document.getElementById('bookmarkForm').addEventListener('submit', saveBookmark);
document.getElementById('groupForm').addEventListener('submit', addGroup);

// Initialize groups
let groups = JSON.parse(localStorage.getItem('groups')) || [];

// Function to Add a New Group
function addGroup(e) {
    e.preventDefault();

    let groupName = document.getElementById('newGroupName').value.trim();

    if (!groupName) return; // Prevent empty group names

    // Check if group already exists
    if (groups.some(group => group.name === groupName)) {
        alert("Group already exists!");
        return;
    }

    let group = {
        name: groupName,
        bookmarks: []
    };

    groups.push(group);
    localStorage.setItem('groups', JSON.stringify(groups));

    document.getElementById('newGroupName').value = '';

    renderGroups();
    populateGroupSelect();
}

// Function to Save Bookmark
function saveBookmark(e) {
    e.preventDefault();

    let siteName = document.getElementById('siteName').value.trim();
    let siteUrl = document.getElementById('siteUrl').value.trim();
    let groupName = document.getElementById('groupName').value;

    if (!siteName || !siteUrl || !groupName) return; // Validation

    let bookmark = {
        name: siteName,
        url: siteUrl
    };

    // Find the group and add the bookmark to it
    let group = groups.find(g => g.name === groupName);
    group.bookmarks.push(bookmark);

    localStorage.setItem('groups', JSON.stringify(groups));
    document.getElementById('bookmarkForm').reset();

    renderGroups();
}

// Function to Delete Group (Only if Empty)
function deleteGroup(groupName) {
    let group = groups.find(g => g.name === groupName);

    if (group.bookmarks.length > 0) {
        alert("Cannot delete a group with bookmarks!");
        return;
    }

    groups = groups.filter(g => g.name !== groupName);
    localStorage.setItem('groups', JSON.stringify(groups));

    renderGroups();
    populateGroupSelect();
}

// Function to Edit Group Name
function editGroupName(oldName) {
    let newName = prompt("Enter new group name:", oldName);

    if (newName && newName !== oldName) {
        if (groups.some(group => group.name === newName)) {
            alert("Group with this name already exists!");
            return;
        }

        let group = groups.find(g => g.name === oldName);
        group.name = newName;

        localStorage.setItem('groups', JSON.stringify(groups));
        renderGroups();
        populateGroupSelect();
    }
}

// Function to Render Groups and Bookmarks
function renderGroups() {
    let bookmarksList = document.getElementById('bookmarksList');
    bookmarksList.innerHTML = ''; // Clear the list

    groups.forEach(group => {
        let groupDiv = document.createElement('div');
        groupDiv.classList.add('bookmark-group');
        groupDiv.innerHTML = `
            <h2>
                ${group.name} 
                <button class="edit" onclick="editGroupName('${group.name}')">Edit</button>
                <button class="delete" onclick="deleteGroup('${group.name}')">Delete</button>
            </h2>
            <ul>
                ${group.bookmarks.map(b => `
                    <li>
                        <a href="${b.url}" target="_blank">${b.name}</a>
                        <button class="delete" onclick="deleteBookmark('${group.name}', '${b.url}')">Delete</button>
                    </li>
                `).join('')}
            </ul>
        `;
        bookmarksList.appendChild(groupDiv);
    });
}

// Function to Delete a Bookmark
function deleteBookmark(groupName, url) {
    let group = groups.find(g => g.name === groupName);
    group.bookmarks = group.bookmarks.filter(b => b.url !== url);

    localStorage.setItem('groups', JSON.stringify(groups));
    renderGroups();
}

// Function to Populate Group Select (Dropdown)
function populateGroupSelect() {
    let groupSelect = document.getElementById('groupName');
    groupSelect.innerHTML = ''; // Clear existing options

    groups.forEach(group => {
        let option = document.createElement('option');
        option.value = group.name;
        option.textContent = group.name;
        groupSelect.appendChild(option);
    });

    // If no groups exist, show a message
    if (groups.length === 0) {
        groupSelect.innerHTML = '<option value="" disabled>No groups available</option>';
    }
}

// Render groups and populate dropdown on page load
document.addEventListener('DOMContentLoaded', () => {
    renderGroups();
    populateGroupSelect();
});
