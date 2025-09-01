import importlib, io, json, builtins

def test_schemas_imports(monkeypatch):
    fake_json = json.dumps({"features": ["age_bracket"]})
    def fake_open(path, *a, **k):
        if path.endswith("features.json"):
            return io.StringIO(fake_json)
        return builtins.open(path, *a, **k)
    monkeypatch.setattr("builtins.open", fake_open)

    mod = importlib.import_module("backend.schemas 2")
    assert hasattr(mod, "Schema")
