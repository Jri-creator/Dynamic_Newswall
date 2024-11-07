async function loadContent() {
  try {
    // Fetch and filter data from each file, ignoring any blank lines
    const headers = await fetch('nw/head/head.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== ''));
    console.log('Headers:', headers); // Log headers content
    
    const bodies = await fetch('nw/body/txt.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== ''));
    console.log('Bodies:', bodies); // Log bodies content
    
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
    console.log('Buttons:', buttons); // Log buttons content
    
    const images = await fetch('nw/webpng/png.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== '').map(filename => `nw/webpng/${filename.trim()}`));
    console.log('Images:', images); // Log image paths
    
    const times = await fetch('nw/timers/time.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== '').map(Number));
    console.log('Times:', times); // Log timing for slides
    
    const colors = await fetch('nw/colors/color.txt')
      .then(res => res.text())
      .then(data => data.split('\n').filter(line => line.trim() !== ''));
    console.log('Colors:', colors); // Log colors content

    let slideIndex = 0;

    function showSlide(index) {
      // Clear previous content
      const newswall = document.getElementById('newswall');
      newswall.innerHTML = '';

      // Remove previous color class
      newswall.className = 'newswall'; // Reset to default class

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

      // Set color and background color, loop if out of range
      const color = colors[index % colors.length] || 'white'; // Use modulo to wrap around colors array
      newswall.classList.add(`w3-${color}`);

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
  } catch (error) {
    console.error("Error loading content:", error);
  }
}

// Load the newswall content on page load
window.onload = loadContent;
