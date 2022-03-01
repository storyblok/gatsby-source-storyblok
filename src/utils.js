export const typeToNodeName = (contentType) => {
  return `Storyblok${toPascalCase(contentType)}`;
};

function toPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text) {
  return text.replace(/-/, '').toUpperCase();
}

export const getImageId = (url) => {
  return url.split('/')[6];
};

export const retrieveAssets = (content, assets = []) => {
  Object.keys(content).forEach((key) => {
    const value = content[key];
    if (typeof value === 'object' && value !== null) {
      if (value.fieldtype && value.fieldtype === 'asset') {
        if (value.filename !== '' && value.filename !== null && value.id !== null) {
          const extension = value.filename.split('.').pop();
          if (extension === 'svg') {
            return;
          }
          assets.push({
            src: value.filename,
            alt: value.alt,
            title: value.title,
            copyright: value.copyright,
          });
        }
      } else if (value.type === 'image' && value.attrs && value.attrs.src) {
        assets.push(value.attrs);
      } else {
        retrieveAssets(content[key], assets);
      }
    }
  });
  return assets;
};
