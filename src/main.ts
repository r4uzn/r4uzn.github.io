import { homeItems, profile, timeline } from './data.js';
import { categories, posts, type Post } from './posts.generated.js';

type Route =
  | { name: 'home' }
  | { name: 'blog'; category?: string; query?: string }
  | { name: 'info' }
  | { name: 'post'; slug: string };

const appRoot = document.querySelector<HTMLDivElement>('#app');

if (!appRoot) {
  throw new Error('Missing #app root');
}

const app: HTMLDivElement = appRoot;
let teardownMotion = () => {};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(`${value}T00:00:00+09:00`));
}

function tagList(tags: string[]): string {
  return tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
}

function postUrl(slug: string): string {
  return `#/post/${encodeURIComponent(slug)}`;
}

function parseRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path = '', queryString = ''] = hash.split('?');
  const params = new URLSearchParams(queryString);

  if (path.startsWith('post/')) {
    return { name: 'post', slug: decodeURIComponent(path.slice(5)) };
  }

  if (path === 'blog') {
    const route: Extract<Route, { name: 'blog' }> = { name: 'blog' };
    const category = params.get('category');
    const query = params.get('q');

    if (category) {
      route.category = category;
    }

    if (query) {
      route.query = query;
    }

    return route;
  }

  if (path === 'info') {
    return { name: 'info' };
  }

  return { name: 'home' };
}

function layout(content: string, active: Route['name']): string {
  const nav = [
    { id: 'home', label: 'Home', href: '#/' },
    { id: 'blog', label: 'Blog', href: '#/blog' },
    { id: 'info', label: 'Info', href: '#/info' }
  ];

  return `
    <div class="scroll-progress" aria-hidden="true"><span></span></div>
    <header class="site-header">
      <a class="brand" href="#/" aria-label="Go to overview">
        <strong>${profile.name}</strong>
      </a>
      <nav class="tabs" aria-label="Primary navigation">
        ${nav
          .map(
            (item) => `
              <a class="${active === item.id ? 'active' : ''}" href="${item.href}">
                ${item.label}
              </a>
            `
          )
          .join('')}
      </nav>
    </header>
    <main>${content}</main>
  `;
}

function renderHome(): string {
  return layout(
    `
      <section class="home-intro" data-motion>
        <p class="eyebrow">${escapeHtml(profile.role)}</p>
        <h1>${profile.name}</h1>
        <p class="headline">${profile.headline}</p>
        <p class="intro">${profile.intro}</p>
        <div class="focus-row">${tagList(profile.focus)}</div>
      </section>

      <aside class="home-indicator" aria-label="Current section">
        <span id="home-section-count">00</span>
        <strong id="home-section-title">${profile.name}</strong>
      </aside>

      <section class="resume-showcase" aria-label="Resume highlights">
        ${homeItems
          .map(
            (item, index) => {
              const sectionIndex = String(index + 1).padStart(2, '0');
              return `
              <article
                class="resume-item"
                data-motion
                data-section-index="${sectionIndex}"
                data-section-title="${escapeHtml(item.title)}"
              >
                <div class="resume-meta">
                  <span>${escapeHtml(item.label)}</span>
                  <time>${escapeHtml(item.meta)}</time>
                </div>
                <h2>${escapeHtml(item.title)}</h2>
                ${item.body ? `<p>${escapeHtml(item.body)}</p>` : ''}
                ${
                  item.details
                    ? `<ul class="resume-detail-list">${item.details
                        .map((detail) => `<li>${escapeHtml(detail)}</li>`)
                        .join('')}</ul>`
                    : ''
                }
                ${item.tags?.length ? `<div class="mini-tags">${tagList(item.tags)}</div>` : ''}
              </article>
            `;
            }
          )
          .join('')}
      </section>

      <section class="compact-timeline" data-motion>
        <p class="eyebrow">Timeline</p>
        <ol>
          ${timeline
            .map(
              (item) => `
                <li>
                  <time>${escapeHtml(item.period)}</time>
                  <span>${escapeHtml(item.title)}</span>
                </li>
              `
            )
            .join('')}
        </ol>
        <a class="text-link" href="#/blog">Read blog notes</a>
      </section>
    `,
    'home'
  );
}

function renderPostCard(post: Post): string {
  return `
    <article class="post-card">
      <a href="${postUrl(post.slug)}">
        <div class="post-meta">
          <time>${formatDate(post.date)}</time>
          <span>${escapeHtml(post.category)}</span>
        </div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.summary)}</p>
        <div class="mini-tags">${tagList(post.tags)}</div>
      </a>
    </article>
  `;
}

