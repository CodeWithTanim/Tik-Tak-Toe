document.addEventListener("DOMContentLoaded", () => {
    const startGameBtn = document.getElementById("start-game");
    const player1Input = document.getElementById("player1");
    const player2Input = document.getElementById("player2");

    startGameBtn.addEventListener("click", () => {
        const player1 = player1Input.value || "Player 1";
        const player2 = player2Input.value || "Player 2";
        
        // Add button click animation
        startGameBtn.style.transform = "scale(0.95)";
        setTimeout(() => {
            startGameBtn.style.transform = "scale(1)";
            window.location.href = `Game.html?p1=${encodeURIComponent(player1)}&p2=${encodeURIComponent(player2)}`;
        }, 200);
    });

    // Add input hover effects
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("mouseenter", () => {
            input.style.transform = "scale(1.02)";
        });
        input.addEventListener("mouseleave", () => {
            input.style.transform = "scale(1)";
        });
    });
});