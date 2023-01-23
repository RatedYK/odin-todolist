import ToDoList from "./todoList";

export default class Storage {

    static saveTodoList(data) {
        localStorage.setItem('todoList', JSON.stringify(data));
    }

    static getTodoList() {
        return Object.assign(new ToDoList(), JSON.parse(localStorage.getItem('todoList')));
    }

    static saveProject(project) {
        //make new list with old items
        const todoList = this.getTodoList();
        //push new project onto list
        todoList.addProject(project);
        Storage.saveTodoList(todoList);
    }

    static saveTaskToProject(projectName, task) {
        //make new list with saved items
        const todoList = this.getTodoList();
        //find the project and push the task onto the array
        todoList.addTask(todoList.findProject(projectName), task);
        Storage.saveTodoList(todoList);
    }
}