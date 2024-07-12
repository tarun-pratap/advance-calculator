let display = document.getElementById("display");

function clearDisplay() {
    display.innerText = "0";
}

function deleteLast() {
    display.innerText = display.innerText.slice(0, -1) || "0";
}

function appendCharacter(char) {
    const display = document.getElementById("display");
    if (display.innerText === "0" || display.innerText === "Error") {
        display.innerText = char;
    } else {
        display.innerText += char;
    }
}

function calculateResult() {
    try {
        let expression = display.innerText.replace(/%/g, "/100");
        // Replace occurrences of √ with Math.sqrt()
        expression = expression.replace(/√/g, "Math.sqrt");

        // Evaluate the expression using Function constructor for safety
        const result = new Function('return ' + expression)();
        display.innerText = result;
    } catch {
        display.innerText = "Error";
    }
}

let isOn = true;

function toggleCalculator() {
    const display = document.getElementById("display");
    const buttons = document.querySelectorAll(".buttons .btn:not(.on-off)");

    if (isOn) {
        display.innerText = "";
        buttons.forEach(button => button.disabled = true);
    } else {
        display.innerText = "0";
        buttons.forEach(button => button.disabled = false);
    }

    isOn = !isOn;
}



function flipCalculator() {
    let basicButtons = document.getElementById("basic-buttons");
    let advancedButtons = document.getElementById("advanced-buttons");

    if (basicButtons.style.display === "none") {
        basicButtons.style.display = "grid";
        advancedButtons.style.display = "none";
    } else {
        basicButtons.style.display = "none";
        advancedButtons.style.display = "grid";
    }
}
async function fetchWolframAlphaResult(query) {
    const url = `/wolfram?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.result) {
            return data.result;
        } else if (data.error) {
            return data.error;
        } else {
            return "Unknown error";
        }
    } catch (error) {
        return "Error: Network issue";
    }
}

async function submitWolframQuery() {
    const queryInput = document.getElementById("wolframQuery");
    const query = queryInput.value;
    const result = await fetchWolframAlphaResult(query);
    document.getElementById("display").innerText = result;
}
