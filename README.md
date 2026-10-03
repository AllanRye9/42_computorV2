# 🧮 Polynomial Mathematics Solver (ComputorV1)

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Shell-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white" alt="Shell"/>
  <img src="https://img.shields.io/badge/Make-427819?style=for-the-badge&logo=gnu&logoColor=white" alt="Make"/>
</p>

<p align="center">
  <strong>A polynomial mathematics project that parses, simplifies, and analyzes polynomial equations up to degree 2.</strong>
</p>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Usage](#-usage)
- [Examples](#-examples)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Mathematical Background](#-mathematical-background)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🚀 About

**ComputorV1** is a command-line polynomial equation solver that reduces polynomial expressions to their canonical form, determines the polynomial degree, and solves equations up to degree 2 (quadratic equations).

The application focuses on:
- 🔍 **Parsing logic** - Robust equation parsing with validation
- 🧪 **Mathematical validation** - Checks for invalid input and malformed equations
- 🔢 **Equation solving** - Handles linear and quadratic equations
- ⚠️ **Error handling** - Clear error reporting for unsupported degrees

---

## ✨ Features

✅ Parse polynomial expressions with positive and negative coefficients  
✅ Reduce equations to standard (reduced) form  
✅ Detect and calculate the polynomial degree  
✅ Handle missing terms (e.g., X² not explicitly provided)  
✅ Validate invalid characters and malformed input  
✅ Support for floating-point coefficients  
✅ Solve linear equations (degree 1)  
✅ Solve quadratic equations (degree 2) using the discriminant method  
✅ Custom square root implementation (no external math libraries)  
✅ Display solutions as fractions when applicable  
✅ Clear error reporting for unsupported degrees (> 2)

---

## 🛠 Technologies

- **Node.js** - JavaScript runtime
- **JavaScript (ES6+)** - Core programming language
- **Shell scripting** - Executable wrapper
- **Makefile** - Build automation

---

## 📦 Installation

### Prerequisites

- **Node.js** (v12 or higher recommended)
- **npm** (comes with Node.js)
- **Make** (optional, for using Makefile)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/AllanRye9/ComputorV1.git
   cd ComputorV1
   ```

2. **Navigate to the source directory**
   ```bash
   cd src
   ```

3. **Build the project using Make**
   ```bash
   make
   ```

   This will:
   - Initialize npm if needed
   - Install dependencies
   - Create an executable `computor` script

4. **Alternatively, manual setup**
   ```bash
   npm init -y
   npm install
   chmod +x computor
   ```

---

## 💻 Usage

### Basic Command

```bash
./computor "polynomial_equation"
```

### Format

Equations must be in the form:
```
left_side = right_side
```

Where each side can contain terms like:
- `5 * X^0` (constant term)
- `4 * X^1` (linear term)
- `1 * X^2` (quadratic term)

### Supported Operations

- Addition: `+`
- Subtraction: `-`
- Multiplication: `*` (between coefficient and variable)
- Exponentiation: `^` (for degree)

---

## 📚 Examples

### Example 1: Simple Linear Equation

```bash
./computor "5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0"
```

**Output:**
```
Reduced form: -9.3 * X^2 + 4 * X^1 + 4 * X^0 = 0
Polynomial degree: 2
Discriminant is strictly positive, the two solutions are:
0.905239
-0.475131
```

---

### Example 2: Quadratic Equation (No Real Solutions)

```bash
./computor "5 * X^0 + 4 * X^1 + 1 * X^2 = 1 * X^0"
```

**Output:**
```
Reduced form: 1 * X^2 + 4 * X^1 + 4 * X^0 = 0
Polynomial degree: 2
Discriminant is zero, the solution is:
-2
```

---

### Example 3: Linear Equation

```bash
./computor "5 * X^0 + 4 * X^1 = 4 * X^0"
```

**Output:**
```
Reduced form: 4 * X^1 + 1 * X^0 = 0
Polynomial degree: 1
The solution is:
-0.25
```

---

### Example 4: Identity Equation

```bash
./computor "4 * X^0 = 4 * X^0"
```

**Output:**
```
Reduced form: 0 * X^0 = 0
Any real number is a solution.
```

---

### Example 5: Unsupported Degree

```bash
./computor "8 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 3 * X^0"
```

**Output:**
```
Reduced form: -5.6 * X^3 - 6 * X^1 + 5 * X^0 = 0
Polynomial degree: 3
The polynomial degree is strictly greater than 2, I can't solve.
```

---

### Example 6: Invalid Input

```bash
./computor "5 * X^0 + 4 * X^1 @ 1 * X^2 = 0"
```

**Output:**
```
Error: Invalid characters in equation
```

---

## 📁 Project Structure

```
ComputorV1/
├── src/
│   ├── computor.js       # Entry point
│   ├── polynomial.js     # Core polynomial solver logic
│   ├── parse.js          # Equation parser and validator
│   ├── utils.js          # Math utilities (sqrt, gcd, fraction)
│   └── Makefile          # Build automation
├── README.md             # Documentation
└── .computorV1           # Symbolic link (executable)
```

### Module Descriptions

| File | Description |
|------|-------------|
| `computor.js` | Main entry point that initializes the solver |
| `polynomial.js` | Handles equation simplification, degree calculation, and solving |
| `parse.js` | Parses and validates user input, splits equation into terms |
| `utils.js` | Contains math utilities: custom square root, GCD, and fraction display |
| `Makefile` | Automates the build process |

---

## 🔧 How It Works

### 1. **Parsing Phase**
   - Validates the equation format
   - Checks for invalid characters
   - Splits the equation into left and right sides
   - Extracts coefficients and degrees

### 2. **Simplification Phase**
   - Combines like terms (same degree)
   - Moves all terms to the left side
   - Validates coefficients and degrees

### 3. **Degree Detection**
   - Identifies the highest degree term
   - Reports the polynomial degree

### 4. **Solving Phase**
   - **Degree 0**: Checks if the equation is an identity or contradiction
   - **Degree 1**: Solves using `x = -b/a`
   - **Degree 2**: Uses the discriminant method
     - Δ > 0: Two distinct real solutions
     - Δ = 0: One repeated real solution
     - Δ < 0: Two complex conjugate solutions

### 5. **Custom Math Functions**
   - **Square Root**: Newton-Raphson iterative method
   - **GCD**: Euclidean algorithm
   - **Fraction Display**: Simplifies rational solutions

---

## 📐 Mathematical Background

### Quadratic Formula

For equations of the form **ax² + bx + c = 0**, the solutions are:

```
x = (-b ± √Δ) / 2a
```

Where the **discriminant** (Δ) is:

```
Δ = b² - 4ac
```

### Cases:
- **Δ > 0**: Two distinct real roots
- **Δ = 0**: One repeated real root
- **Δ < 0**: Two complex conjugate roots

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Areas for Improvement

- [ ] Support for higher-degree polynomials (cubic, quartic)
- [ ] Complex number solutions display
- [ ] Interactive mode with step-by-step solutions
- [ ] Web-based UI
- [ ] Unit tests
- [ ] Graph visualization

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Oryema Allan**

- GitHub: [@AllanRye9](https://github.com/AllanRye9)
- LinkedIn: [Oryema Allan](https://ae.linkedin.com/in/oryema-allan)
- Email: oallan@student.42abudhabi.ae

---

## 🌟 Acknowledgments

- Inspired by mathematical problem-solving and algorithmic thinking
- Part of the 42 Abu Dhabi curriculum
- Built with curiosity and a passion for mathematics

---

<p align="center">
  <strong>⭐ If you found this project useful, please consider giving it a star!</strong>
</p>

---

## 🐛 Known Issues

- Very large coefficients may cause precision issues
- Complex number solutions are calculated but not displayed in standard form
- Error messages could be more descriptive in some edge cases

---

## 📝 Change Log

### Version 1.0.0
- ✅ Initial release
- ✅ Linear and quadratic equation solver
- ✅ Custom math utilities
- ✅ Robust input validation

---

**Made with ❤️ and ☕ by Allan**