function filterPosts(category: string, query: string): Post[] {
  const normalized = query.trim().toLowerCase();

  return posts.filter((post) => {
    const categoryMatch = category === 'All' || post.category === category;
    const haystack = `${post.title} ${post.summary} ${post.tags.join(' ')} ${post.category}`.toLowerCase();
    return categoryMatch && (!normalized || haystack.includes(normalized));
  });
}

function renderPostList(items: Post[]): string {
  return items.length ? items.map(renderPostCard).join('') : '<p class="empty">검색 결과가 없습니다.</p>';
}

function renderBlog(route: Extract<Route, { name: 'blog' }>): string {
  const query = route.query ?? '';
  const activeCategory = route.category ?? 'All';
  const filtered = filterPosts(activeCategory, query);

  return layout(
    `
      <section class="page-head">
        <p class="eyebrow">Blog</p>
        <h1>Research Notes</h1>
        <p>풀이와 연구 과정을 주제별로 정리했습니다. 검색어와 카테고리 필터를 같이 사용할 수 있습니다.</p>
      </section>

      <section class="blog-tools" aria-label="Blog filters">
        <label class="search-box">
          <span>Search</span>
          <input id="post-search" type="search" value="${escapeHtml(route.query ?? '')}" placeholder="xss, reversing, scanner..." />
        </label>
        <div class="category-tabs" aria-label="Categories">
          ${['All', ...categories]
            .map((category) => {
              const href =
                category === 'All'
                  ? '#/blog'
                  : `#/blog?category=${encodeURIComponent(category)}`;
              return `<a class="${activeCategory === category ? 'active' : ''}" href="${href}">${escapeHtml(category)}</a>`;
            })
            .join('')}
        </div>
      </section>

      <section class="post-list" aria-label="Posts">
        ${renderPostList(filtered)}
      </section>
    `,
    'blog'
  );
}

function renderInfo(): string {
  return layout(
    `
      <section class="page-head">
        <p class="eyebrow">Info</p>
        <h1>About ${profile.name}</h1>
        <p>${escapeHtml(profile.intro)}</p>
      </section>

      <section class="info-grid">
        <div class="info-panel">
          <h2>Focus</h2>
          <div class="focus-row">${tagList(profile.focus)}</div>
        </div>
        <div class="info-panel">
          <h2>Contact</h2>
          <div class="link-list">
            ${profile.links
              .map(
                (link) => `
                  <a href="${escapeHtml(link.href)}" target="${link.href.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer">
                    ${escapeHtml(link.label)}
                  </a>
                `
              )
              .join('')}
          </div>
        </div>
      </section>
    `,
    'info'
  );
}

function renderInlineMarkdown(value: string): string {
  let html = escapeHtml(value);

  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" loading="lazy" referrerpolicy="no-referrer" />'
  );
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
  );
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  return html;
}

function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const chunks: string[] = [];
  let code: string[] = [];
  let codeLang = '';
  let inCode = false;
  let list: string[] = [];

  const flushList = () => {
    if (list.length) {
      chunks.push(`<ul>${list.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`);
      list = [];
    }
  };

  const flushCode = () => {
    if (code.length || inCode) {
      chunks.push(
        `<pre><code data-lang="${escapeHtml(codeLang)}">${escapeHtml(code.join('\n'))}</code></pre>`
      );
      code = [];
      codeLang = '';
    }
  };

  for (const line of lines) {
    const fence = line.match(/^```(\w+)?/);
    if (fence) {
      if (inCode) {
        inCode = false;
        flushCode();
      } else {
        flushList();
        inCode = true;
        codeLang = fence[1] ?? '';
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (!line.trim()) {
      flushList();
      continue;
    }

    if (/^-{3,}$/.test(line.trim())) {
      flushList();
      chunks.push('<hr />');
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)/);
    if (heading) {
      flushList();
      const level = heading[1]?.length ?? 2;
      chunks.push(`<h${level}>${renderInlineMarkdown(heading[2] ?? '')}</h${level}>`);
      continue;
    }

    const bullet = line.match(/^\s*[-*]\s+(.+)/);
    if (bullet) {
      list.push(bullet[1] ?? '');
      continue;
    }

    const numbered = line.match(/^\s*\d+\.\s+(.+)/);
    if (numbered) {
      list.push(numbered[1] ?? '');
      continue;
    }

    flushList();
    chunks.push(`<p>${renderInlineMarkdown(line.trim())}</p>`);
  }

  flushList();
  flushCode();

  return chunks.join('');
}

