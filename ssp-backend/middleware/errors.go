package middleware

import "errors"

// Authentication errors
var (
	ErrMissingAuthHeader       = errors.New("authorization header is required")
	ErrInvalidAuthHeaderFormat = errors.New("invalid authorization header format. Use: Bearer <token>")
	ErrInvalidSigningMethod    = errors.New("invalid signing method")
	ErrInvalidOrExpiredToken   = errors.New("invalid or expired token")
	ErrInvalidTokenClaims      = errors.New("invalid token claims")
	ErrUserIDMissingInClaims   = errors.New("user_id missing in token claims")
	ErrInvalidUserIDType       = errors.New("invalid user_id type in claims")
	ErrUserNotFound            = errors.New("user not found")
)