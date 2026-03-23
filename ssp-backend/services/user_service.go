package services

import (
	"backend/models"
	"backend/repository"
	"context"
	"errors"
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

func (s *UserService) UpdateUserProfile(ctx context.Context, userID uint, updateData interface{}) (*models.User, error) {
	// Get existing user
	user, err := s.UserRepo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	// Type assertion to get the struct
	data, ok := updateData.(*struct {
		FirstName  string
		MiddleName string
		LastName   string
		Birthday   string
		Street     string
		Barangay   string
		City       string
	})
	if !ok {
		return nil, errors.New("invalid update data")
	}

	// Update fields if provided
	if data.FirstName != "" {
		user.FirstName = data.FirstName
	}
	if data.MiddleName != "" {
		user.MiddleName = data.MiddleName
	}
	if data.LastName != "" {
		user.LastName = data.LastName
	}
	if data.Birthday != "" {
		user.Birthday = data.Birthday
	}
	if data.Street != "" {
		user.Street = data.Street
	}
	if data.Barangay != "" {
		user.Barangay = data.Barangay
	}
	if data.City != "" {
		user.City = data.City
	}

	// Save updated user
	err = s.UserRepo.UpdateUser(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}