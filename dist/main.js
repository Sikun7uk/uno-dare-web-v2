"use strict";
// Aturan default
const defaultDares = [
    "Membuat lagu pendek tentang kartu Uno.",
    "Berdandan seperti kartu Uno favorit Anda.",
    "Menggambar kartu Uno di wajah Anda dengan spidol.",
    "Berbicara dengan aksen selama 5 menit.",
    "Menari selama 30 detik setiap kali giliran Anda tiba.",
    "Menceritakan lelucon lucu.",
    "Bernyanyi lagu pilihan grup.",
    "Melakukan push-up 10 kali.",
    "Menggambar binatang dengan mata tertutup.",
    "Mengatakan 'Uno!' dengan suara yang sangat tinggi.",
    "Memberikan pujian kepada setiap pemain.",
    "Berpose seperti patung selama 1 menit.",
    "Mencoba menyentuh hidung Anda dengan lidah Anda.",
    "Berjalan mundur sampai giliran Anda berikutnya.",
    "Menirukan suara hewan.",
    "Memberikan pelukan kepada pemain di sebelah Anda."
];
// Variabel untuk menyimpan aturan saat ini
let currentDares = [];
// Variabel untuk menyimpan aturan yang sudah diacak
let shuffledDares = [];
// Indeks untuk input aturan baru
let newDaresTempArray = [];
let currentDareInputIndex = 0;
// --- Mengambil elemen-elemen UI ---
const screens = {
    initial: document.getElementById('initial-screen'),
    newDareInput: document.getElementById('new-dare-input-screen'),
    defaultDareList: document.getElementById('default-dare-list-screen'),
    gamePlay: document.getElementById('game-play-screen'),
    chooseDare: document.getElementById('choose-dare-screen'),
    displayDare: document.getElementById('display-dare-screen')
};
const buttons = {
    defaultDares: document.getElementById('btn-default-dares'),
    newDares: document.getElementById('btn-new-dares'),
    saveNewDare: document.getElementById('btn-save-new-dare'),
    cancelNewDare: document.getElementById('btn-cancel-new-dare'),
    startGame: document.getElementById('btn-start-game-from-default'),
    getDare: document.getElementById('btn-get-dare'),
    newMatch: document.getElementById('btn-new-match'),
    endGame: document.getElementById('btn-end-game'),
    confirmDareNumber: document.getElementById('btn-confirm-dare-number'),
    backFromChooseDare: document.getElementById('btn-back-from-choose-dare'),
    backToGamePlay: document.getElementById('btn-back-to-game-play')
};
const inputs = {
    newDare: document.getElementById('input-new-dare'),
    dareNumber: document.getElementById('input-dare-number')
};
const displays = {
    newDarePrompt: document.getElementById('new-dare-prompt'),
    dareList: document.getElementById('dare-list'),
    displayedDareNumber: document.getElementById('displayed-dare-number'),
    dareDisplay: document.getElementById('dare-display')
};
const alertModal = document.getElementById('alert-modal');
const alertModalMessage = document.getElementById('alert-modal-message');
const alertModalOkBtn = document.getElementById('alert-modal-ok-btn');
// --- Fungsi Pembantu ---
/**
 * Menampilkan pesan alert kustom.
 * @param message Pesan yang akan ditampilkan.
 * @param callback Fungsi opsional yang akan dipanggil setelah OK diklik.
 * @param okButtonText Teks untuk tombol OK.
 */
function showCustomAlert(message, callback = () => { }, okButtonText = "OK") {
    alertModalMessage.textContent = message;
    alertModalOkBtn.textContent = okButtonText;
    alertModal.style.display = 'flex';
    alertModalOkBtn.onclick = () => {
        alertModal.style.display = 'none';
        callback();
    };
}
/**
 * Mengacak urutan elemen dalam sebuah array.
 * @param array Array yang akan diacak.
 * @returns Array yang sudah diacak.
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
/**
 * Mengganti tampilan layar yang aktif.
 * @param screenToShow Elemen layar yang akan ditampilkan.
 */
function displayScreen(screenToShow) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screenToShow.classList.add('active');
}
// --- Logika Permainan ---
function startGame() {
    displayScreen(screens.gamePlay);
}
function startNewDareInputProcess() {
    newDaresTempArray = [];
    currentDareInputIndex = 0;
    inputs.newDare.value = '';
    updateNewDarePrompt();
    displayScreen(screens.newDareInput);
}
function updateNewDarePrompt() {
    displays.newDarePrompt.textContent = `Aturan ke-${currentDareInputIndex + 1} dari 16:`;
    inputs.newDare.focus();
}
function saveNewDareAndContinue() {
    const dare = inputs.newDare.value.trim();
    if (dare === '') {
        showCustomAlert("Aturan dare tidak boleh kosong!");
        return;
    }
    newDaresTempArray.push(dare);
    inputs.newDare.value = '';
    currentDareInputIndex++;
    if (currentDareInputIndex < 16) {
        updateNewDarePrompt();
    }
    else {
        currentDares = [...newDaresTempArray];
        shuffledDares = shuffleArray(currentDares);
        showCustomAlert("16 aturan baru sudah diset ulang! Siap bermain.", () => {
            startGame();
        });
    }
}
function showDefaultDaresAndPromptToStart() {
    displays.dareList.innerHTML = '';
    defaultDares.forEach((dare, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${dare}`;
        displays.dareList.appendChild(li);
    });
    displayScreen(screens.defaultDareList);
}
function chooseDare() {
    inputs.dareNumber.value = '';
    displayScreen(screens.chooseDare);
}
function confirmDareNumber() {
    const dareNumber = parseInt(inputs.dareNumber.value.trim());
    if (isNaN(dareNumber) || dareNumber < 1 || dareNumber > 16) {
        showCustomAlert("Nomor dare tidak valid. Masukkan angka antara 1 dan 16.");
        return;
    }
    const index = dareNumber - 1;
    displays.displayedDareNumber.textContent = dareNumber.toString();
    displays.dareDisplay.textContent = shuffledDares[index];
    displayScreen(screens.displayDare);
}
function newGame() {
    showCustomAlert("Mengacak ulang aturan untuk game baru...", () => {
        shuffledDares = shuffleArray(currentDares);
        startGame();
    });
}
function endGame() {
    showCustomAlert("Terima kasih sudah bermain! Sampai jumpa.", () => {
        displayScreen(screens.initial);
    });
}
// --- Event Listeners ---
buttons.defaultDares.addEventListener('click', () => {
    currentDares = [...defaultDares];
    shuffledDares = shuffleArray(currentDares);
    showDefaultDaresAndPromptToStart();
});
buttons.newDares.addEventListener('click', startNewDareInputProcess);
buttons.saveNewDare.addEventListener('click', saveNewDareAndContinue);
buttons.cancelNewDare.addEventListener('click', () => showCustomAlert("Pengaturan aturan baru dibatalkan.", () => displayScreen(screens.initial)));
buttons.startGame.addEventListener('click', startGame);
buttons.getDare.addEventListener('click', chooseDare);
buttons.newMatch.addEventListener('click', newGame);
buttons.endGame.addEventListener('click', endGame);
buttons.confirmDareNumber.addEventListener('click', confirmDareNumber);
buttons.backFromChooseDare.addEventListener('click', startGame);
buttons.backToGamePlay.addEventListener('click', startGame);
// --- Inisialisasi ---
displayScreen(screens.initial);
