package routes

import (
	"backend/auth"
	"backend/config"
	"backend/handlers"
	"backend/middleware"
	"backend/repository"
	"backend/services"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	// Configure middleware
	r = setupCORS(r)

	// Setup services
	cfg := config.LoadConfig()
	authService := &auth.AuthJWT{JWTSecret: cfg.JWTSecret}
	
	userRepo := &repository.UserRepository{DB: db}
	userService := &services.UserService{UserRepo: userRepo}
	userHandler := &handlers.UserHandler{
		UserService: userService,
		AuthService: authService,
	}

	// Register routes
	registerUserRoutes(r, userHandler, authService, userRepo)

	return r
}

// setupCORS configures CORS middleware
func setupCORS(r *gin.Engine) *gin.Engine {
    r.Use(cors.New(cors.Config{
        AllowOrigins: []string{
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://[::1]:5173", // IPv6 localhost
        },
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Cookie"},
        ExposeHeaders:    []string{"Content-Length", "Set-Cookie"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))
    return r
}
// registerUserRoutes registers all user-related routes
func registerUserRoutes(r *gin.Engine, userHandler *handlers.UserHandler, authService *auth.AuthJWT, userRepo *repository.UserRepository) {
	api := r.Group("/api")
	{
		// Public routes
		// api.GET("/users", userHandler.GetUsers)
		api.POST("/signup", userHandler.SignupUser)

		// Protected routes (require authentication)
		protected := api.Group("/protected")
		protected.Use(middleware.AuthMiddleware(authService, userRepo))
		{
			protected.GET("/profiling", userHandler.GetProfilingUser)
			// Add more protected routes here
		}
	}
}