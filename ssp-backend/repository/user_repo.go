package repository

import (
	"backend/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func (r *UserRepository) GetAllUsers() ([]models.User, error) {
    var users []models.User
    result := r.DB.Find(&users)
    return users, result.Error
}

func (r *UserRepository) CreateUser(user *models.User) error {
    return r.DB.Create(user).Error
}