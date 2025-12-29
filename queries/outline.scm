;; queries/outline.scm

;; Functions
(function_declaration
  (snake_case_identifier) @name) @item

(lambda_declaration
  (snake_case_identifier) @name) @item

;; Classes
(class_definition
  (camel_case_identifier) @name) @item

;; Namespaces
(block_scoped_namespace_definition
  (camel_case_identifier) @name) @item

(file_scoped_namespace_definition
  (camel_case_identifier) @name) @item
