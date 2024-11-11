# Alkitab API - Bible Data API

This API provides access to Bible data, including versions, books, chapters, and verses. You can fetch information about available Bible versions, books in the Bible, chapters for each book, and the text of specific verses from any version.

## Features

- **Get Available Bible Versions**: Retrieve a list of all available Bible versions.
- **Get List of Books**: Fetch a list of books in the Bible along with their names and codes (in local and English languages).
- **Get Chapters for a Book**: Get a list of chapters for a specified book.
- **Get Verse Text**: Retrieve the text of a specific verse from a given version, book, and chapter.

## API Endpoints

### 1. Get Available Bible Versions
- **URL**: `/api/alkitab/v1/versions`
- **Method**: `GET`
- **Response Example**:
  ```json
  [
    { "code": "tb", "name": "Terjemahan Baru" },
    { "code": "ayt", "name": "Alkitab Yang Terbuka (AYT)" }
  ]
  ```
### 2. Get List of Books
- **URL**: `/api/alkitab/v1/books`
- **Method**: `GET`
- **Response Example**:
```json
[
  { "name": "Genesis", "code": "gen", "name_en": "Genesis", "code_en": "gen" },
  { "name": "Exodus", "code": "exod", "name_en": "Exodus", "code_en": "exod" }
]
```
### 3. Get Chapters for a Book
- **URL**: `/api/alkitab/v1/{bookName}/chapter`
- **Method**: `GET`
- **Path Parameter**: bookName (e.g., "gen" for Genesis)
Response Example:
```json
[ 1, 2, 3, 4 ]
```
### 4. Get Verse Text
- **URL**: `/api/alkitab/v1/{version}/{bookName}/{chapter}/{verse}`
- **Method**: `GET`
- **Path Parameters**:
`version` (e.g., "tb" for Terjemahan Baru)
`bookName` (e.g., "gen" for Genesis)
`chapter` (e.g., 1)
`verse` (e.g., 1)
Response Example:
```json
{ "verse": "In the beginning, God created the heavens and the earth." }
```
Requirements
- Node.js (>= 12.x)
- Express.js
- File system access to Bible data files (JSON)

## Installation
Clone the repository:
```bash
git clone https://github.com/your-username/alkitab-api.git
cd alkitab-api
```

### Install dependencies:

```bash
npm install
Start the server:
```
```bash
npm start
The server will start on http://localhost:3000.
```

### Error Handling
- 404 Not Found: If a resource (e.g., book, chapter, or verse) is not found.
- 400 Bad Request: If required parameters are missing or invalid.
### License
This project is licensed under the MIT License - see the LICENSE file for details.
