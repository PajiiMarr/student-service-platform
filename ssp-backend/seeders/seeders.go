// seeders/seeder.go
package seeders

import (
    "log"
    
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
    
    "backend/models"
)

type Seeder struct {
    DB *gorm.DB
}

func NewSeeder(db *gorm.DB) *Seeder {
    return &Seeder{DB: db}
}

func (s *Seeder) SeedUsers() error {
    users := []struct {
        User      models.User
        IsAdmin   bool
        IsStudent bool
        StudentDetails struct {
            YearLevel uint
            Section   string
            CourseID  uint
        }
    }{
        {
            User: models.User{
                Username:  "admin-ssp",
                Email:     "admin-ssp@email.com",
                Password:  "ssp-password",
                FirstName: "Admin",
                LastName:  "User",
                Birthday:  "1990-01-01",
                Street:    "Admin Street",
                Barangay:  "Admin Barangay",
                City:      "Admin City",
                Role:      "admin",
            },
            IsAdmin: true,
        },
        {
            User: models.User{
                Username:  "john-student",
                Email:     "john@example.com",
                Password:  "password123",
                FirstName: "John",
                LastName:  "Doe",
                Birthday:  "2000-05-15",
                Street:    "123 Main St",
                Barangay:  "Barangay 1",
                City:      "Manila",
                Role:      "student",
            },
            IsStudent: true,
            StudentDetails: struct {
                YearLevel uint
                Section   string
                CourseID  uint
            }{
                YearLevel: 3,
                Section:   "A",
                CourseID:  1, // BS Computer Science
            },
        },
        {
            User: models.User{
                Username:  "jane-student",
                Email:     "jane@example.com",
                Password:  "password123",
                FirstName: "Jane",
                LastName:  "Smith",
                Birthday:  "2001-08-20",
                Street:    "456 Oak Ave",
                Barangay:  "Barangay 2",
                City:      "Quezon City",
                Role:      "student",
            },
            IsStudent: true,
            StudentDetails: struct {
                YearLevel uint
                Section   string
                CourseID  uint
            }{
                YearLevel: 2,
                Section:   "B",
                CourseID:  2, // BS Information Technology
            },
        },
    }

    for _, userData := range users {
        // Hash password
        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userData.User.Password), bcrypt.DefaultCost)
        if err != nil {
            return err
        }
        userData.User.Password = string(hashedPassword)

        // Check if user already exists
        var existingUser models.User
        result := s.DB.Where("email = ?", userData.User.Email).First(&existingUser)
        
        if result.Error == gorm.ErrRecordNotFound {
            // Create user
            if err := s.DB.Create(&userData.User).Error; err != nil {
                return err
            }
            log.Printf("Created user: %s (%s)", userData.User.Email, userData.User.Role)

            // Create associated records based on role
            if userData.IsAdmin {
                admin := models.Admin{
                    UserID: userData.User.ID,
                }
                if err := s.DB.Create(&admin).Error; err != nil {
                    log.Printf("Warning: Failed to create admin record for %s: %v", userData.User.Email, err)
                } else {
                    log.Printf("Created admin record for: %s", userData.User.Email)
                }
            }

            if userData.IsStudent {
                student := models.Student{
                    UserID:    userData.User.ID,
                    YearLevel: userData.StudentDetails.YearLevel,
                    Section:   userData.StudentDetails.Section,
                    CourseID:  userData.StudentDetails.CourseID,
                }
                if err := s.DB.Create(&student).Error; err != nil {
                    log.Printf("Warning: Failed to create student record for %s: %v", userData.User.Email, err)
                } else {
                    log.Printf("Created student record for: %s (Year: %d, Section: %s, CourseID: %d)", 
                        userData.User.Email, 
                        student.YearLevel, 
                        student.Section, 
                        student.CourseID)
                }
            }
        } else {
            log.Printf("User already exists: %s", userData.User.Email)
        }
    }
    
    return nil
}

// Optional: Seed courses and colleges first
func (s *Seeder) SeedCourses() error {
    // Seed colleges
    colleges := []models.College{
        {Name: "College of Computing Studies"},
        {Name: "College of Engineering"},
        {Name: "College of Liberal Arts"},
    }
    
    for _, college := range colleges {
        var existing models.College
        result := s.DB.Where("name = ?", college.Name).First(&existing)
        if result.Error == gorm.ErrRecordNotFound {
            if err := s.DB.Create(&college).Error; err != nil {
                return err
            }
            log.Printf("Created college: %s", college.Name)
        }
    }
    
    // Seed courses
    courses := []models.Course{
        {Name: "Bachelor of Science in Computer Science", CollegeID: 1},
        {Name: "Bachelor of Science in Information Technology", CollegeID: 1},
        {Name: "Bachelor of Science in Computer Engineering", CollegeID: 2},
        {Name: "Bachelor of Science in Political Science", CollegeID: 3},
    }
    
    for _, course := range courses {
        var existing models.Course
        result := s.DB.Where("name = ?", course.Name).First(&existing)
        if result.Error == gorm.ErrRecordNotFound {
            if err := s.DB.Create(&course).Error; err != nil {
                return err
            }
            log.Printf("Created course: %s", course.Name)
        }
    }
    
    return nil
}

