new Vue({
    el: '#app',
    data: {
        items: ["DİVAN", "SERBEST", "HİKAYE", "DESTAN", "KARAKUTU", "KÖRÜK", "TIRNAK", "TIRPAN", "YUNUS EMRE", "NECİP FAZIL", "CEMİL MERİÇ", "RÜŞTÜ HİLMİ", "DAĞ", "OVA", "GÖL", "IRMAK"],
        correctGroups: [
            ["DİVAN", "SERBEST", "HİKAYE", "DESTAN"],
            ["KARAKUTU", "KÖRÜK", "TIRNAK", "TIRPAN"],
            ["YUNUS EMRE", "NECİP FAZIL", "CEMİL MERİÇ", "RÜŞTÜ HİLMİ"],
            ["DAĞ", "OVA", "GÖL", "IRMAK"]
        ],
        correctGroupMessages: [
            "DİVAN, SERBEST, HİKAYE, DESTAN - Bu grup Türk edebiyatı terimleridir.",
            "KARAKUTU, KÖRÜK, TIRNAK, TIRPAN - Bu grup Türk deyimleridir.",
            "YUNUS EMRE, NECİP FAZIL, CEMİL MERİÇ, RÜŞTÜ HİLMİ - Bu grup Türk filozofları ve şairleridir.",
            "DAĞ, OVA, GÖL, IRMAK - Bu grup Türk coğrafi özellikleridir."
        ],
        correctItems: [],
        selectedItems: [],
        previousGuesses: [],
        attemptsLeft: 5,
        wrongGuessMessage: "",
        isWrong: false,
        wrongGuessItems: [],
        gameEnded: false
    },
    created() {
        this.shuffleItems();
    },
    computed: {
        remainingItems() {
            return this.items.filter(item => !this.correctItems.includes(item));
        },
        correctGroupsWithMessages() {
            let groupsWithMessages = [];
            for (let i = 0; i < this.correctGroups.length; i++) {
                let groupItems = this.correctGroups[i];
                if (groupItems.every(item => this.correctItems.includes(item))) {
                    groupsWithMessages.push({
                        items: groupItems,
                        message: this.correctGroupMessages[i]
                    });
                }
            }
            return groupsWithMessages;
        }
    },
    methods: {
        toggleSelection(item) {
            if (this.selectedItems.includes(item) || this.gameEnded) {
                return;
            }
            if (this.selectedItems.includes(item)) {
                this.selectedItems = this.selectedItems.filter(i => i !== item);
            } else {
                if (this.selectedItems.length < 4) {
                    this.selectedItems.push(item);
                }
            }
        },
        checkResults() {
            if (this.selectedItems.length !== 4) {
                this.wrongGuessMessage = 'Lütfen dört öğe seçin.';
                return;
            }

            let currentGuess = [...this.selectedItems].sort().toString();
            if (this.previousGuesses.includes(currentGuess)) {
                this.wrongGuessMessage = 'Bu tahmini zaten yaptınız.';
                this.selectedItems = [];
                return;
            }

            this.previousGuesses.push(currentGuess);

            let isCorrect = this.correctGroups.some(group => {
                return this.arraysEqual(group.sort(), this.selectedItems.sort());
            });

            if (isCorrect) {
                this.correctItems.push(...this.selectedItems);
                this.wrongGuessMessage = "";
            } else {
                this.wrongGuessItems = [...this.selectedItems];
                this.wrongGuessMessage = "Yanlış tahmin!";
                this.isWrong = true;
                setTimeout(() => {
                    this.isWrong = false;
                    this.wrongGuessItems = [];
                }, 3000);
                this.attemptsLeft--;
                if (this.attemptsLeft <= 0) {
                    this.attemptsLeft = 0;
                    this.wrongGuessMessage = 'Tüm denemeler bitti. Oyun bitti!';
                    this.revealAllGroups();
                    this.gameEnded = true;
                }
            }

            this.selectedItems = [];
        },
        arraysEqual(a, b) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        },
        shuffleItems() {
            this.items = this.items.sort(() => Math.random() - 0.5);
        },
        revealAllGroups() {
            this.correctGroups.forEach(group => {
                group.forEach(item => {
                    if (!this.correctItems.includes(item)) {
                        this.correctItems.push(item);
                    }
                });
            });
        }
    }
});
