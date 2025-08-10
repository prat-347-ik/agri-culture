// Marketplace Tabs Functionality
function openMarketTab(evt, tabName) {
  // Hide all tab content
  const tabContents = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = 'none';
  }

  // Remove active class from all tab links
  const tabLinks = document.getElementsByClassName('tab-link');
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(' active', '');
  }

  // Show the selected tab content and add active class to the button
  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.className += ' active';
}

// Bid functionality
function placeBid(button) {
  const bidItem = button.closest('.bid-item');
  const bidInput = bidItem.querySelector('.bid-input');
  const currentBidElement = bidItem.querySelector('.current-bid');
  
  if (bidInput.value.trim() === '') {
    alert('Please enter a bid amount');
    return;
  }
  
  const bidAmount = parseFloat(bidInput.value);
  const currentBidText = currentBidElement.textContent;
  const currentAmount = parseFloat(currentBidText.replace('Current Bid: $', ''));
  
  if (bidAmount <= currentAmount) {
    alert('Your bid must be higher than the current bid');
    return;
  }
  
  // Update current bid
  currentBidElement.textContent = `Current Bid: $${bidAmount}`;
  bidInput.value = '';
  
  // Show success message
  const successMsg = document.createElement('div');
  successMsg.textContent = 'Bid placed successfully!';
  successMsg.style.color = '#4caf50';
  successMsg.style.fontSize = '0.8rem';
  successMsg.style.marginTop = '0.5rem';
  successMsg.style.textAlign = 'center';
  
  bidItem.appendChild(successMsg);
  
  // Remove success message after 3 seconds
  setTimeout(() => {
    if (successMsg.parentNode) {
      successMsg.remove();
    }
  }, 3000);
}

// Rent functionality
function rentEquipment(button) {
  const rentItem = button.closest('.rent-item');
  const durationSelect = rentItem.querySelector('.rent-duration');
  const equipmentName = rentItem.querySelector('h3').textContent;
  const price = rentItem.querySelector('.price').textContent;
  
  const duration = durationSelect.value;
  const durationText = durationSelect.options[durationSelect.selectedIndex].text;
  
  // Show confirmation dialog
  const confirmRent = confirm(`Confirm rental:\nEquipment: ${equipmentName}\nDuration: ${durationText}\nPrice: ${price}`);
  
  if (confirmRent) {
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.textContent = 'Rental confirmed! You will be contacted soon.';
    successMsg.style.color = '#4caf50';
    successMsg.style.fontSize = '0.8rem';
    successMsg.style.marginTop = '0.5rem';
    successMsg.style.textAlign = 'center';
    
    rentItem.appendChild(successMsg);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
      if (successMsg.parentNode) {
        successMsg.remove();
      }
    }, 5000);
  }
}

