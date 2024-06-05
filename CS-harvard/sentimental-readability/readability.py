
def main():
    str=input("Text: ")
    nalphas= countalpha(str)
    nwords=countwords(str)
    nsentenses=countsentenses(str)

    L=(nalphas/nwords)*100
    S=(nsentenses/nwords)*100
    #0.0588 * L - 0.296 * S - 15.8,
    cindex=round(0.0588 * L - 0.296 * S - 15.8)
    if cindex<1:
        print("Before Grade 1")
    elif cindex>=16:
        print("Grade 16+")
    else:
        print(f"Grade {cindex}")



def countalpha(str):
    nalpha=0;
    for apha in str:
        if apha.isalpha():
            nalpha+=1
    return nalpha

def countwords(str):
    return len(str.split(" "))

def countsentenses(str):
    return sum(str.count(ending) for ending in [".","?","!"] )





main();
