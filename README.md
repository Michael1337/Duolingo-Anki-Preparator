# Duolingo Course Word Extractor & Audio Generator

This project automates the extraction of all words from a Duolingo course and generates corresponding audio files for each word. The generated audio files can be easily imported into Anki for enhanced language learning.

## Features

- Extracts all vocabulary words from a specified Duolingo course (that you already learned) using Tamper Monkey.
- Generates audio files for each word using the Python script.
- Provides files in a format compatible with Anki import, i.e. .mp3 and .csv.

## Usage

1. Use Google Chrome.
2. Import the .js script in Tamper Monkey.
3. Go to https://www.duolingo.com/practice-hub/words.
4. Press F12 and go to Network tab.
5. Check "Disable cache" and "Media".
6. Left-click anywhere on the webpage.
7. Wait for the download dialog. This may take a minute depending on how many words you have unlocked.
8. Safe words.csv.
9. In the Network tab, on the top-right click the download icon and download as "network.har".
10. Safe the file to where the Python script is located.
11. Run the Python script.
12. Take the columns from the two generated csv files and add them to the words.csv.
13. Place the mp3 files in the Anki collection.media folder (https://docs.ankiweb.net/importing/text-files.html#importing-media).
14. Import the words.csv into Anki.

## Requirements

- Python (or your preferred runtime, depending on implementation)
- Internet connection for accessing Duolingo and generating audio

## License

See `LICENSE` for details.