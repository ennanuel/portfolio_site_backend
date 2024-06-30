const stackInput = document.getElementById('stack');
const addStackBtn = document.getElementById('add_btn');
const stacksContainer = document.getElementById('stacks_container');
const iconInput = document.getElementById('icon');
const imagesInput = document.getElementById('images');
const projectIcon = document.getElementById('project_icon');
const projectImage = document.getElementById('project_image');

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
    icon.setAttribute('class', 'fa fa-plus rotate-45');
    closeBtn.setAttribute('class', 'peer h-[30px] aspect-square text-red-600 border border-red-600 flex items-center justify-center pointer-events-none group-hover:text-white group-hover:bg-red-600');
    newStack.setAttribute('class', 'stack group font-semibold flex-1 gap-2 pl-2 whitespace-nowrap mb-4 pr-[10px] h-[50px] border border-gray-800 flex items-center justify-between hover:text-red-600 hover:border-red-600');
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
        projectIcon.setAttribute('src', imgSrc);
    } catch (error) {
        console.error(error);
    }
}

async function handleImageChange(e) {
    try {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const imgSrc = await fetchFileURL(file);
        projectImage.setAttribute('src', imgSrc)
    } catch (error) {
        console.error(error);
    }
}

addStackBtn.addEventListener('click', addStack);
iconInput.addEventListener('change', handleIconChange);
imagesInput.addEventListener('change', handleImageChange);