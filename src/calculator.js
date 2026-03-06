// --- CALCULADORA PREMIUM LOGIC ---
window.CalcApp = {
    tempTotal: 0,
    tempHistory: "0",
    currentExpression: "0",
    activeProduct: "",

    updateUI: function () {
        const display = document.getElementById('calcResult');
        const saved = document.getElementById('current-saved-val');
        if (display) display.textContent = this.currentExpression;
        if (saved) saved.textContent = this.tempTotal;
    },

    open: function (product, currentQty, currentHistory) {
        this.activeProduct = product;
        this.tempTotal = currentQty || 0;
        this.tempHistory = currentHistory || "0";
        this.currentExpression = "0";

        const title = document.getElementById('calc-product-name');
        if (title) title.textContent = product;

        this.updateUI();
        const modal = document.getElementById('calcModal');
        if (modal) modal.style.display = 'flex';
    },

    close: function () {
        const modal = document.getElementById('calcModal');
        if (modal) modal.style.display = 'none';
    },

    handleInput: function (val, op) {
        if (op === 'C' || op === 'CE') {
            this.currentExpression = "0";
        } else if (op === 'BS') {
            this.currentExpression = this.currentExpression.length > 1 ? this.currentExpression.slice(0, -1) : "0";
        } else if (op === 'ANT') {
            this.currentExpression = this.currentExpression === "0" ? "ANT" : this.currentExpression + "ANT";
        } else if (op === '=') {
            this.performCalc();
            return;
        } else {
            this.currentExpression = (this.currentExpression === "0" && !isNaN(val)) ? val : this.currentExpression + val;
        }
        this.updateUI();
    },

    performCalc: function () {
        try {
            let expr = this.currentExpression.replace(/ANT/g, this.tempTotal).replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '.');
            let res = eval(expr);
            if (!isNaN(res)) {
                let isOpOnTotal = this.currentExpression.includes("ANT");
                let old = this.tempTotal;
                this.tempTotal = isOpOnTotal ? res : old + res;

                let step = isOpOnTotal ? `(${this.currentExpression.replace(/ANT/g, old)})=${this.tempTotal}` : `+${this.currentExpression}=${this.tempTotal}`;
                this.tempHistory = (this.tempHistory === "0" || this.tempHistory === "") ? (isOpOnTotal ? step : `${this.currentExpression}=${this.tempTotal}`) : this.tempHistory + step;
                this.currentExpression = "0";
            }
        } catch (e) {
            alert("Operación inválida");
        }
        this.updateUI();
    },

    save: function (onSaveCallback) {
        if (this.currentExpression !== "0") {
            alert("⚠️ PRESIONA '=' ANTES DE GUARDAR");
            return;
        }
        if (onSaveCallback) onSaveCallback(this.activeProduct, this.tempTotal, this.tempHistory);
        this.close();
    },

    toggleHistory: function () {
        alert("HISTORIAL:\\n" + this.tempHistory);
    }
};

// Bind buttons globally
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('calc-btn')) {
        const btn = e.target;
        window.CalcApp.handleInput(btn.textContent, btn.dataset.op);
    }
});
