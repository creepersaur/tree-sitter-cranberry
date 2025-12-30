export default grammar({
	name: "cranberry",

	conflicts: $ => [
		[$.decorator_statement]
	],

	rules: {
		source_file: $ => repeat($._statement),

		_statement: $ => choice(
			$.comment,
			$._single_line_statement,
			$._expression,
			/\n/,
			';'
		),

		_single_line_statement: $ => choice(
			$.decorator_statement,
			$.using_statement,
			$.file_scoped_namespace_definition,
			$.block_scoped_namespace_definition,
			$.explicit_scope,
			$.class_definition,
			$.function_declaration,
			$.return_statement,
			$.break_statement,
			$.out_statement,
			$.continue_statement,
			$.const_statement,
			$.let_statement,
		),

		_expression: $ => choice(
			$.loop_statement,
			$.while_statement,
			$.for_statement,
			$.if_statement,
			$.let_expression,
			$.switch_statement,
			$.lambda_declaration,
			$.assignment_expression,
			$.dictionary_expression,
			$.list_expression,
			$.tuple_expression,
			$.range_expression,
			$.member_expression,
			$.call_expression,
			$.index_expression,
			$.parenthesized_expression,
			$.binary_expression,
			$.formatted_string,
			$.string,
			$.number,
			$.boolean,
			$.self,
			$.nil,
			$.print,
			$.builtin_type,
			$.identifier,
		),

		parenthesized_expression: $ => prec(1, seq(
			'(',
			$._expression,
			')'
		)),

		binary_expression: $ => prec(0, choice(
			prec(6, seq(choice('!', '-', '+'), $._expression)),
			prec.right(3, seq($._expression, '^', $._expression)),
			prec.left(2, seq($._expression, choice('*', '/', '%'), $._expression)),
			prec.left(1, seq($._expression, choice('+', '-'), $._expression)),
			prec.left(1, seq($._expression, choice('==', '!=', '<', '>', '<=', '>='), $._expression)),
			prec.left(0, seq($._expression, '&&', $._expression)),
			prec.left(-1, seq($._expression, '||', $._expression)),
		)),

		let_statement: $ => prec.right(1, seq(
			word('let'),
			$.identifier,
			'=',
			$._expression
		)),

		const_statement: $ => prec.right(1, seq(
			word('const'),
			$.identifier,
			'=',
			$._expression
		)),

		let_expression: $ => prec.right(0, seq(
			word('let'),
			$.identifier,
			'=',
			$._expression
		)),

		call_expression: $ => prec(10, seq(
			field('name', choice(
				$.print,
				$.builtin_type,
				$.identifier,
			)),
			'(',
			optional(seq($._expression, repeat(seq(',', $._expression)))),
			')'
		)),

		member_expression: $ => prec(5, seq(
			$._expression,
			$.DOT,
			field('member', choice($.identifier, $.call_expression))
		)),

		assignment_expression: $ => prec.right(seq(
			$._expression,
			'=',
			$._expression
		)),

		index_expression: $ => prec(10, seq(
			$._expression,
			'[',
			$._expression,
			']'
		)),

		comment: $ => /#.*/,

		identifier: $ => choice(
			$.snake_case_identifier,
			$.all_caps_identifier,
			$.camel_case_identifier,
		),
		snake_case_identifier: $ => /[a-z_][a-z0-9_]*/,
		all_caps_identifier: $ => /[A-Z_][A-Z0-9_]+/,
		camel_case_identifier: $ => /[A-Z_][a-zA-Z0-9_]+/,

		// SCOPED-STATEMENTS

		explicit_scope: $ => seq(
			word('@'),
			$.block
		),

		// BLOCKS

		any_block: $ => choice($.block, $.inline_block),

		block: $ => seq(
			'{',
			repeat($._statement),
			'}'
		),

		inline_block: $ => seq(
			$.ARROW,
			prec.right(choice(
				$._single_line_statement,
				$._expression
			))
		),

		ARROW: _ => token('=>'),

		// LISTS

		list_expression: $ => seq(
			'[',
			optional(
				seq(
					$._expression,
					repeat(seq(',', $._expression)),
					optional(',') // trailing comma
				)
			),
			']'
		),

		tuple_expression: $ => seq(
			'(',
			$._expression,
			',',
			repeat(seq($._expression, ',')),
			optional($._expression),
			')'
		),

		// DICTIONARY

		dictionary_expression: $ => prec(1, seq(
			'{',
			optional(
				seq(
					choice(
						$.dictionary_shorthand_entry,
						$.dictionary_entry
					),
					repeat(
						seq(
							',',
							choice(
								$.dictionary_shorthand_entry,
								$.dictionary_entry
							)
						)),
					optional(',') // trailing comma
				)
			),
			'}'
		)),

		dictionary_shorthand_entry: $ => prec(2, seq($.identifier, '=', $._expression)),
		dictionary_entry: $ => seq($._expression, ':', $._expression),

		// FUNCTIONS

		function_declaration: $ => prec(2, seq(
			word('fn'),
			$.snake_case_identifier,
			'(',
			optional($.parameter_list),
			')',
			$.any_block
		)),

		parameter_list: $ => seq(
			$.identifier,
			repeat(seq(',', $.identifier)),
			optional(',')  // trailing comma
		),

		lambda_declaration: $ => seq(
			word('fn'),
			'(',
			optional($.parameter_list),
			')',
			$.any_block
		),

		// RETURN / OUT / BREAK

		return_statement: $ => prec.right(seq(
			word('return'),
			optional($._expression)
		)),

		out_statement: $ => prec.right(seq(
			word('out'),
			optional($._expression)
		)),

		break_statement: $ => prec.right(seq(
			word('break'),
			optional($._expression)
		)),

		continue_statement: $ => prec(2, word('continue')),

		// IF STATEMENT

		if_statement: $ => prec.right(seq(
			word('if'),
			$._expression,
			$.any_block,
			optional(
				repeat($.elseif_statement)
			),
			optional(seq(
				word('else'),
				$.any_block
			))
		)),

		elseif_statement: $ => seq(
			seq(word('else'), word('if')),
			$._expression,
			$.any_block,
		),

		// SWITCH STATEMENT

		switch_statement: $ => seq(
			word('switch'),
			$._expression,
			'{',

			repeat(seq(
				$._expression,
				repeat(seq(',', $._expression)),
				'=>',
				choice($._statement, $.block),
			)),

			'}'
		),

		// LOOPS

		loop_statement: $ => seq(
			word('loop'),
			$.any_block
		),

		while_statement: $ => seq(
			word('while'),
			$._expression,
			$.any_block
		),

		for_statement: $ => seq(
			word('for'),
			$.identifier,
			word('in'),
			$._expression,
			$.any_block
		),

		// RANGES

		range_expression: $ => prec.left(2, seq(
			$._expression,
			$.DOT_DOT,
			$._expression
		)),

		DOT_DOT: _ => '..',
		DOT: _ => '.',

		// CLASSES

		class_definition: $ => seq(
			word('class'),
			$.camel_case_identifier,
			'{',

			choice(
				seq(
					repeat(choice(
						$.function_declaration,
						$.let_expression,
					)),

					seq(
						$.constructor,
						'(',
						optional($.parameter_list),
						')',
						$.any_block
					),

					repeat(choice(
						$.function_declaration,
						$.let_expression,
					)),
				),
				repeat(choice(
					$.function_declaration,
					$.let_expression,
				)),
			),

			'}'
		),

		constructor: $ => prec(2, word('constructor')),

		// DECORATORS

		decorator_statement: $ => choice(
			seq(word('@'), $.identifier),               // no parentheses
			seq(word('@'), $.identifier, '(', ')'),     // empty parentheses
			seq(word('@'), $.identifier, '(', $.commaSep1, ')')  // with arguments
		),

		commaSep1: $ => seq($._expression, repeat(seq(',', $._expression))),

		// NAMESPACES

		using_statement: $ => seq(
			word('using'),
			field('path', $.namespace_import)
		),

		namespace_import: $ => choice(
			$.namespace_path,
			$.namespace_group_import
		),

		namespace_path: $ => seq(
			$.camel_case_identifier,
			repeat(seq('::', $.camel_case_identifier))
		),

		namespace_group_import: $ => seq(
			$.camel_case_identifier,
			repeat(seq('::', $.camel_case_identifier)),
			'::',
			'{',
			$.camel_case_identifier,
			repeat(seq(',', $.camel_case_identifier)),
			'}'
		),

		block_scoped_namespace_definition: $ => prec(2, seq(
			word('namespace'),
			$.camel_case_identifier,
			$.any_block
		)),

		file_scoped_namespace_definition: $ => seq(
			word('namespace'),
			$.camel_case_identifier
		),

		// LITERALS

		formatted_string: $ => seq(
			word('$'),
			choice(
				seq(
					word('"'),
					repeat(choice(
						$.escape_sequence,
						$.interpolated_string_content_double,
						$.interpolation
					)),
					word('"')
				),
				seq(
					word("'"),
					repeat(choice(
						$.escape_sequence,
						$.interpolated_string_content_single,
						$.interpolation
					)),
					word("'")
				),
				seq(
					word('`'),
					repeat(choice(
						$.escape_sequence,
						$.interpolated_string_content_backtick,
						$.interpolation
					)),
					word('`')
				)
			)
		),

		interpolation: $ => seq(
			'{',
			$._expression,
			'}'
		),

		string: $ => choice(
			seq(
				'"',
				repeat(choice($.escape_sequence, $.string_content_double)),
				'"'
			),
			seq(
				"'",
				repeat(choice($.escape_sequence, $.string_content_single)),
				"'"
			),
			seq(
				'`',
				repeat(choice($.escape_sequence, $.string_content_backtick)),
				'`'
			)
		),

		string_content_double: _ => token.immediate(/[^"\\\n]+/),
		string_content_single: _ => token.immediate(/[^'\\\n]+/),
		string_content_backtick: _ => token.immediate(/[^`\\n]+/),

		interpolated_string_content_double: _ => token.immediate(/[^"\\{\n]+/),
		interpolated_string_content_single: _ => token.immediate(/[^'\\{\n]+/),
		interpolated_string_content_backtick: _ => token.immediate(/[^`\\{\n]+/),

		interpolated_string_content: _ =>
			token.immediate(/[^"\\`'\{\n]+/),

		escape_sequence: _ =>
			token.immediate(/\\./),

		number: $ => /\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?/,
		boolean: $ => choice('true', 'false'),
		self: $ => word('self'),
		print: $ => choice(word('print'), word('println')),
		builtin_type: $ => prec(2, choice(
			word('number'),
			word('string'),
			word('bool'),
			word('list'),
			word('dict'),
			word('char')
		)),
		nil: $ => word('nil'),
	},
});

// helper: create a token alias for a keyword
function word(keyword) {
	// case-sensitive exact-token alias
	return alias(token(keyword), keyword);
}
