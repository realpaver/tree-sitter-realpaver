from unittest import TestCase

import tree_sitter
import tree_sitter_realpaver


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_realpaver.language())
        except Exception:
            self.fail("Error loading RealPaver parser based on tree-sitter grammar")
