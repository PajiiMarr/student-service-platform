package handlers

import (
	"backend/auth"
	"backend/middleware"
	"backend/models"
	"backend/services"
	"backend/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserService *services.UserService
	AuthService *auth.AuthJWT
}

func (h *UserHandler) SignupUser(c *gin.Context) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	err := h.UserService.SignupUser(c.Request.Context(), &user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	token, err := h.AuthService.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": fmt.Sprintf("Failed to generate token: %v", err)})
		return
	}

	utils.SetAuthCookie(c.Writer, token)

	c.JSON(http.StatusCreated, gin.H{"user": user})
}

func (h *UserHandler) GetProfilingUser(c *gin.Context) {
	// Get authenticated user from context
	user, exists := middleware.GetAuthenticatedUser(c)

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":       user.ID,
			"email":    user.Email,
			"username": user.Username,
		},
	})
}

func (h *UserHandler) UpdateUserProfile(c *gin.Context) {
	user, exists := middleware.GetAuthenticatedUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var updateData models.User
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	updatedUser, err := h.UserService.UpdateUserProfile(c.Request.Context(), user.ID, &updateData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully", "user": updatedUser})
}
