const navigationEvent = new CustomEvent('auth-navigate', { detail: { path: '' } });

// 로그인 페이지로 이동하는 이벤트 발생
export const navigate = (path: string) => {
  navigationEvent.detail.path = path;
  window.dispatchEvent(navigationEvent);
};