package routes

import (
    "github.com/gin-gonic/gin"
    "backend/handlers"
    "backend/repository"
    "backend/services"
    "gorm.io/gorm"
)

func SetupRoutes(db *gorm.DB) *gin.Engine {
    r := gin.Default()

    userRepo := &repository.UserRepository{DB: db}
    userService := &services.UserService{UserRepo: userRepo}
    userHandler := &handlers.UserHandler{UserService: userService}

    r.GET("/users", userHandler.GetUsers)
    r.POST("/users", userHandler.CreateUser)

    return r
}