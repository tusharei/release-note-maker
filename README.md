# Release Note Maker

A modern, web-based tool for creating professional release notes with rich text formatting, auto-save functionality, and AI-powered text beautification.

## Features

- **Rich Text Editor**: Format your release notes with bold, italic, colors, headings, and lists using Quill editor
- **Auto-Save**: Your work is automatically saved to localStorage - no data loss on page refresh
- **AI Text Beautification**: Use Gemini AI to improve your technical descriptions
- **Word Export**: Generate professionally formatted .docx files with all your formatting preserved
- **Template-Based**: Uses a DOCX template for consistent styling
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Tech Stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- Quill Rich Text Editor

### Backend
- Spring Boot
- Apache POI (for Word document generation)
- JSoup (for HTML parsing)
- Gemini AI API (for text beautification)

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd release-note-maker
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   # Configure your Gemini API key in application.properties
   mvn spring-boot:run
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

### Environment Variables

Create a `.env` file in the backend directory:
```properties
GEMINI_API_KEY=your_api_key_here
```

## Project Structure

```
release-note-maker/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript types
│   │   └── styles/           # CSS styles
│   └── package.json
├── backend/                  # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/         # Java source files
│   │       └── resources/    # Templates and config
│   └── pom.xml
└── README.md
```

## Usage

1. Fill in the release details (version, date, client name, etc.)
2. Add functional and technical descriptions using the rich text editor
3. Optionally use the "Beautify" button to improve text with AI
4. Add implementation plan details
5. Click "Download Release Note" to export as Word document

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for any purpose.

## Author

Tushar Sharma - 2461
Sarvatra Technologies

---

