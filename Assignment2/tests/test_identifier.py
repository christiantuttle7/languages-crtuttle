# tests/test_identifier.py
from app.identifier import is_js_id

def test_valid_ids():
    valid = ["main", "_foo", "$", "x0", "Ωmega"]
    for id_str in valid:
        assert is_js_id(id_str) is True

def test_invalid_ids():
    invalid = ["", "1bad", "foo bar", "class", "null", "-nope"]
    for id_str in invalid:
        assert is_js_id(id_str) is False

def test_edge_cases():
    assert is_js_id("forEach") is True
    assert is_js_id("await") is False
