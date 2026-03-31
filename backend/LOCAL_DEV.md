# Local Development - How to Set API Key

## Option 1: Environment Variable (Recommended for Local Dev)

```bash
# Linux/Mac - Run this before starting the app:
export GEMINI_API_KEY=your_actual_api_key

# Then start the app:
cd backend && mvn spring-boot:run
```

Or add this to your IDE run configuration:
```
GEMINI_API_KEY=your_actual_api_key
```

## Option 2: Docker Compose (Production-like)

1. Create a `.env` file in the project root:
```bash
GEMINI_API_KEY=your_actual_api_key
```

2. Run with Docker:
```bash
docker-compose up --build
```

## Option 3: Hardcode (Not Recommended for Git)

If you want to hardcode for quick testing, edit `application.properties`:
```properties
gemini.api.key=your_actual_api_key_here
```

---

## How to Get Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and use it

---

## Note

For GitHub, we keep the `.env` files in `.gitignore` to protect your API key.
The code uses `${GEMINI_API_KEY:}` which means:
- Uses `GEMINI_API_KEY` env variable if set
- Uses empty string if not set (app works but beautify feature won't work)
