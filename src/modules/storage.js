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

    static updateToday() {
        const todoList = this.getTodoList();
        const allTasks = [];

        //formats the date into the below shape
        let today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            const yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd; 

        //clear old memory of today
        todoList.findProject('Today').tasks = [];
        todoList.findProject('Week').tasks = [];

        //find and get all tasks pushed onto the allTasks array
        todoList
            .getProjects()
            .map((project) => {
                project
                    .getTasks()
                    .map((task) => {
                        allTasks.push(task)
                    })
            })
        
        //if the tasks are today then push onto the today project object
        allTasks.forEach((task) => {
            if (task.dueDate === today) {
                todoList.findProject('Today').tasks.push(task);
            }
        })
        Storage.saveTodoList(todoList);
    }

    static updateWeek() {
        const todoList = this.getTodoList();
        const allTasks = [];
        
        //checks if the date is this week
        const isThisWeek = (date) => {
            const testToday = new Date();
            const startOfWeek = new Date(testToday.setDate(testToday.getDate() - testToday.getDay()));
            const endOfWeek = new Date(testToday.setDate(testToday.getDate() + (6 - testToday.getDay())));

            return date >= startOfWeek && date <= endOfWeek;
        }
        
    
        //clear old memory of today
        todoList.findProject('Week').tasks = [];
        todoList.findProject('Today').tasks = [];

        //find and get all tasks pushed onto the allTasks array
        todoList
            .getProjects()
            .map((project) => {
                project
                    .getTasks()
                    .map((task) => {
                        allTasks.push(task)
                    })
            })
        
        //if the tasks are this week then push onto the week project object
        //**CHANGE TO FILTER */
        allTasks.forEach((task) => {
            
            if (isThisWeek(new Date(task.dueDate))) {
                todoList.findProject('Week').tasks.push(task);
            }
        })
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
        if (projectName !== 'Home') {
            //also add task to Home file if the project is not already there.
            todoList.addTask(todoList.findProject('Home'), task);
        }
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