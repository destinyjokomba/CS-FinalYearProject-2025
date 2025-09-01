def test_config_imports():
    import importlib
    cfg = importlib.import_module("backend.config 2")
    assert cfg is not None
