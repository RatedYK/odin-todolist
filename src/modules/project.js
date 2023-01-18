export default class Project {
    constructor(title) {
        this.title = title;
        this.tasks = [];
    }
    getTitle() {
        return this.title;
    }
    getTask() {
        return this.tasks;
    }
    setTask(tasks) {
        this.tasks = tasks;
    }
    addTask(newTask) {
        this.tasks.push(newTask);
    }
    deleteTask(taskTitle) {
        this.tasks = this.tasks.filter((task) => {task.title !== taskTitle});
    }
}