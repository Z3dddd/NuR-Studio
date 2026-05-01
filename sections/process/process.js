const steps = document.querySelectorAll('.process-step');
steps.forEach(step => {
  step.addEventListener('click', () => {
    steps.forEach(s => s.classList.remove('active'));
    step.classList.add('active');
  });
});
