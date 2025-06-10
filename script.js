const container = document.getElementById('array-container');
const newArrayBtn = document.getElementById('newArrayBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const stepToggleBtn = document.getElementById('stepToggleBtn');
const nextStepBtn = document.getElementById('nextStepBtn');
const speedSlider = document.getElementById('speedSlider');
const sizeSlider = document.getElementById('sizeSlider');
const explanation = document.getElementById('explanation');
const algoSelect = document.getElementById('algoSelect');

let array = [];
let stepMode = false;
let waitingForStep = false;
let stopRequested = false;

function generateArray(size = sizeSlider.value) {
  stopRequested = true;
  array = [];
  container.innerHTML = '';
  for (let i = 0; i < size; i++) {
    const val = Math.floor(Math.random() * 150) + 20;
    array.push(val);
    const box = document.createElement('div');
    box.classList.add('number-box');
    box.textContent = val;
    container.appendChild(box);
  }
  explanation.textContent = 'New array generated.';
}

function updateBars(activeIndices = [], swappedIndices = []) {
  const boxes = container.querySelectorAll('.number-box');
  boxes.forEach((box, idx) => {
    box.textContent = array[idx];
    box.style.backgroundColor = '#eee';
    if (activeIndices.includes(idx)) box.style.backgroundColor = '#f39c12';
    if (swappedIndices.includes(idx)) box.style.backgroundColor = '#2ecc71';
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForStep() {
  return new Promise(resolve => {
    waitingForStep = true;
    nextStepBtn.disabled = false;
    function handler() {
      nextStepBtn.disabled = true;
      nextStepBtn.removeEventListener('click', handler);
      waitingForStep = false;
      resolve();
    }
    nextStepBtn.addEventListener('click', handler);
  });
}

async function bubbleSort() {
  stopRequested = false;
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    explanation.textContent = `Bubble Sort: Pass ${i + 1}`;
    for (let j = 0; j < n - i - 1; j++) {
      if (stopRequested) return (explanation.textContent = 'Sorting stopped.');
      updateBars([j, j + 1]);
      explanation.textContent = `Comparing ${array[j]} and ${array[j + 1]}`;
      if (stepMode) await waitForStep();
      else await sleep(speedSlider.value);

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        updateBars([], [j, j + 1]);
        explanation.textContent = `Swapped ${array[j]} and ${array[j + 1]}`;
        if (stepMode) await waitForStep();
        else await sleep(speedSlider.value);
      }
    }
  }
  updateBars();
  explanation.textContent = 'Bubble Sort complete!';
}

async function selectionSort() {
  stopRequested = false;
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    explanation.textContent = `Selection Sort: Pass ${i + 1}`;
    for (let j = i + 1; j < n; j++) {
      if (stopRequested) return (explanation.textContent = 'Sorting stopped.');
      updateBars([j, minIdx]);
      explanation.textContent = `Comparing ${array[j]} and ${array[minIdx]}`;
      if (stepMode) await waitForStep();
      else await sleep(speedSlider.value);

      if (array[j] < array[minIdx]) {
        minIdx = j;
        updateBars([], [minIdx]);
        explanation.textContent = `New min found at index ${minIdx}`;
        if (stepMode) await waitForStep();
        else await sleep(speedSlider.value);
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      updateBars([], [i, minIdx]);
      explanation.textContent = `Swapped ${array[i]} and ${array[minIdx]}`;
      if (stepMode) await waitForStep();
      else await sleep(speedSlider.value);
    }
  }
  updateBars();
  explanation.textContent = 'Selection Sort complete!';
}

async function insertionSort() {
  stopRequested = false;
  const n = array.length;
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    explanation.textContent = `Inserting ${key}`;
    updateBars([i]);
    if (stepMode) await waitForStep();
    else await sleep(speedSlider.value);

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      updateBars([], [j, j + 1]);
      j--;
      if (stepMode) await waitForStep();
      else await sleep(speedSlider.value);
    }

    array[j + 1] = key;
    updateBars([], [j + 1]);
    explanation.textContent = `Inserted at index ${j + 1}`;
    if (stepMode) await waitForStep();
    else await sleep(speedSlider.value);
  }
  updateBars();
  explanation.textContent = 'Insertion Sort complete!';
}

newArrayBtn.onclick = () => {
  stopRequested = true;
  generateArray();
};

stopBtn.onclick = () => {
  stopRequested = true;
  explanation.textContent = 'Sorting manually stopped.';
};

startBtn.onclick = async () => {
  const selectedAlgo = algoSelect.value;
  if (!selectedAlgo) return alert('Please select a sorting algorithm!');
  stopRequested = false;
  if (selectedAlgo === "bubble") await bubbleSort();
  else if (selectedAlgo === "selection") await selectionSort();
  else if (selectedAlgo === "insertion") await insertionSort();
};

stepToggleBtn.onclick = () => {
  stepMode = !stepMode;
  stepToggleBtn.textContent = stepMode ? 'Disable Step Mode' : 'Enable Step Mode';
  nextStepBtn.disabled = !stepMode;
};

sizeSlider.oninput = () => {
  stopRequested = true;
  generateArray();
};

// Init
generateArray();
