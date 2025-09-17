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
    enroll: 'Enroll Services',
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
    // Enrollment form translations
    enrollServices: 'Enroll Your Services',
    enrollSubtitle: 'Choose your service type and fill out the form to get started',
    bidding: 'Bidding',
    selling: 'Selling',
    renting: 'Renting',
    serviceRequirements: 'Service Requirements',
    whatServiceNeed: 'What service do you need?',
    buildingFarming: 'Building things for farming',
    helpersLabor: 'Helpers/Labor',
    otherServices: 'Other services',
    pleaseSpecify: 'Please specify the service you need',
    projectDetails: 'Project Details',
    projectTitle: 'Project Title',
    enterProjectTitle: 'Enter project title',
    projectType: 'Project Type',
    selectProjectType: 'Select project type',
    construction: 'Construction',
    maintenance: 'Maintenance',
    installation: 'Installation',
    repair: 'Repair',
    projectDescription: 'Project Description',
    describeProject: 'Describe your project requirements in detail',
    location: 'Location',
    enterLocation: 'Enter project location',
    budgetRange: 'Budget Range',
    selectBudgetRange: 'Select budget range',
    timelineRequirements: 'Timeline & Requirements',
    startDate: 'Start Date',
    expectedDuration: 'Expected Duration',
    selectDuration: 'Select duration',
    specialRequirements: 'Special Requirements',
    specialRequirementsDesc: 'Any special skills, certifications, or requirements needed',
    contactInformation: 'Contact Information',
    phoneNumber: 'Phone Number',
    enterPhone: 'Enter your phone number',
    email: 'Email',
    enterEmail: 'Enter your email address',
    submitBidding: 'Submit Bidding Request',
    productInformation: 'Product Information',
    productCategory: 'Product Category',
    seedsPlants: 'Seeds & Plants',
    seedsPlantsDesc: 'Grains, vegetables, fruits, flowers',
    farmingTools: 'Farming Tools',
    farmingToolsDesc: 'Hand tools, machinery, equipment',
    fertilizersPesticides: 'Fertilizers & Pesticides',
    fertilizersPesticidesDesc: 'Organic, chemical, bio-fertilizers',
    livestockPoultry: 'Livestock & Poultry',
    livestockPoultryDesc: 'Cattle, poultry, fish, bees',
    freshProduce: 'Fresh Produce',
    freshProduceDesc: 'Vegetables, fruits, grains',
    otherProducts: 'Other Products',
    otherProductsDesc: 'Custom farming products',
    productName: 'Product Name',
    enterProductName: 'Enter product name',
    productDescription: 'Product Description',
    describeProduct: 'Describe your product in detail',
    pricingQuantity: 'Pricing & Quantity',
    pricePerUnit: 'Price per Unit',
    enterPricePerUnit: 'Enter price per unit',
    unitType: 'Unit Type',
    selectUnitType: 'Select unit type',
    availableQuantity: 'Available Quantity',
    enterAvailableQuantity: 'Enter available quantity',
    minimumOrderQuantity: 'Minimum Order Quantity',
    enterMinOrderQuantity: 'Enter minimum order quantity',
    qualityCertification: 'Quality & Certification',
    qualityGrade: 'Quality Grade',
    selectQualityGrade: 'Select quality grade',
    premium: 'Premium',
    standard: 'Standard',
    economy: 'Economy',
    organicCertified: 'Organic Certified',
    selectOption: 'Select option',
    yes: 'Yes',
    no: 'No',
    pending: 'Pending',
    additionalCertifications: 'Additional Certifications',
    additionalCertificationsDesc: 'List any additional certifications or quality marks',
    locationDelivery: 'Location & Delivery',
    deliveryAvailable: 'Delivery Available',
    deliveryCharges: 'Delivery Charges',
    deliveryChargesDesc: 'Enter delivery charges or \'Free\' if applicable',
    submitSelling: 'Submit Selling Request',
    equipmentServiceInfo: 'Equipment/Service Information',
    rentalCategory: 'Rental Category',
    farmMachinery: 'Farm Machinery',
    farmMachineryDesc: 'Tractors, harvesters, tillers',
    toolsEquipment: 'Tools & Equipment',
    toolsEquipmentDesc: 'Hand tools, power tools, irrigation',
    vehicles: 'Vehicles',
    vehiclesDesc: 'Transport vehicles, trailers',
    landStorage: 'Land & Storage',
    landStorageDesc: 'Farmland, warehouses, sheds',
    laborServices: 'Labor Services',
    laborServicesDesc: 'Skilled workers, helpers',
    otherServicesRent: 'Other Services',
    otherServicesRentDesc: 'Custom rental services',
    itemServiceName: 'Item/Service Name',
    enterItemName: 'Enter item or service name',
    description: 'Description',
    describeRental: 'Describe what you\'re offering for rent',
    rentalDetails: 'Rental Details',
    rentalRate: 'Rental Rate',
    enterRentalRate: 'Enter rental rate',
    ratePeriod: 'Rate Period',
    selectRatePeriod: 'Select rate period',
    minimumRentalPeriod: 'Minimum Rental Period',
    enterMinRentalPeriod: 'Enter minimum rental period',
    maximumRentalPeriod: 'Maximum Rental Period',
    enterMaxRentalPeriod: 'Enter maximum rental period',
    securityDeposit: 'Security Deposit',
    enterSecurityDeposit: 'Enter security deposit amount',
    availabilityConditions: 'Availability & Conditions',
    availabilityStatus: 'Availability Status',
    selectAvailability: 'Select availability',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    needsRepair: 'Needs Repair',
    termsConditions: 'Terms & Conditions',
    enterTermsConditions: 'Enter rental terms and conditions',
    locationPickup: 'Location & Pickup',
    pickupAvailable: 'Pickup Available',
    additionalCharges: 'Additional Charges',
    additionalChargesDesc: 'Enter any additional charges (fuel, delivery, etc.)',
    submitRenting: 'Submit Renting Request',
    biddingSuccess: 'Bidding request submitted successfully!',
    sellingSuccess: 'Selling request submitted successfully!',
    rentingSuccess: 'Renting request submitted successfully!',
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
    enroll: 'सेवा नोंदणी',
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
    // Enrollment form translations in Marathi
    enrollServices: 'तुमच्या सेवांची नोंदणी करा',
    enrollSubtitle: 'तुमचा सेवा प्रकार निवडा आणि सुरु करण्यासाठी फॉर्म भरा',
    bidding: 'बोली',
    selling: 'विक्री',
    renting: 'भाडे',
    serviceRequirements: 'सेवा आवश्यकता',
    whatServiceNeed: 'तुम्हाला कोणती सेवा हवी आहे?',
    buildingFarming: 'शेतीसाठी बांधकाम',
    helpersLabor: 'मदतनीस/कामगार',
    otherServices: 'इतर सेवा',
    pleaseSpecify: 'कृपया तुम्हाला हवी असलेली सेवा स्पष्ट करा',
    projectDetails: 'प्रकल्प तपशील',
    projectTitle: 'प्रकल्प शीर्षक',
    enterProjectTitle: 'प्रकल्प शीर्षक प्रविष्ट करा',
    projectType: 'प्रकल्प प्रकार',
    selectProjectType: 'प्रकल्प प्रकार निवडा',
    construction: 'बांधकाम',
    maintenance: 'दुरुस्ती',
    installation: 'स्थापना',
    repair: 'दुरुस्ती',
    projectDescription: 'प्रकल्प वर्णन',
    describeProject: 'तुमच्या प्रकल्पाच्या आवश्यकता तपशीलवार वर्णन करा',
    location: 'स्थान',
    enterLocation: 'प्रकल्प स्थान प्रविष्ट करा',
    budgetRange: 'बजेट श्रेणी',
    selectBudgetRange: 'बजेट श्रेणी निवडा',
    timelineRequirements: 'वेळरेषा आणि आवश्यकता',
    startDate: 'सुरुवातीची तारीख',
    expectedDuration: 'अपेक्षित कालावधी',
    selectDuration: 'कालावधी निवडा',
    specialRequirements: 'विशेष आवश्यकता',
    specialRequirementsDesc: 'कोणत्याही विशेष कौशल्ये, प्रमाणपत्रे किंवा आवश्यकता',
    contactInformation: 'संपर्क माहिती',
    phoneNumber: 'फोन क्रमांक',
    enterPhone: 'तुमचा फोन क्रमांक प्रविष्ट करा',
    email: 'ईमेल',
    enterEmail: 'तुमचा ईमेल पत्ता प्रविष्ट करा',
    submitBidding: 'बोली विनंती सबमिट करा',
    productInformation: 'उत्पादन माहिती',
    productCategory: 'उत्पादन श्रेणी',
    seedsPlants: 'बिया आणि रोपे',
    seedsPlantsDesc: 'तृणधान्ये, भाज्या, फळे, फुले',
    farmingTools: 'शेती साधने',
    farmingToolsDesc: 'हात साधने, यंत्रे, उपकरणे',
    fertilizersPesticides: 'खते आणि कीडनाशके',
    fertilizersPesticidesDesc: 'सेंद्रिय, रासायनिक, जैव-खते',
    livestockPoultry: 'पशुधन आणि पाळीव पक्षी',
    livestockPoultryDesc: 'गुरे, पाळीव पक्षी, मासे, मधमाश्या',
    freshProduce: 'ताजे उत्पादने',
    freshProduceDesc: 'भाज्या, फळे, तृणधान्ये',
    otherProducts: 'इतर उत्पादने',
    otherProductsDesc: 'सानुकूल शेती उत्पादने',
    productName: 'उत्पादन नाव',
    enterProductName: 'उत्पादन नाव प्रविष्ट करा',
    productDescription: 'उत्पादन वर्णन',
    describeProduct: 'तुमचे उत्पादन तपशीलवार वर्णन करा',
    pricingQuantity: 'किंमत आणि प्रमाण',
    pricePerUnit: 'प्रति एकक किंमत',
    enterPricePerUnit: 'प्रति एकक किंमत प्रविष्ट करा',
    unitType: 'एकक प्रकार',
    selectUnitType: 'एकक प्रकार निवडा',
    availableQuantity: 'उपलब्ध प्रमाण',
    enterAvailableQuantity: 'उपलब्ध प्रमाण प्रविष्ट करा',
    minimumOrderQuantity: 'किमान ऑर्डर प्रमाण',
    enterMinOrderQuantity: 'किमान ऑर्डर प्रमाण प्रविष्ट करा',
    qualityCertification: 'गुणवत्ता आणि प्रमाणन',
    qualityGrade: 'गुणवत्ता श्रेणी',
    selectQualityGrade: 'गुणवत्ता श्रेणी निवडा',
    premium: 'प्रीमियम',
    standard: 'मानक',
    economy: 'अर्थव्यवस्था',
    organicCertified: 'सेंद्रिय प्रमाणित',
    selectOption: 'पर्याय निवडा',
    yes: 'होय',
    no: 'नाही',
    pending: 'प्रलंबित',
    additionalCertifications: 'अतिरिक्त प्रमाणपत्रे',
    additionalCertificationsDesc: 'कोणतीही अतिरिक्त प्रमाणपत्रे किंवा गुणवत्ता चिन्हे सूचीबद्ध करा',
    locationDelivery: 'स्थान आणि वितरण',
    deliveryAvailable: 'वितरण उपलब्ध',
    deliveryCharges: 'वितरण शुल्क',
    deliveryChargesDesc: 'वितरण शुल्क प्रविष्ट करा किंवा \'मोफत\' असल्यास',
    submitSelling: 'विक्री विनंती सबमिट करा',
    equipmentServiceInfo: 'उपकरण/सेवा माहिती',
    rentalCategory: 'भाडे श्रेणी',
    farmMachinery: 'शेती यंत्रे',
    farmMachineryDesc: 'ट्रॅक्टर, हार्वेस्टर, टिलर',
    toolsEquipment: 'साधने आणि उपकरणे',
    toolsEquipmentDesc: 'हात साधने, पॉवर साधने, सिंचन',
    vehicles: 'वाहने',
    vehiclesDesc: 'वाहतूक वाहने, ट्रेलर',
    landStorage: 'जमीन आणि साठवणूक',
    landStorageDesc: 'शेतजमीन, गोदामे, शेड',
    laborServices: 'कामगार सेवा',
    laborServicesDesc: 'कुशल कामगार, मदतनीस',
    otherServicesRent: 'इतर सेवा',
    otherServicesRentDesc: 'सानुकूल भाडे सेवा',
    itemServiceName: 'वस्तू/सेवा नाव',
    enterItemName: 'वस्तू किंवा सेवा नाव प्रविष्ट करा',
    description: 'वर्णन',
    describeRental: 'तुम्ही भाड्याने काय ऑफर करत आहात ते वर्णन करा',
    rentalDetails: 'भाडे तपशील',
    rentalRate: 'भाडे दर',
    enterRentalRate: 'भाडे दर प्रविष्ट करा',
    ratePeriod: 'दर कालावधी',
    selectRatePeriod: 'दर कालावधी निवडा',
    minimumRentalPeriod: 'किमान भाडे कालावधी',
    enterMinRentalPeriod: 'किमान भाडे कालावधी प्रविष्ट करा',
    maximumRentalPeriod: 'कमाल भाडे कालावधी',
    enterMaxRentalPeriod: 'कमाल भाडे कालावधी प्रविष्ट करा',
    securityDeposit: 'सुरक्षा ठेव',
    enterSecurityDeposit: 'सुरक्षा ठेव रक्कम प्रविष्ट करा',
    availabilityConditions: 'उपलब्धता आणि अटी',
    availabilityStatus: 'उपलब्धता स्थिती',
    selectAvailability: 'उपलब्धता निवडा',
    excellent: 'उत्कृष्ट',
    good: 'चांगले',
    fair: 'चांगले',
    needsRepair: 'दुरुस्ती आवश्यक',
    termsConditions: 'अटी आणि नियम',
    enterTermsConditions: 'भाडे अटी आणि नियम प्रविष्ट करा',
    locationPickup: 'स्थान आणि पिकअप',
    pickupAvailable: 'पिकअप उपलब्ध',
    additionalCharges: 'अतिरिक्त शुल्क',
    additionalChargesDesc: 'कोणतेही अतिरिक्त शुल्क प्रविष्ट करा (इंधन, वितरण, इ.)',
    submitRenting: 'भाडे विनंती सबमिट करा',
    biddingSuccess: 'बोली विनंती यशस्वीरित्या सबमिट केली!',
    sellingSuccess: 'विक्री विनंती यशस्वीरित्या सबमिट केली!',
    rentingSuccess: 'भाडे विनंती यशस्वीरित्या सबमिट केली!',
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
  