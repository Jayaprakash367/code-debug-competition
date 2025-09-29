const db = require('./db');

const challenges = [
  {
    name: 'Off-by-One Error in C',
    description: 'Fix the off-by-one error in this C loop.',
    language: 'C',
    buggy_code: `#include <stdio.h>
int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    for (int i = 0; i <= 5; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,
    expected_output: '1 2 3 4 5',
    points: 10
  },
  {
    name: 'Infinite Loop in Python',
    description: 'Fix the infinite loop in this Python code.',
    language: 'Python',
    buggy_code: `while True:
    print("Hello")
    break`,
    expected_output: 'Hello',
    points: 15
  },
  {
    name: 'Null Pointer in C++',
    description: 'Fix the null pointer dereference in this C++ code.',
    language: 'C++',
    buggy_code: `#include <iostream>
int main() {
    int* ptr = nullptr;
    std::cout << *ptr << std::endl;
    return 0;
}`,
    expected_output: '',
    points: 20
  },
  {
    name: 'Array Index Out of Bounds in Java',
    description: 'Fix the array index out of bounds in this Java code.',
    language: 'Java',
    buggy_code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        System.out.println(arr[3]);
    }
}`,
    expected_output: '',
    points: 25
  },
  {
    name: 'Syntax Error in Python',
    description: 'Fix the syntax error in this Python code.',
    language: 'Python',
    buggy_code: `print("Hello World"`,
    expected_output: 'Hello World',
    points: 5
  }
];

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO challenges (name, description, language, buggy_code, expected_output, points)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  challenges.forEach(challenge => {
    stmt.run(challenge.name, challenge.description, challenge.language, challenge.buggy_code, challenge.expected_output, challenge.points);
  });

  stmt.finalize();

  console.log('Sample challenges inserted.');
});
