package handlers

import (
	"backend/auth"
	"backend/middleware"
	"backend/models"
	"backend/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserService *services.UserService
	AuthService *auth.AuthJWT
}

func (h *UserHandler) SigninUser(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
		return
	}

	user, err := h.UserService.AuthenticateUser(c.Request.Context(), credentials.Email, credentials.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Generate both tokens
	accessToken, err := h.AuthService.GenerateAccessToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}

	refreshToken, err := h.AuthService.GenerateRefreshToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	// Set access token cookie
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("auth_token", accessToken, 900, "/", "", false, true)

	// Set refresh token cookie
	c.SetCookie("refresh_token", refreshToken, 604800, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
			"role":     user.Role,
		},
		"token": accessToken,
	})
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

	// Generate both tokens for signup too
	accessToken, err := h.AuthService.GenerateAccessToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": fmt.Sprintf("Failed to generate access token: %v", err)})
		return
	}

	refreshToken, err := h.AuthService.GenerateRefreshToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": fmt.Sprintf("Failed to generate refresh token: %v", err)})
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("auth_token", accessToken, 900, "/", "", false, true)
	c.SetCookie("refresh_token", refreshToken, 604800, "/", "", false, true)

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user": gin.H{
			"id":       user.ID,
			"email":    user.Email,
			"username": user.Username,
			"role":     user.Role,
		},
	})
}

func (h *UserHandler) LogoutUser(c *gin.Context) {
	c.SetCookie("auth_token", "", -1, "/", "", false, true)
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func (h *UserHandler) RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No refresh token"})
		return
	}

	claims, err := h.AuthService.ValidateJWT(refreshToken)
	if err != nil || claims.Type != "refresh" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	// Generate new access token
	newAccessToken, err := h.AuthService.GenerateAccessToken(claims.UserID, claims.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to refresh token"})
		return
	}

	// Generate new refresh token (rolling refresh)
	newRefreshToken, err := h.AuthService.GenerateRefreshToken(claims.UserID, claims.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to refresh token"})
		return
	}

	// Set new access token cookie
	c.SetCookie("auth_token", newAccessToken, 900, "/", "", false, true)

	// Set new refresh token cookie (extends the session)
	c.SetCookie("refresh_token", newRefreshToken, 604800, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "Token refreshed"})
}

func (h *UserHandler) GetProfilingUser(c *gin.Context) {
	user, exists := middleware.GetAuthenticatedUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"username":   user.Username,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"birthday":   user.Birthday,
			"role":       user.Role,
		},
	})
}

func (h *UserHandler) UpdateUserProfile(c *gin.Context) {
	user, exists := middleware.GetAuthenticatedUser(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var updateData struct {
		FirstName  string `json:"first_name"`
		MiddleName string `json:"middle_name"`
		LastName   string `json:"last_name"`
		Birthday   string `json:"birthday"`
		Street     string `json:"street"`
		Barangay   string `json:"barangay"`
		City       string `json:"city"`
		CollegeID  uint   `json:"college_id"`
		CourseID   uint   `json:"course_id"`
		YearLevel  uint   `json:"year_level"`
		Section    string `json:"section"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	fmt.Printf("Received data - UserID: %d, CollegeID: %d, CourseID: %d, YearLevel: %d, Section: %s\n",
		user.ID, updateData.CollegeID, updateData.CourseID, updateData.YearLevel, updateData.Section)

	serviceData := &services.UpdateUserProfileData{
		FirstName:  updateData.FirstName,
		MiddleName: updateData.MiddleName,
		LastName:   updateData.LastName,
		Birthday:   updateData.Birthday,
		Street:     updateData.Street,
		Barangay:   updateData.Barangay,
		City:       updateData.City,
		CollegeID:  updateData.CollegeID,
		CourseID:   updateData.CourseID,
		YearLevel:  updateData.YearLevel,
		Section:    updateData.Section,
	}

	updatedUser, err := h.UserService.UpdateUserProfile(c.Request.Context(), user.ID, serviceData)
	if err != nil {
		fmt.Printf("Error updating profile: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully", "user": updatedUser})
}

func (h *UserHandler) GetCollegesAndCourses(c *gin.Context) {
	colleges, err := h.UserService.GetCollegesAndCourses(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve colleges and courses: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"colleges": colleges})
}
