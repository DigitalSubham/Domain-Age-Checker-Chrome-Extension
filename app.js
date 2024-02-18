function extractRootDomainFromUrl(url) {
  let domain = url.replace(/^https?:\/\//, "");
  domain = domain.split("/")[0];
  domain = domain.split(".").slice(-2).join(".");
  return domain;
}

function calculateAge(data) {
  const creationDate = new Date(data.creation_date);
  const updatedDate = new Date(data.updated_date);
  const expirationDate = new Date(data.expiration_date);

  const start = new Date(creationDate);
  const end = new Date();
  let difference = end - start;
  const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
  const years = Math.floor(daysDifference / 365);
  const remainingDays = daysDifference % 365;

  return { years, remainingDays, updatedDate, expirationDate, creationDate };
}

function displayErrorMessage(message) {
  document.getElementById("errorContainer").textContent = message;
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("lookupButton")
    .addEventListener("click", function () {
      const domain = document.getElementById("domainInput").value;
      domainAge(domain);
    });
});

async function domainAge(domain) {
  try {
    const response = await fetch(
      `https://accessible-ninth-countess.glitch.me/whois?domain=${domain}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    const { years, remainingDays, updatedDate, expirationDate, creationDate } =
      calculateAge(data);

    document.getElementById("name").innerHTML = domain;
    document.getElementById("domainCreated").innerHTML =
      creationDate.toLocaleDateString();
    document.getElementById(
      "age"
    ).innerHTML = `${years} years ${remainingDays} days`;
    document.getElementById("domainUpdated").innerHTML =
      updatedDate.toLocaleDateString();
    document.getElementById("domainExpiration").innerHTML =
      expirationDate.toLocaleDateString();
  } catch (error) {
    // console.error("Unable to get domain information:", error);
    displayErrorMessage("Unable to get domain information.");
  }
}

function getCurrentTabUrl() {
  chrome?.tabs?.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs);
    if (tabs && tabs.length > 0 && tabs[0].url) {
      var url = tabs[0].url;
      let rootDomain = extractRootDomainFromUrl(url);
      domainAge(rootDomain);
    } else {
      // console.error("Unable to get URL of current tab.");
      displayErrorMessage("Unable to get URL of current tab.");
    }
  });
}

getCurrentTabUrl();
