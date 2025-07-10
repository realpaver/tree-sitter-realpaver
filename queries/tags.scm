(constant_definition
    name: (identifier) @name) @definition.constant

(variable_definition
    name: (identifier) @name) @definition.variable

(function_definition
    fun_name: (identifier) @name) @definition.function

(alias_definition
    name: (identifier) @name) @definition.variable
