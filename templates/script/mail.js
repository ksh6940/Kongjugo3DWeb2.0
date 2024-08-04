function clearValue() {
    document.getElementById('email').value = ''; 
    document.getElementById('title').value = ''; 
    document.getElementById('dropdown').selectedIndex = 0; 
    document.getElementById('text').value = '';

    const textArea = document.getElementById('text');
    textArea.style.height = '';
}

function autoResize() {
    const textArea = document.getElementById('text');
    textArea.style.height = 'auto';
    textArea.style.height = (textArea.scrollHeight + 30) + 'px';
}

document.getElementById('text').addEventListener('input', autoResize);

function SendEmail(){
    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "sukhogang@gmail.com",
        Password : "17F50ED7480F4E336680224A523E5D3E0972",
        To : "gsh6940@naver.com",
        From : "sukhogang@gmail.com",
        Subject : getTitle(),
        Body : getContent()
    }).then(
    message => alert("문의 접수가 완료되었습니다. 확인 후 답장 드리겠습니다")
    );
}

function getContent(){
    const email = document.getElementById('email').value; 
    const text = document.getElementById('text').value;

    sendText = `"${email}"로 답장 부탁드립니다. ${text}`;

    return sendText
}

function getTitle(){
    const title = document.getElementById('title').value; 
    const dropdown = document.getElementById('dropdown').value;

    const sendTitle = `[${dropdown}] ${title}` ;

    return sendTitle;
}