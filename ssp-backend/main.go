package main

import (
	"backend/config"
	"backend/models"
	"backend/routes"
	"gorm.io/gorm"
	"log"
)

func main() {
	db := config.ConnectDB()
	log.Println("Database connected successfully!")

	autoRunMigrations(db)

	r := routes.SetupRoutes(db)

	if err := r.Run("127.0.0.1:8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}

}

func autoRunMigrations(db *gorm.DB) {
	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.Admin{})
	db.AutoMigrate(&models.Student{})
	db.AutoMigrate(&models.Course{})
	db.AutoMigrate(&models.College{})
	db.AutoMigrate(&models.Job{})
	db.AutoMigrate(&models.Application{})
	db.AutoMigrate(&models.Message{})
	db.AutoMigrate(&models.Notification{})
	db.AutoMigrate(&models.Wallet{})
	db.AutoMigrate(&models.Transaction{})
	db.AutoMigrate(&models.Withdrawal{})
	db.AutoMigrate(&models.Media{})
}
