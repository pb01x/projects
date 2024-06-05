#include <cs50.h>
#include <stdio.h>

int main(void)
{
    string input1 = get_string("What's your name? ");
    printf("hello, %s\n", input1);
}
