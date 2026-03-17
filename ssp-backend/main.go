package main

import (
	"backend/config"
	"backend/routes"
	"backend/models"
	"gorm.io/gorm"
	"log"
)

func main() {
	db := config.ConnectDB()
	log.Println("Database connected successfully!")

	autoRunMigrations(db)

	r := routes.SetupRoutes(db)

	r.Run(":8080")
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