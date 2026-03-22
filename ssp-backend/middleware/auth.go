package middleware

import (
	"backend/auth"
	"backend/models"
	"backend/repository"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware creates the authentication middleware
func AuthMiddleware(authJwt *auth.AuthJWT, userRepo *repository.UserRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Step 1: Extract token from header
		tokenString, err := extractBearerToken(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Step 2: Parse and validate JWT
		claims, err := parseAndValidateJWT(tokenString, authJwt)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Step 3: Extract user ID from claims
		userID, err := extractUserIDFromClaims(claims)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Step 4: Fetch user from database
		user, err := fetchUserByID(c, userRepo, userID) // Pass 'c' directly, not c.Request.Context()
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Step 5: Set user in context and continue
		setUserInContext(c, user)
		c.Next()
	}
}

// extractBearerToken extracts the token from the Authorization header
func extractBearerToken(c *gin.Context) (string, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return "", ErrMissingAuthHeader
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return "", ErrInvalidAuthHeaderFormat
	}

	return parts[1], nil
}

// parseAndValidateJWT parses and validates the JWT token
func parseAndValidateJWT(tokenString string, authJwt *auth.AuthJWT) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrInvalidSigningMethod
		}
		return authJwt.JWTSecret, nil
	})

	if err != nil {
		return nil, ErrInvalidOrExpiredToken
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, ErrInvalidTokenClaims
	}

	return claims, nil
}

// extractUserIDFromClaims extracts the user ID from JWT claims
func extractUserIDFromClaims(claims jwt.MapClaims) (uint, error) {
	userIDRaw, exists := claims["user_id"]
	if !exists {
		return 0, ErrUserIDMissingInClaims
	}

	// Handle both float64 (from JSON) and int types
	switch v := userIDRaw.(type) {
	case float64:
		return uint(v), nil
	case int:
		return uint(v), nil
	case int64:
		return uint(v), nil
	case uint:
		return v, nil
	default:
		return 0, ErrInvalidUserIDType
	}
}

// fetchUserByID retrieves the user from the database
func fetchUserByID(c *gin.Context, userRepo *repository.UserRepository, userID uint) (*models.User, error) {
	user, err := userRepo.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		return nil, ErrUserNotFound
	}
	return user, nil
}

// setUserInContext stores the authenticated user in Gin's context
func setUserInContext(c *gin.Context, user *models.User) {
	c.Set("user", user)
	c.Set("user_id", user.ID)
}

// Helper function to get authenticated user from context
func GetAuthenticatedUser(c *gin.Context) (*models.User, bool) {
	user, exists := c.Get("user")
	if !exists {
		return nil, false
	}
	userObj, ok := user.(*models.User)
	return userObj, ok
}

// Helper function to get authenticated user ID from context
func GetAuthenticatedUserID(c *gin.Context) (uint, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, false
	}
	userIDUint, ok := userID.(uint)
	return userIDUint, ok
}
