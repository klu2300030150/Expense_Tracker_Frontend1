# API usage snippets

## Get user details by email (secured)

Endpoint: `GET /api/auth/me?email=<userEmail>`

Headers:
- `Authorization: Bearer <JWT token from login/signup>`

Response:
```
{
  "id": 1,
  "fullName": "Test User",
  "email": "test@test.com",
  "phoneNumber": "1234567890",
  "currency": "USD"
}
```

Example (PowerShell):
```
$token = "<paste JWT>"
Invoke-RestMethod -Uri "http://localhost:8081/api/auth/me?email=test@test.com" -Headers @{ Authorization = "Bearer $token" }
```
