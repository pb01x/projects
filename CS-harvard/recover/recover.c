#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
 // Accept a single command-line argument
    if (argc != 2)
    {
        printf("Usage: ./recover FILE\n");
        return 1;
    }

    // Open the memory card
    FILE *card = fopen(argv[1], "r");

    // Create a buffer for a block of data
    uint8_t buffer[512];
    int n=0;
    FILE* image=NULL;

    // While there's still data left to read from the memory card
    while (fread(buffer, 1, 512, card) == 512)
    {

        // Create JPEGs from the data
        //printf("test");
        // 0xff 0xd8 0xff
        if(buffer[0]==0xff && buffer[1]==0xd8 && buffer[2]==0xff && (buffer[3] & 0xf0) == 0xe0)
        {

            if(image!=NULL)
            {
                fclose(image);
            }
            char* imagename=malloc(8*sizeof(char));
            sprintf(&imagename[0], "%03i.jpg",n);
            image=fopen(imagename,"w");
            n++;
            free(imagename);

        }
        if(image !=NULL)
        {
            fwrite(buffer,1,512,image);
        }

    }

    fclose(image);
    fclose(card);

    return 0;


}
