// Implements a dictionary's functionality

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

#include "dictionary.h"
// Represents a node in a hash table
typedef struct node
{
    char word[LENGTH + 1];
    struct node *next;
} node;

// TODO: Choose number of buckets in hash table
const unsigned int N = 26;

// Hash table
node *table[N];

void rcsvunload(node *nodex);

// Returns true if word is in dictionary, else false
bool check(const char *word)
{
    // TODO
    // printf("%s%s","Checking :",word);
    node *nodex=table[hash(word)];
    while(nodex!=NULL)
    {
        if(strcasecmp(word, nodex->word)==0)
        {
            return true;
        }
        nodex=nodex->next;
    }
    return false;
}

// Hashes word to a number
unsigned int hash(const char *word)
{
    // TODO: Improve this hash function
    unsigned  int sum=0;
    for(int i=0; i<strlen(word); i++)
    {
        sum+=tolower(word[i]);
    }
    return sum % N;
    // return toupper(word[0]) - 'A';
}

unsigned int nword=0;
// Loads dictionary into memory, returning true if successful, else false
bool load(const char *dictionary)
{
    // TODO
    // printf("%s%s%s", "loading dictionary...", dictionary, "\n");
       // Open the dictionary file
    FILE *source = fopen(dictionary, "r");
    if(source==NULL)
    {
        return false;
    }

    // Read each word in the file
    char wordx[LENGTH+1];
    while(fscanf(source,"%s",wordx) != EOF)
    {
        node *x=malloc(sizeof(node));
        if(x==NULL)
        {
            return false;
        }
        strcpy(x->word, wordx);
        int hashx=hash(wordx);
        x->next=table[hashx];
         // Add each word to the hash table
        table[hashx]=x;
        nword++;

    }
    //printf("%s%i", "N words :", nword);
      // Close the dictionary file
    fclose(source);

    return true;
}

// Returns number of words in dictionary if loaded, else 0 if not yet loaded
unsigned int size(void)
{
    // TODO
    return nword;
}

// Unloads dictionary from memory, returning true if successful, else false
bool unload(void)
{
    // return true;
    // TODO
    for(int i=0; i<N; i++)
    {
        node *nodex=table[i];
        free(nodex);
    }
    return true;
}

