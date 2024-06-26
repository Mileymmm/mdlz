const listContainer = document.getElementById("acronymList");
const searchInput = document.getElementById("searchInput");

let acronymList = []; // Array to store acronyms

// Function to render acronym list
function renderList(acronyms) {
    listContainer.innerHTML = "";
    acronyms.forEach(acronym => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${acronym.acronym}</strong><br>${acronym.fullForm}<br><span>${acronym.meaning}</span>`;
        listContainer.appendChild(listItem);
    });
}

// Function to filter acronyms based on search input
function filterList(searchText) {
    const filteredAcronyms = acronymList.filter(acronym => {
        return acronym.acronym.toLowerCase().includes(searchText.toLowerCase()) ||
            acronym.fullForm.toLowerCase().includes(searchText.toLowerCase()) ||
            acronym.meaning.toLowerCase().includes(searchText.toLowerCase());
    });
    renderList(filteredAcronyms);
}

// Event listener for search input
searchInput.addEventListener("input", function () {
    filterList(this.value);
});

// Function to fetch and parse CSV file
function fetchCSV() {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n'); // Filter out empty rows
            rows.forEach(row => {
                const [acronym, fullForm, meaning] = row.split('\t');
                acronymList.push({ acronym, fullForm, meaning });
                console.log(acronym);
            });
            renderList(acronymList);
            generateAlphabetBar();
        })
        .catch(error => {
            console.error('Error fetching CSV:', error);
        });
}

// 获取alphabetBar元素
const alphabetBar = document.getElementById('alphabetBar');

// 生成字母导航栏
function generateAlphabetBar() {
    const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    alphabet.split('').forEach(letter => {
        const link = document.createElement("a");
        link.textContent = letter;
        // 添加点击事件监听器
        link.addEventListener('click', handleAlphabetNavigation);
        alphabetBar.appendChild(link);
    });
}

// 处理字母导航栏点击事件
// 处理字母导航栏点击事件
function handleAlphabetNavigation(event) {
    event.preventDefault();
    const targetLetter = event.target.textContent;

    if (targetLetter == "#") {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 找到第一个以 targetLetter 开头的缩略语对象
    const targetAcronym = acronymList.find(acronym =>
        acronym.acronym.startsWith(targetLetter)
    );

    if (targetAcronym) {
        // 计算目标缩略语对象在列表中的索引
        const targetIndex = acronymList.indexOf(targetAcronym);

        // 确保索引是有效的
        if (targetIndex !== -1) {
            // 获取列表容器的引用
            const listContainer = document.getElementById('acronymList');
            // 计算目标列表项的顶部位置
            const listItem = listContainer.children[targetIndex];
            const targetPosition = listItem.offsetTop;

            // 滚动到目标位置，这里使用的是 window 的 scroll 属性
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}


// 设置字母导航栏中高亮的字母
function setActiveLetter(letter) {
    const alphabetLinks = document.querySelectorAll("#alphabetBar a");
    alphabetLinks.forEach(link => {
        link.classList.toggle("active", link.textContent === letter);
    });
}

// 处理滚动事件，显示或隐藏字母导航栏
let lastScrollPosition = 0;
let isScrolling = false;

function handleScroll() {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollPosition > lastScrollPosition && !isScrolling) {
        isScrolling = true;
        alphabetBar.classList.remove("visible");
    } else if (currentScrollPosition <= lastScrollPosition && isScrolling) {
        isScrolling = false;
        alphabetBar.classList.add("visible");
    }
    lastScrollPosition = currentScrollPosition;

    // 假设每个列表项都有一个<strong>标签，包含首字母
    const sections = document.querySelectorAll(".acronym-list > li");
    let activeLetter = "";
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            activeLetter = section.querySelector("strong").textContent[0].toUpperCase();
            setActiveLetter(activeLetter);
            return; // 找到当前可见的字母后即可返回
        }
    });
}

// 滚动事件监听器
window.addEventListener("scroll", handleScroll);
// Initial data fetching
fetchCSV();
document.getElementById('backToTop').addEventListener('click', function(event) {
    // 阻止链接的默认行为
    event.preventDefault();
    
    // 平滑滚动到页面顶部
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const backToTopButton = document.getElementById('backToTop');
    
    if (scrollPosition > 200) { // 页面滚动超过200px时显示按钮
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});
