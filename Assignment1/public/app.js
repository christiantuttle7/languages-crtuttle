async function api(path, opts = {}) {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
  
    const data = await res.json().catch(() => ({}));
  
    if (!res.ok || data.ok === false) {
      const msg = data?.error || res.statusText;
      throw new Error(msg);
    }
    return data;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("calc-form");
    const resultEl = document.getElementById("result");
    const historyEl = document.getElementById("history");
    const refreshBtn = document.getElementById("refresh");
  
    // Handle form submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const operand1 = document.getElementById("op1").value;
      const operand2 = document.getElementById("op2").value;
      let operator = document.getElementById("operator").value;
  
      // Normalize fancy symbols
      if (operator === "×") operator = "*";
      if (operator === "÷") operator = "/";
  
      try {
        const { data } = await api("/api/calc", {
          method: "POST",
          body: JSON.stringify({ operand1, operand2, operator }),
        });
        resultEl.textContent = `${data.expression} = ${data.result}`;
        await loadHistory();
      } catch (err) {
        resultEl.textContent = `Error: ${err.message}`;
      }
    });
  
    // Load history from backend
    async function loadHistory() {
      try {
        const { data } = await api("/api/history?limit=10");
        historyEl.innerHTML = "";
        data.forEach((row) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <span>${row.expression} = ${row.result}</span>
            <span class="time">${new Date(row.created_at).toLocaleString()}</span>
          `;
          historyEl.appendChild(li);
        });
      } catch (err) {
        historyEl.innerHTML = `<li>Error: ${err.message}</li>`;
      }
    }
  
    refreshBtn.addEventListener("click", loadHistory);
    loadHistory();
  });
  