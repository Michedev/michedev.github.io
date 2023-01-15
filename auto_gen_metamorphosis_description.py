"""
This script generates a description file for each image in the Metamorphosis folder.
"""

from path import Path


ROOT = Path(__file__).parent
descriptions_path = ROOT / 'assets' / 'description'

images_path = ROOT / 'assets' / 'images' / 'backgrounds' / 'Metamorphosis'

# remove all existing description files
for description in descriptions_path.files('*.txt'):
    description.remove()

# if filename starts with a, then generate a description txt file with the same name, extension .txt and the content '1'
# if filename starts with b, then generate a description txt file with the same name, extension .txt and the content '2'
# if filename starts with c, then generate a description txt file with the same name, extension .txt and the content '3'
for image in images_path.files('*.png'):
    txt_fname = image.name.replace('.png', '')
    if image.name.startswith('a'):
        with open(descriptions_path / (txt_fname + '.txt'), 'w') as f:
            f.write('1')
    elif image.name.startswith('b'):
        with open(descriptions_path / (txt_fname + '.txt'), 'w') as f:
            f.write('2')
    elif image.name.startswith('c'):
        with open(descriptions_path / (txt_fname + '.txt'), 'w') as f:
            f.write('3')