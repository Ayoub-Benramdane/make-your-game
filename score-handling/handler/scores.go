package handler

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
)

type Data struct {
	Username string `json:"username"`
	Ranking  int    `json:"ranking"`
	Score    int    `json:"score"`
	Timing   int    `json:"timing"`
}

type UserResponse struct {
	All []Data `json:"all"`
}

func GameHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./index.html")
	if err != nil {
		http.Error(w, "Internal Server Error: Could not parse the html template", http.StatusInternalServerError)
		return
	}
	tmpl.Execute(w, nil)
}

func ScoreHandler(w http.ResponseWriter, r *http.Request) {
	var data Data
	var all []Data
	dir, err1 := os.Getwd()

	if err1 != nil {
		http.Error(w, "Internal Server Error: Could not find ", http.StatusInternalServerError)
		os.Exit(1)
	}

	jsonfile := dir + "/handler/score.json"

	Json, err := os.ReadFile(jsonfile)
	if err != nil {
		log.Println("error with reading file")
		return
	}
	err = json.Unmarshal(Json, &all)
	if err != nil && len(Json) != 0 {
		log.Println("error with unmarshling json")
		return
	}
	a := make(map[Data]bool)

	for _, v := range all {
		a[v] = true
	}

	if r.Method == http.MethodPost {
		err = json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, "Internal Server Error: Could not decode request", http.StatusInternalServerError)
			return
		}

		if !a[data] {
			all = append(all, data)
		}

		if len(all) == 1 {
			all[0].Ranking = 1
		}

		for i := 0; i < len(all); i++ {
			for j := i + 1; j < len(all); j++ {
				if all[i].Score < all[j].Score {
					all[i], all[j] = all[j], all[i]
				} else if all[i].Score == all[j].Score {
					if all[i].Timing < all[j].Timing {
						all[i], all[j] = all[j], all[i]
					}
				}
				all[i].Ranking = i + 1
				all[j].Ranking = j + 1
			}
		}

		dataJSON, err := json.MarshalIndent(&all, "", "\t")
		if err != nil {
			http.Error(w, "Internal Server Error: Could not decode request", http.StatusInternalServerError)
			return
		}
		os.WriteFile(jsonfile, dataJSON, 0o666)

	}
	WriteJson(w, 200, UserResponse{All: all})
}

func WriteJson(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		log.Printf("Unexpected Error %s", err.Error())
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
