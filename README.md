# Turbo Pascal Variable Declaration Analyzer

## Overview
This project is a syntax and semantic analyzer for the variable declaration syntax in Turbo Pascal. It is implemented in JavaScript and provides functionality to validate and analyze variable declarations while checking for syntax and semantic errors.

The analyzer was created as part of a university course on **Automata Theory and Formal Languages**.

## Features
- **Syntax Validation:** Checks for correct structure of variable declarations.
- **Semantic Analysis:** 
  - Ensures variable names are unique and not reserved keywords.
  - Validates identifier length and type definitions.
  - Ensures proper range values for array declarations.
- **Error Reporting:** Identifies and points out errors in the code (error messages are in Russian).
- **Variable Table:** Outputs a table with variable names and their corresponding types.

## Language Syntax Supported
The analyzer supports the following Turbo Pascal syntax:

```ebnf
VAR <list_of_descriptions> ;
<list_of_descriptions> ::= <description> | <list_of_descriptions>,<description>
<description> ::= <list_of_variables>:<type>
<list_of_variables> ::= <identifier> | <identifier>,<list_of_variables>
<type> ::= ARRAY [<range>[,<range>]] OF <simple_type>
<simple_type> ::= BYTE | WORD | INTEGER | REAL | CHAR | DOUBLE
<range> ::= <constant1>:<constant2>
<constant1>, <constant2> ::= Integer constants in the range [-32768, 32767]
<identifier> ::= Starts with a letter, followed by letters or digits; no spaces or special characters.
```

## Key Semantic Rules
The following key semantic rules are applied:
- Identifier length must not exceed 8 characters.
- Identifiers cannot be reserved keywords (VAR, BYTE, WORD, etc.).
- Constants must be within the range [-32768, 32767].
- The first constant in a range must be less than the second constant.
- Duplicate variable declarations are not allowed.

## Examples of Valid Declarations
- `VAR Aa,B:REAL;`
- `VAR Abc:INTEGER;`
- `VAR A,K:BYTE, C:WORD, D17,E7:CHAR;`
- `VAR X,Y:ARRAY[1:10,20:30] OF INTEGER;`

## Project Structure
- **Code Implementation:** Written in JavaScript.
- **Error Reporting:** Errors are identified and displayed in Russian, pointing to the specific position in the input string.
- **Main Logic:** The main logic is implemented in `AnalyzerCode`.

## What I Learned
Through this project, I gained practical experience in:
- Designing lexical, syntax, and semantic analyzers for context-free grammars.
- Applying finite state machines to analyze language syntax.
- Implementing error-handling mechanisms in parsers.
- Understanding Turbo Pascal language rules and constraints.
- Using JavaScript to solve complex parsing and validation tasks.

## How to Run
Clone the repository:
```bash
git clone https://github.com/Ariel-cano/js-analyzer.git
```
Open the project folder and run the analyzer script in a JavaScript runtime environment.

## Limitations
- Error messages are in Russian, which may not be suitable for all users.
- Not optimized for large-scale code parsing.

## Future Improvements
- Add support for multilingual error messages.
- Enhance the user interface for better usability.
- Expand the syntax coverage for other parts of the Turbo Pascal language.

## Developed as part of a university project.


