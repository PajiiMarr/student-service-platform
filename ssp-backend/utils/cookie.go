package utils

import (
    "net/http"
)

func SetAuthCookie(w http.ResponseWriter, token string) {
    http.SetCookie(w, &http.Cookie{
        Name:     "auth_token",
        Value:    token,
        Path:     "/",
        HttpOnly: true,
        SameSite: http.SameSiteLaxMode, // SameSiteNoneMode if cross-origin + Secure
        // Secure: true,               // enable in production (HTTPS)
        MaxAge:   86400,               // 24 hours
    })
}