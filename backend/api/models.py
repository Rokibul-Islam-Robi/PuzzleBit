from django.db import models

class Level(models.Model):
    number = models.IntegerField(unique=True)
    letters = models.CharField(max_length=10) # e.g., "ASTRE"
    bg_image = models.URLField(max_length=500, blank=True)
    coins_reward = models.IntegerField(default=50)

    def __str__(self):
        return f"Level {self.number}"

class Word(models.Model):
    level = models.ForeignKey(Level, related_name='words', on_delete=models.CASCADE)
    text = models.CharField(max_length=20)
    x = models.IntegerField()
    y = models.IntegerField()
    direction = models.CharField(max_length=10, choices=[('H', 'Horizontal'), ('V', 'Vertical')])

class PlayerStats(models.Model):
    player_id = models.CharField(max_length=100, unique=True)
    coins = models.IntegerField(default=500)
    current_level = models.IntegerField(default=1)
    unlocked_levels = models.IntegerField(default=1)
