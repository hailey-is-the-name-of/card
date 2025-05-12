// script.js
const totalCards = 64;  // 이미지/텍스트 개수에 맞춰 조정!
let current = 1;
const card = document.getElementById('card');
const imgEl = document.getElementById('card-img');
const textEl = document.getElementById('card-text');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function loadCard(n, random=false) {
  fetch(`texts/${n}.txt`)
    .then(res => res.text())
    .then(txt => {
      // 페이드 아웃
      card.classList.remove('flipped');
      card.style.opacity = 0;
      setTimeout(() => {
        imgEl.src = `images/${n}.jpg`;
        textEl.textContent = txt;
        // 페이드 인 + 뒤집기
        card.style.opacity = 1;
        if (random) card.classList.add('flipped');
      }, 300);
    })
    .catch(_ => {
      textEl.textContent = '콘텐츠를 불러올 수 없습니다.';
    });
}

prevBtn.onclick = () => {
  current = current > 1 ? current - 1 : totalCards;
  loadCard(current, true);
};

nextBtn.onclick = () => {
  current = Math.floor(Math.random() * totalCards) + 1;
  loadCard(current, true);
};

// 초기 로드
loadCard(current);
