new Vue({
    el: '#app',
    data: {
        items: ["ERGENEKON", "ÜLKER", "KURT", "UMAY", "KAZASKER", "SADRAZAM", "DİVAN", "ŞEYHÜLİSLAM", "REVAK", "CÜLUS", "HAREM", "KUBBE", "SEHER", "ZÜLFİKAR", "FERDA", "ŞEBNEM"],
        correctGroups: [
            ["ERGENEKON", "ÜLKER", "KURT", "UMAY"],
            ["KAZASKER", "SADRAZAM", "DİVAN", "ŞEYHÜLİSLAM"],
            ["REVAK", "CÜLUS", "HAREM", "KUBBE"],
            ["SEHER", "ZÜLFİKAR", "FERDA", "ŞEBNEM"]
        ],
        correctGroupMessages: [
            "ERGENEKON, ÜLKER, KURT, UMAY - Bu grup Türk mitolojisi varlıklarıdır.",
            "KAZASKER, SADRAZAM, DİVAN, ŞEYHÜLİSLAM - Bu grup Osmanlıca hukuk terimleridir.",
            "REVAK, CÜLUS, HAREM, KUBBE - Bu grup Osmanlı mimari terimleridir.",
            "SEHER, ZÜLFİKAR, FERDA, ŞEBNEM - Bu grup Türk şiirinde sık kullanılan kelimelerdir."
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
            if (this.gameEnded) {
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
                   