// --- Simple I18N ---
const translations = {
  en: {
    login: 'Login',
    menu: 'Menu',
    home: 'Home',
    map: 'Map',
    market: 'Market',
    contacts: 'Contacts',
    etc: 'etc',
    welcomeTitle: 'Welcome to Agri-Culture',
    welcomeSubtitle: 'Connecting Farmers for a Better Tomorrow',
    mapDesc: 'Explore local farms and agricultural areas',
    viewMap: 'View Map',
    marketDesc: 'Buy, bid, and rent agricultural equipment',
    visitMarket: 'Visit Market',
    contactsDesc: 'Important contacts for farmers',
    viewContacts: 'View Contacts',
    allFarms: 'All Farms',
    cropFields: 'Crop Fields',
    equipment: 'Equipment',
    weather: 'Weather',
    buy: 'Buy',
    bid: 'Bid',
    rent: 'Rent',
    tractorDesc: 'High-quality farming tractor',
    seeds: 'Seeds Package',
    seedsDesc: 'Premium quality seeds',
    fertilizer: 'Fertilizer',
    fertilizerDesc: 'Organic fertilizer blend',
    irrigation: 'Irrigation System',
    irrigationDesc: 'Complete irrigation setup',
    buyNow: 'Buy Now',
    pesticide: 'Pesticide',
    starting50: 'Starting: $50',
    pesticideDesc: 'Eco-friendly pesticide',
    placeBid: 'Place Bid',
    harvester: 'Harvester',
    starting15000: 'Starting: $15,000',
    harvesterDesc: 'Advanced harvesting machine',
    greenhouse: 'Greenhouse',
    starting8000: 'Starting: $8,000',
    greenhouseDesc: 'Complete greenhouse setup',
    irrigationPump: 'Irrigation Pump',
    pumpDesc: 'High-capacity pump',
    tractor: 'Tractor',
    tractorRentDesc: 'Daily tractor rental',
    harvesterRentDesc: 'Professional harvester',
    rentNow: 'Rent Now',
    search: 'Search',
    searchContacts: 'Search contacts...',
    all: 'All',
    government: 'Government',
    emergency: 'Emergency',
    services: 'Services',
    role: 'Role',
    nameDept: 'Name/Dept',
    contactNumber: 'Contact Number',
    action: 'Action',
    call: 'Call',
    talukaOffice: 'Taluka Office',
    policeStation: 'Police Station',
    vetVan: 'Vet Van',
    soilTesting: 'Soil Testing',
    weatherService: 'Weather Service',
    agriExtension: 'Agricultural Extension',
    emergencyHelpline: 'Emergency Helpline',
    cropInsurance: 'Crop Insurance',
    additionalServices: 'Additional Services',
    weatherForecast: 'Weather Forecast',
    weatherDesc: 'Get daily weather updates for your area',
    sunny: 'Sunny',
    viewDetails: 'View Details',
    cropCalendar: 'Crop Calendar',
    cropCalendarDesc: 'Plan your farming activities',
    wheatSeason: 'Wheat Season',
    viewCalendar: 'View Calendar',
    priceUpdates: 'Price Updates',
    priceUpdatesDesc: 'Latest market prices for crops',
    viewPrices: 'View Prices',
    expertAdvice: 'Expert Advice',
    expertAdviceDesc: 'Connect with agricultural experts',
    soilExpert: 'Soil Expert',
    chatNow: 'Chat Now',
    trainingPrograms: 'Training Programs',
    trainingDesc: 'Learn modern farming techniques',
    organicFarming: 'Organic Farming',
    twoWeeks: '2 weeks',
    enrollNow: 'Enroll Now',
    insuranceServices: 'Insurance Services',
    insuranceDesc: 'Protect your crops and equipment',
    getQuote: 'Get Quote',
    // Profile page translations
    profile: 'Profile',
    fullName: 'Full Name',
    age: 'Age',
    gender: 'Gender',
    phoneNumber: 'Phone Number',
    address: 'Address',
    district: 'District',
    taluka: 'Taluka',
    village: 'Village',
    pincode: 'Pincode',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    reset: 'Reset',
    save: 'Save',
    verified: 'Phone verified!',
    continue: 'Continue',
  },
  mr: {
    login: 'लॉगिन',
    menu: 'मेनू',
    home: 'मुखपृष्ठ',
    map: 'ನकाशा'.replace('ನ','न'),
    market: 'बाजार',
    contacts: 'संपर्क',
    etc: 'इत्यादी',
    welcomeTitle: 'अॅग्री-कल्चर मध्ये स्वागत आहे',
    welcomeSubtitle: 'उद्याचा शेतकरी अधिक सबळ',
    mapDesc: 'स्थानिक शेत व कृषी क्षेत्रे पहा',
    viewMap: 'नकाशा पहा',
    marketDesc: 'खरेदी, बोली व भाड्याने उपकरणे',
    visitMarket: 'बाजार पहा',
    contactsDesc: 'शेतकऱ्यांसाठी महत्वाचे संपर्क',
    viewContacts: 'संपर्क पहा',
    allFarms: 'सर्व शेत',
    cropFields: 'पीक क्षेत्रे',
    equipment: 'साधने',
    weather: 'हवामान',
    buy: 'खरेदी',
    bid: 'बोली',
    rent: 'भाडे',
    tractorDesc: 'उच्च दर्जाचा ट्रॅक्टर',
    seeds: 'बिया पॅकेज',
    seedsDesc: 'उत्तम प्रतीच्या बिया',
    fertilizer: 'खत',
    fertilizerDesc: 'सेंद्रिय खत मिश्रण',
    irrigation: 'सिंचन प्रणाली',
    irrigationDesc: 'पूर्ण सिंचन सेटअप',
    buyNow: 'आता खरेदी करा',
    pesticide: 'कीडनाशक',
    starting50: 'सुरुवात: $50',
    pesticideDesc: 'पर्यावरणपूरक कीडनाशक',
    placeBid: 'बोली लावा',
    harvester: 'हार्वेस्टर',
    starting15000: 'सुरुवात: $15,000',
    harvesterDesc: 'प्रगत हार्वेस्टर',
    greenhouse: 'हरितगृह',
    starting8000: 'सुरुवात: $8,000',
    greenhouseDesc: 'पूर्ण हरितगृह सेटअप',
    irrigationPump: 'सिंचन पंप',
    pumpDesc: 'उच्च क्षमता पंप',
    tractor: 'ट्रॅक्टर',
    tractorRentDesc: 'दैनिक ट्रॅक्टर भाडे',
    harvesterRentDesc: 'प्रोफेशनल हार्वेस्टर',
    rentNow: 'आता भाड्याने घ्या',
    search: 'शोधा',
    searchContacts: 'संपर्क शोधा...',
    all: 'सर्व',
    government: 'शासन',
    emergency: 'आपत्कालीन',
    services: 'सेवा',
    role: 'भूमिका',
    nameDept: 'नाव/विभाग',
    contactNumber: 'संपर्क क्रमांक',
    action: 'क्रिया',
    call: 'कॉल',
    talukaOffice: 'तहसील कार्यालय',
    policeStation: 'पोलीस स्टेशन',
    vetVan: 'पशुवैद्यकीय व्हॅन',
    soilTesting: 'मृदा परीक्षण',
    weatherService: 'हवामान सेवा',
    agriExtension: 'कृषी विस्तार',
    emergencyHelpline: 'आपत्कालीन हेल्पलाइन',
    cropInsurance: 'पीक विमा',
    additionalServices: 'अतिरिक्त सेवा',
    weatherForecast: 'हवामान अंदाज',
    weatherDesc: 'तुमच्या भागातील हवामान अद्यतने',
    sunny: 'सूर्यप्रकाश',
    viewDetails: 'तपशील पहा',
    cropCalendar: 'पीक दिनदर्शिका',
    cropCalendarDesc: 'तुमच्या शेतीच्या योजना',
    wheatSeason: 'गहू हंगाम',
    viewCalendar: 'दिनदर्शिका पहा',
    priceUpdates: 'किंमत अद्यतने',
    priceUpdatesDesc: 'बाजारातील ताज्या किमती',
    viewPrices: 'किंमती पहा',
    expertAdvice: 'तज्ञ सल्ला',
    expertAdviceDesc: 'कृषी तज्ञांशी संपर्क साधा',
    soilExpert: 'मृदा तज्ञ',
    chatNow: 'आता चॅट करा',
    trainingPrograms: 'प्रशिक्षण कार्यक्रम',
    trainingDesc: 'आधुनिक शेती तंत्रे शिका',
    organicFarming: 'सेंद्रिय शेती',
    twoWeeks: '२ आठवडे',
    enrollNow: 'नोंदणी करा',
    insuranceServices: 'विमा सेवा',
    insuranceDesc: 'तुमचे पीक व साधने सुरक्षित करा',
    getQuote: 'कोट मिळवा',
    // Profile page translations in Marathi
    profile: 'प्रोफाइल',
    fullName: 'पूर्ण नाव',
    age: 'वय',
    gender: 'लिंग',
    phoneNumber: 'फोन क्रमांक',
    address: 'पत्ता',
    district: 'जिल्हा',
    taluka: 'तालुका',
    village: 'गाव',
    pincode: 'पिनकोड',
    male: 'पुरुष',
    female: 'स्त्री',
    other: 'इतर',
    reset: 'रीसेट',
    save: 'जतन करा',
    verified: 'फोन सत्यापित झाले!',
    continue: 'सुरू ठेवा',
  }
};