async function renderPost(slug: string): Promise<void> {
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    app.innerHTML = layout('<section class="page-head"><h1>Post not found</h1></section>', 'blog');
    initPageMotion('post');
    return;
  }

  app.innerHTML = layout(
    `
      <article class="article-shell">
        <a class="back-link" href="#/blog">Back to Blog</a>
        <header class="article-head">
          <p class="eyebrow">${escapeHtml(post.category)}</p>
          <h1>${escapeHtml(post.title)}</h1>
          <div class="post-meta">
            <time>${formatDate(post.date)}</time>
            <span>${post.tags.map(escapeHtml).join(' / ')}</span>
          </div>
          <p>${escapeHtml(post.summary)}</p>
        </header>
        <div id="article-content" class="article-content">
          <p class="loading">Loading note...</p>
        </div>
      </article>
    `,
    'blog'
  );

  initPageMotion('post');

  const target = document.querySelector<HTMLDivElement>('#article-content');
  if (!target) {
    return;
  }

  try {
    const response = await fetch(`./posts/${encodeURIComponent(post.file)}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const markdown = await response.text();
    target.innerHTML = renderMarkdown(markdown);
  } catch (error) {
    target.innerHTML = `<p class="empty">글을 불러오지 못했습니다. ${escapeHtml(String(error))}</p>`;
  }
}

function wireBlogSearch(route: Extract<Route, { name: 'blog' }>): void {
  const input = document.querySelector<HTMLInputElement>('#post-search');
  const list = document.querySelector<HTMLElement>('.post-list');
  if (!input) {
    return;
  }

  input.addEventListener('input', () => {
    const params = new URLSearchParams();
    if (route.category) {
      params.set('category', route.category);
    }
    if (input.value.trim()) {
      params.set('q', input.value.trim());
    }
    const query = params.toString();
    window.history.replaceState(null, '', `#/blog${query ? `?${query}` : ''}`);
    if (list) {
      list.innerHTML = renderPostList(filterPosts(route.category ?? 'All', input.value));
    }
  });
}

function initScrollProgress(): () => void {
  const bar = document.querySelector<HTMLElement>('.scroll-progress span');

  if (!bar) {
    return () => {};
  }

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  return () => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  };
}

function initHomeMotion(): () => void {
  const targets = [...document.querySelectorAll<HTMLElement>('[data-motion]')];
  const items = [...document.querySelectorAll<HTMLElement>('.resume-item')];
  const title = document.querySelector<HTMLElement>('#home-section-title');
  const count = document.querySelector<HTMLElement>('#home-section-count');

  if (!targets.length) {
    return () => {};
  }

  let revealObserver: IntersectionObserver | undefined;

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );

    for (const target of targets) {
      revealObserver.observe(target);
    }
  } else {
    for (const target of targets) {
      target.classList.add('in-view');
    }
  }

  const updateActiveItem = () => {
    const viewportCenter = window.innerHeight * 0.52;
    let activeItem = items[0];
    let activeDistance = Number.POSITIVE_INFINITY;

    for (const item of items) {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = Math.abs(itemCenter - viewportCenter);
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));

      item.style.setProperty('--item-progress', progress.toFixed(3));

      if (distance < activeDistance) {
        activeDistance = distance;
        activeItem = item;
      }
    }

    for (const item of items) {
      item.classList.toggle('is-active', item === activeItem);
    }

    if (activeItem && title && count) {
      title.textContent = activeItem.dataset.sectionTitle ?? profile.name;
      count.textContent = activeItem.dataset.sectionIndex ?? '00';
    }
  };

  updateActiveItem();
  window.addEventListener('scroll', updateActiveItem, { passive: true });
  window.addEventListener('resize', updateActiveItem);

  return () => {
    revealObserver?.disconnect();
    window.removeEventListener('scroll', updateActiveItem);
    window.removeEventListener('resize', updateActiveItem);
  };
}

function initPageMotion(routeName: Route['name']): void {
  const cleanups = [initScrollProgress()];

  if (routeName === 'home') {
    cleanups.push(initHomeMotion());
  }

  teardownMotion = () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

function render(): void {
  teardownMotion();
  teardownMotion = () => {};

  const route = parseRoute();

  if (route.name === 'post') {
    void renderPost(route.slug);
    window.scrollTo({ top: 0 });
    return;
  }

  if (route.name === 'blog') {
    app.innerHTML = renderBlog(route);
    wireBlogSearch(route);
  } else if (route.name === 'info') {
    app.innerHTML = renderInfo();
  } else {
    app.innerHTML = renderHome();
  }

  initPageMotion(route.name);
  window.scrollTo({ top: 0 });
}

window.addEventListener('hashchange', render);
render();
