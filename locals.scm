; Scopes
;-------

(source_file) @local.scope
(function_definition) @local.scope

; Definitions
;------------
(constant_definition
  name: (identifier) @local.definition)
(variable_definition
  name: (identifier) @local.definition)
(alias_definition
  name: (identifier) @local.definition)
(parameter_list
  (identifier) @local.definition)

; References
;------------
(identifier) @local.reference
