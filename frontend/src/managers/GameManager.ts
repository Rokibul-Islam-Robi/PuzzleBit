// frontend/src/managers/GameManager.ts
export class GameManager {
    setCoins: (coins: number) => void;
    setCurrentLevel: (level: number) => void;
    coins: number;
    level: number;

    constructor(setCoins: (coins: number) => void, setCurrentLevel: (level: number) => void) {
        this.setCoins = setCoins;
        this.setCurrentLevel = setCurrentLevel;
        this.coins = parseInt(localStorage.getItem('coins') || '500');
        this.level = parseInt(localStorage.getItem('currentLevel') || '1');
    }

    addCoins(amount: number) {
        this.coins += amount;
        localStorage.setItem('coins', this.coins.toString());
        this.setCoins(this.coins);
    }

    completeLevel(reward: number) {
        this.addCoins(reward);
        this.level += 1;
        localStorage.setItem('currentLevel', this.level.toString());
        this.setCurrentLevel(this.level);
        return true;
    }

    useHint(cost: number = 200) {
        if (this.coins >= cost) {
            this.addCoins(-cost);
            return true;
        }
        return false;
    }
}
