# Computor V2: Interactive Mathematics Interpreter

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
   <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Shell-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white" alt="Shell"/>
  <img src="https://img.shields.io/badge/Make-427819?style=for-the-badge&logo=gnu&logoColor=white" alt="Make"/>
</p>

<p align="center">
   <strong>A command interpreter for interactive mathematical computations.</strong>
</p>

---

## 📖 Table of Contents

- [About](#-about)
- [Specification](#specification)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Usage](#-usage)
- [Example](#example)
- [Project Structure](#-project-structure)

---

## 🚀 About

**Computor V2** is an instruction interpreter that, like a shell, reads user input and evaluates advanced mathematical computations. It presents a simple command prompt and responds to instructions interactively.

---

## Specification

The target specification includes:

- Mathematical types: rational numbers, complex numbers with rational coefficients, matrices, and polynomial equations of degree at most 2
- Assignment of expressions to variables using type inference
- Reassignment of an existing variable to an expression of a different type
- Assignment from another variable, whether or not that variable has already been defined
- Evaluation of mathematical expressions with or without defined variables
- Resolution of equations of degree at most 2
- Operations between supported types wherever they are defined
- Program termination by keyword, signal, or keyboard shortcut

These points describe the project scope; they are not a claim that every listed feature is implemented in the current version.

---

## 🛠 Technologies

- **Node.js** - JavaScript runtime
- **TypeScript** - Core programming language
- **Shell scripting** - Executable wrapper
- **Makefile** - Build automation

---

## 📦 Installation

### Prerequisites

- **Node.js**
- **npm** (comes with Node.js)
- **Make** (optional, for using Makefile)

### Steps

1. **Build the project**
   ```bash
   make
   ```

   The Makefile installs the TypeScript build dependencies when needed, compiles the interpreter, and creates the `computorv2` executable.

---

## 💻 Usage

Start the interactive interpreter from the repository root:

```bash
./computorv2
```

Enter instructions at the `>` prompt. Use `exit` or `quit` to leave; `help`, `vars`, and `history` are also available.

## Example

```
> a = 2 * 4 + 4
12
> a + 2 = ?
14
>
```

## 📁 Project Structure

```
computorV2/
├── V1/                   # Polynomial solver modules
├── V2/
│   ├── computorV2.ts     # Executable entry point
│   └── interpreter.ts   # Interactive interpreter
├── Makefile              # Build automation
└── README.md             # Documentation
```

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
