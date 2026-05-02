// seeders/run.go
package seeders

import (
    "log"
    "gorm.io/gorm"
)

func Run(db *gorm.DB) {
    seeder := NewSeeder(db)
    
    log.Println("Starting database seeding...")
    
    if err := seeder.SeedCourses(); err != nil {
        log.Fatalf("Failed to seed courses: %v", err)
    }
    
    if err := seeder.SeedUsers(); err != nil {
        log.Fatalf("Failed to seed users: %v", err)
    }
    
    log.Println("Seeding completed successfully!")
}