#include <cs50.h>
#include <ctype.h>
#include <stdio.h>
#include <string.h>

int checkKey(string argv[]);
int main(int argc, string argv[])
{
    if (checkKey(argv) == 1)
    {
        printf("Invalid Key\n");
        return 1;
    }
    string plaintext = get_string("plaintext:");
    string output = "--";

    printf("ciphertext: ");

    for (int i = 0, len = strlen(plaintext); i < len; i++)
    {

        if (isalpha(plaintext[i]) == false)
        {
            printf("%c", plaintext[i]);
        }
        else if (plaintext[i] - 'A' < 26)
        {
            printf("%c", toupper(argv[1][plaintext[i] - 'A']));
        }
        else
        {
            printf("%c", toupper(argv[1][plaintext[i] - 'a']) + 'a' - 'A');
        }
    }

    printf("\n");
    return 0;
}

int checkKey(string argv[])
{
    if (argv[1] == NULL || argv[2] != NULL)
    {
        return 1;
    }

    if (strlen(argv[1]) != 26)
    {
        return 1;
    }

    int duplicateTest[26];
    for (int i = 0; i < 26; i++)
    {
        if (!isalpha(argv[1][i]))
        {
            return 1;
        }
        char cx = toupper(argv[1][i]);
        if (duplicateTest[(int) cx] == 1)
        {
            return 1;
        }
        else
        {
            duplicateTest[(int) cx] = 1;
        }
    }

    return 0;
}
