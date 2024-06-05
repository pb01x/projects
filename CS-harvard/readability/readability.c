#include <cs50.h>
#include <ctype.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

float computeReadability(string inp);

int main(void)
{
    string input = get_string("Text:");
    int calc = round(computeReadability(input));
    if (calc < 1)
    {
        printf("Before Grade 1\n");
    }
    else if (calc > 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %i\n", calc);
    }
}

float computeReadability(string inp)
{
    int n = strlen(inp);
    float wordlen = 1;
    float charlen = 0;
    float sentlen = 0;

    for (int i = 0; i < n; i++)
    {
        if (isalpha(inp[i]))
        {
            charlen++;
        }
        else if (inp[i] == ' ')
        {
            wordlen++;
        }
        else if (inp[i] == '.' || inp[i] == '?' || inp[i] == '!')
        {
            sentlen++;
        }
    }

    return (float) (0.0588 * (charlen / wordlen * 100) - 0.296 * ((float) sentlen / (float) wordlen * 100) - 15.8);
}
