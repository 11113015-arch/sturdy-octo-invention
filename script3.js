
let todoItems = JSON.parse(localStorage.getItem('ai_todo_list')) || [];

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    const addBtn = document.getElementById("add-btn");
    addBtn.addEventListener("click", handleAddTodo);
    
   
    document.getElementById("todo-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleAddTodo();
    });

   
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }

    renderTodos();
    recheckActiveReminders();
}


function recheckActiveReminders() {
    const now = new Date();
    todoItems.forEach(item => {
        if (!item.completed && item.reminderTime) {
            const delay = new Date(item.reminderTime) - now;
            if (delay > 0) {
                setupTimeoutReminder(item.text, item.reminderTime, delay);
            }
        }
    });
}

function handleAddTodo() {
    const input = document.getElementById("todo-input");
    const timeInput = document.getElementById("todo-time");
    
    const text = input.value.trim();
    const reminderTime = timeInput.value;
    
    if (!text) {
        alert("請先輸入一些事情內容唷！");
        return;
    }

    const newItem = {
        id: Date.now(),
        text: text,
        reminderTime: reminderTime || null,
        completed: false
    };

    todoItems.push(newItem);
    saveAndRefresh();

    
    if (reminderTime) {
        const delay = new Date(reminderTime) - new Date();
        if (delay > 0) {
            setupTimeoutReminder(text, reminderTime, delay);
        }
    }

    input.value = "";
    timeInput.value = "";
}

function setupTimeoutReminder(text, isoTimeStr, delay) {
    setTimeout(() => {
        
        const currentItem = todoItems.find(i => i.text === text && i.reminderTime === isoTimeStr);
        if (currentItem && !currentItem.completed) {
            if (Notification.permission === "granted") {
                new Notification("⏳ 智能事項提醒", {
                    body: `該執行這件事囉：${text}\n設定時間：${new Date(isoTimeStr).toLocaleString()}`,
                    icon: "https://cdn-icons-png.flaticon.com/512/2098/2098402.png"
                });
            }
        }
    }, delay);
}

function toggleItem(id) {
    todoItems = todoItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveAndRefresh();
}

function deleteItem(id) {
    todoItems = todoItems.filter(item => item.id !== id);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('ai_todo_list', JSON.stringify(todoItems));
    renderTodos();
}


function renderTodos() {
    const listContainer = document.getElementById("todo-list");
    listContainer.innerHTML = "";

    if (todoItems.length === 0) {
        listContainer.innerHTML = `<li class="empty-state">目前沒有任何待辦事項</li>`;
        return;
    }

    todoItems.forEach(item => {
        const li = document.createElement("li");
        li.className = `todo-card-item ${item.completed ? 'completed' : ''}`;
        
        
        const contentDiv = document.createElement("div");
        contentDiv.className = "item-body";
        contentDiv.addEventListener("click", () => toggleItem(item.id));

        const titleSpan = document.createElement("span");
        titleSpan.className = "item-title";
        titleSpan.textContent = item.text;

        const timeSpan = document.createElement("span");
        timeSpan.className = "item-time";
        timeSpan.textContent = item.reminderTime 
            ? `⏰ 提醒: ${new Date(item.reminderTime).toLocaleString()}` 
            : "❄️ 無設定提醒時間";

        contentDiv.appendChild(titleSpan);
        contentDiv.appendChild(timeSpan);

        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "✕";
        deleteBtn.title = "單擊刪除此項目";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            deleteItem(item.id);
        });

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        listContainer.appendChild(li);
    });
}