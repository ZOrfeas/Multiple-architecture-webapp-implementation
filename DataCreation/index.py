import sys
##

if __name__ == "__main__":
    debug = False
    argCount = len(sys.argv)
    if argCount != 1 and argCount != 5:
        print("Provide no, or exactly 4 commandline args")
        exit()
    from src.creator import main
    if argCount == 1:
        main(debug=debug)
    else:
        # print(map(int,sys.argv[1:]))
        # print(*map(int,sys.argv[1:]))
        main(*map(int,sys.argv[1:]), debug=debug)