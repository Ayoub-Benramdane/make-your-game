package main

import (
	"fmt"
	"game/handler"
	"net/http"
	"os"
)

func main() {
	if len(os.Args) != 1 {
		fmt.Println("Too many arguments")
		os.Exit(1)
	}

	http.Handle("/scripts/", http.StripPrefix("/scripts/", http.FileServer(http.Dir("./scripts"))))
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("./img"))))

	http.HandleFunc("/", handler.GameHandler)
	http.HandleFunc("/score", handler.ScoreHandler)

	fmt.Println("Server starting on http://localhost:8404")
	if err := http.ListenAndServe(":8404", nil); err != nil {
		fmt.Println("Server error:", err)
		os.Exit(1)
	}
}
