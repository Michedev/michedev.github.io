import wikipedia
import requests
import shutil
import json
from path import Path
import tqdm
from PIL import Image
import sqlite3
import isbnlib

ROOT = Path(__file__).parent
IMG = ROOT / 'img'
IMG.mkdir_p()
# db = sqlite3.connect('data.db')
# db.execute('drop table if exists Books')
# db.execute('drop table if exists Games')
# db.execute('create table Games (title text, summmary text, coverpath text)')
# db.execute('create table Books (title text, authors text, year INTEGER, summmary text, coverpath text)')
# db.commit()
data = {'Games': [], 'Books': []}


def normalize(string):
    return string.lower().replace(' ', '').replace('_', '').replace('viii', '8').replace('-', '').replace(':', '')

def cut_description(description: str):
    maxchar = 400
    if len(description) < maxchar:
        return description
    else:
        newdescr = ''
        descrsplitted = description.split('.')
        while len(newdescr) < maxchar:
            newdescr += descrsplitted.pop(0)
        return newdescr + '.'


def contains_imgname(imgname, url):
    normurl = normalize(url)
    return normalize(imgname) in normurl or 'cover' in normurl


def store_image_and_summary(name, is_games=True):
    if is_games:
        title = name
        pagename = wikipedia.search(name)[0]
        page = wikipedia.page(title=pagename, auto_suggest=False)
        url_image: str = next(
            filter(lambda url: contains_imgname(name, url), page.images))
        imgpath = save_image(url_image, title)
        summary = cut_description(page.summary)
        # db.execute(f'INSERT INTO Games VALUES (?, ?, ?)', (pagename, summary, imgpath.relpath(ROOT)))
        data['Games'].append(
            {'title': pagename, 'description': summary, 'imgpath': imgpath.relpath(ROOT)})
    else:
        metadata = isbnlib.meta(name, 'goob')
        descr = cut_description(isbnlib.desc(name))
        title = metadata['Title']
        url_images: list = list(isbnlib.cover(name).values())
        if not url_images:
            print(f'Warning: Image urls for {name} doesnt exists')
            imgpath = ''
        else:
            url_image = url_images[0]
            imgpath = save_image(url_image, title)
        authors = ', '.join(metadata['Authors'])
        year = int(metadata['Year'])

        # db.execute('INSERT INTO BOOKS VALUES (?, ?, ?, ?, ?)', (title, authors, year, descr, imgpath.relpath(ROOT)))
        data['Books'].append({'title': title, 'authors': authors, 'year': year,
                              'description': descr, 'imgpath': imgpath.relpath(ROOT)})


def save_image(url_image, title):
    data = requests.get(url_image, stream=True)
    img_ext = url_image.split('.')[-1]
    if len(img_ext) > 4 or len(img_ext) < 3:
        img_ext = 'jpg'
    if data.status_code == 200:
        data.raw.decode_content = True
        imgname = title + '.' + img_ext
        imgpath: Path = IMG / imgname
        with open(imgpath, 'wb') as f:
            shutil.copyfileobj(data.raw, f)
        true_imgpath = IMG / (title + '.png')
        if img_ext != 'png':
            Image.open(imgpath).save(true_imgpath)
            imgpath.remove()
        return true_imgpath
    else:
        print('Warning! Image Status code ', data.status_code)


if __name__ == "__main__":
    wikipedia.set_lang('en')
    books = [
        '0262337371',  # Deep learning
        '978-0803283688',  # 'Human, All Too Human',
        '978-0143039884',  # 'Eichmann in Jerusalem',
        '978-0099478898',  # happiness hypotesis
        '978-1567921847',  # cogito ergo sum
        '978-1590171158',  # il fu mattia pascal
    ]
    print('Downloading books')
    for isbn_book in tqdm.tqdm(books):
        store_image_and_summary(isbn_book, is_games=False)
    # db.commit()
    print('Books downloaded')
    games = ['Final Fantasy VII',
             'Octopath Traveler',
             'Final Fantasy VIII',
             'Xenoblade Chronicles 2',
             'Master of Olympus - Zeus',
             'Europa Universalis IV']
    print('Downloading games')
    for game in tqdm.tqdm(games):
        store_image_and_summary(game)
    print('Games downloaded')
    with open('data.json', 'w') as f:
        json.dump(data, f)
