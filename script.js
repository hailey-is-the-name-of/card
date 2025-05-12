// script.js
const total = 64;       // 총 카드 수
let idx = 1;
let texts = [];

// 1) contents.txt 불러와서 1~64로 분리
fetch('contents.txt')
  .then(r => r.text())
  .then(raw => {
    // "\n1." 패턴으로 분리: 맨 앞 공백 처리
    const parts = raw.split(/\n(?=\d+\.)/);
    texts = parts.map(t => t.replace(/^\d+\.\s*/, '').trim());
    loadCard(idx);
  });

// 2) 카드 로드 함수
function loadCard(n) {
  const card = document.getElementById('card');
  const img = document.getElementById('card-img');
  const txt = document.getElementById('card-text');

  // 뒤집힘 해제
  card.classList.remove('flipped');

  // 이미지, 텍스트 교체
  img.src = `images/${n}.jpg`;
  txt.textContent = texts[n-1] || '';

  // 진짜 이미지 로드된 뒤 사이즈 동기화
  img.onload = () => {
    // 카드 크기를 이미지 크기와 동일하게
    card.style.width = img.clientWidth + 'px';
    card.style.height = img.clientHeight + 'px';
  };
}

// 3) 애니메이션: 이전
document.getElementById('prev').onclick = () => {
  const card = document.getElementById('card');
  // 뒤에서 위로 올라오는 준비: 바로 뒤에 위치
  card.style.transition = 'none';
  card.style.transform = 'translateY(20px)';
  idx = idx>1 ? idx-1 : total;
  loadCard(idx);
  // 살짝 위에서 스르륵 내려오기
  requestAnimationFrame(() => {
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = 'translateY(0)';
  });
};

// 4) 애니메이션: 다음
document.getElementById('next').onclick = () => {
  const card = document.getElementById('card');
  // 현재 카드 오른쪽으로 슬라이드 아웃
  card.style.transition = 'transform 0.4s ease';
  card.style.transform = `translateX(100vw)`;
  // 아웃 애니 끝나면 뒤에서 올라오는 다음 카드
  card.addEventListener('transitionend', function handler() {
    card.removeEventListener('transitionend', handler);
    // 초기 위치 뒤에서
    card.style.transition = 'none';
    card.style.transform = 'translateY(20px)';
    idx = Math.floor(Math.random()*total) + 1;
    loadCard(idx);
    requestAnimationFrame(() => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = 'translateY(0)';
    });
  });
};

// 5) 카드 클릭 시 뒤집기
document.getElementById('card').onclick = () => {
  document.getElementById('card').classList.toggle('flipped');
};
