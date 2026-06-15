
function notifyUser(task, time) {
  
    if (Notification.permission === "granted") {
       
        new Notification("Reminder", {
            body: `Time for: ${task} \nAt: ${time}` 
    }
}

// 
function scheduleReminder(task, time) {
    const now = new Date(); 
    const reminderTime = new Date(time); 
    
   
    const delay = reminderTime - now;
    
  
    if (delay > 0) {
        setTimeout(() => {
            notifyUser(task, reminderTime.toLocaleString()); 
        }, delay);
    }
}


function addTodo() {
    
    const input = document.getElementById("todo-input");
    const timeInput = document.getElementById("todo-time");
    
  
    const newTodoText = input.value.trim();
    const reminderTimeStr = timeInput.value;
   
    if (newTodoText !== "") {
        const todoList = document.getElementById("todo-list");
   
        const li = document.createElement("li");
        li.className = "todo-item";
 
        const textSpan = document.createElement("span");
        textSpan.textContent = newTodoText;
   
        const timeSpan = document.createElement("span");
     
        if (reminderTimeStr) {
            const dateObj = new Date(reminderTimeStr);
            timeSpan.textContent = ` (提醒日期與時間: ${dateObj.toLocaleString()})`;
        } else {
            timeSpan.textContent = " (沒有設定提醒時間)";
        }
        
      
        li.appendChild(textSpan);
        li.appendChild(timeSpan);
        
       
        li.onclick = function() {
            this.classList.toggle("completed"); 
        };
        
       
        li.ondblclick = function() {
            this.remove();
        };
        
      
        todoList.appendChild(li);
        
        
        if (reminderTimeStr) {
            scheduleReminder(newTodoText, reminderTimeStr);
        }
        
        
        input.value = "";
        timeInput.value = "";
    }
}


if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
}