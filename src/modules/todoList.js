import Project from "./project";

export default class ToDoList {
    constructor() {
        this.projects = [];
        this.projects.push(new Project('Home'));
        this.projects.push(new Project('Today'));
        this.projects.push(new Project('Week'));
    }

    setProjects(projects) {
        return this.projects = projects;
    }
    
    getProjects() {
        return this.projects;
    }

    findProject(projectName) {
        return this.projects.find((project) => {
            return project.title === projectName
        })
    }

    addProject(project) {
        this.projects.push(project);
    }

    deleteProject(project) {
        const projectToDelete = this.findProject(project);

        this.projects.splice(this.projects.indexOf(projectToDelete), 1);
    }

    addTask(project,task) {
        project.tasks.push(task);
    }
}