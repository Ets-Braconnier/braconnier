document.querySelectorAll("a[href]").forEach(link => {

  const url = link.getAttribute("href");

  if (!url) return;

  const external = url.startsWith("http") && !url.includes(location.hostname);
  const file = url.match(/\.(pdf|doc|docx|xls|xlsx|zip)$/i);

  if (external || file) {
    link.setAttribute("target","_blank");
    link.setAttribute("rel","noopener");
  }

});