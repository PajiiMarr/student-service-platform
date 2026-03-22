package routes

import (
	"backend/auth"
	"backend/config"
	"backend/handlers"
	"backend/repository"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	cfg := config.LoadConfig()

	authService := &auth.AuthJWT{JWTSecret: cfg.JWTSecret}

	userRepo := &repository.UserRepository{DB: db}
	userService := &services.UserService{UserRepo: userRepo}
	userHandler := &handlers.UserHandler{
		UserService: userService,
		AuthService: authService,
	}

	api := r.Group("/api")
	{
		api.GET("/users", userHandler.GetUsers)
		api.POST("/signup", userHandler.SignupUser)

		// protected := api.Group("/protected")
		// protected.Use(middleware.AuthMiddleware(authService, userRepo)){
        //     return null
		// }

	}

	return r
}
