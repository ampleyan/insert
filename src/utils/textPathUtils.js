export function calculateLetterPositions(text, pathConfig, containerWidth, containerHeight) {
  if (!pathConfig.enabled || pathConfig.type === 'none') {
    return null;
  }

  const letters = text.split('');
  const letterCount = letters.length;

  switch (pathConfig.type) {
    case 'arc':
      return calculateArcPath(
        letterCount,
        pathConfig.arcRadius,
        pathConfig.arcStart,
        pathConfig.arcSpan,
        pathConfig.letterRotation,
        pathConfig.letterAlignment,
        containerWidth,
        containerHeight
      );
    case 'wave':
      return calculateWavePath(
        letterCount,
        pathConfig.waveAmplitude,
        pathConfig.waveFrequency,
        pathConfig.waveOffset,
        pathConfig.letterRotation,
        pathConfig.letterAlignment,
        containerWidth,
        containerHeight
      );
    case 'circle':
      return calculateCirclePath(
        letterCount,
        pathConfig.circleRadius,
        pathConfig.circlePosition,
        pathConfig.inwardFacing,
        pathConfig.letterRotation,
        pathConfig.letterAlignment,
        containerWidth,
        containerHeight
      );
    default:
      return null;
  }
}

function calculateArcPath(
  letterCount,
  radius,
  startAngle,
  span,
  rotateLetters,
  alignment,
  containerWidth,
  containerHeight
) {
  const positions = [];
  const startRad = (startAngle * Math.PI) / 180;
  const spanRad = (span * Math.PI) / 180;
  const angleStep = spanRad / Math.max(letterCount - 1, 1);

  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  for (let i = 0; i < letterCount; i++) {
    const angle = startRad + angleStep * i;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    let rotation = 0;
    if (rotateLetters) {
      rotation = ((angle * 180) / Math.PI) + 90;
    }

    positions.push({
      x,
      y,
      rotation,
      index: i,
    });
  }

  return positions;
}

function calculateWavePath(
  letterCount,
  amplitude,
  frequency,
  offset,
  rotateLetters,
  alignment,
  containerWidth,
  containerHeight
) {
  const positions = [];
  const totalWidth = containerWidth * 0.8;
  const startX = (containerWidth - totalWidth) / 2;
  const spacing = totalWidth / Math.max(letterCount - 1, 1);

  const centerY = containerHeight / 2;
  const offsetRad = (offset * Math.PI) / 180;

  for (let i = 0; i < letterCount; i++) {
    const x = startX + spacing * i;
    const wavePos = (i / letterCount) * Math.PI * 2 * frequency + offsetRad;
    const y = centerY + Math.sin(wavePos) * amplitude;

    let rotation = 0;
    if (rotateLetters) {
      const tangent = Math.cos(wavePos) * amplitude * (Math.PI * 2 * frequency / letterCount);
      rotation = Math.atan(tangent) * (180 / Math.PI);
    }

    positions.push({
      x,
      y,
      rotation,
      index: i,
    });
  }

  return positions;
}

function calculateCirclePath(
  letterCount,
  radius,
  position,
  inwardFacing,
  rotateLetters,
  alignment,
  containerWidth,
  containerHeight
) {
  const positions = [];
  let centerX, centerY, startAngle;

  switch (position) {
    case 'top':
      centerX = containerWidth / 2;
      centerY = radius + 50;
      startAngle = inwardFacing ? Math.PI : 0;
      break;
    case 'bottom':
      centerX = containerWidth / 2;
      centerY = containerHeight - radius - 50;
      startAngle = inwardFacing ? 0 : Math.PI;
      break;
    case 'left':
      centerX = radius + 50;
      centerY = containerHeight / 2;
      startAngle = inwardFacing ? Math.PI / 2 : -Math.PI / 2;
      break;
    case 'right':
      centerX = containerWidth - radius - 50;
      centerY = containerHeight / 2;
      startAngle = inwardFacing ? -Math.PI / 2 : Math.PI / 2;
      break;
    default:
      centerX = containerWidth / 2;
      centerY = containerHeight / 2;
      startAngle = 0;
  }

  const angleStep = (Math.PI * 2) / letterCount;

  for (let i = 0; i < letterCount; i++) {
    const angle = startAngle + angleStep * i;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    let rotation = 0;
    if (rotateLetters) {
      rotation = ((angle * 180) / Math.PI) + (inwardFacing ? -90 : 90);
    }

    positions.push({
      x,
      y,
      rotation,
      index: i,
    });
  }

  return positions;
}

export function getLetterStyle(position, baseStyle = {}) {
  if (!position) {
    return baseStyle;
  }

  return {
    ...baseStyle,
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `translate(-50%, -50%) rotate(${position.rotation}deg)`,
    transformOrigin: 'center center',
  };
}

export function splitTextIntoLetters(text) {
  return text.split('').map((letter, index) => ({
    letter,
    index,
  }));
}
