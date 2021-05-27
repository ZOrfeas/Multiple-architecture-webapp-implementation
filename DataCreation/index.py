import sys
##

if __name__ == "__main__":
    debugVal = False
    argCount = len(sys.argv)
    if argCount != 1 and argCount != 5:
        print("Provide no, or exactly 4 commandline args")
        exit()
    from src.creator import main
    if argCount == 1:
        main(debug=debugVal)
    else:
        main(list(map(int,sys.argv[1:])), debug=debugVal)
