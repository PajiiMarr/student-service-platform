package middleware

import (
	"backend/auth"
	"backend/models"
	"backend/repository"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware creates the authentication middleware
func AuthMiddleware(authJwt *auth.AuthJWT, userRepo *repository.UserRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := extractToken(c)

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication token is required"})
			c.Abort()
			return
		}

		// Parse and validate JWT with role claims
		claims, err := authJwt.ValidateJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Fetch user from database to ensure they still exist and role hasn't changed
		user, err := fetchUserByID(c, userRepo, claims.UserID)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}

		// Verify role matches (in case role was changed in DB after token was issued)
		if user.Role != claims.Role {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Role changed, please login again"})
			c.Abort()
			return
		}

		// Set user and claims in context
		setUserInContext(c, user)
		c.Set("role", user.Role)
		c.Set("email", user.Email)
		c.Next()
	}
}

// Role-based authorization middleware
func RequireRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := GetAuthenticatedUser(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		for _, role := range allowedRoles {
			if user.Role == role {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{
			"error": fmt.Sprintf("Access denied. Required roles: %v", allowedRoles),
		})
		c.Abort()
	}
}

// Specific role middlewares for convenience
func RequireAdmin() gin.HandlerFunc {
	return RequireRole("admin")
}

func RequireStudent() gin.HandlerFunc {
	return RequireRole("student")
}

func RequireStudentOrAdmin() gin.HandlerFunc {
	return RequireRole("student", "admin")
}

// Extract token from Authorization header or cookie
func extractToken(c *gin.Context) string {
	authHeader := c.GetHeader("Authorization")
	if authHeader != "" {
		parts := strings.Split(authHeader, " ")
		if len(parts) == 2 && strings.ToLower(parts[0]) == "bearer" {
			return parts[1]
		}
	}

	cookie, err := c.Cookie("auth_token")
	if err == nil && cookie != "" {
		return cookie
	}

	return ""
}

// fetchUserByID retrieves the user from the database
func fetchUserByID(c *gin.Context, userRepo *repository.UserRepository, userID uint) (*models.User, error) {
	user, err := userRepo.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

// setUserInContext stores the authenticated user in Gin's context
func setUserInContext(c *gin.Context, user *models.User) {
	c.Set("user", user)
	c.Set("user_id", user.ID)
	c.Set("role", user.Role)
}

// Helper functions to get user info from context
func GetAuthenticatedUser(c *gin.Context) (*models.User, bool) {
	user, exists := c.Get("user")
	if !exists {
		return nil, false
	}
	userObj, ok := user.(*models.User)
	return userObj, ok
}

func GetAuthenticatedUserID(c *gin.Context) (uint, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, false
	}
	userIDUint, ok := userID.(uint)
	return userIDUint, ok
}

func GetAuthenticatedUserRole(c *gin.Context) (string, bool) {
	role, exists := c.Get("role")
	if !exists {
		return "", false
	}
	roleStr, ok := role.(string)
	return roleStr, ok
}