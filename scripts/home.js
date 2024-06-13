const department = localStorage.getItem('department');
const semester = Number(localStorage.getItem('semester'));

let modulesCount = 0;
let gpa = 0;

const grades = [];
const credits = [];
const modules = [];

const generateHTML = (index) => {
  const modulesHTML = `
    <input id="module-${index}-name" class="module-name" type="text" placeholder="module name">
    <input id="credits-${index}" class="credits-selector" placeholder="credits" type="number" min="1" required>

    <select id="grade-selector-${index}" class="grade-selector" required>
      <option disabled hidden selected>Select Grade</option>
      <option value="4">A+</option>
      <option value="4">A</option>
      <option value="3.7">A-</option>
      <option value="3.3">B+</option>
      <option value="3">B</option>
      <option value="2.7">B-</option>
      <option value="2.3">C+</option>
      <option value="2">C</option>
      <option value="1.7">C-</option>
      <option value="1.3">D+</option>
      <option value="1">D</option>
      <option value="0">E</option>
    </select>
  `
  return modulesHTML;
}

const addNewModule = (index) => {
  const newModule = document.createElement('div');
  newModule.classList.add(`module-${index}`);
  newModule.classList.add('module-items');
  document.querySelector('.module-container').appendChild(newModule);
  document.querySelector('.alt-text').innerHTML = '';
  document.querySelector('.alt-text').classList.add('no-display');
  
}

const updateLists = () => {
  for (let i = 0; i < modulesCount; i++) {
    const module = document.getElementById(`module-${i}-name`).value;
    const grade = document.getElementById(`grade-selector-${i}`).value;
    const credit = document.getElementById(`credits-${i}`).value;
    modules[i] = module;
    if(grade) grades[i] = Number(grade);
    if(credit) credits[i] = Number(credit);
  }
}

const circularProgressBar = (progressEndValue) => {
  let progressBar = document.querySelector(".circular-progress");
  let valueContainer = document.querySelector(".value-container");

  let progressValueTemp = 0;

  let progress = setInterval(() => {
    progressValueTemp += 0.01;
    let progressValue = progressValueTemp.toFixed(2);
    valueContainer.textContent = `${progressValue}/4.00`;

    if (progressEndValue < 2.00) {
      progressBar.style.background = `conic-gradient(
        #ff0000 ${progressValue * 90}deg,
        #cadcff ${progressValue * 90}deg
    )`;
    } else if (progressEndValue < 3.00) {
      progressBar.style.background = `conic-gradient(
        #ffa500 ${progressValue * 90}deg,
        #cadcff ${progressValue * 90}deg
    )`;
    } else if (progressEndValue < 3.30) {
      progressBar.style.background = `conic-gradient(
        #ffff00 ${progressValue * 90}deg,
        #cadcff ${progressValue * 90}deg
    )`;
    } else if (progressEndValue < 3.70) {
      progressBar.style.background = `conic-gradient(
        #90ee90 ${progressValue * 90}deg,
        #cadcff ${progressValue * 90}deg
    )`;
    } else {
      progressBar.style.background = `conic-gradient(
        #00ff00 ${progressValue * 90}deg,
        #cadcff ${progressValue * 90}deg
    )`;
    }

    if (progressValue == progressEndValue) {
      clearInterval(progress);
    }
  }, 10);
}

const generateTable = (index) => {
  updateLists();

  let tableHTML = `<table>
                    <tr>
                      <th>Module Name</th>
                      <th>Credits</th>
                      <th>Result</th>
                    </tr>
                  ` 
  for (let i = 0; i < index; i++) {
    let grd = document.getElementById(`grade-selector-${i}`);
    let displayGrade = grd.options[grd.selectedIndex].text;

    tableHTML += `
      <tr>
        <td>${modules[i]}</td>
        <td>${credits[i]}</td>
        <td>${displayGrade}</td>
      </tr>
    `
  }
  return tableHTML;
}

const calculateGPA = () => {
  updateLists();

  let gpaTemp = 0;
  let total = 0;

  for (let i = 0; i < modulesCount; i++) {
    gpaTemp += grades[i] * credits[i];
    total += credits[i];
  }
  gpa = (gpaTemp / total).toFixed(2);

  if (Number(gpa)) {
    circularProgressBar(gpa);

    document.querySelector('.button-container').classList.add('no-display');
    document.querySelector('.button-container').classList.remove('button-container');
    document.querySelector('.progressbar-container-temp').classList.add('progressbar-container');
    document.querySelector('.show-gpa-1').innerHTML = `Your GPA for Semester ${semester} is ${gpa}`;

    const tableHTML = generateTable(modulesCount);
    document.querySelector('.module-container').classList.add('table-container');
    document.querySelector('.module-container').classList.remove('module-container');
    document.querySelector('.table-container').innerHTML = tableHTML;
    
  } else {
    document.querySelector('.show-gpa').classList.add('warning');
    document.querySelector('.show-gpa').innerHTML = 'Something is wrong. Check all the inputs and try again...';
  }

  return total;
}

const saveToStorage = () => {
  const total = calculateGPA();

  if (Number(gpa)) {
    console.log(`sem-${semester}-modules`, modules);
    console.log(`sem-${semester}-grades`, grades);
    console.log(`sem-${semester}-credits`, credits);
    console.log(`sem-${semester}-gpa`, gpa);
    console.log(`sem-${semester}-credits`, total);
    document.querySelector('.show-gpa').innerHTML = `<p>Your GPA for Semester is ${gpa}<br>Saved to local storage.</p>`;
  } else {
    document.querySelector('.show-gpa').innerHTML = 'Something is wrong. Refresh the page and try again...';
  }
}

document.querySelector('.department').innerHTML = `Department of ${department} Engineering`;
document.querySelector('.semester').innerHTML = `Semester ${semester}`;

document.querySelector('.add-new-btn').addEventListener('click', () => {
  addNewModule(modulesCount);
  const modulesHTML = generateHTML(modulesCount);
  document.querySelector(`.module-${modulesCount}`).innerHTML = modulesHTML;
  modulesCount += 1;
});

document.querySelector('.calculate-btn').addEventListener('click', () => calculateGPA());
document.querySelector('.save-btn').addEventListener('click', () => saveToStorage());
