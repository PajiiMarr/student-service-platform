package routes

import (
	"backend/auth"
	"backend/config"
	"backend/handlers"
	"backend/middleware"
	"backend/repository"
	"backend/services"
	"net/http"
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

	// Initialize repositories
	userRepo := &repository.UserRepository{DB: db}
	studentRepo := &repository.StudentRepository{DB: db} // ← Add this

	// Initialize services with both repositories
	userService := &services.UserService{
		UserRepo:    userRepo,
		StudentRepo: studentRepo, // ← Add this line
	}

	studentService := &services.StudentService{
		StudentRepo: studentRepo,
	}

	userHandler := &handlers.UserHandler{
		UserService: userService,
		AuthService: authService,
	}

	studentHandler := &handlers.StudentHandler{
		StudentService: studentService,
		AuthService:    authService,
	}

	// Register routes
	registerUserRoutes(r, userHandler, authService, userRepo)
	registerStudentRoutes(r, studentHandler, authService, userRepo)

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

func registerUserRoutes(r *gin.Engine, userHandler *handlers.UserHandler, authService *auth.AuthJWT, userRepo *repository.UserRepository) {
	api := r.Group("/api")
	{
		// Public routes
		api.POST("/signin", userHandler.SigninUser)
		api.POST("/signup", userHandler.SignupUser)
		api.POST("/logout", func(c *gin.Context) {
			c.SetCookie("auth_token", "", -1, "/", "", false, true)
			c.SetCookie("refresh_token", "", -1, "/", "", false, true)
			c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
		})

		// Token refresh endpoint
		api.POST("/refresh", func(c *gin.Context) {
			refreshToken, err := c.Cookie("refresh_token")
			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "No refresh token"})
				return
			}

			claims, err := authService.ValidateJWT(refreshToken)
			if err != nil || claims.Type != "refresh" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
				return
			}

			// Generate new access token
			newAccessToken, err := authService.GenerateAccessToken(claims.UserID, claims.Role)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to refresh token"})
				return
			}

			c.SetCookie(
				"auth_token",
				newAccessToken,
				900,
				"/",
				"",
				false,
				true,
			)

			c.JSON(http.StatusOK, gin.H{"message": "Token refreshed"})
		})

		// Protected routes
		protected := api.Group("/protected")
		protected.Use(middleware.AuthMiddleware(authService, userRepo))
		{
			protected.GET("/profiling", userHandler.GetProfilingUser)
			protected.PUT("/profiling", userHandler.UpdateUserProfile)
			protected.GET("/colleges-courses", userHandler.GetCollegesAndCourses)
		}
	}
}

func registerStudentRoutes(r *gin.Engine, studentHandler *handlers.StudentHandler, authService *auth.AuthJWT, userRepo *repository.UserRepository) {
	// Student API group – all routes require authentication + student role
	studentGroup := r.Group("/api/student")
	studentGroup.Use(middleware.AuthMiddleware(authService, userRepo))
	studentGroup.Use(middleware.RequireStudent())
	{
		studentGroup.GET("/jobs", studentHandler.GetJobs)
		studentGroup.POST("/jobs", studentHandler.PostJob)
		// studentGroup.PUT("/profile", studentHandler.UpdateStudentProfile)
		// studentGroup.GET("/enrollments", studentHandler.GetEnrollments)
		// Add other student-specific endpoints here
	}
}
