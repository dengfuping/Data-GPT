import { formatMessage } from 'umi';
import { useEffect } from 'react';

const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    if (title) {
      document.title = formatMessage(
        {
          id: 'oda-web.src.hook.useDocumentTitle.TitleOceanbaseYunPingtai',
          defaultMessage: '{title} · OceanBase 云平台',
        },
        { title },
      );
    }
  }, [title]);
};

export default useDocumentTitle;
