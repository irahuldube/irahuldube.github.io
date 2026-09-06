// Live countdown: "Dynamic preview will close in 04:53"
// Starts from the value shown in the reference screenshot and counts down in real time.
(function () {
  const el = document.getElementById('countdown');
  if (!el) return;

  let totalSeconds = 4 * 60 + 53; // 04:53

  function render() {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  render();

  const timer = setInterval(() => {
    totalSeconds -= 1;
    if (totalSeconds <= 0) {
      totalSeconds = 0;
      render();
      clearInterval(timer);
      el.textContent = 'Expired';
      return;
    }
    render();
  }, 1000);

  // Live clock in the status bar (mirrors the "9:49" shown in the screenshot)
  const timeEl = document.querySelector('.statusbar .time');
  if (timeEl) {
    function updateClock() {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      h = h % 12 || 12;
      timeEl.textContent = `${h}:${m}`;
    }
    updateClock();
    setInterval(updateClock, 15000);
  }
})();
