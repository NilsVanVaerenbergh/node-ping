const crypto = require("crypto");

function createTask(title) {
    if (typeof title !== "string" || title.trim().length === 0) {
        throw new Error("Title is required");
    }

    return {
        id: crypto.randomUUID(),
        title: title.trim(),
        completed: false,
        deadline: null,
        createdAt: new Date().toISOString(),
    };
}

module.exports = { createTask };
