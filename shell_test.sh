#!/usr/bin/env bash

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
EXECUTABLE="$SCRIPT_DIR/bin/computorV2"

if [ ! -x "$EXECUTABLE" ]; then
    echo "Missing executable: $EXECUTABLE" >&2
    echo "Build it first with 'make'." >&2
    exit 1
fi

TEST_TMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/computorV2-tests.XXXXXX") || exit 1
trap 'rm -rf "$TEST_TMP_DIR"' EXIT HUP INT TERM

tests_run=0
tests_failed=0

assert_output() {
    local name=$1
    local expected=$2
    local status
    shift 2

    if "$EXECUTABLE" "$@" >"$TEST_TMP_DIR/stdout" 2>"$TEST_TMP_DIR/stderr"; then
        status=0
    else
        status=$?
    fi

    tests_run=$((tests_run + 1))
    if [ "$status" -eq 0 ] &&
        [ "$(cat "$TEST_TMP_DIR/stdout")" = "$expected" ] &&
        [ ! -s "$TEST_TMP_DIR/stderr" ]; then
        printf 'PASS: %s\n' "$name"
    else
        tests_failed=$((tests_failed + 1))
        printf 'FAIL: %s (exit status %s)\n' "$name" "$status"
        printf 'Expected stdout:\n%s\n' "$expected"
        printf 'Actual stdout:\n%s\n' "$(cat "$TEST_TMP_DIR/stdout")"
        if [ -s "$TEST_TMP_DIR/stderr" ]; then
            printf 'Unexpected stderr:\n%s\n' "$(cat "$TEST_TMP_DIR/stderr")"
        fi
    fi
}

assert_error() {
    local name=$1
    local expected=$2
    local status
    shift 2

    if "$EXECUTABLE" "$@" >"$TEST_TMP_DIR/stdout" 2>"$TEST_TMP_DIR/stderr"; then
        status=0
    else
        status=$?
    fi

    tests_run=$((tests_run + 1))
    if [ "$status" -eq 1 ] &&
        [ ! -s "$TEST_TMP_DIR/stdout" ] &&
        [ "$(cat "$TEST_TMP_DIR/stderr")" = "$expected" ]; then
        printf 'PASS: %s\n' "$name"
    else
        tests_failed=$((tests_failed + 1))
        printf 'FAIL: %s (exit status %s)\n' "$name" "$status"
        printf 'Expected error:\n%s\n' "$expected"
        printf 'Actual stdout:\n%s\n' "$(cat "$TEST_TMP_DIR/stdout")"
        printf 'Actual stderr:\n%s\n' "$(cat "$TEST_TMP_DIR/stderr")"
    fi
}

printf '%s\n' '========================================' \
    'Testing ComputorV2' \
    '========================================'

assert_output "positive discriminant with decimal coefficients" \
    "$(printf '%s\n' \
        'Reduced form: 4 * X^0 + 4 * X^1 - 9.3 * X^2 = 0' \
        'Polynomial degree: 2' \
        'Discriminant is strictly positive, the two solutions are:' \
        '0.905239' \
        '-0.475131')" \
    '5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0'

assert_output "linear equation" \
    "$(printf '%s\n' \
        'Reduced form: 1 * X^0 + 4 * X^1 = 0' \
        'Polynomial degree: 1' \
        'The solution is:' \
        '-0.25')" \
    '5 * X^0 + 4 * X^1 = 4 * X^0'

assert_output "degree greater than two" \
    "$(printf '%s\n' \
        'Reduced form: 5 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 0' \
        'Polynomial degree: 3' \
        "The polynomial degree is strictly greater than 2, I can't solve.")" \
    '8 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 3 * X^0'

assert_output "identity has infinitely many solutions" \
    "$(printf '%s\n' \
        'Reduced form: 0 * X^0 = 0' \
        'Any real number is a solution.')" \
    '6 * X^0 = 6 * X^0'

assert_output "contradiction has no solution" \
    "$(printf '%s\n' \
        'Reduced form: -5 * X^0 = 0' \
        'No solution.')" \
    '10 * X^0 = 15 * X^0'

assert_output "quadratic with complex solutions" \
    "$(printf '%s\n' \
        'Reduced form: 1 * X^0 + 2 * X^1 + 5 * X^2 = 0' \
        'Polynomial degree: 2' \
        'Discriminant is strictly negative, the two complex solutions are:' \
        '-1/5 + 2i/5' \
        '-1/5 - 2i/5')" \
    '1 * X^0 + 2 * X^1 + 5 * X^2 = 0'

