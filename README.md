# Duolingo Course Word Extractor & Audio Generator

This project automates the extraction of all words from a Duolingo course and generates corresponding audio files for each word. The generated audio files can be easily imported into Anki for enhanced language learning.

## Features

- Extracts all vocabulary words from a specified Duolingo course (that you already learned) using Tamper Monkey.
- Generates audio files for each word using the Python script.
- Provides files in a format compatible with Anki import, i.e. .mp3 and .csv.

## Usage

1. Use Google Chrome.
2. Import the `userscript.js` script in [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
3. Go to https://www.duolingo.com/practice-hub/words.
4. Press F12 and go to Network tab.
5. Check "Disable cache" and "Media".<br>
![Check boxes in Google Chrome](screenshots/chrome.jpg)
6. With the userscript active, left-click anywhere on the webpage.
7. Wait for the download dialog for the `words.csv`. This may take a minute depending on how many words you have unlocked.
8. Safe `words.csv` to this directory next to the `createAudio.py`.
9. In the Network tab, on the top-right click the download icon and download as "network.har".<br>
![Download network.har](screenshots/download.jpg)
10. Safe `network.har` to this directory next to the `createAudio.py`.
11. Run the `createAudio.py` script.
    When running this script a second time, first remove the already existing audio files in `/audio_files`.
12. Copy the column from the `audio_filenames.csv` and paste it into the `words.csv` in column I (filename).
13. In columns E and F, adjust the sections and units according to your best of knowledge if you want to have a more structured deck.
14. In columns A, B and D from row 4, remove the leading apostrophes to activate the formulas and adjust the LANG|LANG according to your languages. Then drag the three cells down to apply the formulas to all rows and save the file.
15. Place the mp3 files in the Anki collection.media folder, which should be in `C:\Users\USERNAME\AppData\Roaming\Anki2\Benutzer 1\collection.media` [Documentation](https://docs.ankiweb.net/importing/text-files.html#importing-media).
16. Import the `words.csv` into Anki. Field Separator should be Semicolon, HTML should be allowed, Note Type should be "Basic (and reversed card)", Existing notes should be Updated with Match scope of "Note type and deck".<br>
![Anki Import](screenshots/anki.jpg)

## Requirements

- Anki Desktop
- Google Chrome with Tampermonkey
- Python
- Internet connection for accessing Duolingo and generating audio

## License

See `LICENSE` for details.