const expressionDisplay = document.getElementById('expression');
const display = document.getElementById('display');
let currentValue = '0';
let previousValue = '';
let operator = null;
let expressionValue = '0';
let resultValue = '';
let shouldResetDisplay = false;

const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
  button.addEventListener('click', () => handleButtonClick(button.dataset.action));
});

window.addEventListener('keydown', (event) => {
  const key = event.key;
  if (/^[0-9]$/.test(key)) {
    event.preventDefault();
    appendNumber(key);
    updateDisplay();
    return;
  }

  if (key === '.' || key === ',') {
    event.preventDefault();
    appendNumber('.');
    updateDisplay();
    return;
  }

  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    evaluate();
    updateDisplay();
    return;
  }

  if (key === 'Backspace') {
    event.preventDefault();
    deleteLastDigit();
    updateDisplay();
    return;
  }

  if (key === 'Escape') {
    event.preventDefault();
    clearAll();
    updateDisplay();
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    event.preventDefault();
    chooseOperator(key);
    updateDisplay();
  }
});

function handleButtonClick(action) {
  if (isNumber(action)) {
    appendNumber(action);
    updateDisplay();
    return;
  }

  switch (action) {
    case '.':
      appendNumber('.');
      break;
    case 'clear':
      clearAll();
      break;
    case 'delete':
      deleteLastDigit();
      break;
    case '=':
      evaluate();
      break;
    case '%':
      applyPercent();
      break;
    default:
      chooseOperator(action);
  }

  updateDisplay();
}

function isNumber(value) {
  return /^[0-9]$/.test(value);
}

function appendNumber(number) {
  if (shouldResetDisplay) {
    currentValue = '';
    shouldResetDisplay = false;
    resultValue = '';
  }

  if (number === '.' && currentValue.includes('.')) return;
  if (currentValue === '0' && number !== '.') {
    currentValue = number;
  } else {
    currentValue += number;
  }
  expressionValue = operator ? `${previousValue}${operator}${currentValue}` : currentValue;
}

function chooseOperator(selectedOperator) {
  if (operator !== null && !shouldResetDisplay) {
    evaluate();
  }
  operator = selectedOperator;
  previousValue = currentValue;
  expressionValue = `${previousValue}${operator}`;
  shouldResetDisplay = true;
  resultValue = '';
}

function evaluate() {
  if (operator === null) return;

  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  if (isNaN(prev) || isNaN(current)) return;

  let result;
  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      result = current === 0 ? 'Error' : prev / current;
      break;
    default:
      return;
  }

  resultValue = formatResult(result);
  expressionValue = `${previousValue}${operator}${currentValue}`;
  currentValue = resultValue;
  operator = null;
  previousValue = '';
  shouldResetDisplay = true;
}

function formatResult(result) {
  if (result === 'Error') return result;
  const formatted = parseFloat(result.toFixed(10));
  return formatted.toString();
}

function clearAll() {
  currentValue = '0';
  previousValue = '';
  operator = null;
  expressionValue = '0';
  resultValue = '';
  shouldResetDisplay = false;
}

function deleteLastDigit() {
  if (shouldResetDisplay) {
    currentValue = '0';
    shouldResetDisplay = false;
    return;
  }
  currentValue = currentValue.slice(0, -1);
  if (currentValue === '' || currentValue === '-') {
    currentValue = '0';
  }
}

function applyPercent() {
  const value = parseFloat(currentValue);
  if (isNaN(value)) return;
  currentValue = (value / 100).toString();
  shouldResetDisplay = true;
}

function updateDisplay() {
  expressionDisplay.textContent = expressionValue;
  display.textContent = resultValue;
}

updateDisplay();
