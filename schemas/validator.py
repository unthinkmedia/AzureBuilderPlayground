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

from dataclasses import dataclass

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

    return errors
