"""Regression tests for documentation-check helpers; not application tests."""
import json
import tempfile
import unittest
from pathlib import Path

from validate_docs import contrast, resolve_json_ref, stage_for, unique_ids, validate_stages


class ValidatorTests(unittest.TestCase):
    def test_black_white_contrast(self):
        self.assertAlmostEqual(contrast("#000000", "#FFFFFF"), 21.0)

    def test_identical_color_contrast(self):
        self.assertAlmostEqual(contrast("#ABCDEF", "#ABCDEF"), 1.0)

    def test_invalid_color_rejected(self):
        with self.assertRaises(ValueError):
            contrast("purple", "#FFFFFF")

    def test_original_violet_not_small_white_text(self):
        self.assertLess(contrast("#FFFFFF", "#806BF2"), 4.5)
        self.assertGreaterEqual(contrast("#FFFFFF", "#6852C7"), 4.5)

    def test_valid_stage_ranges(self):
        stages = [{"id":"a","minAge":0,"maxAge":17},{"id":"b","minAge":18,"maxAge":None}]
        validate_stages(stages)
        self.assertEqual(stage_for(18, stages), "b")
        self.assertEqual(stage_for(105, stages), "b")

    def test_gap_rejected(self):
        with self.assertRaises(ValueError):
            validate_stages([{"id":"a","minAge":0,"maxAge":17},{"id":"b","minAge":19,"maxAge":None}])

    def test_early_open_range_rejected(self):
        with self.assertRaises(ValueError):
            validate_stages([{"id":"a","minAge":0,"maxAge":None},{"id":"b","minAge":18,"maxAge":None}])

    def test_duplicate_ids_rejected(self):
        errors = []
        unique_ids([{"id":"same"},{"id":"same"}], "fixture", errors)
        self.assertTrue(errors)

    def test_local_pointer_resolution(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "schema.json"
            source.write_text(json.dumps({"definitions":{"a/b":{"type":"string"}}}))
            resolve_json_ref(source, "#/definitions/a~1b", root)
            with self.assertRaises(KeyError):
                resolve_json_ref(source, "#/definitions/missing", root)

    def test_reference_escape_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "schema.json"
            source.write_text("{}")
            with self.assertRaises(ValueError):
                resolve_json_ref(source, "../outside.json", root)


if __name__ == "__main__":
    unittest.main()
