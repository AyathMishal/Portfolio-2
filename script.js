const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const menuToggle = document.querySelector('#menu-toggle');
const navLinks = document.querySelector('#nav-links');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && matchMedia('(prefers-color-scheme: dark)').matches)) root.classList.add('dark');
themeToggle.textContent = root.classList.contains('dark') ? '☼' : '◐';

themeToggle.addEventListener('click', () => {
  root.classList.toggle('dark');
  const isDark = root.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☼' : '◐';
});

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  menuToggle.textContent = navLinks.classList.contains('open') ? '×' : '☰';
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open'); menuToggle.textContent = '☰'; menuToggle.setAttribute('aria-expanded', 'false');
}));

async function loadRepositories() {
  const grid = document.querySelector('#repo-grid');
  try {
    const response = await fetch('https://api.github.com/users/AyathMishal/repos?sort=updated&per_page=4', { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error('GitHub request failed');
    const repos = await response.json();
    grid.innerHTML = repos.map(repo => `<a class="repo-card" href="${repo.html_url}" target="_blank" rel="noreferrer"><div><span class="repo-dot"></span>${repo.language || 'Code'}</div><h3>${escapeHtml(repo.name)}</h3><p>${escapeHtml(repo.description || 'A project from my development workspace.')}</p><footer>Updated ${new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}<span>↗</span></footer></a>`).join('');
  } catch {
    grid.innerHTML = '<p class="repo-card">Could not load GitHub projects right now. Please visit my GitHub profile instead.</p>';
  }
}
function escapeHtml(text) { const element = document.createElement('div'); element.textContent = text; return element.innerHTML; }
loadRepositories();
