package main

import (
	"net/http"
	"game/handler"
	"fmt"
	"os"
)

func main() {
	if len(os.Args) != 1 {
		fmt.Println("Too many arguments")
		os.Exit(1)
	}

	http.Handle("/Scripts/", http.StripPrefix("/Scripts/", http.FileServer(http.Dir("./Scripts"))))
    http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("./img"))))

	http.HandleFunc("/", game.GameHandler)
	http.HandleFunc("/score", game.ScoreHandler)

	fmt.Println("Server starting on http://localhost:8404")
	if err := http.ListenAndServe(":8404", nil); err != nil {
		fmt.Println("Server error:", err)
		os.Exit(1)
	}
}
