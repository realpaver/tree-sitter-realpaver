/**
 * @file RealPaver parser based on tree-sitter
 * @author Raphaël Chenouard <raphael.chenouard@ls2n.fr>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "realpaver",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
