#include <iostream>
using namespace std;
int main() {
   int array[] = {10, 20, 30, 40, 50};
   int n = sizeof(array) / sizeof(array[0]); // Calculate the size of the array
   cout << "Array Elements: ";
   for (int i = 0; i < n; i++) {
       cout << array[i] << " ";
   }
   cout << endl;
   return 0;
}