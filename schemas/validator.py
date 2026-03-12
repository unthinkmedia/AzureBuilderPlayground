"""Validate a PageSchema against a live StoryIndex.

Walks every StoryRef in the page (command bar items, template stories,
row actions, card stories, detail section stories) and checks that its
story_id exists in the StoryIndex.

Usage:
    from schemas.loader import fetch_story_index
    from schemas.validator import validate_page

    index = fetch_story_index()
    errors = validate_page(page, index)
    if errors:
        for e in errors:
            print(e)
"""

from __future__ import annotations

import json
import subprocess
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from schemas.loader import StoryIndex
from schemas.page import (
    PageSchema, StoryRef,
    ListTableTemplate, FormTemplate, CardsGridTemplate,
    DetailTemplate, CustomTemplate,
)


@dataclass(frozen=True)
class ValidationError:
    """A single validation error."""
    instance_id: str
    story_id: str
    location: str
    message: str

    def __str__(self) -> str:
        return f"[{self.location}] {self.instance_id}: {self.message} (storyId={self.story_id!r})"


def _check_ref(ref: StoryRef, location: str, index: StoryIndex) -> list[ValidationError]:
    """Check a single StoryRef against the index."""
    if not index.has(ref.story_id):
        return [ValidationError(
            instance_id=ref.instance_id,
            story_id=ref.story_id,
            location=location,
            message="story not found in Storybook index",
        )]
    return []


@lru_cache(maxsize=1)
def _load_valid_icons() -> set[str] | None:
    """Load the set of exported icon names from @fluentui/react-icons.

    Returns None if the package is not installed or node is unavailable.
    """
    try:
        result = subprocess.run(
            [
                "node", "-e",
                "console.log(JSON.stringify("
                "Object.keys(require('@fluentui/react-icons'))"
                ".filter(k => /^[A-Z].*\\d+/.test(k))"
                "))",
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode == 0:
            return set(json.loads(result.stdout.strip()))
    except (FileNotFoundError, subprocess.TimeoutExpired, json.JSONDecodeError):
        pass
    return None


def _collect_icon_names(page: PageSchema) -> list[tuple[str, str, str]]:
    """Collect (icon_component_name, location, instance_id) from the page.

    Icon names in argOverrides are stored as base names (e.g. "ArrowSync")
    and codegen maps them to "{base}20Regular".
    """
    results: list[tuple[str, str, str]] = []
    if page.command_bar:
        for i, item in enumerate(page.command_bar.items):
            if item.story:
                icon = item.story.arg_overrides.get("icon", "")
                if icon:
                    results.append((
                        f"{icon}20Regular",
                        f"commandBar.items[{i}]",
                        item.story.instance_id,
                    ))
    return results


def validate_icons(page: PageSchema) -> list[ValidationError]:
    """Validate that icon names in argOverrides exist in @fluentui/react-icons."""
    valid_icons = _load_valid_icons()
    if valid_icons is None:
        return []  # Can't validate without the package

    errors: list[ValidationError] = []
    for icon_name, location, instance_id in _collect_icon_names(page):
        if icon_name not in valid_icons:
            errors.append(ValidationError(
                instance_id=instance_id,
                story_id="",
                location=location,
                message=f"icon '{icon_name}' not found in @fluentui/react-icons",
            ))
    return errors


def validate_page(page: PageSchema, index: StoryIndex) -> list[ValidationError]:
    """
    Validate every StoryRef in a PageSchema against a StoryIndex.

    Returns a list of ValidationErrors (empty = all valid).
    """
    errors: list[ValidationError] = []

    # -- Command bar --
    if page.command_bar:
        for i, item in enumerate(page.command_bar.items):
            if item.story:
                errors.extend(_check_ref(item.story, f"commandBar.items[{i}]", index))

    # -- Template --
    tpl = page.template

    if isinstance(tpl, ListTableTemplate):
        for i, ref in enumerate(tpl.row_actions):
            errors.extend(_check_ref(ref, f"template.rowActions[{i}]", index))

    elif isinstance(tpl, CardsGridTemplate):
        for ci, card in enumerate(tpl.cards):
            for si, ref in enumerate(card.stories):
                errors.extend(_check_ref(ref, f"template.cards[{ci}].stories[{si}]", index))

    elif isinstance(tpl, DetailTemplate):
        for si, section in enumerate(tpl.sections):
            for ri, ref in enumerate(section.stories):
                errors.extend(_check_ref(ref, f"template.sections[{si}].stories[{ri}]", index))

    elif isinstance(tpl, CustomTemplate):
        for i, ref in enumerate(tpl.stories):
            errors.extend(_check_ref(ref, f"template.stories[{i}]", index))

    # -- Icon validation --
    errors.extend(validate_icons(page))

    return errors
