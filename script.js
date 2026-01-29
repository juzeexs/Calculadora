// Elementos do DOM
const displayCurrent = document.querySelector('.display-current');
const displayPrevious = document.querySelector('.display-previous');

// Estado da calculadora
let currentValue = '0';
let previousValue = '';
let operation = null;
let waitingForNewValue = false;

// Atualiza o display
function updateDisplay() {
    displayCurrent.textContent = formatNumber(currentValue);
    
    if (operation && previousValue) {
        displayPrevious.textContent = `${formatNumber(previousValue)} ${getOperatorSymbol(operation)}`;
    } else {
        displayPrevious.textContent = '';
    }
}

// Formata número para exibição
function formatNumber(num) {
    if (num === '') return '0';
    if (num === 'Erro') return 'Erro';
    
    // Remove zeros desnecessários à direita após ponto decimal
    const parts = num.split('.');
    if (parts.length === 2) {
        parts[1] = parts[1].replace(/0+$/, '');
        if (parts[1] === '') {
            return parts[0];
        }
        return parts.join('.');
    }
    
    return num;
}

// Retorna símbolo visual do operador
function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%'
    };
    return symbols[op] || op;
}

// Adiciona número ao display
function inputNumber(num) {
    if (waitingForNewValue) {
        currentValue = num;
        waitingForNewValue = false;
    } else {
        if (currentValue === '0') {
            currentValue = num;
        } else {
            // Limita tamanho do número
            if (currentValue.length < 12) {
                currentValue += num;
            }
        }
    }
    updateDisplay();
}

// Adiciona ponto decimal
function inputDecimal() {
    if (waitingForNewValue) {
        currentValue = '0.';
        waitingForNewValue = false;
    } else if (!currentValue.includes('.')) {
        currentValue += '.';
    }
    updateDisplay();
}

// Seleciona operador
function selectOperator(op) {
    if (operation && !waitingForNewValue) {
        calculate();
    }
    
    previousValue = currentValue;
    operation = op;
    waitingForNewValue = true;
    updateDisplay();
}

// Realiza o cálculo
function calculate() {
    if (!operation || !previousValue) return;
    
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    let result;
    
    switch (operation) {
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
            if (current === 0) {
                currentValue = 'Erro';
                operation = null;
                previousValue = '';
                waitingForNewValue = true;
                updateDisplay();
                setTimeout(() => {
                    clear();
                }, 1500);
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }
    
    // Arredonda para evitar problemas de ponto flutuante
    result = Math.round(result * 100000000) / 100000000;
    
    // Limita casas decimais na exibição
    currentValue = result.toString();
    if (currentValue.includes('.')) {
        const parts = currentValue.split('.');
        if (parts[1].length > 8) {
            currentValue = result.toFixed(8);
        }
    }
    
    operation = null;
    previousValue = '';
    waitingForNewValue = true;
    updateDisplay();
}

// Calcula porcentagem (botão %)
function calculatePercentage() {
    if (previousValue && operation) {
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentValue);
        
        if (operation === '+' || operation === '-') {
            // Calcula porcentagem do valor anterior
            currentValue = ((prev * current) / 100).toString();
        } else if (operation === '*' || operation === '/') {
            // Converte para decimal
            currentValue = (current / 100).toString();
        }
    } else {
        // Se não há operação, divide por 100
        const current = parseFloat(currentValue);
        currentValue = (current / 100).toString();
    }
    
    updateDisplay();
}

// Limpa tudo
function clear() {
    currentValue = '0';
    previousValue = '';
    operation = null;
    waitingForNewValue = false;
    updateDisplay();
}

// Deleta último caractere
function deleteChar() {
    if (currentValue === 'Erro') {
        clear();
        return;
    }
    
    if (waitingForNewValue) return;
    
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    updateDisplay();
}

// Event listeners para botões
function handleButtonClick(button) {
    // Números
    if (button.dataset.number) {
        const num = button.dataset.number;
        if (num === '.') {
            inputDecimal();
        } else {
            inputNumber(num);
        }
    }
    
    // Operadores
    if (button.dataset.operator) {
        selectOperator(button.dataset.operator);
    }
    
    // Ações
    if (button.dataset.action) {
        const action = button.dataset.action;
        
        switch (action) {
            case 'clear':
                clear();
                break;
            case 'delete':
                deleteChar();
                break;
            case 'equals':
                calculate();
                break;
            case 'percentage':
                calculatePercentage();
                break;
        }
    }
}

// Adiciona eventos de click e touch
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        handleButtonClick(button);
    });
    
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleButtonClick(button);
    });
});

// Suporte a teclado
document.addEventListener('keydown', (e) => {
    // Números
    if (e.key >= '0' && e.key <= '9') {
        inputNumber(e.key);
    }
    
    // Ponto decimal
    if (e.key === '.' || e.key === ',') {
        inputDecimal();
    }
    
    // Operadores
    if (['+', '-', '*', '/'].includes(e.key)) {
        selectOperator(e.key);
    }
    
    // Porcentagem
    if (e.key === '%') {
        calculatePercentage();
    }
    
    // Enter ou = para calcular
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    }
    
    // Backspace para deletar
    if (e.key === 'Backspace') {
        deleteChar();
    }
    
    // Escape para limpar
    if (e.key === 'Escape') {
        clear();
    }
});

// Inicializa display
updateDisplay();

// Previne zoom em double tap (iOS/Mobile) - apenas fora dos botões
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    // Não previne se for um botão
    if (e.target.closest('.btn')) {
        return;
    }
    
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });