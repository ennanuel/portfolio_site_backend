const addStackButton = document.getElementById('add_stack_btn');
const stackInput = document.getElementById('stack_input');
const stackContainer = document.getElementById('stack_container');
const projectForm = document.getElementById('project_form');
const submitButton = document.getElementById('save_btn');

submitButton.addEventListener('click', () => projectForm.submit());

function addStackElement() {
    const stack = stackInput.value;
    if (!stack) return;

    const id = stack + Date.now();

    const container = document.createElement('label');
    container.setAttribute('id', id);
    container.setAttribute('class', 'remove_stack_btn group mb-4 hover:bg-gray-800 hover:text-white flex flex-1 border border-gray-800 items-center justify-center h-[50px]');

    const text = document.createElement('span');
    text.setAttribute('class', 'font-bold px-3 flex-1 whitespace-nowrap');
    text.innerText = stack

    const button = document.createElement('button');
    button.setAttribute('class', 'pointer-events-none cursor-pointer hover:text-white hover:bg-red-500 flex items-center justify-center h-[30px] w-[30px] border border-red-500 text-red-500 mr-[10px]');
    button.setAttribute('type', 'button');
    button.setAttribute('value', id);

    const icon = document.createElement('i');
    icon.setAttribute('class', 'fa fa-plus rotate-45');

    button.appendChild(icon);

    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'stacks[]');
    input.setAttribute('value', stack);

    container.appendChild(text);
    container.appendChild(button);
    container.appendChild(input);

    addRemoveListener(container);

    stackContainer.appendChild(container);

    stackInput.value = '';
}

function addRemoveListener(element) {
    element.addEventListener('click', () => element.remove());
}

[...document.getElementsByClassName('remove_stack_btn')].forEach(addRemoveListener);

addStackButton.addEventListener('click', addStackElement);


const imageInput = document.getElementById('images');
const imageViewer = document.getElementById('project-image');
const iconInput = document.getElementById('icon');
const iconViewer = document.getElementById('project-icon')

function handleImageChange(event) {
    if (!event.target.files) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);
    fileReader.onload = () => event.target.name === 'images' ?
        imageViewer.setAttribute('src', fileReader.result) :
        iconViewer.setAttribute('src', fileReader.result);
}

imageInput.addEventListener('change', handleImageChange);
iconInput.addEventListener('change', handleImageChange);