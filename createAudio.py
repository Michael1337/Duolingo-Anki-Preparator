import json
import base64
from urllib.parse import urlparse
import os
import csv

har_file = 'network.har'  # Replace with your HAR file path
output_dir = 'audio_files'
csv_file = 'audio_filenames.csv'
os.makedirs(output_dir, exist_ok=True)

with open(har_file, 'r', encoding='utf-8') as f:
    har_data = json.load(f)

entries = har_data.get('log', {}).get('entries', [])

filenames = []

for i, entry in enumerate(entries):
    request = entry.get('request', {})
    url = request.get('url', '')
    response = entry.get('response', {})
    content = response.get('content', {})
    mimeType = content.get('mimeType', '')
    text = content.get('text', '')

    # Only handle audio/mpeg content with text base64 content
    if mimeType == 'audio/mpeg' and text:
        base64_data = text

        if base64_data.startswith('data:'):
            base64_data = base64_data.split(',', 1)[1]

        try:
            audio_bytes = base64.b64decode(base64_data)
        except Exception as e:
            print(f"Skipping entry {i} due to decode error: {e}")
            continue

        path = urlparse(url).path
        filename = os.path.basename(path)
        if not filename.lower().endswith('.mp3'):
            filename += '.mp3'

        file_path = os.path.join(output_dir, filename)
        count = 1
        base_file_path = file_path
        while os.path.exists(file_path):
            file_path = os.path.join(output_dir, f"{os.path.splitext(filename)[0]}_{count}.mp3")
            count += 1

        with open(file_path, 'wb') as audio_file:
            audio_file.write(audio_bytes)
        print(f"Saved {file_path}")

        filenames.append(os.path.basename(file_path))  # record filename only

# Write filenames to CSV
with open(csv_file, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['filename'])
    for name in filenames:
        writer.writerow([name])

print(f"Finished. Extracted {len(filenames)} files and saved filenames to {csv_file}")
