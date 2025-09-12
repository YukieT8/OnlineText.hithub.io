document.addEventListener('DOMContentLoaded', function() {
    // Инициализация редактора Quill
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: false // Мы создали свою панель инструментов
        },
        placeholder: 'Начните печатать здесь...'
    });
    
    // Элементы управления
    const saveBtn = document.getElementById('save-doc');
    const newDocBtn = document.getElementById('new-doc');
    const downloadBtn = document.getElementById('download-btn');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const sidebarWordCount = document.getElementById('sidebar-word-count');
    const sidebarCharCount = document.getElementById('sidebar-char-count');
    const readingTime = document.getElementById('reading-time');
    const formatModal = document.getElementById('format-modal');
    const closeModal = document.getElementById('close-modal');
    const formatOptions = document.querySelectorAll('.format-option');
    
    // Элементы бокового меню
    const recentDocsBtn = document.getElementById('recent-docs');
    const myDocsBtn = document.getElementById('my-docs');
    const cloudStorageBtn = document.getElementById('cloud-storage');
    const appearanceBtn = document.getElementById('appearance');
    const languageBtn = document.getElementById('language');
    const shortcutsBtn = document.getElementById('shortcuts');
    const storageBtn = document.getElementById('storage');
    
    // Настройка шрифта
    const fontFamily = document.getElementById('font-family');
    fontFamily.addEventListener('change', function() {
        document.querySelector('.ql-editor').style.fontFamily = this.value;
    });
    
    // Настройка размера текста
    const fontSize = document.getElementById('font-size');
    fontSize.addEventListener('change', function() {
        document.querySelector('.ql-editor').style.fontSize = this.value;
    });
    
    // Кнопки форматирования
    document.getElementById('bold-btn').addEventListener('click', function() {
        quill.format('bold', !quill.getFormat().bold);
        this.classList.toggle('active');
    });
    
    document.getElementById('italic-btn').addEventListener('click', function() {
        quill.format('italic', !quill.getFormat().italic);
        this.classList.toggle('active');
    });
    
    document.getElementById('underline-btn').addEventListener('click', function() {
        quill.format('underline', !quill.getFormat().underline);
        this.classList.toggle('active');
    });
    
    // Выравнивание
    document.getElementById('align-left').addEventListener('click', function() {
        quill.format('align', 'left');
        setActiveAlignmentButton(this);
    });
    
    document.getElementById('align-center').addEventListener('click', function() {
        quill.format('align', 'center');
        setActiveAlignmentButton(this);
    });
    
    document.getElementById('align-right').addEventListener('click', function() {
        quill.format('align', 'right');
        setActiveAlignmentButton(this);
    });
    
    document.getElementById('align-justify').addEventListener('click', function() {
        quill.format('align', 'justify');
        setActiveAlignmentButton(this);
    });
    
    function setActiveAlignmentButton(button) {
        // Удаляем активный класс у всех кнопок выравнивания
        document.querySelectorAll('.toolbar-group:nth-child(4) .toolbar-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс к нажатой кнопке
        button.classList.add('active');
    }
    
    // Списки
    document.getElementById('list-ul').addEventListener('click', function() {
        quill.format('list', quill.getFormat().list === 'bullet' ? false : 'bullet');
        this.classList.toggle('active');
    });
    
    document.getElementById('list-ol').addEventListener('click', function() {
        quill.format('list', quill.getFormat().list === 'ordered' ? false : 'ordered');
        this.classList.toggle('active');
    });
    
    // Цвет текста и фона
    document.getElementById('text-color').addEventListener('change', function(e) {
        quill.format('color', e.target.value);
    });
    
    document.getElementById('bg-color').addEventListener('change', function(e) {
        quill.format('background', e.target.value);
    });
    
    // Функционал бокового меню
    recentDocsBtn.addEventListener('click', function() {
        showNotification('Просмотр последних документов');
    });
    
    myDocsBtn.addEventListener('click', function() {
        showNotification('Просмотр моих документов');
    });
    
    cloudStorageBtn.addEventListener('click', function() {
        // Переход в Google Drive
        window.open('https://drive.google.com/', '_blank');
        showNotification('Открытие Google Drive для сохранения документов');
    });
    
    appearanceBtn.addEventListener('click', function() {
        showNotification('Настройка внешнего вида');
    });
    
    languageBtn.addEventListener('click', function() {
        showNotification('Выбор языка интерфейса');
    });
    
    shortcutsBtn.addEventListener('click', function() {
        showNotification('Настройка горячих клавиш');
    });
    
    storageBtn.addEventListener('click', function() {
        showNotification('Управление хранилищем');
    });
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--primary)';
        notification.style.color = 'white';
        notification.style.padding = '12px 24px';
        notification.style.borderRadius = 'var(--radius-sm)';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = 'var(--shadow)';
        notification.style.fontWeight = '500';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    // Подсчет слов и символов
    quill.on('text-change', function() {
        const text = quill.getText();
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const characters = text.length;
        const readingTimeMin = Math.ceil(words / 200);
        
        wordCount.textContent = `Слов: ${words}`;
        charCount.textContent = `Символов: ${characters}`;
        sidebarWordCount.textContent = words;
        sidebarCharCount.textContent = characters;
        readingTime.textContent = `${readingTimeMin} мин`;
        
        // Автосохранение
        localStorage.setItem('documentContent', quill.root.innerHTML);
    });
    
    // Загрузка сохраненного текста
    const savedContent = localStorage.getItem('documentContent');
    if (savedContent) {
        quill.root.innerHTML = savedContent;
        
        // Обновляем счетчики
        const text = quill.getText();
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const characters = text.length;
        const readingTimeMin = Math.ceil(words / 200);
        
        wordCount.textContent = `Слов: ${words}`;
        charCount.textContent = `Символов: ${characters}`;
        sidebarWordCount.textContent = words;
        sidebarCharCount.textContent = characters;
        readingTime.textContent = `${readingTimeMin} мин`;
    }
    
    // Новый документ
    newDocBtn.addEventListener('click', function() {
        if (confirm('Вы уверены? Все несохраненные изменения будут потеряны.')) {
            quill.setText('');
            localStorage.removeItem('documentContent');
            
            // Сбрасываем счетчики
            wordCount.textContent = 'Слов: 0';
            charCount.textContent = 'Символов: 0';
            sidebarWordCount.textContent = '0';
            sidebarCharCount.textContent = '0';
            readingTime.textContent = '0 мин';
        }
    });
    
    // Сохранение документа
    saveBtn.addEventListener('click', function() {
        this.classList.add('pulse');
        setTimeout(() => {
            this.classList.remove('pulse');
        }, 1000);
        
        // В реальном приложении здесь была бы логика сохранения на сервер
        showNotification('Документ сохранен!');
    });
    
    // Открытие модального окна
    downloadBtn.addEventListener('click', function() {
        formatModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Закрытие модального окна
    closeModal.addEventListener('click', function() {
        formatModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Закрытие модального окна при клике вне его
    formatModal.addEventListener('click', function(e) {
        if (e.target === formatModal) {
            formatModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Генерация имени файла на основе содержимого
    function generateFileName() {
        const text = quill.getText().trim();
        if (text === '') return 'без_названия';
        
        // Берем первые 3-5 слов из текста
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const nameLength = Math.min(words.length, 5);
        let fileName = words.slice(0, nameLength).join('_');
        
        // Убираем специальные символы
        fileName = fileName.replace(/[^\wа-яА-ЯёЁ]/g, '');
        
        // Ограничиваем длину имени файла
        if (fileName.length > 30) {
            fileName = fileName.substring(0, 30);
        }
        
        return fileName || 'документ';
    }
    
    // Обработка выбора формата
    formatOptions.forEach(option => {
        option.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const fileName = generateFileName();
            const content = quill.root.innerHTML;
            const text = quill.getText();
            
            // Анимация выбора
            this.classList.add('pulse');
            
            switch(format) {
                case 'txt':
                    downloadFile(text, fileName + '.txt', 'text/plain');
                    break;
                case 'html':
                    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${fileName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 2rem;
            color: #334155;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        h1, h2, h3 {
            color: #6366f1;
        }
        .ql-editor {
            padding: 0;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
                    downloadFile(htmlContent, fileName + '.html', 'text/html');
                    break;
                case 'doc':
                    // Для .doc файла используем HTML с определенными метатегами
                    const docContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
xmlns:w="urn:schemas-microsoft-com:office:word" 
xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="utf-8">
    <title>${fileName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
                    downloadFile(docContent, fileName + '.doc', 'application/msword');
                    break;
            }
            
            // Закрываем модальное окно после выбора
            setTimeout(() => {
                formatModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                this.classList.remove('pulse');
            }, 1000);
        });
    });
    
    // Функция для создания и скачивания файла
    function downloadFile(content, fileName, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Файл скачивается...');
    }
});
