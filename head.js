async function loadContent() {
  // Fetch data from each file with prepended folders
  const headers = await fetch('nw/head/head.txt').then(res => res.text()).then(data => data.split('\n'));
  const bodies = await fetch('nw/body/txt.txt').then(res => res.text()).then(data => data.split('\n'));
  const buttons = await fetch('nw/button/button.txt').then(res => res.text()).then(data => data.split('\n').map(line => {
    const [buttonText, buttonHTML] = line.split('\\');
    return { buttonText: buttonText.trim(), buttonHTML: buttonHTML.trim() };
  }));
  const images = await fetch('nw/webpng/png.txt').then(res => res.text()).then(data => data.split('\n').map(filename => `nw/webpng/${filename.trim()}`));
  const times = await fetch('nw/timers/time.txt').then(res => res.text()).then(data => data.split('\n').map(Number));
  const colors = await fetch('nw/colors/color.txt').then(res => res.text()).then(data => data.split('\n'));

  let slideIndex = 0;

  function showSlide(index) {
    // Clear previous content
    const newswall = document.getElementById('newswall');
    newswall.innerHTML = '';

    // Create header
    const header = document.createElement('div');
    header.classList.add('slide-header');
    header.textContent = headers[index] || '';
    newswall.appendChild(header);

    // Create body content
    const body = document.createElement('div');
    body.classList.add('slide-body');
    body.textContent = bodies[index] || '';
    newswall.appendChild(body);

    // Create buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('slide-buttons');
    const buttonData = buttons[index] || {};
    if (buttonData.buttonText && buttonData.buttonHTML) {
      buttonContainer.innerHTML = `<button onclick="${buttonData.buttonHTML}">${buttonData.buttonText}</button>`;
      newswall.appendChild(buttonContainer);
    }

    // Set color and background color
    newswall.classList.add(`w3-${colors[index] || 'white'}`);

    // Display image if available
    if (images[index]) {
      const image = document.createElement('img');
      image.classList.add('slide-image');
      image.src = images[index];
      newswall.appendChild(image);
    }

    // Set timer for next slide
    setTimeout(() => {
      slideIndex = (slideIndex + 1) % headers.length;
      showSlide(slideIndex);
    }, (times[index] || 5) * 1000);
  }

  // Start the slideshow
  showSlide(slideIndex);
}