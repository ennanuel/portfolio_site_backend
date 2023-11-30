const { validateValues, createProject } = require('../utils/upload');

test('Values validator should return false if there is an empty field in values sent to server to create new project', () => {
    expect(
        validateValues({ name: '', link: 'https://www.google.com', icon: 'draw.png' })
    ).toEqual({ failed: true, message: 'name field cannot be empty!' });
});

test('Values validator should return false if no values are passed as argument', () => {
    expect(
        validateValues()
    ).toEqual({ failed: true, message: 'There are no values' });
});

test('Values validator should return true if all values are not empty', () => {
    expect(
        validateValues({ name: 'A Project', link: 'https://www.google.com', icon: 'draw.png' })
    ).toEqual({ failed: false, message: '' });
});

test('Returns a new project object with all the values in the correct place and value type (Adds icon, images and stacks to the new object)', () => {
    expect(
        createProject({
            name: "A project",
            desc: "This is a project",
            is_github_link: "true",
            is_main_project: "false",
        })
    ).toEqual({
        name: "A project",
        desc: "This is a project",
        is_github_link: true,
        is_main_project: false,
        icon: undefined,
        images: [],
        stacks: [],
    })
});

test('Returns a new project object with all the values in the correct place and value type (Adds is_github_link and is_main_project to the new object)', () => {
    expect(
        createProject({
            name: "A project",
            desc: "This is a project",
            icon: ['image.jpg'],
            images: ['image1.png', 'image2.png', 'image3.jpeg'],
            stacks: ['React', 'Simfony', 'GraphQL'],
        })
    ).toEqual({
        name: "A project",
        desc: "This is a project",
        is_github_link: false,
        is_main_project: false,
        icon: 'image.jpg',
        images: ['image1.png', 'image2.png', 'image3.jpeg'],
        stacks: ['React', 'Simfony', 'GraphQL'],
    })
});

test('Returns error becuase no argument was passed', () => {
    expect(
        createProject()
    ).toEqual({ error: 'No "value" argument found' });
});