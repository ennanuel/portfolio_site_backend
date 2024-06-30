const projectsContainer = document.getElementById('projects');
const updateProjectRankButton = document.getElementById('update_projects_rank_btn');

const VITE_IMG_URL = 'https://res.cloudinary.com/dewej0c6m';

let projects = [];
let index = 0;

function createProjectImage(images, icon) {
    const image = document.createElement('img');
    const imageSrc = images || icon ?
        `${VITE_IMG_URL}/${(images[0] ? images[0] : icon)}` :
        "/assets/icon-dark.png";
    
    image.setAttribute('src', imageSrc);
    image.setAttribute('class', 'w-[80px] aspect-square border border-gray-800 object-cover');

    return image;
};

function createProjectStack(stacks) {
    const container = document.createElement('div');
    container.setAttribute('class', 'flex items-center gap-2');
    for (let stack of stacks) {
        const stackElement = document.createElement('p');
        stackElement.setAttribute('class', 'text-xs border border-gray-800 px-2 pb-[2px]');
        stackElement.innerText = stack;
        container.appendChild(stackElement);
    }
    return container;
}

function createProject({ id, desc, icon, images, is_main_project, name, stacks, rank }, index) {
    const container = document.createElement('a');
    container.setAttribute('class', 'project relative flex items-center gap-4 py-2 px-4 border border-gray-800 text-gray-800 bg-white');
    container.setAttribute('href', `/project/${id}`);
    container.setAttribute('data-index', index);
    container.id = id;
    container.draggable = true;
    container.ondragover = handleDragOver;
    container.ondragend = handleDragEnd;

    const projectImage = createProjectImage(images, icon);

    const detailsContainer = document.createElement('div');
    detailsContainer.setAttribute('class', 'flex flex-col gap-1 flex-1')

    const nameAndTypeContainer = document.createElement('div');
    nameAndTypeContainer.setAttribute('class', 'flex items-center gap-2 mb-2')
    const projectName = document.createElement('p');
    projectName.setAttribute('class', 'text-base font-bold');
    projectName.innerText = name;

    const projectType = document.createElement('p');
    projectType.setAttribute('class', 'bg-gray-800 text-white text-xs font-bold px-2 pb-[2px]');
    projectType.innerText = is_main_project ? 'main' : 'secondary';

    nameAndTypeContainer.appendChild(projectName);
    nameAndTypeContainer.appendChild(projectType);

    const projectDescription = document.createElement('p');
    projectDescription.setAttribute('class', 'text-xs');
    projectDescription.innerText = desc.length > 250 ? desc.replace(/\s+/g, ' ').substring(0, 250) + '...' : desc.replace(/\s+/g, ' ');

    const projectStack = createProjectStack(stacks);

    detailsContainer.appendChild(nameAndTypeContainer)
    detailsContainer.appendChild(projectDescription);
    detailsContainer.appendChild(projectStack);

    const iconElement = document.createElement('i');
    iconElement.setAttribute('class', 'fa fa-angle-right');
    iconElement.setAttribute('aria-hidden', 'true');

    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'projects[]');
    input.setAttribute('value', `${id} ${rank}`);

    container.appendChild(projectImage);
    container.appendChild(detailsContainer);
    container.appendChild(iconElement);
    container.appendChild(input);
    
    projectsContainer.appendChild(container);
};

function renderProjects() {
    projectsContainer.innerHTML = "";
    projects.forEach(createProject);
}

(async function fetchProjects() {
    try {
        const res = await fetch('/project');
        if (res.status !== 200) throw res;
        projects = await res.json();
        renderProjects();
    } catch (error) {
        console.error(error);
    }
})();

function handleDragOver(event) { 
    event.target.classList.add('dragging');

    const closestProject = event.target.closest('.project');
    if (closestProject) index = closestProject.dataset.index;
};

function handleDragEnd(event) { 
    event.target.classList.remove('dragging');
    updateProjectRankButton.classList.remove('hidden');
    updateProjectRankButton.classList.add('flex');

    const [foundProject, ...otherProjects] = projects.sort((projectA) => projectA.id == event.target.id ? -1 : 1);
    otherProjects.splice(index, 0, foundProject);
    projects = otherProjects.map((project, rank) => ({ ...project, rank }));

    index = 0;
    renderProjects();
};


// REMOVE MESSAGE

var message = document.getElementById('message');
document.getElementById('close_btn').addEventListener('click', () => message.remove());