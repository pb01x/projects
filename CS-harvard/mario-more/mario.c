#include <cs50.h>
#include <stdio.h>

void startinp();
void CreateRow(int n);
void PrintHash(int n);

int nrow;
int main(void)
{
    startinp();
}

void startinp()
{
    nrow = get_int("Height: ");
    if (nrow > 0 && nrow < 9)
    {
        for (int i = 0; i < nrow; i++)
        {
            CreateRow(i + 1);
        }
    }
    else
    {
        startinp();
    }
}

void CreateRow(int n)
{
    for (int i = 0; i < (nrow - n); i++)
    {
        printf(" ");
    }
    PrintHash(n);
    printf("  ");
    PrintHash(n);
    printf("\n");
}

void PrintHash(int n)
{
    for (int i = 0; i < (n); i++)
    {
        printf("#");
    }
}
