document.getElementById("addTaskBtn").addEventListener("click", function() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    if (taskText === "") return;
    
    const li = document.createElement("li");
    li.textContent = taskText;
    
    li.addEventListener("click", function() {
        li.classList.toggle("completed");
    });
    
    document.getElementById("taskList").appendChild(li);
    taskInput.value = "";
});