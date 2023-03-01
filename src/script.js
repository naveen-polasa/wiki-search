const input = document.querySelector(".input");
const btn = document.querySelector(".search");
const results = document.querySelector(".results");
const paginateContainer = document.querySelector(".paginate");

const fetchData = (searchVal) => {
  results.innerHTML = `<div class="flex justify-center items-center gap-6 h-44">
                  <div class="h-12 w-12 border-4 rounded-full border-t-red-500 animate-spin"></div>
                  <h2 class="text-2xl font-semibold">Loading...</h2>
              </div>`;
  paginateContainer.innerHTML = "";

  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=23&format=json&origin=*&srsearch=${searchVal}`;

  const http = new XMLHttpRequest();
  http.onreadystatechange = () => {
    if (http.readyState == 4 && http.status == 200) {
      let data = JSON.parse(http.responseText).query.search;
      data = paginate(data);
      renderPage(data, 0);
    }
  };

  http.open("GET", url, true);
  http.send();
};

function renderPage(data, num) {
  let currPageData = data.filter((_, index) => index === num);
  currPageData = currPageData.map((res) => {
    return res
      .map((item) => {
        const { title, pageid, snippet } = item;
        return `<div class="w-96 p-3 border-2 rounded-xl border-red-300 bg-red-50 hover:scale-105 duration-300 hover:bg-green-50">
       <a href="http://en.wikipedia.org/?curid=${pageid}" target="_blank">
       <h3 class="text-2xl text-center font-mono">${title}</h3>
       <p>${snippet}</p>
       </a>
       </div>`;
      })
      .join(" ");
  });
  results.innerHTML = currPageData;
}

function setBtns(data) {
  const btns = data
    .map((_, index) => {
      return `<button class="paginateBtn py-2 px-3 bg-red-300 border-2 rounded-lg text-white text-lg hover:scale-110 duration-300 mx-2 hover:bg-orange-300 border-red-400">${
        index + 1
      }</button>`;
    })
    .join(" ");

  paginateContainer.addEventListener("click", (e) => {
    const pageNum = parseInt(e.target.innerText) - 1;
    renderPage(data, pageNum);
  });
  paginateContainer.innerHTML = btns;
}

function paginate(data) {
  let numberOfItems = 6;
  const totalPages = Math.ceil(data.length / numberOfItems);
  const newData = Array.from({ length: totalPages }, (_, index) => {
    const items = index * numberOfItems;
    const tempData = data.slice(items, items + numberOfItems);
    return tempData;
  });
  setBtns(newData);
  return newData;
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!input.value) return;
  fetchData(input.value);
  input.value = "";
});

fetchData("javascript");