assert_output "positive discriminant with integer roots" \
    "$(printf '%s\n' \
        'Reduced form: -4 * X^0 + 1 * X^2 = 0' \
        'Polynomial degree: 2' \
        'Discriminant is strictly positive, the two solutions are:' \
        '-2.000000' \
        '2.000000')" \
    'X^2 - 4 = 0'

assert_output "zero discriminant" \
    "$(printf '%s\n' \
        'Reduced form: 1 * X^0 + 2 * X^1 + 1 * X^2 = 0' \
        'Polynomial degree: 2' \
        'Discriminant is zero, the solution is:' \
        '-1')" \
    'X^2 + 2*X + 1 = 0'

assert_output "quadratic with negative leading coefficient" \
    "$(printf '%s\n' \
        'Reduced form: 1 * X^0 - 1 * X^2 = 0' \
        'Polynomial degree: 2' \
        'Discriminant is strictly positive, the two solutions are:' \
        '1.000000' \
        '-1.000000')" \
    '-X^2 + 1 = 0'

assert_output "implicit variable coefficient" \
    "$(printf '%s\n' \
        'Reduced form: 1 * X^1 = 0' \
        'Polynomial degree: 1' \
        'The solution is:' \
        '-0')" \
    'X = 0'

assert_output "implicit negative variable coefficient" \
    "$(printf '%s\n' \
        'Reduced form: 1 * X^0 - 1 * X^1 = 0' \
        'Polynomial degree: 1' \
        'The solution is:' \
        '1')" \
    '-X + 1 = 0'

assert_output "repeated terms are combined" \
    "$(printf '%s\n' \
        'Reduced form: 5 * X^1 = 0' \
        'Polynomial degree: 1' \
        'The solution is:' \
        '-0')" \
    '2*X + 3*X = 0'

assert_output "terms on both sides are reduced" \
    "$(printf '%s\n' \
        'Reduced form: 2 * X^0 + 3 * X^1 = 0' \
        'Polynomial degree: 1' \
        'The solution is:' \
        '-0.6666666666666666')" \
    '5 * X + 4 = 2 * X + 2'

assert_output "decimal linear coefficients" \
    "$(printf '%s\n' \
        'Reduced form: 3 * X^0 + 1.5 * X^1 = 0' \
        'Polynomial degree: 1' \
        'The solution is:' \
        '-2')" \
    '1.5*X + 3 = 0'

assert_output "whitespace is ignored" \
    "$(printf '%s\n' \
        'Reduced form: 1 * X^0 + 4 * X^1 = 0' \
        'Polynomial degree: 1' \
        'The solution is:' \
        '-0.25')" \
    ' 5 * X^0 + 4 * X^1 = 4 * X^0 '

assert_output "arguments are joined into one equation" \
    "$(printf '%s\n' \
        'Reduced form: 1 * X^0 + 4 * X^1 = 0' \
        'Polynomial degree: 1' \
        'The solution is:' \
        '-0.25')" \
    '5' '*' 'X^0' '+' '4' '*' 'X^1' '=' '4' '*' 'X^0'

assert_error "missing equation argument" \
    'Format: equation must contain one = and a non-empty expression on each side'

assert_error "missing equals sign" \
    'Format: equation must contain one = and a non-empty expression on each side' \
    'X + 1'

assert_error "empty left side" \
    'Format: equation must contain one = and a non-empty expression on each side' \
    '= X'

assert_error "empty right side" \
    'Format: equation must contain one = and a non-empty expression on each side' \
    'X ='

assert_error "multiple equals signs" \
    'Format: equation must contain one = and a non-empty expression on each side' \
    'X = 0 = 1'

assert_error "unsupported variable" \
    'Invalid or empty expression' \
    'Y = 0'

assert_error "invalid character" \
    'Invalid or empty expression' \
    'X & 1 = 0'

assert_error "malformed term" \
    'Malformed term: 2**X' \
    '2**X = 0'

assert_error "malformed exponent" \
    'Malformed term: X^1.5' \
    'X^1.5 = 0'

assert_error "negative exponent" \
    'Malformed term: X^' \
    'X^-1 = 0'

assert_error "missing exponent" \
    'Malformed term: X^' \
    'X^ = 0'

assert_error "unsafe integer exponent" \
    'Invalid coefficient or degree: X^9007199254740992' \
    'X^9007199254740992 = 0'

assert_error "empty term between operators" \
    'Malformed expression' \
    'X + = 0'

printf '%s\n' '========================================'
printf 'Tests run: %s | Passed: %s | Failed: %s\n' \
    "$tests_run" "$((tests_run - tests_failed))" "$tests_failed"
printf '%s\n' '========================================'

[ "$tests_failed" -eq 0 ]
