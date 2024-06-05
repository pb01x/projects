from cs50 import get_float

while True:
    change = get_float("Change: ")
    if (change > 0):
        break


count = 0
x = change*100
while x > 0:
    # 25,10,5,1
    if x >= 25:
        count += 1
        x = x-25
    elif x >= 10:
        count += 1
        x = x-10
    elif x >= 5:
        count += 1
        x = x-5
    elif x >= 1:
        count += 1
        x = x-1

print(count)
