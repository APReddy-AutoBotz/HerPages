#!/usr/bin/env python3
"""Check the HerPages documentation baseline using only the Python standard library.

This is not a full OpenAPI/JSON Schema validator, application test or security audit.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]


def contrast(foreground: str, background: str) -> float:
    def luminance(value: str) -> float:
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", value):
            raise ValueError(f"Invalid RGB color: {value}")
        channels = [int(value[i:i + 2], 16) / 255 for i in (1, 3, 5)]
        linear = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in channels]
        return sum(v * w for v, w in zip(linear, (0.2126, 0.7152, 0.0722)))
    a, b = sorted((luminance(foreground), luminance(background)))
    return (b + 0.05) / (a + 0.05)


def unique_ids(records: list[dict], label: str, errors: list[str]) -> dict:
    result = {}
    for record in records:
        identity = record.get("id")
        if not identity or identity in result:
            errors.append(f"{label}: missing or duplicate ID {identity!r}")
        result[identity] = record
    return result


def validate_stages(stages: list[dict]) -> None:
    expected = 0
    seen = set()
    for index, stage in enumerate(stages):
        if stage["id"] in seen:
            raise ValueError("Duplicate stage ID")
        seen.add(stage["id"])
        if stage["minAge"] != expected:
            raise ValueError("Stage age gap or overlap")
        maximum = stage["maxAge"]
        if maximum is None:
            if index != len(stages) - 1:
                raise ValueError("Only final stage may be open-ended")
        elif maximum < stage["minAge"]:
            raise ValueError("Invalid age range")
        else:
            expected = maximum + 1
    if not stages or stages[-1]["maxAge"] is not None:
        raise ValueError("Final stage must be open-ended")


def stage_for(age: int, stages: list[dict]) -> str:
    for stage in stages:
        if age >= stage["minAge"] and (stage["maxAge"] is None or age <= stage["maxAge"]):
            return stage["id"]
    raise ValueError(f"No stage for age {age}")


def resolve_json_ref(source: Path, reference: str, root: Path) -> None:
    path_part, separator, fragment = reference.partition("#")
    if urlparse(path_part).scheme:
        return  # Remote references are not fetched by this offline checker.
    target = (source.parent / unquote(path_part)).resolve() if path_part else source.resolve()
    if not target.is_relative_to(root.resolve()):
        raise ValueError("Reference escapes repository")
    data = json.loads(target.read_text(encoding="utf-8"))
    if separator and fragment:
        if not fragment.startswith("/"):
            raise ValueError("Only JSON Pointer fragments are supported")
        for token in fragment[1:].split("/"):
            token = unquote(token).replace("~1", "/").replace("~0", "~")
            data = data[int(token)] if isinstance(data, list) else data[token]


def walk_refs(value: object):
    if isinstance(value, dict):
        for key, item in value.items():
            if key == "$ref" and isinstance(item, str):
                yield item
            yield from walk_refs(item)
    elif isinstance(value, list):
        for item in value:
            yield from walk_refs(item)


def validate(root: Path) -> tuple[list[str], dict]:
    errors: list[str] = []
    files = [p for p in root.rglob("*") if p.is_file() and not any(x in p.parts for x in (".git", "node_modules", "__pycache__"))]
    json_files = [p for p in files if p.suffix == ".json"]
    markdown = [p for p in files if p.suffix == ".md"]
    payloads = {}
    for path in json_files:
        try:
            payloads[str(path.relative_to(root))] = json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError) as exc:
            errors.append(f"JSON {path.relative_to(root)}: {exc}")
    for path in markdown:
        text = path.read_text(encoding="utf-8")
        for raw in re.findall(r"\[[^\]]*\]\(([^)]+)\)", text):
            destination = raw.strip().split(" ")[0].strip("<>")
            if not destination or destination.startswith("#") or urlparse(destination).scheme:
                continue
            target = unquote(destination.split("#", 1)[0])
            if target and not (path.parent / target).exists():
                errors.append(f"Broken local link in {path.relative_to(root)}: {destination}")
    for relative, data in payloads.items():
        for reference in walk_refs(data):
            try:
                resolve_json_ref(root / relative, reference, root)
            except (ValueError, OSError, KeyError, IndexError, TypeError) as exc:
                errors.append(f"Broken JSON reference in {relative}: {reference}: {exc}")
    required = ["README.md", "AGENTS.md", "SECURITY.md", "docs/README.md", "docs/06-delivery/STATUS.md", "docs/06-delivery/RELEASE_GATES.md", "docs/07-reference/SOURCES.md"]
    for name in required:
        if not (root / name).is_file():
            errors.append(f"Missing required file: {name}")
    stats = {"files": len(files), "markdown": len(markdown), "json": len(json_files)}
    try:
        requirements = payloads["docs/01-product/requirements.json"]["requirements"]
        cases = payloads["docs/06-delivery/test-cases.json"]["cases"]
        req_map = unique_ids(requirements, "requirements", errors)
        test_map = unique_ids(cases, "tests", errors)
        tasks = set(re.findall(r"HP-\d{3}", (root / "docs/06-delivery/BACKLOG.md").read_text()))
        for req in requirements:
            for field in ("module", "phase", "priority", "statement", "acceptance", "test", "task"):
                if not req.get(field):
                    errors.append(f"{req['id']}: missing {field}")
            if req.get("test") not in test_map:
                errors.append(f"{req['id']}: unknown test")
            elif test_map[req["test"]].get("requirement") != req["id"]:
                errors.append(f"{req['id']}: test back-reference mismatch")
            if req.get("task") not in tasks:
                errors.append(f"{req['id']}: unknown backlog task")
        for case in cases:
            if case.get("requirement") not in req_map:
                errors.append(f"{case['id']}: unknown requirement")
            if not case.get("scenario") or not case.get("expected"):
                errors.append(f"{case['id']}: missing test specification")
        if len(req_map) != 64 or len(test_map) != 64:
            errors.append("Baseline expects 64 requirements and 64 acceptance specifications")
        lifecycle = payloads["contracts/lifecycle.json"]
        stages = lifecycle["stages"]
        validate_stages(stages)
        if lifecycle["jurisdictions"]["IN"]["adultAge"] != 18 or lifecycle["visualPolicy"]["authoritySource"] is not False:
            errors.append("Legal adulthood/theme separation violated")
        if stage_for(17, stages) != "horizon" or stage_for(18, stages) != "horizon":
            errors.append("Horizon boundary contract changed")
        tokens = payloads["docs/02-design/tokens.json"]
        if set(tokens["stages"]) != {s["id"] for s in stages}:
            errors.append("Stage token coverage mismatch")
        for pair in tokens["contrastPairs"]:
            ratio = contrast(pair["foreground"], pair["background"])
            if ratio + 1e-9 < pair["minimum"]:
                errors.append(f"Contrast {pair['name']}: {ratio:.2f} < {pair['minimum']}")
        flags = payloads["contracts/feature-flags.json"]["flags"]
        for name, spec in flags.items():
            if name != "synthetic_demo" and spec["enabled"] is not False:
                errors.append(f"Sensitive baseline flag enabled: {name}")
        personas = payloads["docs/fixtures/synthetic-personas.json"]
        if personas["synthetic"] is not True:
            errors.append("Personas not labeled synthetic")
        for person in personas["personas"]:
            if person["stage"] != stage_for(person["age"], stages) or person["real_processing_allowed"] is not False:
                errors.append(f"Invalid persona policy: {person['id']}")
        samples = payloads["docs/fixtures/sample-opportunities.json"]
        for item in samples["opportunities"]:
            if not item["is_demo"] or not item["title"].startswith("DEMO") or item["status"] != "draft":
                errors.append("Opportunity fixture could masquerade as real")
            for field in ("source_url", "application_url"):
                if not (urlparse(item[field]).hostname or "").endswith(".invalid"):
                    errors.append("Fixture destination must use reserved .invalid domain")
        api = payloads["docs/03-architecture/openapi.json"]
        if api["openapi"] != "3.1.0" or not urlparse(api["servers"][0]["url"]).hostname.endswith(".invalid"):
            errors.append("OpenAPI version or documentation server invalid")
        operations = []
        for route, methods in api["paths"].items():
            if "/pages" in route:
                errors.append("Private vault CRUD must not exist on service API")
            for method, operation in methods.items():
                if method in ("get", "post", "put", "patch", "delete"):
                    operations.append({"id": operation.get("operationId")})
                    if not operation.get("responses"):
                        errors.append(f"API operation without responses: {route}")
        unique_ids(operations, "OpenAPI operations", errors)
        source_text = (root / "docs/07-reference/SOURCES.md").read_text()
        known_sources = set(re.findall(r"\| (S\d{2}) \|", source_text))
        for path in markdown:
            for source in set(re.findall(r"\bS\d{2}\b", path.read_text())):
                if source not in known_sources:
                    errors.append(f"Unknown source {source} in {path.relative_to(root)}")
        stats.update(requirements=len(requirements), acceptance_cases=len(cases), tasks=len(tasks), stages=len(stages), contrast_pairs=len(tokens["contrastPairs"]), api_operations=len(operations), sources=len(known_sources))
    except (KeyError, ValueError, TypeError, OSError) as exc:
        errors.append(f"Contract validation could not complete: {exc}")
    return errors, stats


def main() -> int:
    errors, stats = validate(ROOT)
    print(json.dumps({"status": "FAIL" if errors else "PASS", "counts": stats, "limitations": "Document consistency only; not app execution, full schema conformance, security audit or legal approval."}, indent=2))
    for error in errors:
        print(f"ERROR: {error}", file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
