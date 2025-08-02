// Aturan default
const defaultDares: string[] = [
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
let currentDares: string[] = [];
// Variabel untuk menyimpan aturan yang sudah diacak
let shuffledDares: string[] = [];
// Indeks untuk input aturan baru
let newDaresTempArray: string[] = [];
let currentDareInputIndex: number = 0;

// --- Mengambil elemen-elemen UI ---
const screens = {
    initial: document.getElementById('initial-screen') as HTMLElement,
    newDareInput: document.getElementById('new-dare-input-screen') as HTMLElement,
    defaultDareList: document.getElementById('default-dare-list-screen') as HTMLElement,
    gamePlay: document.getElementById('game-play-screen') as HTMLElement,
    chooseDare: document.getElementById('choose-dare-screen') as HTMLElement,
    displayDare: document.getElementById('display-dare-screen') as HTMLElement
};

const buttons = {
    defaultDares: document.getElementById('btn-default-dares') as HTMLButtonElement,
    newDares: document.getElementById('btn-new-dares') as HTMLButtonElement,
    saveNewDare: document.getElementById('btn-save-new-dare') as HTMLButtonElement,
    cancelNewDare: document.getElementById('btn-cancel-new-dare') as HTMLButtonElement,
    startGame: document.getElementById('btn-start-game-from-default') as HTMLButtonElement,
    getDare: document.getElementById('btn-get-dare') as HTMLButtonElement,
    newMatch: document.getElementById('btn-new-match') as HTMLButtonElement,
    endGame: document.getElementById('btn-end-game') as HTMLButtonElement,
    confirmDareNumber: document.getElementById('btn-confirm-dare-number') as HTMLButtonElement,
    backFromChooseDare: document.getElementById('btn-back-from-choose-dare') as HTMLButtonElement,
    backToGamePlay: document.getElementById('btn-back-to-game-play') as HTMLButtonElement
};

const inputs = {
    newDare: document.getElementById('input-new-dare') as HTMLInputElement,
    dareNumber: document.getElementById('input-dare-number') as HTMLInputElement
};

const displays = {
    newDarePrompt: document.getElementById('new-dare-prompt') as HTMLElement,
    dareList: document.getElementById('dare-list') as HTMLUListElement,
    displayedDareNumber: document.getElementById('displayed-dare-number') as HTMLElement,
    dareDisplay: document.getElementById('dare-display') as HTMLElement
};

const alertModal = document.getElementById('alert-modal') as HTMLElement;
const alertModalMessage = document.getElementById('alert-modal-message') as HTMLElement;
const alertModalOkBtn = document.getElementById('alert-modal-ok-btn') as HTMLButtonElement;

// --- Fungsi Pembantu ---

/**
 * Menampilkan pesan alert kustom.
 * @param message Pesan yang akan ditampilkan.
 * @param callback Fungsi opsional yang akan dipanggil setelah OK diklik.
 * @param okButtonText Teks untuk tombol OK.
 */
function showCustomAlert(message: string, callback: () => void = () => {}, okButtonText: string = "OK"): void {
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
function shuffleArray<T>(array: T[]): T[] {
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
function displayScreen(screenToShow: HTMLElement): void {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screenToShow.classList.add('active');
}

// --- Logika Permainan ---

function startGame(): void {
    displayScreen(screens.gamePlay);
}

function startNewDareInputProcess(): void {
    newDaresTempArray = [];
    currentDareInputIndex = 0;
    inputs.newDare.value = '';
    updateNewDarePrompt();
    displayScreen(screens.newDareInput);
}

function updateNewDarePrompt(): void {
    displays.newDarePrompt.textContent = `Aturan ke-${currentDareInputIndex + 1} dari 16:`;
    inputs.newDare.focus();
}

function saveNewDareAndContinue(): void {
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
    } else {
        currentDares = [...newDaresTempArray];
        shuffledDares = shuffleArray(currentDares);
        showCustomAlert("16 aturan baru sudah diset ulang! Siap bermain.", () => {
            startGame();
        });
    }
}

function showDefaultDaresAndPromptToStart(): void {
    displays.dareList.innerHTML = '';
    defaultDares.forEach((dare, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${dare}`;
        displays.dareList.appendChild(li);
    });
    displayScreen(screens.defaultDareList);
}

function chooseDare(): void {
    inputs.dareNumber.value = '';
    displayScreen(screens.chooseDare);
}

function confirmDareNumber(): void {
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

function newGame(): void {
    showCustomAlert("Mengacak ulang aturan untuk game baru...", () => {
        shuffledDares = shuffleArray(currentDares);
        startGame();
    });
}

function endGame(): void {
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
