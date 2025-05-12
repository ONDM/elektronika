document.addEventListener('DOMContentLoaded', function () {
  console.log('Stránka načtena');
  // Zobrazení obsahu ihned po načtení
  document.getElementById('content').classList.remove('hidden');

  // Přidání posluchačů na tlačítka
  var buttons = document.querySelectorAll('.buttons-container button');
  console.log('Nalezeno tlačítek:', buttons.length);
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var buttonNumber = button.querySelector('.button-number').innerText;
      console.log('Kliknuto na tlačítko číslo:', buttonNumber);
      showContent(buttonNumber);
    });
  });

  // Skrytí veškerého obsahu při načtení
  document.querySelectorAll('.content').forEach(function (item) {
    item.classList.add('hidden');
  });
});

// Funkce pro zobrazení obsahu podle čísla tlačítka
function showContent(buttonNumber) {
  console.log('Zobrazuji obsah pro:', buttonNumber);

  // Skrytí kontejneru s tlačítky
  document.getElementById('content').classList.add('hidden');

  // Skrytí všech obsahů
  document.querySelectorAll('.content').forEach(function (item) {
    item.classList.add('hidden');
    // Vyčištění předchozího obsahu
    while (item.firstChild) {
      item.removeChild(item.firstChild);
    }
  });

  // Zobrazení konkrétního obsahu
  var contentId = 'content-' + buttonNumber;
  var content = document.getElementById(contentId);
  if (content) {
    var pdfPath = `folder/${buttonNumber}.pdf`;
    console.log('Pokus o načtení PDF z:', pdfPath);

    // Kontrola, zda je zařízení mobilní
    var isMobile = window.innerWidth <= 600;

    if (isMobile) {
      // Pro mobilní zařízení použijeme upravený PDF renderer
      var viewerContainer = document.createElement('div');
      viewerContainer.id = 'pdf-viewer-container';
      viewerContainer.style.width = '100%';
      viewerContainer.style.height = '100%';
      viewerContainer.style.overflow = 'auto';
      viewerContainer.style.backgroundColor = '#333';
      content.appendChild(viewerContainer);

      // Načteme PDF pomocí PDF.js s vylepšenými parametry
      pdfjsLib.getDocument(pdfPath).promise.then(function (pdf) {
        console.log('PDF načteno, počet stránek:', pdf.numPages);

        // Funkce pro vykreslení stránky s vylepšenou kvalitou
        function renderPage(pageNumber) {
          pdf.getPage(pageNumber).then(function (page) {
            // Získáme originální velikost stránky
            var originalViewport = page.getViewport({ scale: 1 });

            // Spočítáme scale pro přizpůsobení šířce zařízení
            var screenWidth = viewerContainer.clientWidth - 10;
            var scale = screenWidth / originalViewport.width;

            // Pro zajištění ostrosti textu zvýšíme rozlišení renderu
            var pixelRatio = window.devicePixelRatio || 1;
            var scaledViewport = page.getViewport({ scale: scale });

            // Vytvoříme canvas pro aktuální stránku
            var canvas = document.createElement('canvas');
            canvas.id = 'pdf-canvas-' + pageNumber;

            // Nastavíme canvas rozměry podle viewportu s pixel ratio
            canvas.width = Math.floor(scaledViewport.width * pixelRatio);
            canvas.height = Math.floor(scaledViewport.height * pixelRatio);
            canvas.style.width = Math.floor(scaledViewport.width) + "px";
            canvas.style.height = Math.floor(scaledViewport.height) + "px";

            // Přidáme canvas do containeru
            viewerContainer.appendChild(canvas);

            // Získáme kontext a nastavíme transformaci
            var context = canvas.getContext('2d');
            context.scale(pixelRatio, pixelRatio);
            context.imageSmoothingEnabled = false;

            // Vykreslíme stránku
            var renderContext = {
              canvasContext: context,
              viewport: scaledViewport,
              enableWebGL: true,
              renderInteractiveForms: true
            };

            page.render(renderContext).promise.then(function () {
              console.log('Stránka', pageNumber, 'vykreslena');
              if (pageNumber < pdf.numPages) {
                renderPage(pageNumber + 1);
              }
            });
          });
        }

        // Začneme vykreslovat od první stránky
        renderPage(1);
      }).catch(function (error) {
        console.error('Chyba při načítání PDF:', error);
        var errorMsg = document.createElement('div');
        errorMsg.innerText = 'Nepodařilo se načíst PDF. Zkontrolujte, zda soubor existuje.';
        errorMsg.style.color = 'white';
        errorMsg.style.padding = '20px';
        errorMsg.style.textAlign = 'center';
        viewerContainer.appendChild(errorMsg);
      });
    } else {
      // Pro desktop použijeme iframe
      var iframe = document.createElement('iframe');
      iframe.src = pdfPath;
      iframe.style.width = '100%';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';

      content.appendChild(iframe);
    }

    // Přidání tlačítka "Zpět" dynamicky
    var backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.innerHTML = '<span class="button-number"></span>Zpět';
    backButton.onclick = goBack;
    content.appendChild(backButton);
    console.log('Přidáno tlačítko Zpět');

    // Zobrazíme obsah
    content.classList.remove('hidden');
    console.log('Zobrazen div:', contentId);
  } else {
    console.error('Div nenalezen:', contentId);
  }
}

// Funkce pro návrat na seznam tlačítek
function goBack() {
  console.log('Kliknuto na Zpět');
  // Skrytí všech obsahů
  document.querySelectorAll('.content').forEach(function (item) {
    item.classList.add('hidden');
    // Odstranění dynamicky přidaného obsahu
    while (item.firstChild) {
      item.removeChild(item.firstChild);
    }
  });

  // Zobrazení kontejneru s tlačítky
  document.getElementById('content').classList.remove('hidden');
  console.log('#content zobrazen');
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/elektronika/sw.js')
    .then(reg => console.log('Service Worker zaregistrován', reg))
    .catch(err => console.error('Chyba registrace:', err));
}