import { ref, onBeforeUnmount } from 'vue';

export function useTextAnimation(settings, textLines) {
  const vibratingItems = ref({});
  const animationFrame = ref(null);
  const lastFrameTime = ref(null);

  const randomVibrate = () => {
    vibratingItems.value = {};

    textLines.value.forEach((text, lineIndex) => {
      const isParagraph = settings.value.textTypes?.[lineIndex] === 'paragraph';

      if (isParagraph) {
        const allWords = [];
        const lines = text.split('\n').filter((line) => line.trim());

        lines.forEach((line, pLineIndex) => {
          const words = line.split(/(\s+)/).map((part) => {
            return part.trim() === '' ? ' ' : part;
          });

          words.forEach((word, wordIndex) => {
            if (word.trim()) {
              allWords.push({
                pLineIndex,
                wordIndex,
                key: `${lineIndex}-${pLineIndex}-${wordIndex}`,
                word: word,
              });
            }
          });
        });

        const randomAmount =
          !settings.value.randomAmount[lineIndex] || settings.value.randomAmount[lineIndex] === 0
            ? settings.value.globalRandomAmount || 50
            : settings.value.randomAmount[lineIndex];

        const wordsToAnimate = Math.ceil(allWords.length * (randomAmount / 100));

        const indices = Array.from({ length: allWords.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        for (let i = 0; i < wordsToAnimate; i++) {
          if (i < indices.length) {
            const selectedWord = allWords[indices[i]];
            vibratingItems.value[selectedWord.key] = true;
          }
        }
      } else {
        const totalLetters = text.length;
        const randomAmount =
          settings.value.randomAmount[lineIndex] === 0
            ? settings.value.globalRandomAmount
            : settings.value.randomAmount[lineIndex];
        const lettersToAnimate = Math.floor(totalLetters * (randomAmount / 100));

        const indices = Array.from({ length: totalLetters }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        for (let i = 0; i < lettersToAnimate; i++) {
          const key = `${lineIndex}-${indices[i]}`;
          vibratingItems.value[key] = true;
        }
      }
    });
  };

  const animate = (timestamp) => {
    if (!lastFrameTime.value) lastFrameTime.value = timestamp;
    const delta = timestamp - lastFrameTime.value;

    if (delta >= settings.value.intervalSpeed) {
      randomVibrate();
      lastFrameTime.value = timestamp;
    }

    animationFrame.value = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value);
    }
    lastFrameTime.value = null;
    animationFrame.value = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value);
      animationFrame.value = null;
    }
  };

  onBeforeUnmount(() => {
    stopAnimation();
  });

  return {
    vibratingItems,
    startAnimation,
    stopAnimation,
  };
}
