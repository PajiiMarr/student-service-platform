package services

import (
	"backend/models"
	"backend/repository"
	"context"
	"errors"
)

type StudentService struct {
	StudentRepo *repository.StudentRepository
}

func (s *StudentService) PostJob(ctx context.Context, job *models.Job) error {
	// Validate input
	if job == nil {
		return errors.New("job cannot be nil")
	}
	if job.StudentID == 0 {
		return errors.New("student ID is required")
	}
	if job.Title == "" {
		return errors.New("job title is required")
	}
	if job.Description == "" {
		return errors.New("job description is required")
	}

	return s.StudentRepo.PostJob(ctx, job)
}

// In services/student_service.go
func (s *StudentService) GetStudentByUserID(ctx context.Context, userID uint) (*models.Student, error) {
	return s.StudentRepo.GetStudentByUserID(ctx, userID)
}


func (s *StudentService) GetAllJobs(ctx context.Context) ([]models.Job, error) {
	return s.StudentRepo.GetAllJobs(ctx)
}

func (s *StudentService) GetJobByID(ctx context.Context, jobID string) (*models.Job, error) {
	return s.StudentRepo.GetJobByID(ctx, jobID)
}

func (s *StudentService) GetStudentProfileByID(ctx context.Context, studentID uint) (*models.Student, error) {
	return s.StudentRepo.GetStudentProfileByID(ctx, studentID)
}