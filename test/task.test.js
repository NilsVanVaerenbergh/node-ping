const test = require("node:test");
const assert = require("node:assert/strict");
const { createTask } = require("../lib/models/task");

test("creates a task with a unique id, the given title, completed=false, and no deadline", () => {
    const task = createTask("Buy milk");

    assert.equal(typeof task.id, "string");
    assert.ok(task.id.length > 0);
    assert.equal(task.title, "Buy milk");
    assert.equal(task.completed, false);
    assert.equal(task.deadline, null);
    assert.equal(typeof task.createdAt, "string");
});

test("generates a different id for each task", () => {
    const first = createTask("Task one");
    const second = createTask("Task two");

    assert.notEqual(first.id, second.id);
});

test("rejects an empty title", () => {
    assert.throws(() => createTask(""));
});

test("rejects a whitespace-only title", () => {
    assert.throws(() => createTask("   "));
});

test("rejects a missing title", () => {
    assert.throws(() => createTask(undefined));
});
