import googleFontsService from './googleFonts';

const CONFIG_VERSION = '1.0';

export async function exportConfig(settings) {
  const config = {
    version: CONFIG_VERSION,
    timestamp: new Date().toISOString(),
    settings: { ...settings },
    customFonts: googleFontsService.customFonts,
  };

  delete config.settings.win98;
  delete config.settings.appMode;

  const jsonString = JSON.stringify(config, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `insert-config-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importConfig(file, updateSettings) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const config = JSON.parse(e.target.result);

        if (!config.version || !config.settings) {
          throw new Error('Invalid config file format');
        }

        if (config.customFonts && Array.isArray(config.customFonts)) {
          for (const font of config.customFonts) {
            const existing = googleFontsService.customFonts.find(f => f.name === font.name);
            if (!existing) {
              try {
                const arrayBuffer = googleFontsService.base64ToArrayBuffer(font.data);
                const fontFace = new FontFace(font.name, arrayBuffer);
                await fontFace.load();
                document.fonts.add(fontFace);
                googleFontsService.loadedFonts.add(font.name);
                googleFontsService.customFonts.push(font);
              } catch (fontError) {
                console.error(`Failed to restore font "${font.name}":`, fontError);
              }
            }
          }
          googleFontsService.saveCustomFonts();
        }

        const settingsToApply = { ...config.settings };
        delete settingsToApply.win98;
        delete settingsToApply.appMode;

        updateSettings(settingsToApply);

        resolve({
          success: true,
          fontsImported: config.customFonts?.length || 0,
        });
      } catch (error) {
        reject(new Error(`Failed to import config: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

export function getConfigInfo(settings) {
  return {
    effectType: settings.effectType,
    textLines: settings.textLines?.length || 0,
    customFonts: googleFontsService.customFonts.length,
    imageOverlays: settings.imageOverlays?.length || 0,
    videoOverlays: settings.videoOverlays?.length || 0,
  };
}
