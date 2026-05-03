package services

import (
	"backend/models"
	"backend/repository"
	"context"
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// Define the struct type outside the method
type UpdateUserProfileData struct {
	FirstName  string
	MiddleName string
	LastName   string
	Birthday   string
	Street     string
	Barangay   string
	City       string
	CollegeID  uint
	CourseID   uint
	YearLevel  uint
	Section    string
}

type UserService struct {
	UserRepo    *repository.UserRepository
	StudentRepo *repository.StudentRepository
}

func (s *UserService) GetUsers() ([]models.User, error) {
	return s.UserRepo.GetAllUsers()
}

func (s *UserService) AuthenticateUser(ctx context.Context, username, password string) (*models.User, error) {
	// Find user by username or email
	user, err := s.UserRepo.GetUserByUsernameOrEmail(ctx, username)
	if err != nil {
		return nil, errors.New("user not found")
	}

	// Compare password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.New("invalid password")
	}

	return user, nil
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

func (s *UserService) UpdateUserProfile(ctx context.Context, userID uint, updateData *UpdateUserProfileData) (*models.User, error) {
	
	// Get user
	user, err := s.UserRepo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	// Update user fields
	if updateData.FirstName != "" {
		user.FirstName = updateData.FirstName
	}
	if updateData.MiddleName != "" {
		user.MiddleName = updateData.MiddleName
	}
	if updateData.LastName != "" {
		user.LastName = updateData.LastName
	}
	if updateData.Birthday != "" {
		user.Birthday = updateData.Birthday
	}
	if updateData.Street != "" {
		user.Street = updateData.Street
	}
	if updateData.Barangay != "" {
		user.Barangay = updateData.Barangay
	}
	if updateData.City != "" {
		user.City = updateData.City
	}

	// Update user
	if err := s.UserRepo.UpdateUser(ctx, user); err != nil {
		return nil, err
	}

	// Check if StudentRepo is nil
	if s.StudentRepo == nil {
		return nil, errors.New("StudentRepo is not initialized in UserService")
	}

	// Log the data being saved
	fmt.Printf("Attempting to save student record - UserID: %d, CourseID: %d, YearLevel: %d, Section: %s\n", 
		userID, updateData.CourseID, updateData.YearLevel, updateData.Section)

	// Update or create student
	if err := s.StudentRepo.UpdateOrCreateStudent(ctx, userID, updateData.CourseID, updateData.YearLevel, updateData.Section); err != nil {
		return nil, errors.New("failed to save student record: " + err.Error())
	}

	fmt.Println("Student record saved successfully")

	return user, nil
}

func (s *UserService) GetCollegesAndCourses(ctx context.Context) ([]models.College, error) {
	colleges, err := s.UserRepo.GetCollegesAndCourses(ctx)
	if err != nil {
		return nil, err
	}
	return colleges, nil
}