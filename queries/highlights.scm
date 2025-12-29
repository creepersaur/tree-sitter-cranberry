; Keywords
[
	"let"
	"const"
	"fn"
	"loop"
	"while"
	"for"
	"using"
	"class"
	"namespace"
	"if"
	"else"
	"switch"
	"return"
	"break"
	"out"
	"continue"
	"=>"
	"constructor",
	"in"
] @keyword

;; Operators / common punctuation as operators
[
	".."
	"^"
	"&&"
	"||"
	"=="
	"!="
	"<="
	">="
	"<"
	">"
	"+"
	"-"
	"*"
	"/"
	"%"
	"="
	"!"
] @operator

;; Declarations & names (more-specific captures first)
(function_declaration
  (snake_case_identifier) @function)

(class_definition
  (camel_case_identifier) @type)

;; Parameter names
(parameter_list
  (identifier) @variable)

  ;; Let / const bindings and let-expression bindings
(let_statement
  (identifier) @variable)
(const_statement
  (identifier) @variable)
(let_expression
  (identifier) @variable)

;; Member access / property names (obj.prop)
(member_expression
  (identifier) @property)

;; Dictionary shorthand entries (key = expr)
(dictionary_shorthand_entry
  (identifier) @property)

;; Namespace paths / imports (treat as types)
(namespace_path
  (camel_case_identifier) @type)
(namespace_group_import
  (camel_case_identifier) @type)

;; Call expressions (function)
(call_expression
  _expression: (identifier) @function)

;; Call expressions (class object)
(call_expression
  _expression: (camel_case_identifier) @type)

;; Generic identifiers (fallback)
(snake_case_identifier) @variable
(camel_case_identifier) @type
(identifier) @variable

(decorator_statement
  "@" @punctuation
  (identifier) @decorator
  "(" @punctuation
  ")" @punctuation)
