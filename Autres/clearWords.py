from time import sleep
from pprint import pprint
import codecs
import io

FILE = []
WORDS = []

with io.open("temp.txt", 'r', encoding="utf-8") as file:
	FILE = file.readlines()

for line, word in enumerate(FILE):
	word = word[:-1].lower()
	if word not in WORDS:
		WORDS.append(word)
	else:
		print("Doublon : " + word + " ligne " + str(line))

print("Lignes : " + str(len(FILE)))
print("Sans doublons : " + str(len(WORDS)))

with io.open("old.txt", 'r', encoding="utf-8") as file:
	FILE = file.readlines()

for line, word in enumerate(FILE):
	word = word[:-1].lower()
	if word not in WORDS:
		print("Mot manquant : " + word)
		WORDS.append(word)

with codecs.open("new.txt", 'w', 'utf-8') as file:
	for word in sorted(WORDS):
  		file.write(u"%s\n" % word)