var titleInput = document.getElementById("title");
var descriptionInput = document.getElementById("description");
var prioriteInput = document.getElementById("priorite");
var tacheterInput = document.getElementById("tache-terminee");
var tacheNonermineeInput = document.getElementById("tache-non-terminee");
const sendbtn = document.getElementById("button-new");

var taskesinfo = [];

sendbtn.addEventListener("click", function () {
    const title = titleInput.value;
    const description = descriptionInput.value;
    const priorite = prioriteInput.value;
    const isCompleted = tacheterInput.checked;

    var task = {
        id: Date.now(), // Generate a unique ID using the current timestamp
        title,
        description,
        priorite,
        isCompleted
    };

    taskesinfo.push(task);
    showData(task);

    // Clear the form inputs
    titleInput.value = "";
    descriptionInput.value = "";
    prioriteInput.value = "basse";
    tacheterInput.checked = true;
});

function showData(task) {
    const parentElem = document.getElementById("tasks-list");

    // Create a new `li` element
    const elem = document.createElement("li");
    elem.className = "list-group-item py-3";
    elem.id = `li-${task.id}`;

    // Dynamically generate the task content based on the `task` object
    elem.innerHTML = `
        <div>
            <h5 class="mb-1">${task.title || "Untitled Task"}</h5>
            <p class="mb-2 text-muted small">${task.description || "No description provided."}</p>
            <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-${getPriorityClass(task.priorite)}">${task.priorite || "Normal Priority"}</span>
                <span class="badge bg-${task.isCompleted ? "success" : "danger"}">${task.isCompleted ? "Completed" : "Not Completed"}</span>
                <div>
                    <button class="btn btn-sm btn-success me-1" onclick="editTask('${task.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
                </div>
            </div>
        </div>
    `;

    // Append the created element to the parent element
    parentElem.appendChild(elem);
}

// Helper function to map priority levels to badge classes
function getPriorityClass(priority) {
    switch (priority?.toLowerCase()) {
        case "haute":
            return "danger";
        case "moyenne":
            return "warning";
        case "basse":
            return "success";
        default:
            return "secondary";
    }
}

// Function to edit a task (to be implemented)
function editTask(taskId) {
    const task = taskesinfo.find(task => task.id == taskId);
    if (task) {
        // Populate the form with the task details
        titleInput.value = task.title;
        descriptionInput.value = task.description;
        prioriteInput.value = task.priorite;
        if (task.isCompleted) {
            tacheterInput.checked = true;
        } else {
            tacheNonermineeInput.checked = true;
        }

        // Remove the task from the list
        deleteTask(taskId);
    }
}

// Function to delete a task
function deleteTask(taskId) {
    taskesinfo = taskesinfo.filter(task => task.id != taskId);
    const taskElem = document.getElementById(`li-${taskId}`);
    if (taskElem) {
        taskElem.remove();
    }
}

// Get all the new elements
const shortBreakTypeSelect = document.getElementById("shortBreakType");
const longBreakTypeSelect = document.getElementById("longBreakType");
const customShortBreakGroup = document.getElementById("customShortBreakGroup");
const customLongBreakGroup = document.getElementById("customLongBreakGroup");

// Input validation functions
function validateWorkDuration(value) {
    const numValue = parseInt(value);
    return numValue >= 1 && numValue <= 60;
}

function validateShortBreak(value) {
    const numValue = parseInt(value);
    return numValue >= 1 && numValue <= 15;
}

function validateLongBreak(value) {
    const numValue = parseInt(value);
    return numValue >= 5 && numValue <= 30;
}

function showError(input) {
    input.classList.add('is-invalid');
}

function hideError(input) {
    input.classList.remove('is-invalid');
}

// Add event listeners for input validation
workDurationInput.addEventListener('input', function() {
    if (validateWorkDuration(this.value)) {
        hideError(this.value);
    } else {
        showError(this.value);
    }
});

shortBreakDurationInput.addEventListener('input', function() {
    if (validateShortBreak(this.value)) {
        hideError(this);
    } else {
        showError(this);
    }
});

longBreakDurationInput.addEventListener('input', function() {
    if (validateLongBreak(this.value)) {
        hideError(this);
    } else {
        showError(this);
    }
});

// Handle break type selection changes
shortBreakTypeSelect.addEventListener('change', function() {
    if (this.value === 'custom') {
        customShortBreakGroup.style.display = 'block';
    } else {
        customShortBreakGroup.style.display = 'none';
        shortBreakDurationInput.value = this.value;
    }
});

longBreakTypeSelect.addEventListener('change', function() {
    if (this.value === 'custom') {
        customLongBreakGroup.style.display = 'block';
    } else {
        customLongBreakGroup.style.display = 'none';
        longBreakDurationInput.value = this.value;
    }
});

// Update the getBreakDuration function to use the selected break types
function getBreakDuration() {
    if (cyclesCompleted % 4 === 0) {
        // Long break
        return longBreakTypeSelect.value === 'custom' 
            ? parseInt(longBreakDurationInput.value) * 60
            : parseInt(longBreakTypeSelect.value) * 60;
    } else {
        // Short break
        return shortBreakTypeSelect.value === 'custom'
            ? parseInt(shortBreakDurationInput.value) * 60
            : parseInt(shortBreakTypeSelect.value) * 60;
    }
}

// Update the startTimer function to include validation
function startTimer() {
    // Validate all inputs before starting
    if (!validateWorkDuration(workDurationInput.value)) {
        showError(workDurationInput);
        return;
    }
    
    if (shortBreakTypeSelect.value === 'custom' && !validateShortBreak(shortBreakDurationInput.value)) {
        showError(shortBreakDurationInput);
        return;
    }
    
    if (longBreakTypeSelect.value === 'custom' && !validateLongBreak(longBreakDurationInput.value)) {
        showError(longBreakDurationInput);
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

// Initialize the timer with validated work duration
timeLeft = validateWorkDuration(workDurationInput.value) 
    ? parseInt(workDurationInput.value) * 60 
    : 1500; // Default to 25 minutes if invalid
updateTimer();