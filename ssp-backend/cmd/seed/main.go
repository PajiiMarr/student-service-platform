package main 

import (
    "backend/config"
    "backend/seeders"
)

func main() {
    db := config.ConnectDB()
    
    // Run seeders
    seeders.Run(db)
}