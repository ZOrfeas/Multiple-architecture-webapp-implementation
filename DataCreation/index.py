import sys
##

if __name__ == "__main__":
    debug = False
    argCount = len(sys.argv)
    if argCount != 1 and argCount != 5:
        print("Provide no, or exactly 4 commandline args")
        exit()
    from src.dummyDataCreator import main
    if argCount == 1:
        main(debug=debug)
    else:
        main(sys.argv[1:], debug=debug)