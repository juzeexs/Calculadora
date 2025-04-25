let operacao = null;
let resultadoAnterior = 0;

function calculo(x) {
    if (x == "soma") {
        operacao = "soma";
    } else if (x == "multiplicacao") {
        operacao = "multiplicacao";
    } else if (x == "divisao") {
        operacao = "divisao";
    } else if (x == "menos") {
        operacao = "menos";
    }
}

function resultado() {
    let valor1 = Number(document.getElementById("valor1").value);
    let valor2 = Number(document.getElementById("valor2").value);
    
    let resultado;

    if (resultadoAnterior !== 0) {
        valor1 = resultadoAnterior;
    }

    if (operacao == "soma") {
        resultado = valor1 + valor2;
    } else if (operacao == "multiplicacao") {
        resultado = valor1 * valor2;
    } else if (operacao == "divisao") {
        if (valor2 !== 0) {
            resultado = valor1 / valor2;
        } else {
            resultado = "Erro: Divisão por zero!";
        }
    } else if (operacao == "menos") {
        resultado = valor1 - valor2;
    }

    document.getElementById("resultado").innerHTML = resultado;
    resultadoAnterior = resultado;
}





