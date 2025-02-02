// Task Management
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const prioriteInput = document.getElementById("priorite");
const statusInput = document.getElementById("status");
const sendbtn = document.getElementById("buttonnew");
let taskesinfo = [];

// Pomodoro Timer Elements
const workDurationInput = document.getElementById('workDuration');
const shortBreakTypeSelect = document.getElementById('shortBreakType');
const longBreakTypeSelect = document.getElementById('longBreakType');
const customShortBreakGroup = document.getElementById('customShortBreakGroup');
const customLongBreakGroup = document.getElementById('customLongBreakGroup');
const shortBreakDurationInput = document.getElementById('shortBreakDuration');
const longBreakDurationInput = document.getElementById('longBreakDuration');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDisplay = document.getElementById('timer');
const cyclesCompletedDisplay = document.getElementById('cyclesCompleted');

// Timer State
let timeLeft;
let interval;
let isWorkTime = true;
let cyclesCompleted = 0;

// Form Element
const taskForm = document.getElementById('taskForm');


// Task Functions
sendbtn.addEventListener("click", function () {
    if (!validateForm()) {
        return;
    }
    const task = {
        id: Date.now(),
        title: titleInput.value,
        description: descriptionInput.value,
        priorite: prioriteInput.value,
        isCompleted: statusInput.value === 'completed'
    };

    taskesinfo.push(task);
    showData(task);

    // Reset form
    titleInput.value = "";
    descriptionInput.value = "";
    prioriteInput.value = "basse";
    statusInput.value = "not-completed";

    // reset form styles
    titleInput.classList.remove('is-invalid');
    descriptionInput.classList.remove('is-invalid');
    prioriteInput.classList.remove('is-invalid');
    statusInput.classList.remove('is-invalid');
});

function validateForm() {
    let isValid = true;
  
    if (!titleInput.value.trim()) {
      showError(titleInput, 'Please provide a title.');
      isValid = false;
    } else {
      hideError(titleInput);
    }

    if(prioriteInput.value === ""){
        showError(prioriteInput, 'Please select a priority.');
      isValid = false;
    }else{
        hideError(prioriteInput);
    }
  
     if(statusInput.value === ""){
       showError(statusInput, 'Please select a status.');
      isValid = false;
     } else {
      hideError(statusInput);
    }
  
    return isValid;
}

function showData(task) {
    const parentElem = document.getElementById("tasks-list");
    const elem = document.createElement("li");
    elem.className = "list-group-item py-3";
    elem.id = `li-${task.id}`;

    elem.innerHTML = `
        <div>
            <h5 class="mb-1">${task.title || "Untitled Task"}</h5>
            <p class="mb-2 text-muted small">${task.description || "No description provided."}</p>
            <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-${getPriorityClass(task.priorite)}">${task.priorite}</span>
                <select class="form-select-sm status-select" data-task-id="${task.id}">
                    <option value="completed" ${task.isCompleted ? 'selected' : ''}>Completed</option>
                    <option value="not-completed" ${!task.isCompleted ? 'selected' : ''}>Not Completed</option>
                </select>
                <div>
                    <button class="btn btn-sm btn-success me-1" onclick="editTask('${task.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
                </div>
            </div>
        </div>
    `;

    parentElem.appendChild(elem);
}

function getPriorityClass(priority) {
    switch (priority.toLowerCase()) {
        case "haute": return "danger";
        case "moyenne": return "warning";
        case "basse": return "success";
        default: return "secondary";
    }
}

function editTask(taskId) {
    const task = taskesinfo.find(t => t.id == taskId);
    if (task) {
        titleInput.value = task.title;
        descriptionInput.value = task.description;
        prioriteInput.value = task.priorite;
        statusInput.value = task.isCompleted ? 'completed' : 'not-completed';
        deleteTask(taskId);
    }
}

function deleteTask(taskId) {
    taskesinfo = taskesinfo.filter(t => t.id != taskId);
    document.getElementById(`li-${taskId}`)?.remove();
}

// Pomodoro Timer Functions
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function getBreakDuration() {
   let shortBreakDuration = parseInt(shortBreakTypeSelect.value) * 60;
   let longBreakDuration = parseInt(longBreakTypeSelect.value) * 60;


    if (shortBreakTypeSelect.value === 'custom') {
        shortBreakDuration = parseInt(shortBreakDurationInput.value) * 60;
    }

   if(cyclesCompleted % 4 === 0){
       if(longBreakTypeSelect.value === 'custom'){
           longBreakDuration = parseInt(longBreakDurationInput.value) * 60;
       }
       return longBreakDuration;
   }else{
    return shortBreakDuration;
   }
}

function startTimer() {
     if (!validateWorkDuration(workDurationInput.value) ) {
        return;
    }
     if (shortBreakTypeSelect.value === 'custom' &&
         !validateShortBreak(shortBreakDurationInput.value)) {
         return;
    }
    
    if (longBreakTypeSelect.value === 'custom' &&
         !validateLongBreak(longBreakDurationInput.value)) {
        return;
    }
    if (!interval) {
        interval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimer();
            } else {
                clearInterval(interval);
                interval = null;
                if (isWorkTime) {
                    cyclesCompleted++;
                    cyclesCompletedDisplay.textContent = `Cycles terminés : ${cyclesCompleted}`;
                    timeLeft = getBreakDuration();
                } else {
                    timeLeft = parseInt(workDurationInput.value) * 60;
                }
                isWorkTime = !isWorkTime;
                startTimer();
            }
        }, 1000);
    }
}

// Event Listeners
document.addEventListener('change', e => {
    if (e.target.classList.contains('status-select')) {
        const taskId = e.target.dataset.taskId;
        const task = taskesinfo.find(t => t.id == taskId);
        if (task) task.isCompleted = e.target.value === 'completed';
    }
});

shortBreakTypeSelect.addEventListener('change', () => {
    customShortBreakGroup.style.display = shortBreakTypeSelect.value === 'custom' ? 'block' : 'none';
});

longBreakTypeSelect.addEventListener('change', () => {
    customLongBreakGroup.style.display = longBreakTypeSelect.value === 'custom' ? 'block' : 'none';
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', () => clearInterval(interval));
resetBtn.addEventListener('click', () => {
    clearInterval(interval);
    interval = null;
    timeLeft = parseInt(workDurationInput.value) * 60;
    isWorkTime = true;
    updateTimer();
});

// Initialize
timeLeft = parseInt(workDurationInput.value) * 60;
updateTimer();


// Add proper error handling functions
function showError(input, message) {
    const formControl = input.closest('.form-group');
    const errorDisplay = formControl.querySelector('.invalid-feedback');
    input.classList.add('is-invalid');
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
}

function hideError(input) {
    const formControl = input.closest('.form-group');
    const errorDisplay = formControl.querySelector('.invalid-feedback');
    input.classList.remove('is-invalid');
    errorDisplay.textContent = '';
    errorDisplay.style.display = 'none';
}

// Update validation functions
function validateWorkDuration(value) {
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 60) {
        showError(workDurationInput, 'La durée doit être entre 1 et 60 minutes');
        return false;
    }
    hideError(workDurationInput);
    return true;
}

function validateShortBreak(value) {
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 15) {
        showError(shortBreakDurationInput, 'La pause courte doit être entre 1 et 15 minutes');
        return false;
    }
    hideError(shortBreakDurationInput);
    return true;
}

function validateLongBreak(value) {
    const num = parseInt(value);
    if (isNaN(num) || num < 5 || num > 30) {
        showError(longBreakDurationInput, 'La pause longue doit être entre 5 et 30 minutes');
        return false;
    }
    hideError(longBreakDurationInput);
    return true;
}

// Update input event listeners
workDurationInput.addEventListener('input', () => {
    validateWorkDuration(workDurationInput.value);
    if (validateWorkDuration(workDurationInput.value)) {
        timeLeft = parseInt(workDurationInput.value) * 60;
        updateTimer();
    }
});

shortBreakDurationInput.addEventListener('input', () => {
    if (shortBreakTypeSelect.value === 'custom') {
        validateShortBreak(shortBreakDurationInput.value);
    }
});

longBreakDurationInput.addEventListener('input', () => {
    if (longBreakTypeSelect.value === 'custom') {
        validateLongBreak(longBreakDurationInput.value);
    }
});