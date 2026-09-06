(() => {
  'use strict';

  if (document.documentElement.classList.contains('aiderlog-android')) return;

  const selector = document.getElementById('siteDesignVersion');
  const download = document.getElementById('siteDesignDownload');
  if (!selector || !download) return;

  const editions = {
    modern: {
      href: './AiderLog-Modern-v162-site-files.zip',
      filename: 'AiderLog-Modern-v162-site-files.zip',
      label: '모던 사이트 파일 다운로드',
    },
    editorial: {
      href: './AiderLog-Editorial-v161-site-files.zip',
      filename: 'AiderLog-Editorial-v161-site-files.zip',
      label: '에디토리얼 사이트 파일 다운로드',
    },
  };

  const applyEdition = () => {
    const edition = editions[selector.value] || editions.modern;
    download.href = edition.href;
    download.download = edition.filename;
    download.textContent = edition.label;
  };

  selector.addEventListener('change', applyEdition);
  applyEdition();
})();
