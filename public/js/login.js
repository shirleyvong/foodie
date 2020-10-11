const username = document.getElementById('login-username');
const password = document.getElementById('login-password');
const loginForm = document.getElementById('login-form');
const msg = document.getElementsByClassName('missing-input-msg')[0];

function validate() {
  username.classList.remove('missing-input');
  password.classList.remove('missing-input');
  msg.style.display = 'block';

  if (username.value.length === 0) {
    msg.innerHTML = 'Username is required.';
    username.classList.add('missing-input');
    return;
  }

  if (password.value.length === 0) {
    msg.innerHTML = 'Password is required.';
    password.classList.add('missing-input');
    return;
  }

  loginForm.submit();
}
