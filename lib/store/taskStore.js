const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "..", "data", "tasks.json");

function readTasks() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return raw.trim() ? JSON.parse(raw) : [];
}

function writeTasks(tasks) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

function saveTask(task) {
    const tasks = readTasks();
    tasks.push(task);
    writeTasks(tasks);
    return task;
}

module.exports = { saveTask, readTasks, DATA_FILE };
