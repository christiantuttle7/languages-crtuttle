CREATE TABLE IF NOT EXISTS calculations (
id SERIAL PRIMARY KEY,
operand1 NUMERIC NOT NULL,
operand2 NUMERIC NOT NULL,
operator TEXT NOT NULL CHECK (operator IN ('+', '-', '*', '/')),
result NUMERIC NOT NULL,
expression TEXT NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Optional seed
INSERT INTO calculations (operand1, operand2, operator, result, expression)
VALUES (1, 2, '+', 3, '1 + 2')
ON CONFLICT DO NOTHING;