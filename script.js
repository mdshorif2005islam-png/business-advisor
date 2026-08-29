// ============================================================
// টাস্ক ম্যানেজার অ্যাপ - সম্পূর্ণ লজিক
// ============================================================

// ============================================================
// ১. ডেটা স্টোরেজ (LocalStorage)
// ============================================================

// LocalStorage থেকে টাস্ক লোড করা
function loadTasks() {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
}

// LocalStorage-এ টাস্ক সেভ করা
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ============================================================
// ২. টাস্ক ক্রিয়েশন
// ============================================================

// নতুন টাস্ক তৈরি করা
function createTask(text, date, category) {
    return {
        id: Date.now(), // ইউনিক আইডি
        text: text,
        date: date,
        category: category,
        completed: false,
        createdAt: new Date().toISOString()
    };
}

// ============================================================
// ৩. টাস্ক রেন্ডারিং (ডিসপ্লে)
// ============================================================

// টাস্ক লিস্ট রেন্ডার করা
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <h3>📭 কোনো টাস্ক নেই</h3>
                <p>উপরে নতুন টাস্ক যোগ করুন!</p>
            </div>
        `;
        updateStats(tasks);
        return;
    }

    let html = '';
    tasks.forEach(task => {
        const completedClass = task.completed ? 'completed' : '';
        const dateDisplay = task.date ? `📅 ${formatDate(task.date)}` : '';
        
        html += `
            <div class="task-item ${completedClass}" data-id="${task.id}">
                <div class="task-info">
                    <div class="task-text">${escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="category">${task.category || 'জেনারেল'}</span>
                        ${dateDisplay ? `<span>${dateDisplay}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="complete-btn" onclick="toggleTask(${task.id})">
                        ${task.completed ? '↩️ ফিরিয়ে নিন' : '✅ সম্পন্ন'}
                    </button>
                    <button class="edit-btn" onclick="editTask(${task.id})">✏️</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            </div>
        `;
    });

    taskList.innerHTML = html;
    updateStats(tasks);
}

// ============================================================
// ৪. হেল্পার ফাংশন
// ============================================================

// HTML এস্কেপ (XSS প্রতিরোধ)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// তারিখ ফরম্যাট
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// ============================================================
// ৫. টাস্ক অপারেশন (CRUD)
// ============================================================

// টাস্ক যোগ করা
function addTask() {
    const input = document.getElementById('taskInput');
    const dateInput = document.getElementById('taskDate');
    const categorySelect = document.getElementById('taskCategory');
    
    const text = input.value.trim();
    if (!text) {
        alert('⚠️ দয়া করে একটি টাস্ক লিখুন!');
        return;
    }

    const tasks = loadTasks();
    const newTask = createTask(text, dateInput.value, categorySelect.value);
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks(tasks);

    // ইনপুট ফিল্ড খালি করা
    input.value = '';
    dateInput.value = '';
    input.focus();
}

// টাস্ক টগল (সম্পন্ন/অসম্পন্ন)
function toggleTask(id) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks(tasks);
    }
}

// টাস্ক ডিলিট
function deleteTask(id) {
    if (confirm('🗑️ এই টাস্কটি ডিলিট করতে চান?')) {
        let tasks = loadTasks();
        tasks = tasks.filter(t => t.id !== id);
        saveTasks(tasks);
        renderTasks(tasks);
    }
}

// টাস্ক এডিট
function editTask(id) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('✏️ টাস্ক আপডেট করুন:', task.text);
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasks(tasks);
        renderTasks(tasks);
    }
}

// ============================================================
// ৬. ফিল্টার ও সার্চ
// ============================================================

// ফিল্টার করা টাস্ক পাওয়া
function getFilteredTasks() {
    const tasks = loadTasks();
    const category = document.getElementById('filterCategory').value;
    const search = document.getElementById('searchInput').value.toLowerCase().trim();

    let filtered = tasks;

    // ক্যাটাগরি ফিল্টার
    if (category !== 'সব') {
        filtered = filtered.filter(t => t.category === category);
    }

    // সার্চ ফিল্টার
    if (search) {
        filtered = filtered.filter(t => 
            t.text.toLowerCase().includes(search)
        );
    }

    return filtered;
}

// ফিল্টার প্রয়োগ
function applyFilters() {
    const filtered = getFilteredTasks();
    renderTasks(filtered);
}

// ============================================================
// ৭. পরিসংখ্যান (স্ট্যাটস)
// ============================================================

// টাস্ক স্ট্যাটস আপডেট
function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

// ============================================================
// ৮. সব টাস্ক ডিলিট
// ============================================================

function clearAllTasks() {
    if (confirm('⚠️ সব টাস্ক ডিলিট করতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না!')) {
        saveTasks([]);
        renderTasks([]);
    }
}

// ============================================================
// ৯. ইভেন্ট লিসেনার
// ============================================================

// DOM রেডি হলে
document.addEventListener('DOMContentLoaded', function() {
    // টাস্ক লোড
    const tasks = loadTasks();
    renderTasks(tasks);

    // অ্যাড বাটন
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    
    // এন্টার কী
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    // ফিল্টার
    document.getElementById('filterCategory').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);

    // ক্লিয়ার অল
    document.getElementById('clearAllBtn').addEventListener('click', clearAllTasks);
});

// ============================================================
// ১০. গ্লোবাল ফাংশন (HTML-এ onclick কাজ করার জন্য)
// ============================================================
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.editTask = editTask;