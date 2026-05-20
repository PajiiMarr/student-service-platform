package repository

import (
	"context"
	"errors"
	"log"  // Add this import
	"backend/models"
	"gorm.io/gorm"
)

type StudentRepository struct {
	DB *gorm.DB
}

func (r *StudentRepository) GetStudentByUserID(ctx context.Context, userID uint) (*models.Student, error) {
	var student models.Student
	err := r.DB.WithContext(ctx).Where("user_id = ?", userID).First(&student).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &student, nil
}

func (r *StudentRepository) UpdateStudent(ctx context.Context, student *models.Student) error {
	return r.DB.WithContext(ctx).Save(student).Error
}

func (r *StudentRepository) CreateStudent(ctx context.Context, student *models.Student) error {
	return r.DB.WithContext(ctx).Create(student).Error
}

func (r *StudentRepository) UpdateOrCreateStudent(ctx context.Context, userID uint, courseID uint, yearLevel uint, section string) error {
	log.Printf("UpdateOrCreateStudent called - UserID: %d, CourseID: %d, YearLevel: %d, Section: %s", 
		userID, courseID, yearLevel, section)
	
	var student models.Student
	result := r.DB.WithContext(ctx).Where("user_id = ?", userID).First(&student)
	
	if result.Error == nil {
		log.Printf("Found existing student record with ID: %d, updating...", student.ID)
		// Update existing
		student.CourseID = courseID
		student.YearLevel = yearLevel
		student.Section = section
		err := r.DB.WithContext(ctx).Save(&student).Error
		if err != nil {
			log.Printf("Error updating student: %v", err)
			return err
		}
		log.Printf("Successfully updated student record")
		return nil
	}
	
	log.Printf("No existing student record found, creating new...")
	// Create new
	student = models.Student{
		UserID:    userID,
		CourseID:  courseID,
		YearLevel: yearLevel,
		Section:   section,
	}
	err := r.DB.WithContext(ctx).Create(&student).Error
	if err != nil {
		log.Printf("Error creating student: %v", err)
		return err
	}
	log.Printf("Successfully created student record with ID: %d", student.ID)
	return nil
}

func (r *StudentRepository) PostJob(ctx context.Context, job *models.Job) error {
	return r.DB.WithContext(ctx).Create(job).Error
}