const stackInput = document.getElementById('stack');
const addStackBtn = document.getElementById('add_btn');
const stacksContainer = document.getElementById('stacks_container');
const iconInput = document.getElementById('icon');
const imagesInput = document.getElementById('images');
const projectIcon = document.getElementById('project_icon');
const projectImages = document.getElementById('project_images');

function removeElement(e) {
    e.target.remove();
}

function addStack() {
    const stack = stackInput.value;
    const stackElements = stacksContainer.getElementsByClassName('stack');
    const stacks = [...stackElements].map(elem => elem.value);
    if (!stack || stacks.includes(stack)) return;
    const newStack = document.createElement('button');
    const closeBtn = document.createElement('span');
    const icon = document.createElement('i');
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('value', stack);
    hiddenInput.setAttribute('name', 'stacks[]');
    icon.setAttribute('class', 'fa fa-minus');
    closeBtn.setAttribute('class', 'h-[35px] aspect-square bg-highlight-500 text-gray-900 flex items-center justify-center pointer-events-none');
    newStack.setAttribute('class', 'stack mb-4 gap-2 flex items-center justify-center border border-highlight-800 bg-highlight-500/10 rounded-sm pl-2');
    newStack.setAttribute('type', 'button');
    newStack.innerText = stack;
    closeBtn.appendChild(icon);
    closeBtn.appendChild(hiddenInput);
    newStack.appendChild(closeBtn);
    newStack.addEventListener('click', removeElement);
    stackInput.value = '';
    stacksContainer.appendChild(newStack);
}

const fetchFileURL = (file) => new Promise(
    function (resolve, reject) {
        if (!file) reject();
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => resolve(fileReader.result);
    }
)

async function handleIconChange(e) {
    try {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const imgSrc = await fetchFileURL(file);
        projectIcon.style.opacity = '1';
        projectIcon.setAttribute('src', imgSrc);
    } catch (error) {
        console.error(error);
    }
}

async function addImage(file) {
    const imgSrc = await fetchFileURL(file);
    const container = document.createElement('div');
    const img = document.createElement('img');
    img.setAttribute('src', imgSrc);
    img.setAttribute('class', 'aspect-square rounded-sm object-cover hover:opacity-80 pointer-events-none');
    container.setAttribute('class', 'container rounded-md block p-1 border border-transparent hover:border-red-500');
    container.appendChild(img);
    projectImages.appendChild(container);
}

async function handleImageAdd(e) {
    try {
        if (!e.target.files) return;
        const previousImages = projectImages.getElementsByClassName('container');
        [...previousImages].forEach(elem => elem.removej());
        const files = [...e.target.files];
        files.map(addImage);
    } catch (error) {
        console.error(error);
    }
}

addStackBtn.addEventListener('click', addStack);
iconInput.addEventListener('change', handleIconChange);
imagesInput.addEventListener('change', handleImageAdd);