import os

import requests
import json
from pathlib import Path
import time
from typing import TypedDict

ROOT = Path(__file__).parent
ASSETS = ROOT / 'assets'
DESCRIPTION = ASSETS / 'description'
ART = ASSETS / 'images' / 'art'

USERNAME = "MikeDev1"
SUBREDDIT = "art"
# We add ?limit=100 to get the maximum number of posts per page
BASE_URL = f"https://www.reddit.com/user/{USERNAME}/submitted.json?limit=100"

headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

class Painting(TypedDict):
    title: str
    image_url: str
    post_url: str
    created_utc: float

def fetch_all_my_paintings() -> list[Painting]:
    paintings: list[Painting] = []
    after = None
    
    while True:
        # If we have an 'after' token, append it to the URL to get the next page
        url = BASE_URL if after is None else f"{BASE_URL}&after={after}"
        
        print(f"Fetching page... (after={after})")
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            print(f"Error fetching data: {response.status_code}")
            break
            
        data = response.json()
        posts = data['data']['children']
        
        # If there are no more posts, we've reached the end
        if not posts:
            break
            
        for post in posts:
            post_data = post['data']
            
            if post_data['subreddit'].lower() == SUBREDDIT and 'url' in post_data:
                url = post_data['url']
                if url.endswith(('.jpg', '.jpeg', '.png')):
                    paintings.append({
                        'title': post_data['title'],
                        'image_url': url,
                        'post_url': f"https://www.reddit.com{post_data['permalink']}",
                        'created_utc': post_data['created_utc']
                    })
        
        # Get the token for the next page
        after = data['data']['after']
        
        # If 'after' is None, there are no more pages
        if after is None:
            break
            
        # Sleep for 2 seconds to avoid hitting Reddit's rate limit (HTTP 429)
        time.sleep(2)
                
    return paintings

def store_painting_(painting: Painting, fname: str):
    response = requests.get(painting['image_url'])

    if response.status_code == 200:
        with open(ART / f'{fname}.jpg', 'wb') as f:
            f.write(response.content)
        with open(DESCRIPTION / f'{fname}.txt', 'w') as f:
            painting_title = painting['title'].split(',')[0]
            f.write(painting_title)
    else:
        print(f'Problem downloading {painting["image_url"]} - Error code {response.status_code}')

def clear_files_(folder: Path):
    for file in folder.iterdir():
        if file.is_file():
            file.unlink()
        

if __name__ == "__main__":
    my_art = fetch_all_my_paintings()
    limit_utc = 1721954360.0
    my_art = [el for el in my_art if el['created_utc'] >= limit_utc]
    with open('my_gallery.json', 'w') as f:
        json.dump(my_art, f, indent=4)

    clear_files_(ART)
    clear_files_(DESCRIPTION)

    print(f"Successfully pulled {len(my_art)} paintings!")
    my_art = sorted(my_art, key=lambda x: x['created_utc'], reverse=True)
    i = 1
    for p in my_art:
        store_painting_(p, str(i))
        i += 1