export default class Project {
    constructor(title) {
        this.title = title;
        this.tasks = [];
    }
    getTitle() {
        return this.title;
    }
    getTasks() {
        return this.tasks;
    }
    findTask(taskName) {
        return this.tasks.find((task) => {
            return task.title === taskName;
        })
    }
    setTasks(tasks) {
        return this.tasks = tasks;
    }
    addTask(newTask) {
        this.tasks.push(newTask);
    }
    deleteTask(taskTitle) {
        return this.tasks = this.tasks.filter((task) => { return task.title !== taskTitle});
    }
}