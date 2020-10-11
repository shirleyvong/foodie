const username = document.getElementById('reg-username');
const password = document.getElementById('reg-password');
const confirm = document.getElementById('reg-confirm-password');
const registerForm = document.getElementById('register-form');
const msg = document.getElementsByClassName('missing-input-msg')[0];

function validate() {
  username.classList.remove('missing-input');
  password.classList.remove('missing-input');
  confirm.classList.remove('missing-input');
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

  if (confirm.value.length === 0) {
    msg.innerHTML = 'Please confirm password.';
    confirm.classList.add('missing-input');
    return;
  }

  if (password.value !== confirm.value) {
    msg.innerHTML = 'Passwords do not match.';
    password.classList.add('missing-input');
    confirm.classList.add('missing-input');
    return;
  }

  registerForm.submit();
}
