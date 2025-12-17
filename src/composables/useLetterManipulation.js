import { ref } from 'vue';

export function useLetterManipulation(emit) {
  const selectedLetter = ref({ lineIndex: null, letterIndex: null });
  const manipulating = ref({ active: false, type: null, startX: 0, startY: 0, startValue: 0 });

  const selectLetter = (lineIndex, letterIndex) => {
    selectedLetter.value = { lineIndex, letterIndex };
  };

  const deselectLetter = () => {
    selectedLetter.value = { lineIndex: null, letterIndex: null };
  };

  const isLetterSelected = (lineIndex, letterIndex) => {
    return (
      selectedLetter.value.lineIndex === lineIndex &&
      selectedLetter.value.letterIndex === letterIndex
    );
  };

  const startManipulation = (event, type, currentValue) => {
    event.stopPropagation();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    manipulating.value = {
      active: true,
      type,
      startX: clientX,
      startY: clientY,
      startValue: currentValue,
    };
  };

  const onManipulate = (event, letterTransforms) => {
    if (!manipulating.value.active || selectedLetter.value.lineIndex === null) return;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const { lineIndex, letterIndex } = selectedLetter.value;
    const { type, startX, startY, startValue } = manipulating.value;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    const transforms = letterTransforms[lineIndex] || {};
    const currentTransform = transforms[letterIndex] || {
      scale: 1,
      rotate: 0,
      skewX: 0,
      skewY: 0,
    };

    let newValue = startValue;

    switch (type) {
      case 'scale':
        newValue = Math.max(0.1, startValue + deltaY * -0.01);
        currentTransform.scale = newValue;
        break;
      case 'rotate':
        newValue = startValue + deltaX * 0.5;
        currentTransform.rotate = newValue;
        break;
      case 'skewX':
        newValue = startValue + deltaX * 0.2;
        currentTransform.skewX = Math.max(-45, Math.min(45, newValue));
        break;
      case 'skewY':
        newValue = startValue + deltaY * 0.2;
        currentTransform.skewY = Math.max(-45, Math.min(45, newValue));
        break;
    }

    const newTransforms = [...letterTransforms];
    if (!newTransforms[lineIndex]) {
      newTransforms[lineIndex] = {};
    }
    newTransforms[lineIndex][letterIndex] = currentTransform;

    emit('update', { letterTransforms: newTransforms });
  };

  const stopManipulation = () => {
    manipulating.value = { active: false, type: null, startX: 0, startY: 0, startValue: 0 };
  };

  return {
    selectedLetter,
    manipulating,
    selectLetter,
    deselectLetter,
    isLetterSelected,
    startManipulation,
    onManipulate,
    stopManipulation,
  };
}
