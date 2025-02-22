document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button[data-difficulty]');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const difficulty = e.target.dataset.difficulty;
            window.location.href = `Game.html?mode=computer&difficulty=${difficulty}`;
        });
    });
});