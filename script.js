let array = [];
let currentAlgo = 'bubble';
let isRunning = false;
let comparisons = 0;
let swaps = 0;

const descriptions = {
    bubble: {
        title: "Bubble Sort",
        desc: "Compares adjacent elements and swaps them if they're in wrong order. Repeats until array is sorted.",
        steps: "1) Compare neighbors 2) Swap if needed 3) Repeat for all elements"
    },
    selection: {
        title: "Selection Sort",
        desc: "Finds the smallest element and puts it at the beginning. Repeats for remaining elements.",
        steps: "1) Find minimum element 2) Swap with first position 3) Repeat for rest of array"
    },
    insertion: {
        title: "Insertion Sort",
        desc: "Takes each element and inserts it in correct position among already sorted elements.",
        steps: "1) Start from second element 2) Compare with previous elements 3) Insert in right place"
    }
};

function parseArray() {
    const input = document.getElementById('arrayInput').value;
    const errorDiv = document.getElementById('error');

    try {
        const numbers = input.split(',').map(x => parseInt(x.trim()));

        if (numbers.some(isNaN)) {
            throw new Error('Please enter valid numbers only');
        }

        if (numbers.length < 2) {
            throw new Error('Please enter at least 2 numbers');
        }

        array = numbers;
        errorDiv.style.display = 'none';
        return true;
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
        return false;
    }
}

function drawArray() {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';

    const maxVal = Math.max(...array);
    const barWidth = Math.min(60, (visualizer.offsetWidth - 40) / array.length);

    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = barWidth + 'px';
        bar.style.height = (array[i] / maxVal * 250) + 'px';
        bar.textContent = array[i];
        bar.id = 'bar' + i;
        visualizer.appendChild(bar);
    }
}

function selectAlgorithm(algo) {
    if (isRunning) return;

    currentAlgo = algo;

    // Update button styles
    document.querySelectorAll('.algo-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update description
    const desc = descriptions[algo];
    document.getElementById('description').innerHTML = `
                <h3>${desc.title}</h3>
                <p>${desc.desc}</p>
                <p><strong>Steps:</strong> ${desc.steps}</p>
            `;
}

function resetStats() {
    comparisons = 0;
    swaps = 0;
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
}

function updateStats() {
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('swaps').textContent = swaps;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function highlightBars(indices, className) {
    // Remove previous highlights
    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.remove('comparing', 'swapping');
    });

    // Add new highlights
    indices.forEach(i => {
        document.getElementById('bar' + i).classList.add(className);
    });

    await sleep(1000);
}

async function swapInArray(i, j) {
    await highlightBars([i, j], 'swapping');

    // Swap in array
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    // Update visual
    const bar1 = document.getElementById('bar' + i);
    const bar2 = document.getElementById('bar' + j);

    const maxVal = Math.max(...array);
    bar1.style.height = (array[i] / maxVal * 250) + 'px';
    bar1.textContent = array[i];
    bar2.style.height = (array[j] / maxVal * 250) + 'px';
    bar2.textContent = array[j];

    swaps++;
    updateStats();
    await sleep(500);
}

async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            await highlightBars([j, j + 1], 'comparing');
            comparisons++;
            updateStats();

            if (array[j] > array[j + 1]) {
                await swapInArray(j, j + 1);
            }
        }
        document.getElementById('bar' + (array.length - 1 - i)).classList.add('sorted');
    }
    document.getElementById('bar0').classList.add('sorted');
}

async function selectionSort() {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < array.length; j++) {
            await highlightBars([minIndex, j], 'comparing');
            comparisons++;
            updateStats();

            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            await swapInArray(i, minIndex);
        }

        document.getElementById('bar' + i).classList.add('sorted');
    }
    document.getElementById('bar' + (array.length - 1)).classList.add('sorted');
}

async function insertionSort() {
    document.getElementById('bar0').classList.add('sorted');

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        await highlightBars([i], 'comparing');

        while (j >= 0 && array[j] > key) {
            await highlightBars([j, j + 1], 'comparing');
            comparisons++;
            updateStats();

            array[j + 1] = array[j];
            const bar = document.getElementById('bar' + (j + 1));
            const maxVal = Math.max(...array);
            bar.style.height = (array[j + 1] / maxVal * 250) + 'px';
            bar.textContent = array[j + 1];

            j--;
            swaps++;
            updateStats();
            await sleep(500);
        }

        array[j + 1] = key;
        const bar = document.getElementById('bar' + (j + 1));
        const maxVal = Math.max(...array);
        bar.style.height = (key / maxVal * 250) + 'px';
        bar.textContent = key;
        bar.classList.add('sorted');
    }
}

async function startSort() {
    if (isRunning) return;

    if (!parseArray()) return;

    isRunning = true;
    resetStats();
    drawArray();

    // Remove all highlights
    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.remove('comparing', 'swapping', 'sorted');
    });

    try {
        if (currentAlgo === 'bubble') {
            await bubbleSort();
        } else if (currentAlgo === 'selection') {
            await selectionSort();
        } else if (currentAlgo === 'insertion') {
            await insertionSort();
        }
    } catch (error) {
        console.log('Sorting stopped');
    }

    isRunning = false;

    // Clear highlights after sorting
    setTimeout(() => {
        document.querySelectorAll('.bar').forEach(bar => {
            bar.classList.remove('comparing', 'swapping');
        });
    }, 1000);
}

// Initialize
if (parseArray()) {
    drawArray();
}