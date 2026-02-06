import db from './db.js';

const challenges = [
  {
    name: 'Sum of Numbers in C',
    description: 'Fix the code to print the sum of numbers from 1 to 10.',
    language: 'C',
    buggy_code: `#include <stdio.h>
int main() {
    int sum = 0;
    for (int i = 1; i < 10; i++) {
        sum += i;
    }
    printf("%d", sum);
    return 0;
}`,
    expected_output: '45',
    points: 10
  },
  {
    name: 'Print Hello World in Python',
    description: 'Fix the syntax error to print "Hello World".',
    language: 'Python',
    buggy_code: `print "Hello World"`,
    expected_output: 'Hello World',
    points: 5
  },
  {
    name: 'Array Print in C++',
    description: 'Fix the off-by-one error to print array elements correctly.',
    language: 'C++',
    buggy_code: `#include <iostream>
int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    for (int i = 0; i <= 5; i++) {
        std::cout << arr[i] << " ";
    }
    return 0;
}`,
    expected_output: '10 20 30 40 50',
    points: 15
  },
  {
    name: 'Factorial in Python',
    description: 'Fix the code to calculate factorial of 5.',
    language: 'Python',
    buggy_code: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n)

result = factorial(5)
print(result)`,
    expected_output: '120',
    points: 20
  },
  {
    name: 'Loop Output in Java',
    description: 'Fix the loop to print numbers from 1 to 5.',
    language: 'Java',
    buggy_code: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.print(i);
        }
    }
}`,
    expected_output: '12345',
    points: 8
  },
  {
    name: 'Even Numbers in C',
    description: 'Print all even numbers from 2 to 10.',
    language: 'C',
    buggy_code: `#include <stdio.h>
int main() {
    for (int i = 2; i <= 10; i += 1) {
        printf("%d ", i);
    }
    return 0;
}`,
    expected_output: '2 4 6 8 10',
    points: 12
  },
  {
    name: 'String Concatenation in Python',
    description: 'Fix the code to concatenate and print "Hello World".',
    language: 'Python',
    buggy_code: `a = "Hello"
b = "World"
print(a b)`,
    expected_output: 'HelloWorld',
    points: 7
  },
  {
    name: 'Reverse Number in C++',
    description: 'Fix the code to print digits of 54321 in order.',
    language: 'C++',
    buggy_code: `#include <iostream>
int main() {
    int num = 12345;
    while (num > 0) {
        std::cout << num % 10;
        num /= 10;
    }
    return 0;
}`,
    expected_output: '54321',
    points: 18
  },
  {
    name: 'Multiplication Table in Python',
    description: 'Print multiplication table of 3 from 1 to 5.',
    language: 'Python',
    buggy_code: `for i in range(1, 5):
    print(3 * i)`,
    expected_output: '3\n6\n9\n12',
    points: 10
  },
  {
    name: 'Sum Array in Java',
    description: 'Calculate sum of array elements 1, 2, 3, 4, 5.',
    language: 'Java',
    buggy_code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        System.out.print(sum);
    }
}`,
    expected_output: '15',
    points: 12
  }
];

db.serialize(() => {
  challenges.forEach((challenge) => {
    db.run(
      `INSERT OR IGNORE INTO challenges (name, description, language, buggy_code, expected_output, points)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [challenge.name, challenge.description, challenge.language, challenge.buggy_code, challenge.expected_output, challenge.points],
      (err) => {
        if (err) {
          console.error('Error inserting challenge:', err.message);
        }
      }
    );
  });

  db.all('SELECT COUNT(*) as count FROM challenges', [], (err, rows) => {
    if (err) {
      console.error('Error counting challenges:', err.message);
    } else {
      console.log(`Total challenges in database: ${rows[0].count}`);
    }
  });
});
