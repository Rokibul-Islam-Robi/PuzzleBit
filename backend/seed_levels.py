import json
import random

def generate_levels(count=500):
    word_db = {
        3: ["CAT", "DOG", "SUN", "TEN", "BOX"],
        4: ["STRE", "PLAY", "GAME", "WIND", "FIRE"],
        5: ["ASTRE", "APPLE", "BRAIN", "STORM", "LIGHT"],
        6: ["PUZZLE", "GARDEN", "PLANET", "SILVER", "WINDOW"]
    }
    
    levels = []
    for i in range(1, count + 1):
        # Scaling difficulty
        word_len = 3 if i < 50 else 4 if i < 150 else 5 if i < 350 else 6
        
        main_word = random.choice(word_db[word_len])
        letters = list(main_word)
        random.shuffle(letters)
        
        level_data = {
            "number": i,
            "letters": "".join(letters),
            "words": [main_word], # In a real app, find all sub-words
            "coins_reward": 50 + (i // 10),
            "bg_image": f"https://source.unsplash.com/featured/?nature,wallpaper&{i}"
        }
        levels.append(level_data)
        
    with open("levels.json", "w") as f:
        json.dump(levels, f, indent=4)
    print(f"✅ Generated {count} levels in levels.json")

if __name__ == "__main__":
    generate_levels()
