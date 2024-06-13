const sem = document.getElementById('sem-selector');
sem.addEventListener('change', function(e) {
  const semester = e.target.value;
  localStorage.setItem('semester', semester);
});

const dep = document.getElementById('dep-selector');
dep.addEventListener('change', function(e) {
  const department = e.target.value;
  localStorage.setItem('department', department);
});