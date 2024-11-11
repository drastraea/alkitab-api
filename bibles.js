const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Assuming JSON files are in a 'Files/Alkitab' directory
const versionsPath = path.join(__dirname, 'data', 'versions.json');
const booksPath = path.join(__dirname, 'data', 'books.json');
const chaptersPath = path.join(__dirname, 'data', 'chapters.json');

// Load JSON data with error handling
let versions, books, chapters;

try {
    versions = JSON.parse(fs.readFileSync(versionsPath, 'utf8'));
    books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
    chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
} catch (error) {
    console.error('Error loading JSON files:', error);
    app.use((req, res) => {
        res.status(500).json({ message: 'Failed to load data' });
    });
    return;
}

// Helper function to find the book code
const getBookCode = (bookName) => {
    for (let book of books) {
        if (
            book.name.toLowerCase() === bookName.toLowerCase() ||
            book.code.toLowerCase() === bookName.toLowerCase() ||
            book.code_en.toLowerCase() === bookName.toLowerCase() ||
            book.name_en.toLowerCase() === bookName.toLowerCase()
        ) {
            return book.code;
        }
    }
    return null;
};

// 0. API Documentation
app.get('/api/alkitab/v1/docs', (req, res) => {
    res.json({
        message: 'Welcome to the Alkitab API!',
        description: 'This API provides access to Bible data, including versions, books, chapters, and verses.',
        endpoints: {
            '/api/alkitab/v1/versions': {
                title: 'Get Available Bible Versions',
                method: 'GET',
                description: 'Fetch a list of available Bible versions.',
                sample_request: 'GET /api/alkitab/v1/versions',
                sample_response: [{ code: 'tb', name: 'Terjemahan Baru' }, { code: 'ayt', name: 'Alkitab Yang Terbuka (AYT)' }],
                error: false
            },
            '/api/alkitab/v1/books': {
                title: 'Get List of Books',
                method: 'GET',
                description: 'Fetch a list of books in the Bible.',
                sample_request: 'GET /api/alkitab/v1/books',
                sample_response: [{ name: 'Genesis', code: 'gen' }, { name: 'Exodus', code: 'exod' }],
                error: false
            },
            '/api/alkitab/v1/{bookName}/chapter': {
                title: 'Get Chapters for Book',
                method: 'GET',
                description: 'Fetch a list of chapter numbers for a specific book.',
                parameters: { bookName: 'The name of the book (e.g., "gen" for Genesis)' },
                sample_request: 'GET /api/alkitab/v1/gen/chapter',
                sample_response: [1, 2, 3],
                error: false
            },
            '/api/alkitab/v1/{version}/{bookName}/{chapter}/{verse}': {
                title: 'Get Verse Text',
                method: 'GET',
                description: 'Fetch the text of a specific verse from a specific version.',
                parameters: {
                    version: 'The Bible version code (e.g., "tb")',
                    bookName: 'The name of the book (e.g., "gen")',
                    chapter: 'The chapter number',
                    verse: 'The verse number'
                },
                sample_request: 'GET /api/alkitab/v1/tb/gen/1/1',
                sample_response: { verse: 'In the beginning, God created the heavens and the earth.' },
                error: false
            }
        }
    });
});

// 1. Get Versions
app.get('/api/alkitab/v1/versions', (req, res) => {
    res.json(versions);
});

// 2. Get Books
app.get('/api/alkitab/v1/books', (req, res) => {
    const bookNames = books.map(book => ({
        name: book.name,
        name_en: book.name_en,
        code: book.code,
        code_en: book.code_en
    }));
    res.json(bookNames);
});

// 3. Get Chapters for a Book
app.get('/api/alkitab/v1/:bookName/chapter', (req, res) => {
    const { bookName } = req.params;

    // Find the correct book code
    const bookCode = getBookCode(bookName);
    if (!bookCode) {
        return res.status(404).json({ error: 'Book not found' });
    }

    if (!chapters[bookCode]) {
        return res.status(404).json({ error: 'Chapters not found for this book' });
    }

    const chaptersList = chapters[bookCode].map(chapter => ({ chapter }));
    res.json(chaptersList);
});

// 4. Get Verses from a Chapter
app.get('/api/alkitab/v1/:version/:bookName/:chapter/:startVerse/:endVerse?', (req, res) => {
    const { version, bookName, chapter, startVerse, endVerse } = req.params;

    // Ensure startVerse and endVerse are integers
    if (!version || !bookName || !chapter || !startVerse) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    const bookCode = getBookCode(bookName);
    if (!bookCode) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const filePath = path.join(__dirname, 'Files', 'Alkitab', 'Verses', version, bookCode, `${chapter}.json`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Chapter not found' });
    }

    const versesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Default to single verse if endVerse is not provided
    const end = endVerse || startVerse;
    const selectedVerses = versesData.verses.filter(verse => verse.verse_number >= startVerse && verse.verse_number <= end);

    if (selectedVerses.length === 0) {
        return res.status(404).json({ error: 'No verses found' });
    }

    res.json(selectedVerses.map(verse => ({
        verse_number: verse.verse_number,
        verse_text: verse.verse_text
    })));
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
