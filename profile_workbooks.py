from __future__ import annotations

import datetime as dt
import re
import zipfile
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
from xml.etree import ElementTree as ET


NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
    "office": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


DATE_WORDS = ("date", "created", "dob", "pay_", "at", "ends")


@dataclass
class Stat:
    non_empty: int = 0
    numeric_count: int = 0
    min_num: float | None = None
    max_num: float | None = None
    examples: Counter[str] = field(default_factory=Counter)


def col_index(cell_ref: str) -> int:
    letters = re.match(r"[A-Z]+", cell_ref or "")
    if not letters:
        return 0
    total = 0
    for char in letters.group(0):
        total = total * 26 + ord(char) - ord("A") + 1
    return total - 1


def excel_date(value: float) -> str:
    base = dt.datetime(1899, 12, 30)
    return (base + dt.timedelta(days=value)).strftime("%Y-%m-%d")


def load_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    strings: list[str] = []
    for si in root.findall("main:si", NS):
        strings.append("".join(node.text or "" for node in si.findall(".//main:t", NS)))
    return strings


def cell_value(cell: ET.Element, shared_strings: list[str]) -> str:
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.findall(".//main:t", NS)).strip()
    value = cell.find("main:v", NS)
    if value is None or value.text is None:
        return ""
    raw = value.text.strip()
    if cell_type == "s":
        try:
            return shared_strings[int(raw)].strip()
        except (ValueError, IndexError):
            return raw
    return raw


def workbook_sheets(zf: zipfile.ZipFile) -> list[tuple[str, str]]:
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    rel_map = {
        rel.attrib["Id"]: rel.attrib["Target"]
        for rel in rels.findall("rel:Relationship", NS)
    }
    sheets: list[tuple[str, str]] = []
    for sheet in workbook.findall(".//main:sheet", NS):
        name = sheet.attrib["name"]
        rel_id = sheet.attrib["{%s}id" % NS["office"]]
        target = rel_map[rel_id].lstrip("/")
        path = target if target.startswith("xl/") else f"xl/{target}"
        sheets.append((name, path))
    return sheets


def iter_row_values(zf: zipfile.ZipFile, path: str, shared_strings: list[str]):
    root = ET.fromstring(zf.read(path))
    for row in root.findall(".//main:sheetData/main:row", NS):
        values: list[str] = []
        for cell in row.findall("main:c", NS):
            idx = col_index(cell.attrib.get("r", ""))
            while len(values) < idx:
                values.append("")
            values.append(cell_value(cell, shared_strings))
        yield values


def display_numeric(header: str, value: float | None) -> str:
    if value is None:
        return ""
    header_l = header.lower()
    if any(word in header_l for word in DATE_WORDS) and 20000 <= value <= 60000:
        return f"{value:.2f} ({excel_date(value)})"
    return f"{value:.2f}"


def profile_sheet(zf: zipfile.ZipFile, sheet_path: str, shared_strings: list[str]):
    rows = iter_row_values(zf, sheet_path, shared_strings)
    header = next(rows, [])
    headers = [h.strip() or f"blank_col_{i + 1}" for i, h in enumerate(header)]
    stats = [Stat() for _ in headers]
    total_rows = 0
    for row in rows:
        total_rows += 1
        for i, value in enumerate(row[: len(headers)]):
            if not value:
                continue
            stats[i].non_empty += 1
            if len(stats[i].examples) < 20 or value in stats[i].examples:
                stats[i].examples[value] += 1
            try:
                number = float(value)
            except ValueError:
                continue
            stats[i].numeric_count += 1
            stats[i].min_num = number if stats[i].min_num is None else min(stats[i].min_num, number)
            stats[i].max_num = number if stats[i].max_num is None else max(stats[i].max_num, number)
    return total_rows, headers, stats


def inspect_file(path: Path) -> None:
    print(f"\nWORKBOOK: {path.name}")
    with zipfile.ZipFile(path) as zf:
        shared_strings = load_shared_strings(zf)
        for sheet_name, sheet_path in workbook_sheets(zf):
            total_rows, headers, stats = profile_sheet(zf, sheet_path, shared_strings)
            print(f"\nSHEET: {sheet_name}")
            print(f"DATA_ROWS_AFTER_HEADER: {total_rows}")
            meaningful = [
                (i, header, stat)
                for i, (header, stat) in enumerate(zip(headers, stats), start=1)
                if stat.non_empty > 0 or not header.startswith("blank_col_")
            ]
            for i, header, stat in meaningful[:40]:
                numeric = f"{stat.numeric_count}/{stat.non_empty}" if stat.non_empty else "0/0"
                examples = ", ".join(k for k, _ in stat.examples.most_common(4))
                print(
                    f"  C{i:02d} {header}: non_empty={stat.non_empty}, "
                    f"numeric={numeric}, min={display_numeric(header, stat.min_num)}, "
                    f"max={display_numeric(header, stat.max_num)}, examples=[{examples}]"
                )


def main() -> None:
    for path in sorted(Path(".").glob("*.xlsx")):
        inspect_file(path)


if __name__ == "__main__":
    main()
