import csv
import sys


def main():

    rows=[]
    # TODO: Check for command-line usage
    if len(sys.argv) != 3:
        print("USAGE: python dna.py database.csv sequence.txt")
        sys.exit()

    # TODO: Read database file into a variable
    with open(sys.argv[1]) as csvfile:
        reader=csv.DictReader(csvfile)
        for row in reader:
            rows.append(row)
        fnames=reader.fieldnames



    # TODO: Read DNA sequence file into a variable
    with open(sys.argv[2]) as seqfile:
        seqtxt=seqfile.read()

    # TODO: Find longest match of each STR in DNA sequence
        result={}
        for str in fnames:
            result[str]=longest_match(seqtxt,str)
        # print(result);

    # TODO: Check database for matching profiles
        nresult=len(result)
        for row in rows:
            nn=0;
            for key in row:
                for res in result:
                    if key==res:
                        # print(f"",row[key], result[res],row[key]==result[res])
                        try:
                            if int(row[key])==int(result[res]):
                                # print("ttt-----")
                                nn+=1
                        except:
                            continue
                        #   print(f"",key,row[key], result[res])
                        if nn==nresult-2:
                            print(row["name"])
                            return;



        print("No match\n")



def longest_match(sequence, subsequence):
    """Returns length of longest run of subsequence in sequence."""

    # Initialize variables
    longest_run = 0
    subsequence_length = len(subsequence)
    sequence_length = len(sequence)

    # Check each character in sequence for most consecutive runs of subsequence
    for i in range(sequence_length):

        # Initialize count of consecutive runs
        count = 0

        # Check for a subsequence match in a "substring" (a subset of characters) within sequence
        # If a match, move substring to next potential match in sequence
        # Continue moving substring and checking for matches until out of consecutive matches
        while True:

            # Adjust substring start and end
            start = i + count * subsequence_length
            end = start + subsequence_length

            # If there is a match in the substring
            if sequence[start:end] == subsequence:
                count += 1

            # If there is no match in the substring
            else:
                break

        # Update most consecutive matches found
        longest_run = max(longest_run, count)

    # After checking for runs at each character in seqeuence, return longest run found
    return longest_run


main()
