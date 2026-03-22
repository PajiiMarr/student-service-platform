package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username       string `json:"username"`
	Email      string `json:"email" gorm:"unique"`
	Password   string `json:"password"`
	FirstName  string `json:"first_name"`
	MiddleName string `json:"middle_name"`
	LastName   string `json:"last_name"`
	Birthday   string `json:"birthday"`
	Street     string `json:"street"`
	Barangay   string `json:"barangay"`
	City       string `json:"city"`

	Medias []Media `gorm:"polymorphic:Owner;"`
}

type Admin struct {
	gorm.Model
	UserID uint
	User   User `gorm:"foreignKey:UserID"`
}

type Student struct {
	gorm.Model
	UserID uint
	User   User `gorm:"foreignKey:UserID"`

	CourseID uint
	Course   Course `gorm:"foreignKey:CourseID"`
}

type Course struct {
	gorm.Model
	Name string

	CollegeID uint
	College   College `gorm:"foreignKey:CollegeID"`
}

type College struct {
	gorm.Model
	Name string
}

type Job struct {
	gorm.Model
	StudentID uint
	Student   Student `gorm:"foreignKey:StudentID"`

	Title       string  `json:"title"`
	Description string  `json:"description"`
	AmountOffer float64 `json:"amount_offer"`
	Status      string  `json:"status"`
}

type Application struct {
	gorm.Model
	JobID uint
	Job   Job `gorm:"foreignKey:JobID"`

	StudentID uint
	Student   Student `gorm:"foreignKey:StudentID"`

	Status string `json:"status"`
}

type Message struct {
	gorm.Model
	SenderID   uint
	ReceiverID uint
	Content    string
}

type Notification struct {
	gorm.Model
	UserID uint
	User   User `gorm:"foreignKey:UserID"`

	Content string
	Read    bool
}

type Wallet struct {
	gorm.Model
	UserID uint
	User   User `gorm:"foreignKey:UserID"`

	Balance float64
}

type Transaction struct {
	gorm.Model
	WalletID uint
	Wallet   Wallet `gorm:"foreignKey:WalletID"`

	Amount float64
	Type   string // deposit, withdrawal, payment
}

type Withdrawal struct {
	gorm.Model
	WalletID uint
	Wallet   Wallet `gorm:"foreignKey:WalletID"`

	Amount         float64
	Status         string  // pending, approved, rejected
	TransactionFee float64

	Medias []Media `gorm:"polymorphic:Owner;"`
}

type Media struct {
	gorm.Model
	OwnerID   uint
	OwnerType string

	FilePath string `json:"file_path"`
	Type     string `json:"type"` // profile, receipt, etc.
}