package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"backend/models"
	"backend/services"
)

type UserHandler struct {
	UserService *services.UserService
}

func (h *UserHandler) GetUsers(c *gin.Context) {
    users, err := h.UserService.GetUsers()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, users)
}


func (h *UserHandler) CreateUser(c *gin.Context) {
    var user models.User

    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    err := h.UserService.CreateUser(&user)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, user)
}