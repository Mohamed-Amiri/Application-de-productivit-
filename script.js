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

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const timerDisplay = document.getElementById("timer");
const cyclesCompletedDisplay = document.getElementById("cyclesCompleted");
const workDurationInput = document.getElementById("workDuration");
const shortBreakDurationInput = document.getElementById("shortBreakDuration");
const longBreakDurationInput = document.getElementById("longBreakDuration");

let interval;
let timeLeft = 0;
let isWorkTime = true;
let cyclesCompleted = 0;

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    timerDisplay.innerHTML = formattedTime;
}

function startTimer() {
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
                    if (cyclesCompleted % 4 === 0) {
                        timeLeft = parseInt(longBreakDurationInput.value) * 60;
                    } else {
                        timeLeft = parseInt(shortBreakDurationInput.value) * 60;
                    }
                } else {
                    timeLeft = parseInt(workDurationInput.value) * 60;
                }
                isWorkTime = !isWorkTime;
                startTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    clearInterval(interval);
    interval = null;
    timeLeft = parseInt(workDurationInput.value) * 60;
    isWorkTime = true;
    cyclesCompleted = 0;
    cyclesCompletedDisplay.textContent = `Cycles terminés : ${cyclesCompleted}`;
    updateTimer();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Initialize timer with work duration
timeLeft = parseInt(workDurationInput.value) * 60;
updateTimer();



function getBreakDuration() {
    return (cyclesCompleted % 4 === 0)
        ? parseInt(longBreakDurationInput.value) * 60
        : parseInt(shortBreakDurationInput.value) * 60;
}

// Modifiez la partie concernée dans startTimer :
if (isWorkTime) {
    cyclesCompleted++;
    cyclesCompletedDisplay.textContent = `Cycles terminés : ${cyclesCompleted}`;
    timeLeft = getBreakDuration(); // Utilisation de la nouvelle fonction
} else {
    timeLeft = parseInt(workDurationInput.value) * 60;
}