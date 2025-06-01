const container = document.getElementById('array-container');
  const newArrayBtn = document.getElementById('newArrayBtn');
  const bubbleBtn = document.getElementById('bubbleBtn');
  const selectionBtn = document.getElementById('selectionBtn');
  const insertionBtn = document.getElementById('insertionBtn');
  const startBtn = document.getElementById('startBtn');
  const stepToggleBtn = document.getElementById('stepToggleBtn');
  const nextStepBtn = document.getElementById('nextStepBtn');
  const speedSlider = document.getElementById('speedSlider');
  const sizeSlider = document.getElementById('sizeSlider');
  const explanation = document.getElementById('explanation');

  let array = [];
  let stepMode = false;
  let waitingForStep = false;
  let stopRequested = false;
  let currentSortFunction = null;

  function generateArray(size = sizeSlider.value) {
    stopRequested = true; // stop any ongoing sort
    array = [];
    container.innerHTML = '';
    for(let i = 0; i < size; i++) {
      const val = Math.floor(Math.random() * 150) + 20;
      array.push(val);
      const bar = document.createElement('div');
      bar.classList.add('bar');
      bar.style.height = val + 'px';
      container.appendChild(bar);
    }
    explanation.textContent = 'New array generated.';
  }

  function updateBars(activeIndices = [], swappedIndices = []) {
    const bars = container.querySelectorAll('.bar');
    bars.forEach((bar, idx) => {
      bar.style.height = array[idx] + 'px';
      bar.classList.remove('active', 'swapped');
      if(activeIndices.includes(idx)) bar.classList.add('active');
      if(swappedIndices.includes(idx)) bar.classList.add('swapped');
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
    for(let i = 0; i < n-1; i++) {
      explanation.textContent = `Bubble Sort: Starting pass ${i+1}`;
      for(let j = 0; j < n - i -1; j++) {
        if(stopRequested) {
          explanation.textContent = 'Sorting stopped.';
          updateBars();
          return;
        }
        updateBars([j, j+1]);
        explanation.textContent = `Comparing index ${j} (${array[j]}) and ${j+1} (${array[j+1]})`;
        if(stepMode) await waitForStep();
        else await sleep(speedSlider.value);

        if(array[j] > array[j+1]) {
          explanation.textContent = `Swapping ${array[j]} and ${array[j+1]}`;
          [array[j], array[j+1]] = [array[j+1], array[j]];
          updateBars([], [j, j+1]);
          if(stepMode) await waitForStep();
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
    for(let i = 0; i < n-1; i++) {
      let minIdx = i;
      explanation.textContent = `Selection Sort: Starting pass ${i+1}`;
      for(let j = i + 1; j < n; j++) {
        if(stopRequested) {
          explanation.textContent = 'Sorting stopped.';
          updateBars();
          return;
        }
        updateBars([j, minIdx]);
        explanation.textContent = `Comparing index ${j} (${array[j]}) and current minimum index ${minIdx} (${array[minIdx]})`;
        if(stepMode) await waitForStep();
        else await sleep(speedSlider.value);

        if(array[j] < array[minIdx]) {
          minIdx = j;
          explanation.textContent = `New minimum found at index ${minIdx}`;
          updateBars([], [minIdx]);
          if(stepMode) await waitForStep();
          else await sleep(speedSlider.value);
        }
      }
      if(minIdx !== i) {
        explanation.textContent = `Swapping index ${i} (${array[i]}) and minimum index ${minIdx} (${array[minIdx]})`;
        [array[i], array[minIdx]] = [array[minIdx], array[i]];
        updateBars([], [i, minIdx]);
        if(stepMode) await waitForStep();
        else await sleep(speedSlider.value);
      }
    }
    updateBars();
    explanation.textContent = 'Selection Sort complete!';
  }

  async function insertionSort() {
    stopRequested = false;
    const n = array.length;
    for(let i = 1; i < n; i++) {
      let key = array[i];
      let j = i - 1;
      explanation.textContent = `Insertion Sort: Inserting element at index ${i} (${key})`;
      updateBars([i]);
      if(stepMode) await waitForStep();
      else await sleep(speedSlider.value);

      while(j >= 0 && array[j] > key) {
        if(stopRequested) {
          explanation.textContent = 'Sorting stopped.';
          updateBars();
          return;
        }
        explanation.textContent = `Moving element at index ${j} (${array[j]}) to index ${j+1}`;
        array[j+1] = array[j];
        updateBars([], [j, j+1]);
        j--;
        if(stepMode) await waitForStep();
        else await sleep(speedSlider.value);
      }
      array[j+1] = key;
      explanation.textContent = `Inserted ${key} at index ${j+1}`;
      updateBars([], [j+1]);
      if(stepMode) await waitForStep();
      else await sleep(speedSlider.value);
    }
    updateBars();
    explanation.textContent = 'Insertion Sort complete!';
  }

  function setSortFunction(fn) {
    currentSortFunction = fn;
    explanation.textContent = 'Sorting algorithm selected.';
  }

  newArrayBtn.onclick = () => {
    stopRequested = true;
    generateArray();
  };

  bubbleBtn.onclick = () => setSortFunction(bubbleSort);
  selectionBtn.onclick = () => setSortFunction(selectionSort);
  insertionBtn.onclick = () => setSortFunction(insertionSort);

  startBtn.onclick = async () => {
    if (!currentSortFunction) {
      alert('Please select a sorting algorithm first!');
      return;
    }
    stopRequested = false;
    await currentSortFunction();
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

  // Initialize
  generateArray();
