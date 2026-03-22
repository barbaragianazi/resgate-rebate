export function renderCategoryCard(category) {
  return `
    <a href="#/products?category=${category.slug}" 
       class="category-card-circle" 
       id="category-${category.id}"
       style="--cat-color: ${category.color || '#6B7280'}">
      <div class="category-card-icon-wrap">
        <span class="category-card-icon">${category.icon}</span>
      </div>
      <span class="category-card-name">${category.name}</span>
    </a>
  `;
}
