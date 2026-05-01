function handleSubmit(e) {
  e.preventDefault();
  e.target.style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
}
window.handleSubmit = handleSubmit;
