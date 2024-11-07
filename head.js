async function loadContent() {
  try {
    const headers = await fetch('nw/head/head.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== ''));
    const bodies = await fetch('nw/body/txt.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== ''));
    
    // Parse buttons with even lines as text and odd lines as links
    const buttons = await fetch('nw/button/button.txt')
      .then(res => res.text())
      .then(data => {
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const buttonData = [];
        for (let i = 0; i < lines.length; i += 2) {
          const buttonText = lines[i].trim();
          const buttonLink = lines[i + 1] ? lines[i + 1].trim() : '#';
          buttonData.push({ buttonText, buttonLink });
        }
        return buttonData;
      });
    
    const images = await fetch('nw/webpng/png.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== '').map(filename => `nw/webpng/${filename.trim()}`));
    const times = await fetch('nw/timers/time.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== '').map(Number));
    const colors = await fetch('nw/colors/color.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== ''));

    let slideIndex = 0;

    function showSlide(index) {
      const newswall = document.getElementById('newswall');
      newswall.innerHTML = '';
      newswall.className = 'newswall';

      const contentContainer = document.createElement('div');
      contentContainer.classList.add('content-container');

      const header = document.createElement('div');
      header.classList.add('slide-header');
      header.textContent = headers[index] || '';
      contentContainer.appendChild(header);

      const body = document.createElement('div');
      body.classList.add('slide-body');
      body.textContent = bodies[index] || '';
      contentContainer.appendChild(body);

      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('slide-buttons');
      const buttonData = buttons[index] || {};
      if (buttonData.buttonText && buttonData.buttonLink) {
        buttonContainer.innerHTML = `<a href="${buttonData.buttonLink}" target="_blank"><button>${buttonData.buttonText}</button></a>`;
        contentContainer.appendChild(buttonContainer);
      }

      newswall.appendChild(contentContainer);

      const color = colors[index % colors.length] || 'white';
      newswall.classList.add(`w3-${color}`);

      if (images[index]) {
        const image = document.createElement('img');
        image.classList.add('slide-image');
        image.src = images[index];
        newswall.appendChild(image);
      }

      setTimeout(() => {
        slideIndex = (slideIndex + 1) % headers.length;
        showSlide(slideIndex);
      }, (times[index] || 5) * 1000);
    }

    showSlide(slideIndex);
  } catch (error) {
    console.error("Error loading content:", error);
  }
}

window.onload = loadContent;
