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
        return lines.reduce((acc, line, index) => {
          if (index % 2 === 0) {
            acc.push({ buttonText: line.trim(), buttonHTML: '' });
          } else {
            if (acc.length > 0) {
              acc[acc.length - 1].buttonHTML = line.trim();
            }
          }
          return acc;
        }, []);
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

      // Main content container (for text)
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
      if (buttonData.buttonText && buttonData.buttonHTML) {
        buttonContainer.innerHTML = `<button onclick="${buttonData.buttonHTML}">${buttonData.buttonText}</button>`;
        contentContainer.appendChild(buttonContainer);
      }

      newswall.appendChild(contentContainer);

      // Set color
      const color = colors[index % colors.length] || 'white';
      newswall.classList.add(`w3-${color}`);

      // Image on the side, if available
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
