<template>
  <div class="macos-login-screen" :style="loginScreenStyle">
    <div v-if="hasBackgroundImage" class="macos-login-background" :style="backgroundImageStyle"></div>
    <div class="macos-login-menubar">
      <div class="macos-login-menu-left">
        <div class="macos-menu-item apple-menu">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z'/%3E%3C/svg%3E" alt="Apple" class="apple-logo">
        </div>
        <div class="macos-menu-item">Help</div>
      </div>
      <div class="macos-login-menu-right">
        <div class="macos-menu-item">{{ currentTime }}</div>
        <div class="macos-menu-item login-button">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="Login" class="login-icon">
          Login
        </div>
      </div>
    </div>

    <div class="macos-login-content">
      <div class="macos-login-dialog" :style="dialogStyle">
        <div class="macos-login-header">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z'/%3E%3C/svg%3E" alt="Apple" class="apple-logo-large">
          <h1 class="macos-login-title">{{ loginTitle }}</h1>
        </div>

        <div class="macos-login-user-section" :style="userSectionStyle">
          <div class="macos-login-user-info">
            <img :src="userIcon" alt="User" class="macos-user-icon">
            <span class="macos-user-name">{{ userName }}</span>
          </div>
          <div v-if="showPasswordField" class="macos-login-password-area">
            <div class="password-input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                :placeholder="passwordPlaceholder"
                class="macos-password-input"
                :style="inputStyle"
                @keyup.enter="handleLogin"
              />
              <button class="password-toggle-btn" @click="showPassword = !showPassword" type="button">
                <img v-if="showPassword" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666666'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E" alt="Hide" class="eye-icon">
                <img v-else src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666666'%3E%3Cpath d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'/%3E%3C/svg%3E" alt="Show" class="eye-icon">
              </button>
            </div>
          </div>
        </div>

        <div class="macos-login-buttons">
          <button class="macos-login-btn" :style="buttonStyle" @click="handleShutdown">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z'/%3E%3C/svg%3E" alt="" class="btn-icon">
            {{ shutdownText }}
          </button>
          <button v-if="showChangePassword" class="macos-login-btn" :style="buttonStyle" @click="handleChangePassword">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z'/%3E%3C/svg%3E" alt="" class="btn-icon">
            {{ changePasswordText }}
          </button>
          <button class="macos-login-btn macos-login-btn-primary" :style="primaryButtonStyle" @click="handleLogin">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E" alt="" class="btn-icon">
            {{ loginButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { getSkin } from '../../constants/skins';

export default {
  name: 'MacOSLoginScreen',
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      password: '',
      currentTime: this.formatTime(),
      timeInterval: null,
      showPassword: false,
      isLoggingIn: false,
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    loginConfig() {
      return this.win98.macLoginScreen || {};
    },
    skin() {
      return getSkin(this.win98.activeSkin);
    },
    loginTitle() {
      return this.loginConfig.title || 'Welcome to Mac OS';
    },
    userName() {
      return this.loginConfig.userName || 'User';
    },
    userIcon() {
      return this.loginConfig.userIcon || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%235b6b95"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
    },
    showPasswordField() {
      return this.loginConfig.showPasswordField !== false;
    },
    passwordPlaceholder() {
      return this.loginConfig.passwordPlaceholder || 'Password';
    },
    showChangePassword() {
      return this.loginConfig.showChangePassword !== false;
    },
    shutdownText() {
      return this.loginConfig.shutdownText || 'Shutdown';
    },
    changePasswordText() {
      return this.loginConfig.changePasswordText || 'Change Password';
    },
    loginButtonText() {
      return this.loginConfig.loginButtonText || 'Log In';
    },
    loginScreenStyle() {
      const bgColor = this.loginConfig.backgroundColor || this.skin.colors.loginBg || '#6b7b9b';
      const patternColor = this.loginConfig.patternColor || this.skin.colors.loginBgPattern || '#5b6b8b';

      const styles = {
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor} 100%)`,
      };

      if (this.loginConfig.loginBackgroundImage) {
        const opacity = (this.loginConfig.loginBackgroundOpacity || 100) / 100;
        const blur = this.loginConfig.loginBackgroundBlur || 0;
        const fit = this.loginConfig.loginBackgroundFit || 'cover';

        styles.backgroundImage = `url(${this.loginConfig.loginBackgroundImage})`;
        styles.backgroundSize = fit;
        styles.backgroundPosition = 'center';
        styles.backgroundRepeat = 'no-repeat';
        styles.position = 'relative';

        if (opacity < 1 || blur > 0) {
          styles.backgroundImage = 'none';
        }
      } else if (this.loginConfig.showPattern !== false) {
        styles.backgroundImage = `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            ${patternColor}15 35px,
            ${patternColor}15 70px
          )
        `;
      }

      return styles;
    },
    hasBackgroundImage() {
      return !!this.loginConfig.loginBackgroundImage;
    },
    backgroundImageStyle() {
      if (!this.loginConfig.loginBackgroundImage) return {};

      const opacity = (this.loginConfig.loginBackgroundOpacity || 100) / 100;
      const blur = this.loginConfig.loginBackgroundBlur || 0;
      const fit = this.loginConfig.loginBackgroundFit || 'cover';

      return {
        backgroundImage: `url(${this.loginConfig.loginBackgroundImage})`,
        backgroundSize: fit,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: opacity,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
      };
    },
    dialogStyle() {
      const bgColor = this.loginConfig.dialogBgColor || this.skin.colors.loginDialog || '#f0f0f0';
      const borderColor = this.loginConfig.dialogBorderColor || this.skin.colors.loginDialogBorder || '#555577';
      return {
        backgroundColor: bgColor,
        borderColor: borderColor,
      };
    },
    userSectionStyle() {
      const inputBgColor = this.loginConfig.inputBgColor || this.skin.colors.loginInputBg || '#ffffff';
      const inputBorderColor = this.loginConfig.inputBorderColor || this.skin.colors.loginInputBorder || '#555577';
      return {
        '--input-bg': inputBgColor,
        '--input-border': inputBorderColor,
      };
    },
    inputStyle() {
      const bgColor = this.loginConfig.inputBgColor || this.skin.colors.loginInputBg || '#ffffff';
      const borderColor = this.loginConfig.inputBorderColor || this.skin.colors.loginInputBorder || '#555577';
      return {
        backgroundColor: bgColor,
        borderColor: borderColor,
      };
    },
    buttonStyle() {
      const bgColor = this.loginConfig.buttonBgColor || this.skin.colors.loginButton || '#e0e0e0';
      return {
        backgroundColor: bgColor,
      };
    },
    primaryButtonStyle() {
      const bgColor = this.loginConfig.primaryButtonBgColor || this.skin.colors.loginButton || '#e0e0e0';
      return {
        backgroundColor: bgColor,
        fontWeight: 'bold',
      };
    },
  },
  mounted() {
    this.timeInterval = setInterval(() => {
      this.currentTime = this.formatTime();
    }, 1000);
  },
  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },
  methods: {
    formatTime() {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    },
    handleLogin() {
      this.isLoggingIn = true;
      this.$emit('login', {
        userName: this.userName,
        password: this.password,
      });
    },
    handleShutdown() {
      this.$emit('shutdown');
    },
    handleChangePassword() {
      this.$emit('change-password', {
        userName: this.userName,
      });
    },
  },
};
</script>

<style scoped>
.macos-login-screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Charcoal', 'Geneva', 'Lucida Grande', 'Helvetica Neue', Helvetica, sans-serif;
  position: relative;
  overflow: hidden;
}

.macos-login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.macos-login-menubar {
  height: 24px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.macos-login-menu-left,
.macos-login-menu-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.macos-menu-item {
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 3px;
}

.macos-menu-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.apple-menu {
  padding: 2px 6px;
}

.apple-logo {
  width: 16px;
  height: 16px;
}

.login-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

.login-icon {
  width: 14px;
  height: 14px;
}

.macos-login-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 1;
}

.macos-login-dialog {
  background: #f0f0f0;
  border: 3px solid #555577;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.macos-login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.apple-logo-large {
  width: 48px;
  height: 48px;
}

.macos-login-title {
  font-size: 20px;
  font-weight: normal;
  margin: 0;
  color: #000;
  font-family: 'Charcoal', 'Geneva', serif;
  letter-spacing: 0.5px;
}

.macos-login-user-section {
  border: 2px solid var(--input-border, #555577);
  border-radius: 4px;
  padding: 16px;
  background: white;
  margin-bottom: 20px;
  min-height: 120px;
}

.macos-login-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(91, 107, 149, 0.08);
  border-radius: 3px;
}

.macos-user-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #e0e0e0;
  padding: 4px;
}

.macos-user-name {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.macos-login-password-area {
  padding: 8px 0;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.macos-password-input {
  flex: 1;
  padding: 8px 40px 8px 12px;
  border: 2px solid #555577;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  background: white;
  outline: none;
}

.password-toggle-btn {
  position: absolute;
  right: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  transition: background 0.15s;
}

.password-toggle-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.eye-icon {
  width: 20px;
  height: 20px;
}

.macos-password-input:focus {
  border-color: #5b6b95;
  box-shadow: 0 0 0 2px rgba(91, 107, 149, 0.2);
}

.macos-login-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.macos-login-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #e0e0e0;
  border: 2px solid #888;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transition: all 0.15s;
}

.macos-login-btn:hover {
  background: #f0f0f0;
  border-color: #555;
}

.macos-login-btn:active {
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.1);
  transform: translateY(1px);
}

.macos-login-btn-primary {
  border-color: #555577;
}

.btn-icon {
  width: 18px;
  height: 18px;
}
</style>
