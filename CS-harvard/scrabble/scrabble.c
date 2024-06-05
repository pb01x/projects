#include <cs50.h>
#include <ctype.h>
#include <stdio.h>
#include <string.h>

int calculateScore(string word);
int scorex[] = {1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10};

int main(void)
{
    string words[2];
    words[0] = get_string("Player 1: ");
    words[1] = get_string("Player 2: ");

    int a = calculateScore(words[0]);
    int b = calculateScore(words[1]);

    if (a > b)
    {
        printf("%s\n", "Player 1 wins!");
    }
    if (a < b)
    {
        printf("%s\n", "Player 2 wins!");
    }
    else
    {
        printf("%s\n", "Tie");
    }
}

int calculateScore(string word)
{
    int sum = 0;
    for (int i = 0, len = strlen(word); i < len; i++)
    {
        char a = word[i];
        if (!isupper(a))
        {
            a = toupper(a);
        }
        int scr=a - 'A';
        if(scr>=0 && scr< 26)
        {
            sum += scorex[scr];
        }

    }

    return sum;
}
