package handlers

import (
	"backend/auth"
	"backend/middleware"
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type StudentHandler struct {
	StudentService *services.StudentService
	AuthService    *auth.AuthJWT
}

func (h *StudentHandler) PostJob(c *gin.Context) {
	var job models.Job

	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	// Get authenticated user ID from context (set by AuthMiddleware)
	userID, exists := middleware.GetAuthenticatedUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	// Fetch the student record for this user
	student, err := h.StudentService.GetStudentByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to retrieve student record"})
		return
	}
	if student == nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Student profile not found. Please complete your student profile first."})
		return
	}

	// Set the correct StudentID (Student model's primary key)
	job.StudentID = student.ID
	// You might also want to set a default status if not provided
	if job.Status == "" {
		job.Status = "open"
	}

	err = h.StudentService.PostJob(c.Request.Context(), &job)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Job Post created successfully",
		"job":     job,
	})
}