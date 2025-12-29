;; queries/textobjects.scm
;; Cranberry text objects for Zed / Vim mode

;; Functions
(function_declaration
  body: (_) @function.inside) @function.around

(lambda_declaration
  body: (_) @function.inside) @function.around

;; Classes
(class_definition
  body: (_) @class.inside) @class.around

;; Comments
(comment)+ @comment.around

;; Decorators (if you want to treat them as a block)
(decorator_statement)+ @decorator.around
