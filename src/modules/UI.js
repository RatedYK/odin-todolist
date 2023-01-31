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
            const addTaskBtn = document.createElement('input');
            const desiredProject = todoList.findProject('Home');
            
            tasksContainer.innerHTML = '';
            currentProject.textContent = 'Home';
            addTaskBtn.type = 'image';
            addTaskBtn.src = '../../dist/icons/plus.svg'
            currentProject.classList.add('currentProject');
            addTaskBtn.classList.add('addTask');

            tasksContainer.appendChild(currentProject);
            tasksContainer.appendChild(addTaskBtn);

            desiredProject.tasks.forEach((task) => {
                tasksContainer.innerHTML += `<div class="task">
                <input id="taskBox" ${task.check} type="checkbox">
                <div class="taskTitle">${task.title}</div>
                <div class="taskDate">${task.dueDate}</div>
                <div class="myDropDown">
                    <input id="taskPriorityBtn" type="image" src="./icons/priority.svg" alt="Task Priority">
                        <div id="dropDown">
                            <select name="priority" id="priority">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                </div>
                <input id="taskDelete" type="image" src="./icons/delete.svg" alt="Delete Task">
                </div>`
            })

            //for projects
            const newProjectsContainer = document.querySelector('.newProjectsContainer');
            todoList.getProjects().forEach((project) => {
                if (project.title === 'Home' || project.title === 'Today' || project.title === 'Week') return;
                newProjectsContainer.innerHTML += `<div class="buttonContainer">
                                                   <button type="button" class="btn newProject">${project.title}</button>
                                                   <input type="image" class="btn deleteProject" src="./icons/delete.svg">
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
        const deleteTaskBtn = document.querySelectorAll('#taskDelete');

        const taskTitle = document.querySelectorAll('.taskTitle');
        const taskCheckBox = document.querySelectorAll('#taskBox');
        const taskPriorityBtn = document.querySelectorAll('#taskPriorityBtn');
        const taskPrioritySelect = document.querySelectorAll('#priority');


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
        deleteTaskBtn.forEach((btn) => {
            btn.addEventListener('click', this.deleteTask)
        })


        taskTitle.forEach((task) => {
            task.addEventListener('click', this.openTaskInfo)
        })
        taskCheckBox.forEach((box) => {
            box.addEventListener('change', this.blankTask)
        })
        taskPriorityBtn.forEach((btn) => {
            btn.addEventListener('click', this.openTaskPrioritySelect)
        })
        taskPrioritySelect.forEach((select)=> {
            select.addEventListener('change', this.changeTaskPriority)
            select.addEventListener('change', this.updatePriorityColor)
        })

        window.addEventListener('DOMContentLoaded', this.blankTask);
        window.addEventListener('DOMContentLoaded', this.updatePriorityColor)
    }
    //close all Pop Ups
    static enableClosePopUps(e) {
        const body = document.querySelector('body'); 
        body.addEventListener('click', this.closePopUps)
    }

    static disableClosePopUps() {
        const body = document.querySelector('body'); 
        body.removeEventListener('click', this.closePopUps )
    }

    static closePopUps() {
        UI.closeTaskInfo();
        UI.disableClosePopUps();
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
                                           <input type="image" class="btn deleteProject" src="./icons/delete.svg">
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
        <input id="taskBox" ${task.check} type="checkbox">
        <div class="taskTitle">${task.title}</div>
        <div class="taskDate">${task.dueDate}</div>
        <div class="myDropDown">
            <input id="taskPriorityBtn" type="image" src="./icons/priority.svg" alt="Task Priority">
                <div id="dropDown">
                    <select name="priority" id="priority">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
        </div>
        <input id="taskDelete" type="image" src="./icons/delete.svg" alt="Delete Task">
        </div>`

        const project = document.querySelector('.currentProject').innerHTML;
        Storage.saveTaskToProject(project, task);
        UI.initButtons();
    }

    //deleting projects and tasks
    static deleteProject() {
        const parent = this.parentNode;
        const project = parent.querySelector('.newProject').textContent;

        Storage.deleteProject(project);
        parent.remove();
        
    }

    static deleteTask() {
        const parent = this.parentNode;
        const task = parent.querySelector('.taskTitle').textContent;
        const project = document.querySelector('.currentProject').textContent;

        console.log(task)
        Storage.deleteTask(project, task)
        parent.remove();
    }

    //open and close pop ups for create project/task
    static openCreateProject(e) {
        e.stopPropagation();
        const popUpContainer = document.querySelector('.createProjectPopUpContainer');

        popUpContainer.style.display = 'flex';
    }
    static closeCreateProject() {
        const popUpContainer = document.querySelector('.createProjectPopUpContainer');

        popUpContainer.style.display = 'none';
    }

    static openCreateTask(e) {
        e.stopPropagation();
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
        const addTaskBtn = document.createElement('input');

        //find the project
        const clickedProject = e.target.innerHTML;
            //hide the add task button for Today and Week tabs
        if (clickedProject === 'Today') {
            addTaskBtn.style.display = 'none';
            Storage.updateToday();
        } else if (clickedProject === 'Week') {
            addTaskBtn.style.display = 'none';
            Storage.updateWeek();
        }
        const todoList = Storage.getTodoList();
        const desiredProject = todoList.findProject(clickedProject);
       

        //construct DOM for new project page
        tasksContainer.innerHTML = '';
        currentProject.textContent = desiredProject.title;
        addTaskBtn.type = 'image';
        addTaskBtn.src = '../../dist/icons/plus.svg';
        currentProject.classList.add('currentProject');
        addTaskBtn.classList.add('addTask');

        tasksContainer.appendChild(currentProject);
        tasksContainer.appendChild(addTaskBtn);

        desiredProject.tasks.forEach((task) => {
            tasksContainer.innerHTML += `<div class="task">
            <input id="taskBox" ${task.check} type="checkbox">
            <div class="taskTitle">${task.title}</div>
            <div class="taskDate">${task.dueDate}</div>
            <div class="myDropDown">
                <input id="taskPriorityBtn" type="image" src="./icons/priority.svg" alt="Task Priority">
                <div id="dropDown">
                    <select name="priority" id="priority">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>
            <input id="taskDelete" type="image" src="./icons/delete.svg" alt="Delete Task">
            </div>`
        })
        UI.blankTask();
        UI.initButtons();
    }

    //task options (opening description, checkbox, changing priority)
    static openTaskInfo(e) {
        e.stopPropagation();
        const currentProject = document.querySelector('.currentProject').textContent;
        const targetTask = e.target.textContent;
        const taskInfo = document.querySelector('.taskInfoContainer');
        const task = Storage.getTodoList().findProject(currentProject).findTask(targetTask);

        //create the info on DOM
        taskInfo.innerHTML = "";
        for(const key in task) {
            if (key === 'check') {}
            else if (key === 'description') {
                const p = document.createElement('p');
                p.textContent = task[key];
                taskInfo.appendChild(p);
            } else {
                const h4 = document.createElement('h4');
                h4.textContent = task[key];
                taskInfo.appendChild(h4);
            }
        }
        taskInfo.style.display = 'flex';
        //allow closing of this popup by clicking anywhere
        UI.enableClosePopUps();
    }

    static closeTaskInfo() {
        const taskInfo = document.querySelector('.taskInfoContainer');

        taskInfo.style.display = 'none';

    }

    static blankTask() {
        const project = document.querySelector('.currentProject').textContent;
        const tasks = document.querySelectorAll('.task');
        let check = false;

        //for each task, search the DOM for its checkbox and color the task
        tasks.forEach((task) => {
            const box = task.querySelector('#taskBox');
            if (box.checked === true) {
                task.style.backgroundColor = 'red';
                check = true;
            } else {
                task.style.backgroundColor = 'white';
                check = false;
            }
            const taskTitle = task.querySelector('.taskTitle').textContent;
            Storage.checkTask(project, taskTitle, check)
        })
    }

    static openTaskPrioritySelect(e) {
        e.stopPropagation();
        const taskPriority = e.target
        const parent = taskPriority.closest('.task');
        const dropDown = parent.querySelector('#dropDown');
        
        dropDown.style.display === 'flex' ? dropDown.style.display = 'none' : dropDown.style.display = 'flex';        
    }
    
    static changeTaskPriority(e) {
        e.stopPropagation();
        const taskPriority = e.target
        const priority = this.value;
        const parent = taskPriority.closest('.task');
        const taskTitle = parent.querySelector('.taskTitle').textContent;
        const project = document.querySelector('.currentProject').textContent;
    
        Storage.changePriority(project, taskTitle, priority);

        const dropDown = parent.querySelector('#dropDown');

        dropDown.style.display = 'none';
    }

    static updatePriorityColor() {
        const priorityFlags = document.querySelectorAll('#taskPriorityBtn');
        const project = document.querySelector('.currentProject').textContent;

        priorityFlags.forEach((flag) => {
            const parent = flag.closest('.task');
            const taskTitle = parent.querySelector('.taskTitle').textContent;
            const taskPriority = Storage.getTodoList().findProject(project).findTask(taskTitle).priority.toLowerCase();

            //clear any residual colors
            flag.className = '';
            flag.classList.add(taskPriority);
        })
    }
}