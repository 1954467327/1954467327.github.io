export const categoriesMap = JSON.parse("{\"category\":{\"/\":{\"path\":\"/category/\",\"map\":{\"开发规范\":{\"path\":\"/category/%E5%BC%80%E5%8F%91%E8%A7%84%E8%8C%83/\",\"indexes\":[0]},\"部署\":{\"path\":\"/category/%E9%83%A8%E7%BD%B2/\",\"indexes\":[1]}}}},\"tag\":{\"/\":{\"path\":\"/tag/\",\"map\":{\"后端\":{\"path\":\"/tag/%E5%90%8E%E7%AB%AF/\",\"indexes\":[0]},\"移动H5\":{\"path\":\"/tag/%E7%A7%BB%E5%8A%A8h5/\",\"indexes\":[1]}}}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });

