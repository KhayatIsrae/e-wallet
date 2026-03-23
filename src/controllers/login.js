import {finduserbymail} from "../models/database.js";

const submitbtn = document.getElementById('submitbtn');
const mailinput = document.getElementById('mail');
const passwordinput = document.getElementById('password');

submitbtn.addEventListener('click', handlesubmit);

function handlesubmit() {
    const user = finduserbymail(mailinput.value, passwordinput.value);
    submitbtn.textContent='checking.....';
    setTimeout(() => {
        if (user) {
            sessionStorage.setItem('currentUser',JSON.stringify(user));
            document.location = '../views/dashboard.html';
        } else {
            alert('bad credentials !!!');
        }
    },3000)

}