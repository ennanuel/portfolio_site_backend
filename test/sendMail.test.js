const { createOptions, validateMailValues, convertValuesArrayToObject } = require('../utils/nodemailer');

test('Validate Mail Values returns failed = true and fail message on error', () => {
    return expect(
        validateMailValues()
    ).toEqual({ failed: true, message: 'No values array found' })
});

test('Validate Mail Values returns failed = true and field where error occured', () => {
    return expect(
        validateMailValues([['name', ''], ['email', 'emmanuelezema@gmail.com'], ['phone', '09012345678'], ['subject', 'a subject']])
    ).toEqual({ failed: true, message: 'name field cannot be left empty' })
});

test('Validate Mail Values returns failed = false and empty message field', () => {
    return expect(
        validateMailValues([['name', 'Emmanuel'], ['email', 'emmanuelezema@gmail.com'], ['phone', '09012345678'], ['subject', 'a subject']])
    ).toEqual({ failed: false, message: '' })
});

test('Reverts array of object entries back into an object', () => {
    return expect(
        convertValuesArrayToObject([['name', 'Emmanuel'], ['email', 'emmanuelezema@gmail.com'], ['phone', '09012345678'], ['subject', 'a subject']])
    ).toEqual({ name: 'Emmanuel', email: 'emmanuelezema@gmail.com', phone: '09012345678', subject: 'a subject' });
})

test('Revert object entries array back to object and stringifies values that are not strings', () => {
    return expect(
        convertValuesArrayToObject([['name', ['Emmanuel']], ['email', {name: 'emmanuelezema@gmail.com'}], ['phone', '09012345678'], ['subject', 'a subject']])
    ).toEqual({ name: '["Emmanuel"]', email: '{"name":"emmanuelezema@gmail.com"}', phone: '09012345678', subject: 'a subject' });
})

test('Revert object entries array back to object and skips element that does not have object entry structure', () => {
    return expect(
        convertValuesArrayToObject([['name'], ['email', 'emmanuelezema@gmail.com'], ['phone', '09012345678'], ['subject', 'a subject']])
    ).toEqual({email: 'emmanuelezema@gmail.com', phone: '09012345678', subject: 'a subject' });
})

test('Create nodemailer option for sending mail to designated email address', () => {
    return (
        expect(
            createOptions({ name: 'Nnanna', email: 'emmanuelezema6@gmail.com', subject: 'This is a topic about fish' })
        ).toEqual({
            from: process.env.EMAIL,
            to: 'emmanuelezema6@gmail.com',
            subject: 'This is a topic abou... (Nnanna)',
            text: `From: Nnanna - emmanuelezema6@gmail.com`,
            html: `
            <html>
                <head>
                    <style>* { list-style: none; } h1 { font-weight: normal; } h2 span { font-weight: bold; } p { color: #151515; }</style>
                </head>
                <h2>Message from <span>Nnanna</span> - <span>emmanuelezema6@gmail.com</span></h2>
                <p>This is a topic about fish<p>
            </html>
        `
        })
    )
});