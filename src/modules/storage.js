import ToDoList from "./todoList";
import Project from "./project";
import Task from "./task";

export default class Storage {

    static saveTodoList(data) {
        localStorage.setItem('todoList', JSON.stringify(data));
    }

    static getTodoList() {
        const todoList =  Object.assign(new ToDoList(), JSON.parse(localStorage.getItem('todoList')));

        //JSON will make previous class functions obsolete, redefine their functions here
        //redefine projects in the new formed list
        todoList.setProjects(
            todoList
                .getProjects()
                .map((project) => {
                    return Object.assign(new Project(), project)
                }
        ));

        
        //redfine new tasks in the new formed list
        todoList
            .getProjects()
            .forEach((project) => {
                project.setTasks(project
                    .getTasks()
                    .map((task) => {
                        return Object.assign(new Task(), task)
                    }))
            })

        return todoList
    }

    //***PROJECT***
    static saveProject(project) {
        //make new list with old items
        const todoList = this.getTodoList();
        //push new project onto list
        todoList.addProject(project);
        Storage.saveTodoList(todoList);
    }

    static deleteProject(project) {
        const todoList = this.getTodoList();
        todoList.deleteProject(project);
        Storage.saveTodoList(todoList);
    }

    //***TASKS****
    static deleteTask(projectName, taskName) {
        const todoList = this.getTodoList();
        //find the project then use the function from the instance of 'Project'
        todoList.findProject(projectName).deleteTask(taskName);
        Storage.saveTodoList(todoList);

    }

    static saveTaskToProject(projectName, task) {
        //make new list with saved items
        const todoList = this.getTodoList();
        //find the project and push the task onto the array
        todoList.addTask(todoList.findProject(projectName), task);
        Storage.saveTodoList(todoList);
    }

    static checkTask(projectName, taskName, check) {
        const todoList = this.getTodoList();
        const task = todoList.findProject(projectName).findTask(taskName);

        check ? task.check = 'checked' : task.check = false;

        Storage.saveTodoList(todoList);
    }

    static changePriority(projectName, taskName, priority) {
        const todoList = this.getTodoList();
        const task = todoList.findProject(projectName).findTask(taskName);

        task.priority = priority;

        Storage.saveTodoList(todoList);
    }
}