function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.setAttribute('placeholder', dict[key]);
  });
}

function initLanguage() {
  const select = document.getElementById('langSelect');
  const saved = localStorage.getItem('lang') || 'en';
  if (select) select.value = saved;
  applyTranslations(saved);
  if (select) {
    select.addEventListener('change', () => {
      const lang = select.value;
      localStorage.setItem('lang', lang);
      applyTranslations(lang);
      const frame = document.getElementById('contentFrame');
      if (frame && frame.contentWindow) {
        const url = new URL(frame.src, window.location.href);
        frame.src = `${url.pathname}?embed=1`;
      }
    });
  }
}

function initSidebarToggle() {
  const toggle = document.getElementById('menuToggle');
  const backdrop = document.getElementById('sidebarBackdrop');
  const closeMenu = () => document.body.classList.remove('sidebar-open');
  const openMenu = () => document.body.classList.add('sidebar-open');

  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.body.classList.contains('sidebar-open')) closeMenu();
      else openMenu();
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    a.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
    }, { capture: true });
  });
}

function initShellRouting() {
  const frame = document.getElementById('contentFrame');
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  if (!frame || !navLinks.length) return; // not on shell

  const setActive = (href) => {
    navLinks.forEach(a => a.classList.remove('active'));
    const match = Array.from(navLinks).find(a => href.endsWith(a.getAttribute('href').split('?')[0]));
    if (match) match.classList.add('active');
  };

  const load = (href) => {
    const lang = localStorage.getItem('lang') || 'en';
    const url = `${href.split('?')[0]}?embed=1&lang=${encodeURIComponent(lang)}`;
    frame.src = url;
    setActive(href);
    history.replaceState({}, '', `#${href.replace('.html','')}`);
  };

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      load(a.getAttribute('href'));
    });
  });

  const initial = location.hash ? `${location.hash.substring(1)}.html` : 'home.html';
  load(initial);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initSidebarToggle();
  initShellRouting();

  // Header Login click -> fullscreen overlay (shell) or direct nav
  const headerLogin = document.getElementById('headerLoginLink');
  const overlay = document.getElementById('loginOverlay');
  const overlayClose = document.getElementById('loginOverlayClose');
  const overlayFrame = document.getElementById('loginOverlayFrame');

  function openOverlay() {
    if (!overlay || !overlayFrame) return false;
    const lang = localStorage.getItem('lang') || 'en';
    overlayFrame.src = `login.html?embed=1&lang=${encodeURIComponent(lang)}`;
    overlay.classList.add('visible');
    document.body.classList.add('overlay-open');
    return true;
  }
  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('visible');
    document.body.classList.remove('overlay-open');
    // Optionally clear src
    // overlayFrame.src = 'about:blank';
  }

  if (headerLogin) {
    headerLogin.addEventListener('click', (e) => {
      // If overlay exists, use it
      if (overlay && openOverlay()) {
        e.preventDefault();
      }
    });
  }
  if (overlayClose) overlayClose.addEventListener('click', closeOverlay);
});
  