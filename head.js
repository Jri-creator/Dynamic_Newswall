async function loadContent() {
  try {
    const headers = await fetch('nw/head/head.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== ''));
    const bodies = await fetch('nw/body/txt.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== ''));
    
    const buttons = await fetch('nw/button/button.txt')
      .then(res => res.text())
      .then(data => {
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const buttonData = [];
        for (let i = 0; i < lines.length; i += 2) {
          let buttonText = lines[i].trim();
          const buttonLink = lines[i + 1] ? lines[i + 1].trim() : '#';

          let isDisabled = false;
          let openInWindow = false;
          let windowWidth = 600;
          let windowHeight = 400;

          // Check for special cases in the button text
          if (buttonText.includes('{disabled}')) {
            isDisabled = true;
            buttonText = buttonText.replace('{disabled}', '').trim();
          }
          const windowMatch = buttonText.match(/\{window,\s*(\d+),\s*(\d+)\}/);
          if (windowMatch) {
            openInWindow = true;
            windowWidth = parseInt(windowMatch[1], 10);
            windowHeight = parseInt(windowMatch[2], 10);
            buttonText = buttonText.replace(/\{window,\s*\d+,\s*\d+\}/, '').trim();
          }

          buttonData.push({ buttonText, buttonLink, isDisabled, openInWindow, windowWidth, windowHeight });
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

      if (buttonData.buttonText) {
        const button = document.createElement('button');
        button.textContent = buttonData.buttonText;

        if (buttonData.isDisabled) {
          button.disabled = true;
          button.classList.add('disabled-button');
        } else if (buttonData.openInWindow) {
          button.onclick = () => window.open(buttonData.buttonLink, '_blank', `width=${buttonData.windowWidth},height=${buttonData.windowHeight}`);
        } else {
          button.onclick = () => window.open(buttonData.buttonLink, '_blank');
        }
        buttonContainer.appendChild(button);
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
