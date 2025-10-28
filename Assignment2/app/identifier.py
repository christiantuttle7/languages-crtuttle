import regex  # make sure this is installed: pip install regex

IDENTIFIER_RE = regex.compile(
    r'^(?:[$_\p{ID_Start}])(?:[$_\u200C\u200D\p{ID_Continue}])*$',
    regex.UNICODE
)

RESERVED = {
    "await","break","case","catch","class","const","continue","debugger",
    "default","delete","do","else","export","extends","finally","for",
    "function","if","import","in","instanceof","new","return","super",
    "switch","this","throw","try","typeof","var","void","while","with",
    "yield","enum","implements","interface","let","package","private",
    "protected","public","static","null","true","false"
}

def is_js_id(s: str) -> bool:
    return bool(IDENTIFIER_RE.match(s)) and s not in RESERVED
