#include "helpers.h"
#include "math.h"
#include "stdio.h"

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    // Loop over all pixels
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            // Take average of red, green, and blue
            float avg = ((float) image[i][j].rgbtRed + (float) image[i][j].rgbtGreen +
                         (float) image[i][j].rgbtBlue) /
                        3;
            avg = round(avg);
            image[i][j].rgbtRed = avg;
            image[i][j].rgbtGreen = avg;
            image[i][j].rgbtBlue = avg;
            // Update pixel values
        }
    }

    return;
}

// Convert image to sepia
void sepia(int height, int width, RGBTRIPLE image[height][width])
{
    // sepiaRed = .393 * originalRed + .769 * originalGreen + .189 * originalBlue
    // sepiaGreen = .349 * originalRed + .686 * originalGreen + .168 * originalBlue
    // sepiaBlue = .272 * originalRed + .534 * originalGreen + .131 * originalBlue
    // Loop over all pixels
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            // Compute sepia values
            float r = image[i][j].rgbtRed;
            float g = image[i][j].rgbtGreen;
            float b = image[i][j].rgbtBlue;

            int xr = round(.393 * r + .769 * g + .189 * b);
            int xg = round(.349 * r + .686 * g + .168 * b);
            int xb = round(.272 * r + .534 * g + .131 * b);

            if (xr > 255)
            {
                xr = 255;
            }
            if (xg > 255)
            {
                xg = 255;
            }

            if (xb > 255)
            {
                xb = 255;
            }

            image[i][j].rgbtRed = xr;
            image[i][j].rgbtGreen = xg;
            image[i][j].rgbtBlue = xb;

            // Update pixel with sepia values
        }
    }

    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    // Loop over all pixels
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width / 2; j++)
        {
            // Swap pixels
            RGBTRIPLE lft = image[i][width - j - 1];
            RGBTRIPLE rght = image[i][j];
            image[i][j] = lft;
            image[i][width - j - 1] = rght;
        }
    }

    return;
}

int a = 0;
// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{

    int blursize = 3;
    int offset = (blursize - 1) / 2;
    // printf("offset : %i\n", offset);
    RGBTRIPLE imgx[height][width];
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            // first pixel : 0,0
            float rgb[] = {0, 0, 0};
            int countx = 0;

            for (int k = i - offset; k <= i + offset; k++)
            {
                for (int l = j - offset; l <= j + offset; l++)
                {

                    if (k < 0 || k >= height || l < 0 || l >= width)
                    {
                        // if(a<20){
                        //     printf("r-(i,j),k,l, n-(%i,%i) %i, %i\n",i,j, k, l);
                        // }
                        continue;
                    }
                    countx++;
                    rgb[0] += image[k][l].rgbtRed;
                    rgb[1] += image[k][l].rgbtGreen;
                    rgb[2] += image[k][l].rgbtBlue;
                    // printf("r %i\n", rgb[0]);

                    // a++;
                    // if(a<20){
                    //     printf("r-(i,j),k,l %i-(%i,%i) %i, %i\n",image[k][l].rgbtRed,i,j, k, l);
                    // }
                }
            }

            imgx[i][j].rgbtRed = round(rgb[0] / countx);
            imgx[i][j].rgbtGreen = round(rgb[1] / countx);
            imgx[i][j].rgbtBlue = round(rgb[2] / countx);
        }
    }

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {

            image[i][j] = imgx[i][j];
        }
    }

    return;
}
