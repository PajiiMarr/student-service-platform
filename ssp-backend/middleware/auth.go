package middleware

import (
    "backend/auth"
    "backend/models"
    "backend/repository"
    "fmt"
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware creates the authentication middleware
func AuthMiddleware(authJwt *auth.AuthJWT, userRepo *repository.UserRepository) gin.HandlerFunc {
    return func(c *gin.Context) {
        // Extract token from Authorization header or cookie
        tokenString := extractToken(c)
        
        // Debug log
        fmt.Println("=== Auth Debug ===")
        fmt.Println("Token found:", tokenString != "")
        
        if tokenString == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication token is required"})
            c.Abort()
            return
        }

        // Parse and validate JWT
        claims, err := parseAndValidateJWT(tokenString, authJwt)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
            c.Abort()
            return
        }

        // Extract user ID from claims
        userID, err := extractUserIDFromClaims(claims)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
            c.Abort()
            return
        }

        // Fetch user from database
        user, err := fetchUserByID(c, userRepo, userID)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
            c.Abort()
            return
        }

        // Set user in context and continue
        setUserInContext(c, user)
        c.Next()
    }
}

// extractToken extracts the token from Authorization header or cookie
func extractToken(c *gin.Context) string {
    // First try to get token from Authorization header
    authHeader := c.GetHeader("Authorization")
    if authHeader != "" {
        parts := strings.Split(authHeader, " ")
        if len(parts) == 2 && strings.ToLower(parts[0]) == "bearer" {
            return parts[1]
        }
    }
    
    // If no token in header, try to get from cookie
    cookie, err := c.Cookie("auth_token")
    if err == nil && cookie != "" {
        fmt.Println("Found token in cookie")
        return cookie
    }
    
    return ""
}

// parseAndValidateJWT parses and validates the JWT token
func parseAndValidateJWT(tokenString string, authJwt *auth.AuthJWT) (jwt.MapClaims, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        return authJwt.JWTSecret, nil
    })

    if err != nil {
        return nil, fmt.Errorf("invalid or expired token: %v", err)
    }

    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok || !token.Valid {
        return nil, fmt.Errorf("invalid token claims")
    }

    return claims, nil
}

// extractUserIDFromClaims extracts the user ID from JWT claims
func extractUserIDFromClaims(claims jwt.MapClaims) (uint, error) {
    userIDRaw, exists := claims["user_id"]
    if !exists {
        return 0, fmt.Errorf("user_id missing in token claims")
    }

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
        return 0, fmt.Errorf("invalid user_id type in claims")
    }
}

// fetchUserByID retrieves the user from the database
func fetchUserByID(c *gin.Context, userRepo *repository.UserRepository, userID uint) (*models.User, error) {
    user, err := userRepo.GetUserByID(c.Request.Context(), userID)
    if err != nil {
        return nil, fmt.Errorf("user not found")
    }
    return user, nil
}

// setUserInContext stores the authenticated user in Gin's context
func setUserInContext(c *gin.Context, user *models.User) {
    c.Set("user", user)
    c.Set("user_id", user.ID)
}

// GetAuthenticatedUser retrieves the authenticated user from context
func GetAuthenticatedUser(c *gin.Context) (*models.User, bool) {
    user, exists := c.Get("user")
    if !exists {
        return nil, false
    }
    userObj, ok := user.(*models.User)
    return userObj, ok
}

// GetAuthenticatedUserID retrieves the authenticated user ID from context
func GetAuthenticatedUserID(c *gin.Context) (uint, bool) {
    userID, exists := c.Get("user_id")
    if !exists {
        return 0, false
    }
    userIDUint, ok := userID.(uint)
    return userIDUint, ok
}