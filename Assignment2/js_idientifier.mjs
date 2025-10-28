// js_identifier_test.mjs
// Identify valid JavaScript identifiers using Unicode property escapes
// and exclude reserved words so results match real variable/function names.

const IDENTIFIER_RE =
  /^(?:[$_\p{ID_Start}])(?:[$_\u200C\u200D\p{ID_Continue}])*$/u;

// Reserved words in ECMAScript (including literals and strict/future ones).
// Reference: ECMA-262. This set intentionally errs on the safe side.
const RESERVED = new Set([
  "await","break","case","catch","class","const","continue","debugger","default",
  "delete","do","else","export","extends","finally","for","function","if",
  "import","in","instanceof","new","return","super","switch","this","throw",
  "try","typeof","var","void","while","with","yield",
  "enum","implements","interface","let","package","private","protected","public","static",
  // literals
  "null","true","false"
]);

export function is_js_id(str) {
  // Must match the Identifier production and not be a reserved word
  return IDENTIFIER_RE.test(str) && !RESERVED.has(str);
}

/* ------------------------ Tiny test runner below ------------------------ */

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (err) {
    console.error(`❌ ${name}\n   ${err.message}`);
    process.exitCode = 1;
  }
}

function expect(value) {
  return {
    toBeTruthy() {
      if (!value) throw new Error(`Expected truthy, got ${value}`);
    },
    toBeFalsy() {
      if (value) throw new Error(`Expected falsy, got ${value}`);
    }
  };
}

/* ------------------------------ Test cases ------------------------------ */

const shouldPass = [
  "main",
  "foo_bar",
  "_private",
  "$dollar",
  "x0",
  "Ωmega",            // Greek
  "добро",            // Cyrillic
  "变量",              // CJK
  "x\u200Cy",         // ZWNJ allowed in continue
  "x\u200Dy",         // ZWJ allowed in continue
  "𐐷start",          // Deseret letter; needs /u with \p{ID_Start}
];

const shouldFail = [
  "",                 // empty
  "0abc",             // cannot start with digit
  "foo-bar",          // hyphen not allowed
  "has space",        // spaces not allowed
  "class",            // reserved word
  "let",              // reserved word
  "null",             // literal
  "\u200C",           // ZWNJ cannot start an identifier
  "\u200D",           // ZWJ cannot start an identifier
];

test("valid identifiers pass", () => {
  for (const id of shouldPass) {
    const ok = is_js_id(id);
    if (!ok) throw new Error(`Expected valid: ${JSON.stringify(id)}`);
  }
});

test("invalid identifiers fail", () => {
  for (const id of shouldFail) {
    const ok = is_js_id(id);
    if (ok) throw new Error(`Expected invalid: ${JSON.stringify(id)}`);
  }
});

test("mixed bag sanity checks", () => {
  expect(is_js_id("a")).toBeTruthy();
  expect(is_js_id("$")).toBeTruthy();
  expect(is_js_id("_")).toBeTruthy();
  expect(is_js_id("9")).toBeFalsy();
  expect(is_js_id("for")).toBeFalsy();      // reserved
  expect(is_js_id("forEach")).toBeTruthy(); // not reserved
});

/* ----------------------------- Usage example ---------------------------- */
// Uncomment to play:
// console.log(is_js_id(process.argv[2] ?? "main"));
