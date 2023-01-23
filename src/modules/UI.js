import Task from './task';
import Project from './project';
import Storage from './storage';
import ToDoList from './todoList';

export default class UI {
    //load projects from local storage
    static loadStorage() {
        if (!localStorage.length) {
            const todoList = new ToDoList();
            Storage.saveTodoList(todoList);
        } else {
            const todoList = Storage.getTodoList();

             //construct DOM for when opening page, for saved tasks and saved projects
             //for tasks
            const tasksContainer = document.querySelector('.tasksContainer');
            const currentProject = document.createElement('h2');
            const addTaskBtn = document.createElement('button');
            const desiredProject = todoList.findProject('Home');
            
            tasksContainer.innerHTML = '';
            currentProject.textContent = 'Home'
            addTaskBtn.textContent = '+ Add Task';
            currentProject.classList.add('currentProject');
            addTaskBtn.classList.add('addTask');

            tasksContainer.appendChild(currentProject);
            tasksContainer.appendChild(addTaskBtn);

            desiredProject.tasks.forEach((task) => {
                tasksContainer.innerHTML += `<div class="task">
                <input id="taskBox" type="checkbox">
                <div class="taskTitle">${task.title}</div>
                <div class="taskDate">${task.dueDate}</div>
                <input id="taskEdit" type="image" alt="Edit Task">
                <input id="taskDelete" type="image" alt="Delete Task">
                </div>`
            })

            //for projects
            const newProjectsContainer = document.querySelector('.newProjectsContainer');
            todoList.getProjects().forEach((project) => {
                if (project.title === 'Home' || project.title === 'Today' || project.title === 'Week') return;
                newProjectsContainer.innerHTML += `<div class="buttonContainer">
                                                   <button type="button" class="btn newProject">${project.title}</button>
                                                   <button type="button" class="btn deleteProject">X</button>
                                                   </div>`
            })

        }
    }
    //init buttons
    static initButtons() {
        const openCreateProjectBtn = document.querySelector('#createProject');
        const closeCreateProjectBtn = document.querySelector('.cancelBtn');
        const createProjectForm = document.querySelector('#createProjectForm');
        const deleteProjectBtn = document.querySelectorAll('.deleteProject');
        const newProjects = document.querySelectorAll('.newProject');

        const addTaskBtn = document.querySelector('.addTask');
        const closeAddTaskBtn = document.querySelector('.cancelBtnTask');
        const createTaskForm = document.querySelector('#createTaskForm');

        openCreateProjectBtn.addEventListener('click', this.openCreateProject);
        closeCreateProjectBtn.addEventListener('click', this.closeCreateProject);
        createProjectForm.addEventListener('submit', this.createProject);
        deleteProjectBtn.forEach((btn) => {
            btn.addEventListener('click', this.deleteProject);
        })
        newProjects.forEach((project) => {
            project.addEventListener('click', this.openProject);
        })

        addTaskBtn.addEventListener('click', this.openCreateTask);
        closeAddTaskBtn.addEventListener('click', this.closeCreateTask);
        createTaskForm.addEventListener('submit', this.createTask);
    }

    //creating projects and tasks
    static createProject(e) {
        e.preventDefault();
        const form = document.querySelector('#createProjectForm');
        const newProjectsContainer = document.querySelector('.newProjectsContainer');
        const project = new Project(form.projectTitle.value);

        form.projectTitle.value = "";
        
        newProjectsContainer.innerHTML += `<div class="buttonContainer">
                                           <button type="button" class="btn newProject">${project.title}</button>
                                           <button type="button" class="btn deleteProject">X</button>
                                           </div>`
        Storage.saveProject(project);
        UI.initButtons();
    }
    
    static createTask(e) {
        e.preventDefault();

        const taskContainer = document.querySelector('.tasksContainer');
        const form = document.querySelector('#createTaskForm')

        const task = new Task(form.taskTitle.value, form.taskDescription.value, form.taskDueDate.value, form.taskPriority.value, false);

        taskContainer.innerHTML += `<div class="task">
        <input id="taskBox" type="checkbox">
        <div class="taskTitle">${task.title}</div>
        <div class="taskDate">${task.dueDate}</div>
        <input id="taskEdit" type="image" alt="Edit Task">
        <input id="taskDelete" type="image" alt="Delete Task">
        </div>`

        const project = document.querySelector('.currentProject').innerHTML;
        Storage.saveTaskToProject(project, task);
    }

    //deleting projects and tasks
    static deleteProject() {
        const todoList = Storage.getTodoList();
        const parent = this.parentNode;
        const project = parent.querySelector('.newProject').textContent;

        todoList.deleteProject(project);

        parent.remove();

        Storage.saveTodoList(todoList);
        
    }

    //open and close pop ups for create project/task
    static openCreateProject() {
        const popUpContainer = document.querySelector('.createProjectPopUpContainer');

        popUpContainer.style.display = 'flex';
    }
    static closeCreateProject() {
        const popUpContainer = document.querySelector('.createProjectPopUpContainer');

        popUpContainer.style.display = 'none';
    }

    static openCreateTask() {
        const popUpContainer = document.querySelector('.createTaskPopUpContainer');

        popUpContainer.style.display = 'flex';
    }

    static closeCreateTask() {
        const popUpContainer = document.querySelector('.createTaskPopUpContainer');

        popUpContainer.style.display = 'none';
    }

    //open projects and open tasks
    static openProject(e) {
        //construct DOM for new project page
        const tasksContainer = document.querySelector('.tasksContainer');
        const currentProject = document.createElement('h2');
        const addTaskBtn = document.createElement('button');

        //find the project
        const clickedProject = e.target.innerHTML;
        const todoList = Storage.getTodoList();
        const desiredProject = todoList.findProject(clickedProject);
       

        //construct DOM for new project page
        tasksContainer.innerHTML = '';
        currentProject.textContent = desiredProject.title;
        addTaskBtn.textContent = '+ Add Task';
        currentProject.classList.add('currentProject');
        addTaskBtn.classList.add('addTask');
            //hide the add task button for Today and Week tabs
        if (clickedProject === 'Today' || clickedProject === 'Week') addTaskBtn.style.display = 'none';

        tasksContainer.appendChild(currentProject);
        tasksContainer.appendChild(addTaskBtn);

        desiredProject.tasks.forEach((task) => {
            tasksContainer.innerHTML += `<div class="task">
            <input id="taskBox" type="checkbox">
            <div class="taskTitle">${task.title}</div>
            <div class="taskDate">${task.dueDate}</div>
            <input id="taskEdit" type="image" alt="Edit Task">
            <input id="taskDelete" type="image" alt="Delete Task">
            </div>`
        })

        UI.initButtons();

    }
}