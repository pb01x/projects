#include <cs50.h>
#include <stdio.h>

int getsum(long inp, int type);
string detectcard();
int length = 0;
int firstdigit;
int first2digit;
int sum;
int main(void)
{
    long CardNo = get_long("Number: ");
    sum = getsum(CardNo, 1);
    string output = detectcard();
    printf("%s\n", output);
}

string detectcard()
{

    if (sum != 0)
    {
        return "INVALID";
    }

    if (length == 15 && (first2digit == 34 || first2digit == 37))
    {
        return "AMEX";
    }

    if (length == 16 && first2digit > 50 && first2digit < 56)
    {
        return "MASTERCARD";
    }

    if ((length == 13 || length == 16) && firstdigit == 4)
    {
        return "VISA";
    }
    return "INVALID";
}

int getsum(long inp, int type)
{
    long tempCno = inp;
    int firstsum = 0;
    int secondsum = 0;
    int sumx = 0;
    int n = 0;
    while (inp > 0)
    {
        n++;
        int lastdigit;
        if (inp > 9)
        {
            lastdigit = inp % ((inp / 10) * 10);
        }
        else
        {
            lastdigit = inp;
        }

        if (type == 1)
        {
            if (inp > 9)
            {
                first2digit = inp;
            }
            else
            {
                firstdigit = inp;
            }
            length++;
            if (n % 2 != 0)
            {
                firstsum += lastdigit;
            }
            else
            {
                int m2 = lastdigit * 2;
                if (m2 > 9)
                {
                    int xasa = m2;
                    m2 = getsum(m2, 0);
                }
                secondsum += m2;
            }
        }
        else
        {
            sumx += lastdigit;
        }
        inp = inp / 10;
    }

    if (type == 0)
    {
        if (sumx > 9)
        {
            sumx = getsum(sumx, 0);
        }
        return sumx;
    }
    else
    {
        int sumout = firstsum + secondsum;
        if (sumout > 9)
        {
            return sumout % ((sumout / 10) * 10);
        }
        else
        {
            return sumout;
        }
    }
}
