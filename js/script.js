let rotateAngle = 0;
let rotateCount = 0;
let saturationLevel = 100;
let wheelLocked = false;
let currentSpineIndex = 0;
let phase2WheelLock = false;

const circleImg = document.getElementById("circleImg");
const gif = document.getElementById("circleGif");
const circleContainer = document.getElementById("circleContainer");
const phase1 = document.getElementById("phase1");
const phase2 = document.getElementById("phase2");
const phase3 = document.getElementById("phase3");
const bgVideo = document.getElementById("bgVideo");
const wrapper = document.getElementById("wrapper");
const clickSound = document.getElementById("clickSound");
const spines = document.querySelectorAll(".spine-section");

// ✅ 사운드 재생 함수
function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

// ✅ Phase 1: 클릭/휠/엔터 동작
function handlePhase1Advance() {
  playClickSound();

  if (rotateCount >= 8) {
    transitionToPhase2();
    return;
  }

  if (rotateCount === 0) {
    const rect = circleContainer.getBoundingClientRect();
    circleContainer.style.position = 'fixed';
    circleContainer.style.left = `${rect.left}px`;
    circleContainer.style.top = `${rect.top}px`;
    circleContainer.style.width = `${rect.width}px`;
    circleContainer.style.height = `${rect.height}px`;
    circleContainer.style.transform = 'none';
    circleContainer.style.zIndex = '5';

    void circleContainer.offsetWidth;

    circleContainer.style.left = '50%';
    circleContainer.style.top = '0';
    circleContainer.style.width = '1500px';
    circleContainer.style.height = '1500px';
    circleContainer.style.transform = 'translate(-50%, -60%)';

    gif.classList.add("visible");
  } else {
    rotateAngle += 45;
    circleImg.style.transform = `rotate(${rotateAngle}deg)`;
  }

  gif.style.transform = "";
  bgVideo.currentTime += 0.5;
  bgVideo.play();
  saturationLevel = Math.max(0, saturationLevel - 10);
  wrapper.style.filter = `saturate(${saturationLevel}%)`;

  rotateCount++;
}

// ✅ Phase 2 전환
function transitionToPhase2() {
  document.body.dataset.phase = "phase2";
  phase1.style.transform = "translateX(-100%)";
  phase2.classList.add("visible");
}

// ✅ Phase 3 전환
function transitionToPhase3() {
  document.body.dataset.phase = "phase3";
  phase2.style.transform = "translateX(-100%)";
  phase3.classList.add("visible");
}

// ✅ Phase 2: spine 열기 + 채도 복원 포함
function advanceSpineInPhase2() {
  if (currentSpineIndex < spines.length) {
    spines.forEach((s, i) => s.classList.toggle("active", i === currentSpineIndex));
    playClickSound();
    currentSpineIndex++;

    // ✅ 채도 복원 추가
    saturationLevel = Math.min(100, saturationLevel + 10);
    wrapper.style.filter = `saturate(${saturationLevel}%)`;

    if (currentSpineIndex === spines.length) {
      setTimeout(() => {
        transitionToPhase3();
      }, 400);
    }
  }
}

// ✅ Phase 1 클릭
circleImg.addEventListener("click", handlePhase1Advance);

// ✅ 입력 이벤트 (phase 구분 포함)
document.addEventListener("keydown", (e) => {
  const phase = document.body.dataset.phase;
  if (phase === "phase1") {
    if (e.code === "Enter" || e.code === "Space") {
      e.preventDefault();
      handlePhase1Advance();
    }
  } else if (phase === "phase2") {
    if (e.code === "Enter" || e.code === "Space") {
      e.preventDefault();
      advanceSpineInPhase2();
    }
  }
});

document.addEventListener("wheel", (e) => {
  const phase = document.body.dataset.phase;

  if (phase === "phase1") {
    if (wheelLocked) return;
    wheelLocked = true;
    handlePhase1Advance();
    setTimeout(() => { wheelLocked = false; }, 700);
  }

  else if (phase === "phase2") {
    if (phase2WheelLock) return;
    phase2WheelLock = true;
    advanceSpineInPhase2();
    setTimeout(() => { phase2WheelLock = false; }, 500);
  }
});

// ✅ Phase 2 → Phase 3 직접 spine 클릭
document.getElementById("toPhase3").addEventListener("click", () => {
  playClickSound();
  transitionToPhase3();
});

// ✅ Phase 2: hover 시 spine 강조 + 채도 복원
spines.forEach((spine) => {
  spine.addEventListener("mouseenter", () => {
    spines.forEach((s) => s.classList.remove("active"));
    spine.classList.add("active");

    saturationLevel = Math.min(100, saturationLevel + 10);
    wrapper.style.filter = `saturate(${saturationLevel}%)`;
  });
});
