import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { query } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Compute
function compute(a, b, op) {
  const x = Number(a);
  const y = Number(b);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error("Operands must be numbers");
  }

  switch (op) {
    case "+": return x + y;
    case "-": return x - y;
    case "*": return x * y;
    case "/":
      if (y === 0) throw new Error("Division by zero");
      return x / y;
    default:
      throw new Error("Unsupported operator");
  }
}

// --- POST /api/calc ---
app.post("/api/calc", async (req, res) => {
  try {
    const { operand1, operand2, operator } = req.body;
    const result = compute(operand1, operand2, operator);
    const expression = `${operand1} ${operator} ${operand2}`;

    // Insert into DB
    const insert = `
      INSERT INTO calculations (operand1, operand2, operator, result, expression)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { rows } = await query(insert, [operand1, operand2, operator, result, expression]);

    res.json({ ok: true, data: rows[0] });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// --- GET /api/history ---
app.get("/api/history", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 10), 50);
    const { rows } = await query(
      `SELECT expression, result, created_at
       FROM calculations
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
