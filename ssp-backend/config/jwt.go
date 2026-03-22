package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
)

type Config struct {
	JWTSecret []byte
}

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}

	return &Config{
		JWTSecret: []byte(jwtSecret),
	}
}
