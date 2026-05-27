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
		api.POST("/logout", userHandler.LogoutUser)
		api.POST("/refresh", userHandler.RefreshToken)

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
		studentGroup.GET("/jobs/:job_id", studentHandler.GetJobByID)
		studentGroup.POST("/jobs", studentHandler.PostJob)
		// studentGroup.PUT("/profile", studentHandler.UpdateStudentProfile)
		// studentGroup.GET("/enrollments", studentHandler.GetEnrollments)
		// Add other student-specific endpoints here
	}
}
