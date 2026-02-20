/**
 * Simple utility to play notification sounds using Base64 strings.
 * This avoids the need for importing external audio files which can be tricky with some bundlers.
 */

// A short "ting" sound (base64 encoded MP3)
const NOTIFICATION_SOUND = "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWgAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMbXZoZAAAAAMAAAABAAAB5gAAAxQAAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADbXBmdAAAAABAAAbedmRpZgAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAACAAAABgAAAAAAAABlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAACAwAAAAxzb3VuZGEAAAAA//uQZAUAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAABzZHRwAAAAAAAAAAEAAAAA//uQZAsAAl1u0f9gAAAAA0gAAABHuW7R/2AAAAADSAAAAEAAAABtZGF0YQAAAAAABAAA//uQZAuAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZAyAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZA0AAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZA4AAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZA8AAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZBAAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZBEAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZBIAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB";

// A slightly more pleasant "ding" sound
const TING_SOUND = "data:audio/wav;base64,UklGRl9vT1BXQVZfmtue";

// Using a clean "ding" sound effect (base64)
const ALERT_SOUND = "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWgAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMbXZoZAAAAAMAAAABAAAB5gAAAxQAAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADbXBmdAAAAABAAAbedmRpZgAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAACAAAABgAAAAAAAABlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAACAwAAAAxzb3VuZGEAAAAA//uQZAUAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAABzZHRwAAAAAAAAAAEAAAAA//uQZAsAAl1u0f9gAAAAA0gAAABHuW7R/2AAAAADSAAAAEAAAABtZGF0YQAAAAAABAAA//uQZAuAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZAyAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZA0AAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZA4AAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZA8AAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZBAAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZBEAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB//uQZBIAAyl5Uf9hgAAAAA0gAAABF5wVP9hAAACgAAAAQAAAAB";

// Singleton AudioContext
let audioCtx: AudioContext | null = null;

const initAudioContext = () => {
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }

        // Resume if suspended (browser autoplay policy)
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    } catch (e) {
        console.error("Failed to initialize/resume AudioContext:", e);
    }
};

const playNotificationSound = () => {
    try {
        // Try to init/resume first
        initAudioContext();

        if (audioCtx) {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
            oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1); // Drop to A4

            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
        } else {
            console.warn("AudioContext not available");
        }
    } catch (error) {
        console.error("Failed to play notification sound:", error);
    }
};

export { initAudioContext };
export default playNotificationSound;
