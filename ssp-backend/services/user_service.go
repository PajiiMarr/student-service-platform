package services

import (
	"backend/models"
	"backend/repository"
	"fmt"
)

type UserService struct {
	UserRepo *repository.UserRepository
}

func (s *UserService) GetUsers() ([]models.User, error) {
    return s.UserRepo.GetAllUsers()
}

func (s *UserService) CreateUser(user *models.User) error {
    if user.Email == "" {
        return fmt.Errorf("email is required")
    }

    return s.UserRepo.CreateUser(user)
}