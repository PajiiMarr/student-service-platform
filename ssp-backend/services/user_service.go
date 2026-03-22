package services

import (
	"backend/models"
	"backend/repository"
	"context"
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	UserRepo *repository.UserRepository
}

func (s *UserService) GetUsers() ([]models.User, error) {
	return s.UserRepo.GetAllUsers()
}

func (s *UserService) SignupUser(ctx context.Context, user *models.User) error {
	existing, err := s.UserRepo.GetUserByEmail(ctx, user.Email)
	if err != nil && existing.ID != 0 {
		return fmt.Errorf("Email already in use")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashed)


	return s.UserRepo.SignupUser(ctx, user)
}