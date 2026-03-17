package config

import (
	"fmt"
	"log"
	"os"
	"github.com/joho/godotenv"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := dsnLogic()
	
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    return db
}

func dsnLogic() string {
	host := os.Getenv("DB_HOST")
    user := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    dbname := os.Getenv("DB_NAME")
    port := os.Getenv("DB_PORT")
    sslmode := os.Getenv("SSL_MODE")

	dsnParts := []string{}
	if host != "" {
		dsnParts = append(dsnParts, fmt.Sprintf("host=%s", host))
	}
	if user != "" {
		dsnParts = append(dsnParts, fmt.Sprintf("user=%s", user))
	}
	if password != "" {
		dsnParts = append(dsnParts, fmt.Sprintf("password=%s", password))
	}
	if dbname != "" {
		dsnParts = append(dsnParts, fmt.Sprintf("dbname=%s", dbname))
	}
	if port != "" {
		dsnParts = append(dsnParts, fmt.Sprintf("port=%s", port))
	}
	if sslmode != "" {
		dsnParts = append(dsnParts, fmt.Sprintf("sslmode=%s", sslmode))
	}

	dsn := ""
	for i, part := range dsnParts {
		if i > 0 {
			dsn += " "
		}
		dsn += part
	}

	return dsn
}
