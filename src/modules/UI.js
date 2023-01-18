import Task from './task';
import Project from './project';

export default class UI {
    //init buttons
    static initButtons() {
        const openCreateProjectBtn = document.querySelector('#createProject');
        const closeCreateProjectBtn = document.querySelector('.cancelBtn');
        const createProjectForm = document.querySelector('#createProjectForm');
        

        openCreateProjectBtn.addEventListener('click', this.openCreateProject);
        closeCreateProjectBtn.addEventListener('click', this.closeCreateProject);
        createProjectForm.addEventListener('submit', this.createProject)
    }

    //creating projects and tasks
    static createProject(e) {
        e.preventDefault();
        const form = document.querySelector('#createProjectForm');

        const project = new Project (form.projectTitle.value);

        const newProjectsContainer = document.querySelector('.newProjectsContainer');


        newProjectsContainer.innerHTML += `<button class="btn project">${project.title}</button>`;
    }
    
    static createTask(task) {
        const taskContainer = document.querySelector('.taskContainer');

        taskContainer.innerHTML += `<div class="task">
        <input id="taskBox" type="checkbox">
        <div class="taskTitle">${task.title}</div>
        <div class="taskDate">${task.dueDate}</div>
        <input id="taskEdit" type="image" alt="Edit Task">
        <input id="taskDelete" type="image" alt="Delete Task">
        </div>`
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
}