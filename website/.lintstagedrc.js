module.exports = {
  'website/**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  'website/**/*.{js,jsx,json,css,md}': ['prettier --write'],
};
