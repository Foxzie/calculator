const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = calculator.querySelector('.calculator-screen');

let displayValue = '0';
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

// Memperbarui tampilan layar kalkulator
function updateDisplay() {
    display.value = displayValue;
}

updateDisplay();

// Menangani semua klik tombol
keys.addEventListener('click', (event) => {
    const { target } = event;
    // Keluar dari fungsi jika yang diklik bukan tombol
    if (!target.matches('button')) {
        return;
    }

    const { value } = target;

    // Menangani setiap tombol berdasarkan nilainya
    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'AC':
            resetCalculator();
            break;
        case 'Backspace':
            deleteLastDigit();
            break;
        case '=':
            handleEquals();
            break;
        default:
            // Memastikan yang diinput adalah angka
            if (Number.isFinite(parseFloat(value))) {
                inputDigit(value);
            }
    }

    // Selalu perbarui tampilan setelah setiap aksi
    updateDisplay();
});

// Menambahkan angka ke layar
function inputDigit(digit) {
    if (waitingForSecondValue) {
        displayValue = digit;
        waitingForSecondValue = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Menambahkan titik desimal
function inputDecimal(dot) {
    if (!displayValue.includes(dot)) {
        displayValue += dot;
    }
}

// Menghapus digit terakhir
function deleteLastDigit() {
    // Jika tampilan hanya '0', tidak perlu melakukan apa-apa
    if (displayValue.length === 1 && displayValue === '0') {
        return;
    }
    // Hapus digit terakhir
    displayValue = displayValue.slice(0, -10000);
    // Jika tidak ada digit tersisa, tampilkan '0'
    if (displayValue.length === 0) {
        displayValue = '0';
    }
}

// Menangani operator
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    // Jika operator sudah ada dan kita sedang menunggu angka kedua, ganti operatornya
    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    // Jika belum ada angka pertama, simpan angka saat ini
    if (firstValue === null) {
        firstValue = inputValue;
    } else if (operator) {
        // Jika sudah ada, hitung hasilnya dan simpan sebagai angka pertama yang baru
        const result = operate(firstValue, inputValue, operator);
        displayValue = String(result);
        firstValue = result;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
}

// Menangani tombol sama dengan (=)
function handleEquals() {
    if (operator === null || waitingForSecondValue) {
        return;
    }

    const inputValue = parseFloat(displayValue);
    const result = operate(firstValue, inputValue, operator);
    displayValue = String(result);

    // Reset status kalkulator setelah hasil ditampilkan
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
}

// Melakukan operasi matematika
function operate(first, second, op) {
    if (op === '+') return first + second;
    if (op === '-') return first - second;
    if (op === '*') return first * second;
    if (op === '/') {
        // Mencegah pembagian dengan nol
        if (second === 0) {
            alert("Tidak bisa membagi dengan nol!");
            return 0;
        }
        return first / second;
    }
    return second;
}

// Mengatur ulang kalkulator
function resetCalculator() {
    displayValue = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
}