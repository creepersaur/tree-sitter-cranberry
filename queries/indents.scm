;; queries/indents.scm
;; Cranberry auto-indent rules

;; Indent inside blocks
(block) @indent
(inline_block) @indent

;; Indent after control-flow keywords
(if_statement
  any_block: (_) @indent)

(elseif_statement
  any_block: (_) @indent)

(else
  any_block: (_) @indent)

(loop_statement
  any_block: (_) @indent)

(while_statement
  any_block: (_) @indent)

(for_statement
  any_block: (_) @indent)

(switch_statement
  "{" @indent
  "}" @end)

(function_declaration
  any_block: (_) @indent)

(lambda_declaration
  any_block: (_) @indent)

(class_definition
  "{" @indent
  "}" @end)

(block_scoped_namespace_definition
  any_block: (_) @indent)
