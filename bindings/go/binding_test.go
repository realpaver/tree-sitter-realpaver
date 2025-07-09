package tree_sitter_realpaver_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_realpaver "github.com/realpaver/tree-sitter-realpaver/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_realpaver.Language())
	if language == nil {
		t.Errorf("Error loading RealPaver parser based on tree-sitter grammar")
	}
}
