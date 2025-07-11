/**
 * @file RealPaver parser based on tree-sitter
 * @author Raphaël Chenouard <raphael.chenouard@ls2n.fr>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "realpaver",

  extras: ($) => [$.comment, /\s/],

  word: ($) => $.identifier,

  precedences: (_) => [
    [
      "unary",
      "exponent",
      "multiplication",
      "addition",
      "set",
      "comparison",
      "imply",
    ],
  ],

  rules: {
    source_file: ($) => repeat($._definition),

    _definition: ($) =>
      choice(
        $._constants_definition,
        $._variables_definition,
        $._aliases_definition,
        $._constraints_definition,
        $._functions_definition,
        // $._objectives_definition,
        $.objective_definition,
      ),

    _constants_definition: ($) =>
      seq("Constants", commaSep1($.constant_definition), ";"),

    constant_definition: ($) =>
      seq(field("name", $.identifier), "=", field("value", $.expression)),

    _variables_definition: ($) =>
      seq("Variables", commaSep1($.variable_definition), ";"),

    variable_definition: ($) =>
      field(
        "variable",
        seq(
          field("name", $.identifier),
          $._type_dom,
          // optional($.type),
          // optional(seq("in", field("domain", $.domain))),
          optional($._prec),
        ),
      ),

    _type_dom: ($) =>
      choice(
        seq($.type, "in", field("domain", $.domain)),
        seq("in", field("domain", $.domain)),
        seq($.type),
      ),

    domain: ($) => field("domain", choice($._set, $._interval)),

    _set: ($) => $.set_value,

    _interval: ($) => $.interval_value,

    _prec: ($) =>
      seq(
        "tol",
        "(",
        field("rtol", $.expression),
        ",",
        field("atol", $.expression),
        ")",
      ),

    type: ($) => field("type", choice("binary", "integer", "real")),

    _aliases_definition: ($) =>
      seq("Aliases", commaSep1($.alias_definition), ";"),

    alias_definition: ($) =>
      field(
        "alias",
        seq(
          field("name", $.identifier),
          "=",
          field("expression", $._expression),
        ),
      ),

    // _objectives_definition: ($) =>
    //   seq("Objectives", commaSep1($.objective_definition), ";"),
    // objective_definition: ($) =>
    //   seq(
    //     field("opt_dir", choice("MIN", "MAX", "min", "max")),
    //     field("expression", $._expression),
    //   ),
    objective_definition: ($) =>
      seq(
        field("opt_dir", choice("MIN", "MAX", "min", "max", "Min", "Max")),
        optional(seq(field("name", $.identifier), "=")),
        field("expression", $._expression),
        ";",
      ),

    _functions_definition: ($) =>
      seq("Functions", commaSep1($.function_definition), ";"),

    function_definition: ($) =>
      seq(
        field("fun_name", $.identifier),
        "(",
        optional($.parameter_list),
        ")",
        "=",
        field("expression", $.expression),
      ),

    parameter_list: ($) => field("parameters", commaSep1($.identifier)),

    _constraints_definition: ($) =>
      seq("Constraints", commaSep1($._constraint_definition), ";"),

    _constraint_definition: ($) =>
      choice(
        $.arith_constraint,
        $.table_constraint,
        $.conditional_constraint,
        $.piecewise_constraint,
      ),

    arith_constraint: ($) => field("expression", $._comparison_expression),

    table_constraint: (
      $, // field("table", $._table_expression),
    ) =>
      seq(
        "table",
        "(",
        "{",
        field("headers", commaSep1($.ref)),
        "}",
        ",",
        "{",
        field("values", commaSep1($._expression)),
        "}",
        ")",
      ),

    conditional_constraint: ($) =>
      //field("conditional_expression", $._imply_expression),
      seq(
        field("guard", $._expression),
        "->",
        field("body", $._constraint_definition),
      ),

    piecewise_constraint: ($) =>
      seq(
        "piecewise",
        "(",
        field("var", $.ref),
        ",",
        "{",
        field("pieces", commaSep1($._piece_def)),
        "}",
        ")",
      ),

    _piece_def: ($) =>
      seq(
        field("interval", $.interval_value),
        ":",
        field("constraint", $._constraint_definition),
      ),

    identifier: ($) => /[a-zA-Z][a-zA-Z0-9_]*/,

    expression: ($) => $._expression,

    _expression: ($) =>
      choice(
        $._arith_expression,
        $._set_expression,
        $._comparison_expression,
        $._imply_expression,
        $.paren_expression,
      ),

    _comparison_expression: ($) =>
      prec.left(
        "comparison",
        seq(
          field("left", $._expression),
          field("cmp", choice("==", "<=", ">=")),
          field("right", $._expression),
        ),
      ),

    _set_expression: ($) => $._in_expression,

    _in_expression: ($) =>
      prec.left(
        "set",
        seq(
          field("left_operand", $._expression),
          field("operator", "in"),
          field("right_operand", $._expression),
        ),
      ),

    _imply_expression: ($) =>
      prec.left(
        "imply",
        seq(
          field(
            "condition",
            $._expression,
            // choice($._comparison_expression, $._in_expression),
          ),
          "->",
          // field("constraint", $.constraint_definition),
          field("constraint", $._expression),
        ),
      ),

    _arith_expression: ($) =>
      choice(
        $.unary_arith_expression,
        // $._binary_arith_expression,
        $._terminal_expression,
        $.add_expression,
        $.sub_expression,
        $.mul_expression,
        $.div_expression,
        $.exponent_expression,
      ),

    paren_expression: ($) => seq("(", $._expression, ")"),

    unary_arith_expression: ($) =>
      prec(
        "unary",
        seq(
          field("operator", choice("+", "-")),
          field("operand", $._expression),
        ),
      ),

    add_expression: ($) =>
      prec.left(
        "addition",
        seq(
          field("left", $._expression),
          field("operator", "+"),
          field("right", $._expression),
        ),
      ),
    sub_expression: ($) =>
      prec.left(
        "addition",
        seq(
          field("left", $._expression),
          field("operator", "-"),
          field("right", $._expression),
        ),
      ),
    mul_expression: ($) =>
      prec.left(
        "multiplication",
        seq(
          field("left", $._expression),
          field("operator", "*"),
          field("right", $._expression),
        ),
      ),
    div_expression: ($) =>
      prec.left(
        "multiplication",
        seq(
          field("left", $._expression),
          field("operator", "/"),
          field("right", $._expression),
        ),
      ),
    exponent_expression: ($) =>
      prec.left(
        "exponent",
        seq(
          field("left", $._expression),
          field("operator", "^"),
          field("right", $._expression),
        ),
      ),

    _terminal_expression: ($) =>
      choice(
        $._number,
        $.ref,
        $.call_expression,
        $.set_value,
        $.interval_value,
        $.constant,
      ),

    constant: ($) =>
      field("name", choice("PI", "pi", "Pi", "inf", "Inf", "INF")),

    ref: ($) => field("reference", $.identifier),

    call_expression: ($) =>
      seq(
        field(
          "fun_name",
          choice(
            "abs",
            "min",
            "max",
            "cos",
            "sin",
            "tan",
            "exp",
            "log",
            "sqr",
            "pow",
            "sqrt",
            "acos",
            "asin",
            "atan",
            "cosh",
            "sinh",
            "tanh",
            "acosh",
            "asinh",
            "atanh",
            "sgn",
            $.ref,
          ),
        ),
        field("arguments", $._arguments_list),
      ),

    _arguments_list: ($) => seq("(", optional(commaSep1($._expression)), ")"),

    set_value: ($) => seq("{", field("values", commaSep1($._expression)), "}"),

    interval_value: ($) =>
      seq(
        "[",
        field("lower_bound", $._expression),
        ",",
        field("upper_bound", $._expression),
        "]",
      ),

    _number: ($) => choice($.integer, $.float),

    // copy from tree-sitter-python
    integer: ($) =>
      token(
        choice(
          seq(choice("0x", "0X"), repeat1(/_?[A-Fa-f0-9]+/), optional(/[Ll]/)),
          seq(choice("0o", "0O"), repeat1(/_?[0-7]+/), optional(/[Ll]/)),
          seq(choice("0b", "0B"), repeat1(/_?[0-1]+/), optional(/[Ll]/)),
          seq(
            repeat1(/[0-9]+_?/),
            choice(
              optional(/[Ll]/), // long numbers
              optional(/[jJ]/), // complex numbers
            ),
          ),
        ),
      ),

    // copy from tree-sitter-python
    float: ($) => {
      const digits = repeat1(/[0-9]+_?/);
      const exponent = seq(/[eE][\+-]?/, digits);

      return token(
        seq(
          choice(
            seq(digits, ".", optional(digits), optional(exponent)),
            seq(optional(digits), ".", digits, optional(exponent)),
            seq(digits, exponent),
          ),
          optional(/[jJ]/),
        ),
      );
    },
    comment: ($) => token(seq("#", /[^\n]+/)),
  },
});

/**
 * Creates a rule to match one or more of the rules separated by a comma
 *
 * @param {RuleOrLiteral} rule
 *
 * @return {SeqRule}
 *
 */
function commaSep1(rule) {
  return sep1(rule, ",");
}

/**
 * Creates a rule to match one or more occurrences of `rule` separated by `sep`
 *
 * @param {RuleOrLiteral} rule
 *
 * @param {RuleOrLiteral} separator
 *
 * @return {SeqRule}
 *
 */
function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
